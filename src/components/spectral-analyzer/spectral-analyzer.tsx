import React, { useEffect, useRef } from "react";
import withStyles from "./styles";
import { useSelector } from "react-redux";
import { path } from "ramda";
import { ICsound } from "../csound/types";
import { scaleLinear } from "d3-scale";

type ISpectralAnalyzerProperties = {
    classes: any;
};

// resize code used from https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
function resize(canvas) {
    // Lookup the size the browser is displaying the canvas.
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

type CanvasReference = {
    current: HTMLCanvasElement | null;
};

const connectVisualizer = async (
    libcsound: ICsound,
    canvasReference: CanvasReference
) => {
    if (!canvasReference || !canvasReference.current) {
        return;
    } else {
        const canvas: HTMLCanvasElement = canvasReference.current;

        const context_ = canvas.getContext("2d");

        if (!context_) {
            return;
        }

        //console.log("Connect Visualizer!");
        const audioContext = await libcsound.getAudioContext();
        const scopeNode = audioContext.createAnalyser();
        scopeNode.fftSize = 2048;
        console.log("audioContext", audioContext);
        // audioContext.connect(scopeNode);

        const mags = () => {
            resize(canvas);
            const width = canvas.width;
            const height = canvas.height;
            const freqData = new Uint8Array(scopeNode.frequencyBinCount);

            const scaleY = scaleLinear().domain([0, 256]).range([height, 0]);

            scopeNode.getByteFrequencyData(freqData);

            context_.clearRect(0, 0, width, height);

            context_.fillStyle = "rgba(0, 20, 0, 0.1)";
            context_.fillRect(0, 0, width, height);
            context_.lineWidth = 2;
            context_.strokeStyle = "rgba(0,255,0,1)";
            context_.beginPath();

            for (let x = 0; x < width; x++) {
                const indx = Math.floor(
                    (x / width) * scopeNode.frequencyBinCount
                );
                context_.lineTo(x, scaleY(freqData[indx]));
            }

            context_.stroke();
            requestAnimationFrame(mags);
        };
        mags();

        return scopeNode;
    }
};

const disconnectVisualizer = (libcsound: ICsound, scopeNode: AnalyserNode) => {
    console.log(libcsound, scopeNode);
    // const node = csound.getNode();
    // node.disconnect(scopeNode);
};

const SpectralAnalyzer = ({ classes }: ISpectralAnalyzerProperties) => {
    const canvasReference = useRef() as CanvasReference;

    const libcsound: ICsound | undefined = useSelector(
        path(["csound", "libcsound"])
    );

    useEffect(() => {
        let scopeNode: AnalyserNode | undefined;
        if (libcsound && canvasReference.current) {
            connectVisualizer(libcsound, canvasReference).then(
                (sn) => (scopeNode = sn)
            );
        }

        return () => {
            if (libcsound && scopeNode) {
                disconnectVisualizer(libcsound, scopeNode);
            }
        };
    }, [canvasReference, libcsound]);

    return (
        <canvas
            ref={canvasReference}
            style={{ width: "100%", height: "100%", display: "block" }}
        ></canvas>
    );
};

export default withStyles(SpectralAnalyzer);

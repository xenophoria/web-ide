import { IStore } from "@store/types";
// import { IDocument, IProject } from "../projects/types";
import {
    CsoundInstance,
    ICsound,
    SET_CSOUND,
    CsoundPlayState,
    SET_CSOUND_PLAY_STATE
} from "./types";
// import { selectActiveProject } from "../projects/selectors";
// import { saveAs } from "file-saver";
import { path } from "ramda";
// import { storageReference } from "../../config/firestore";

export const setCsound = (csound: CsoundInstance, libcsound: ICsound) => {
    return {
        type: SET_CSOUND,
        csound,
        libcsound
    };
};

export const playCSDFromEMFS = (projectUid: string, filePath: string) => {
    return async (dispatch: any, getState) => {
        const state: IStore = getState();
        const csound: CsoundInstance | undefined = path(
            ["csound", "csound"],
            state
        );
        const libcsound: ICsound | undefined = path(
            ["csound", "libcsound"],
            state
        );
        const playState: CsoundPlayState = path(["csound", "playState"], state);

        const clearConsoleCallback = path(
            ["ConsoleReducer", "clearConsole"],
            state
        );

        if (csound && libcsound) {
            if (playState === "error") {
                dispatch(setCsoundPlayState("stopped"));
            }
            typeof clearConsoleCallback === "function" &&
                clearConsoleCallback();

            await libcsound.csoundSetOption(csound, "-odac");
            await libcsound.csoundSetOption(csound, "-+msg_color=false");
            // TODO
            // await cs.setCurrentDirFS(projectUid);
            const compileResult = await libcsound.csoundCompileCsd(
                csound,
                filePath
            );
            const startResult = await libcsound.csoundStart(csound);
            if (compileResult === 0 && startResult === 0) {
                dispatch(setCsoundPlayState("playing"));
            } else {
                dispatch(setCsoundPlayState("error"));
            }
        }
    };
};

export const playCSDFromString = (projectUid: string, csd: string) => {
    return async (dispatch: any, getState) => {
        const state: IStore = getState();
        const csound: CsoundInstance | undefined = path(
            ["csound", "csound"],
            state
        );
        const libcsound: ICsound | undefined = path(
            ["csound", "libcsound"],
            state
        );
        if (csound && libcsound) {
            // TODO
            // await cs.setCurrentDirFS(projectUid);
            await libcsound.csoundSetOption(csound, "-odac");
            await libcsound.csoundSetOption(csound, "-+msg_color=false");
            const compileResult = await libcsound.csoundCompileCsdText(
                csound,
                csd
            );
            const startResult = await libcsound.csoundStart(csound);

            if (compileResult === 0 && startResult === 0) {
                dispatch(setCsoundPlayState("playing"));
            } else {
                dispatch(setCsoundPlayState("error"));
            }
        }
    };
};

export const playORCFromString = (projectUid: string, orc: string) => {
    return async (dispatch: any, getState) => {
        const state: IStore = getState();
        const csound: CsoundInstance | undefined = path(
            ["csound", "csound"],
            state
        );
        const libcsound: ICsound | undefined = path(
            ["csound", "libcsound"],
            state
        );

        const playState: CsoundPlayState = path(["csound", "playState"], state);

        if (csound && libcsound) {
            // await cs.setCurrentDirFS(projectUid);
            if (playState === "paused") {
                dispatch(setCsoundPlayState("playing"));
                await libcsound.csoundResume();
            } else {
                // cs.reset();
                await libcsound.csoundSetOption(csound, "-odac");
                await libcsound.csoundSetOption(csound, "-+msg_color=false");
                await libcsound.csoundSetOption(csound, "-d");
                await libcsound.csoundSetOption(csound, "-d");

                const compileResult = await libcsound.csoundCompileOrc(
                    csound,
                    orc
                );
                const startResult = await libcsound.csoundStart(csound);

                if (compileResult === 0 && startResult === 0) {
                    dispatch(setCsoundPlayState("playing"));
                } else {
                    dispatch(setCsoundPlayState("error"));
                }
            }
        }
    };
};

export const stopCsound = () => {
    return async (dispatch: any, getState) => {
        const state: IStore = getState();
        const csound: CsoundInstance | undefined = path(
            ["csound", "csound"],
            state
        );
        const libcsound: ICsound | undefined = path(
            ["csound", "libcsound"],
            state
        );

        if (csound && libcsound) {
            dispatch(setCsoundPlayState("stopped"));
            libcsound.csoundStop(csound);
        }
    };
};

export const pauseCsound = () => {
    return async (dispatch: any, getState) => {
        const state: IStore = getState();
        // const csound: CsoundInstance | undefined = path(
        //     ["csound", "csound"],
        //     state
        // );
        const libcsound: ICsound | undefined = path(
            ["csound", "libcsound"],
            state
        );
        const playState: CsoundPlayState = path(["csound", "playState"], state);

        if (libcsound && playState === "playing") {
            await libcsound.csoundPause();
            // dispatch(setCsoundPlayState("paused"));
        }
    };
};

export const resumePausedCsound = () => {
    return async (dispatch: any, getState) => {
        const state: IStore = getState();
        const libcsound: ICsound | undefined = path(
            ["csound", "libcsound"],
            state
        );
        const playState: CsoundPlayState = path(["csound", "playState"], state);
        if (libcsound && playState === "paused") {
            await libcsound.csoundResume();
            // dispatch(setCsoundPlayState("playing"));
        }
    };
};

export const setCsoundPlayState = (playState: CsoundPlayState) => {
    return {
        type: SET_CSOUND_PLAY_STATE,
        playState
    };
};

export const renderToDisk = () => {
    return async (dispatch: any, getState) => {
        /*
        const state: IStore = getState();
        const project: IProject | undefined = selectActiveProject(state);
        if (!project) {
            return;
        }
        const encoder = new TextEncoder();

        if (project) {
            const documents: IDocument[] = Object.values(project.documents);
            const worker = new Worker("/csound/CsoundWebWorker.js");

            // eslint-disable-next-line unicorn/prefer-add-event-listener
            worker.onmessage = (event_) => {
                const data = event_.data;
                const content = data[1];

                switch (data[0]) {
                    case "log":
                        console.log("CsoundDisk: " + content);
                        break;
                    case "renderResult":
                        // grab binary data and download as blob
                        saveAs(
                            new Blob([content.buffer], {
                                type: "audio/wav"
                            }),
                            "project-render.wav"
                        );
                        break;
                    default:
                        console.log(
                            "CsoundWebWorker: Unknown Message: " + data[0]
                        );
                        break;
                }
            };

            for (const document_ of documents) {
                if (document_.type === "bin") {
                    const path = `${project.userUid}/${project.projectUid}/${document_.documentUid}`;
                    const url = await storageReference
                        .child(path)
                        .getDownloadURL();

                    const response = await fetch(url);
                    const blob = await response.arrayBuffer();
                    const message = ["writeToFS", document_.filename, blob];
                    worker.postMessage(message);
                } else {
                    const message = [
                        "writeToFS",
                        document_.filename,
                        encoder.encode(document_.savedValue)
                    ];
                    worker.postMessage(message);
                }
            }

            //let d = docs.find(d => d.filename == 'project.csd');

            // TODO - replace with 'main' csd file name
            // if(d) {
            worker.postMessage(["renderCSD", "project.csd"]);
            //}
        }

        // if (cs) {
        //     cs.reset();
        //     cs.setOption("-+msg_color=false");
        //     cs.compileCSD("project.csd");
        //     cs.start();
        // }
*/
    };
};

/*
export const enableMidiInput = () => {
    return async (dispatch: any, getState) => {
        const cs = path(["csound", "csound"], getState()) as
            | ICsoundObject
            | undefined;
        cs?.enableMidiInput(() => {
            console.log("enableMidiInput done");
        });
    };
};

export const enableAudioInput = () => {
    return async (dispatch: any, getState) => {
        const cs = path(["csound", "csound"], getState()) as
            | ICsoundObject
            | undefined;
        cs?.enableAudioInput(() => {
            console.log("enableAudioInput done");
        });
    };
};
*/

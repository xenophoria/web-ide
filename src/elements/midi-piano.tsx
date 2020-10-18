import React from "react";
import { Piano, KeyboardShortcuts, MidiNumbers } from "react-piano";
import { ICsound, CsoundInstance, CsoundPlayState } from "@comp/csound/types";
import { useSelector } from "react-redux";
import { path, pathOr } from "ramda";
import "react-piano/dist/styles.css";

const MidiPiano = () => {
    const firstNote = MidiNumbers.fromNote("c3");
    const lastNote = MidiNumbers.fromNote("f5");
    const csound: CsoundInstance | undefined = useSelector(
        path(["csound", "csound"])
    );
    const libcsound: ICsound | undefined = useSelector(
        path(["csound", "libcsound"])
    );

    const csoundStatus: CsoundPlayState = useSelector(
        pathOr("stopped", ["csound", "playState"])
    ) as CsoundPlayState;

    const keyboardShortcuts = KeyboardShortcuts.create({
        firstNote: firstNote,
        lastNote: lastNote,
        keyboardConfig: KeyboardShortcuts.HOME_ROW
    });

    return (
        <Piano
            noteRange={{ first: firstNote, last: lastNote }}
            playNote={(midiNumber) => {
                // TODO make velocity configureable
                if (libcsound && csound && csoundStatus === "playing") {
                    libcsound.csoundPushMidiMessage(
                        csound,
                        144,
                        midiNumber,
                        64
                    );
                }
            }}
            stopNote={(midiNumber) => {
                if (libcsound && csound && csoundStatus === "playing") {
                    libcsound.csoundPushMidiMessage(
                        csound,
                        128,
                        midiNumber,
                        64
                    );
                }
            }}
            width={1000}
            keyboardShortcuts={keyboardShortcuts}
        />
    );
};

export default MidiPiano;

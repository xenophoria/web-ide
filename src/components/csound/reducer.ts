import {
    CsoundInstance,
    CsoundPlayState,
    ICsound,
    SET_CSOUND,
    SET_CSOUND_PLAY_STATE
} from "./types";

export interface ICsoundReducer {
    csound: CsoundInstance | undefined;
    libcsound: ICsound | undefined;
    playState: CsoundPlayState;
}

export default (state: any, action: any): ICsoundReducer => {
    switch (action.type) {
        case SET_CSOUND: {
            // store it globally for the Manual!
            (window as any).csound = action.csound;
            return {
                csound: action.csound,
                libcsound: action.libcsound,
                playState: state.playState
            };
        }
        case SET_CSOUND_PLAY_STATE: {
            return {
                csound: state.csound,
                libcsound: state.libcsound,
                playState: action.playState
            };
        }
        default: {
            return (
                state ||
                ({
                    playState: "initialized"
                } as ICsoundReducer)
            );
        }
    }
};

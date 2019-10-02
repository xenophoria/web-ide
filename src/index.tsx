import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store, history } from "./store";
import registerServiceWorker from "./registerServiceWorker";
import Main from "./components/Main/Main";
import { setCsound, setCsoundPlayState } from "./components/Csound/actions";
import CsoundObj from "./components/Csound/CsoundObj";
import { ICsoundObj } from "./components/Csound/types";
import "./config/firestore"; // import for sideffects
import "./css/filemenu.css";
import "./css/index.css";
import "./css/monokai.css";
import "react-perfect-scrollbar/dist/css/styles.css";

(window as any).React = React;
(window as any).ReactDOM = ReactDOM;

// INITIALIZE FIREBASE AND FIRESTORE
// This is done through the import of config/firestore

// INITIALIZE REACT RENDERING
ReactDOM.render(
    <Provider store={store}>
        <Main history={history} />
    </Provider>,
    document.getElementById("root")
);

if ((module as any).hot) {
    (module as any).hot.accept("./components/Main/Main", () => {
        ReactDOM.render(
            <Provider store={store}>
                <Main history={history} />
            </Provider>,
            document.getElementById("root")
        );
    });
}
registerServiceWorker();

// ADD LISTENING TO REDUX STORE FOR SYNCHRONIZING PROJECT FILES TO EMFS
CsoundObj.importScripts("/csound/").then(() => {
    const csound: ICsoundObj = new CsoundObj();
    store.dispatch(setCsound(csound));
    csound.setMessageCallback(() => {});
    csound.addPlayStateListener(csObj => {
        console.log("Csound playState changed: " + csObj.getPlayState());
        store.dispatch(setCsoundPlayState(csObj.getPlayState()));
    });
});

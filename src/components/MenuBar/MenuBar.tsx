import React, { useState, useEffect } from "react";
import onClickOutside from "react-onclickoutside";
import { withShortcut, IWithShortcut } from "react-keybind";
import { useSelector, useDispatch } from "react-redux";
import useStyles from "./styles";
import { MenuItemDef } from "./interfaces";
import { IStore } from "../../db/interfaces";
import { isMac } from "../../utils";
import { newDocument } from "../Projects/actions";
import { reduce } from "lodash";

interface IMenuBarProps {
    shortcut: IWithShortcut;
}

function MenuBar(props) {

    const { shortcut } = (props as IMenuBarProps);

    const activeProjectUid: string = useSelector((store: IStore) => store.ProjectsReducer.activeProjectUid);

    const dispatch = useDispatch();

    const menuBarItems: MenuItemDef[] = [
        {
            label: "File",
            submenu: [
                {
                    label: "New File…",
                    keyBinding: isMac ? "⌘+n" : "alt+n",
                    callback: () => dispatch(newDocument(activeProjectUid, "")),
                },
                {
                    label: "Save Document",
                    keyBinding: isMac ? "⌘+s" : "ctrl+s",
                    role: "saveFile"
                },
                {
                    label: "Save All",
                    keyBinding: isMac ? "⌘+s" : "ctrl+s",
                    role: "saveFile"
                },
                {
                    label: "Save and Close",
                    keyBinding: isMac ? "⌘+s" : "ctrl+s",
                    role: "saveFile"
                },
                {
                    label: "Close",
                    keyBinding: isMac ? "⌘+s" : "ctrl+s",
                    role: "saveFile"
                },
            ],
        },

        { label: "Edit", submenu: [
            { label: "Undo", role: "doStuff" },
            { label: "Redo", role: "doStuff" },
        ] },
        { label: "Control", submenu: [
            { label: "Run", role: "doStuff" },
            { label: "Pause", role: "doStuff" },
            { label: "Render", role: "doStuff" },
            { label: "Stop", role: "doStuff" },
        ] },
        { label: "View", submenu: [{ label: "Do Stuff :)", role: "doStuff" }] },
    ];

    useEffect(
        () => {
            console.log("SHORTC", shortcut);
        },
        [shortcut]);

    (MenuBar as any).handleClickOutside = (evt) => {
        console.log("click outside")
        setOpen(false);
    }

    const classes = useStyles();

    const [open, setOpen] = useState(null) as any;

    function reduceRow(items, nesting) {

        return reduce(items, (acc, item) => {

            const index = acc.length;
            const keyBinding = item.keyBinding;
            const itemCallback = item.callback;

            if (keyBinding && itemCallback) {
                acc.push(
                    <li className={classes.listItem} key={index} onClick={() => itemCallback()}>
                        <p className={classes.label}>{item.label}</p>
                        <span style={{width: 24}} />
                        <i className={classes.label}>{item.keyBinding}</i>
                    </li>
                )
            } else {
                acc.push(
                    <li className={classes.listItem} key={index}>
                        <p className={classes.label}>{item.label}</p>
                    </li>
                )
            }
            return acc;
        }, [] as React.ReactNode[]);
    }


    const columns = reduce(menuBarItems, (acc, item) => {
            const index = acc.length;
            const row = (
                <ul style={{display: open === index ? "block" : "none" }}
                    className={classes.row}>
                    {reduceRow(item.submenu, 0)}
                </ul>
            );
            acc.push(
                <li className={classes.column}
                    key={acc.length + open}
                    onClick={() => ((open !== false) && (index === open) ? setOpen(false) : setOpen(index))}
                    onMouseOver={() => ((open !== false) && (index !== open) ? setOpen(index) : null) }
                >
                    {item.label}
                    {row}
                </li>
            )
            return acc;
    }, [] as React.ReactNode[]);

    return (
        <ul className={classes.root}>
            {columns}
        </ul>
    );
}

const clickOutsideConfig = {
    excludeScrollbar: true,
    handleClickOutside: () => (MenuBar as any).handleClickOutside
};

export default withShortcut(onClickOutside(MenuBar, clickOutsideConfig));

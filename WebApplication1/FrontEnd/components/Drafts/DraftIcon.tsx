import React from 'react';
import { DraftsIndexDraftViewModel } from "./Models/DraftsIndexDraftViewModel";
import Flex from 'react-flexview';
import './css/draftindex.css';
import '../Crosswords/css/crosswords.css'


export function DraftIcon(props: DraftsIndexDraftViewModel) {
    const grid = props.grid;
    return (
        <Flex>
            <div className="crossword-icon-border">
                {grid.map((row, rowNum) =>
                    <Flex key={rowNum} >{row.map((cell, colNum) =>
                        cell === '.' ?
                            <div key={colNum} className={"icon-cell-black"}></div> : <div key={colNum} className={"icon-cell-white"}></div>
                    )}</Flex>
                )}
            </div>
            &nbsp;
            &nbsp;
            &nbsp;
            <Flex column>
                {props.title}
                <a href={`/Drafts/Edit/${props.id}`}>Edit</a>
                <form action={`/Drafts/Delete/${props.id}`} method="post">
                    <button type="submit" className="link-button">Delete</button>
                </form>
            </Flex>
        </Flex>
    );
}
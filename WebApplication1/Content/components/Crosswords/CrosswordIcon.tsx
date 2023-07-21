import React from 'react';
import Flex from 'react-flexview';
import 'react-flexview/lib/flexView.css';
import './css/crosswords.css';
import {CrosswordIconViewModel} from "./Models/CrosswordIconViewModel";


export function CrosswordIcon(props: CrosswordIconViewModel) {
    const grid = props.grid;
    return (
        <Flex>
            <div>
                {grid.map(row =>
                    <Flex column={false}>{row.map(cell =>
                        cell === '.' ?
                            <div className={"icon-cell-black"}></div> : <div className={"icon-cell-white"}></div>
                    )}</Flex>
                )}
            </div>
            &nbsp;
            &nbsp;
            &nbsp;
            <Flex column>
                <div>
                    {props.title}
                </div>
                <div>
                    By {props.author}
                </div>
            </Flex>
        </Flex>
    );
}
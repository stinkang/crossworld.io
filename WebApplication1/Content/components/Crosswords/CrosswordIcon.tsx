import React from 'react';
import Flex from 'react-flexview';
import 'react-flexview/lib/flexView.css';
import './css/crosswords.css';
import {CrosswordIconViewModel} from "./Models/CrosswordIconViewModel";


export function CrosswordIcon(props: CrosswordIconViewModel) {
    const grid = props.grid;
    return (
        <form action={'/Solve/Create/'} method="post">
            <input type="hidden" name="crosswordId" value={props.id} />
            <Flex>
                <button type="submit" style={{background: "none", border: "none", padding: "0", margin: "0"}}>
                    <div className="crossword-icon-border">
                        {grid.map(row =>
                            <Flex column={false}>{row.map(cell =>
                                cell === '.' ?
                                    <div className={"icon-cell-black"}></div> : <div className={"icon-cell-white"}></div>
                            )}</Flex>
                        )}
                    </div>
                </button>
                &nbsp;
                &nbsp;
                &nbsp;
                <Flex column className="icon-text">
                    <div>
                        {props.title}
                    </div>
                    { props.isAnonymous === true ?
                        <div>
                            By Anonymous
                        </div> :
                        <div>
                            By <a href={"/User/Profile/" + props.userId}>{props.author}</a>
                        </div>
                    }
                </Flex>
            </Flex>
        </form>
    );
}
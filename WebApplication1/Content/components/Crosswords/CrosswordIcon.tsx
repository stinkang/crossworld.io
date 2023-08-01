import React from 'react';
import Flex from 'react-flexview';
import 'react-flexview/lib/flexView.css';
import './css/crosswords.css';
import {CrosswordIconViewModel} from "./Models/CrosswordIconViewModel";


export function CrosswordIcon(props: CrosswordIconViewModel) {
    const grid = props.grid;
    
    function formatTime(milliseconds) {
        let totalSeconds = Math.floor(milliseconds / 1000);
        let totalMinutes = Math.floor(totalSeconds / 60);
        let hours = Math.floor(totalMinutes / 60);

        let seconds = totalSeconds % 60;
        let minutes = totalMinutes % 60;
        let ms = milliseconds % 1000;

        return `${hours}:${minutes}:${seconds}:${ms}`;
    }
    
    const leaderboardItems = props.solves.sort((a, b) => a.millisecondsElapsed - b.millisecondsElapsed)
        .filter(solve => solve.isSolved);

    const leaderboard = leaderboardItems
        .map((solve, index) =>
            <div key={solve.userId}>
                {index + 1}. <a href={"/User/Profile/" + solve.userName}>{solve.userName}</a> - {formatTime(solve.millisecondsElapsed)}
            </div>
        );
    
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
                    <h6 className={"title-text"}>
                        {props.title}
                    </h6>
                    { props.isAnonymous === true ?
                        <div>
                            By Anonymous
                        </div> :
                        <div>
                            By <a href={"/User/Profile/" + props.author}>{props.author}</a>
                        </div>
                    }
                    &nbsp;
                    <div className="icon-leaderboard">
                        {leaderboardItems.length != 0 &&
                            <div className={"leaderboard-text"}>
                                Leaderboard
                            </div>
                        }
                        {leaderboard}
                    </div>
                </Flex>
            </Flex>
        </form>
    );
}
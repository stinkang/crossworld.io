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

        let seconds = (totalSeconds % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        let minutes = (totalMinutes % 60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        let ms = (milliseconds % 1000).toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping:false});
        
        if (hours == 0) {
            return `${minutes}:${seconds}:${ms}`;
        }

        return `${hours}:${minutes}:${seconds}:${ms}`;
    }
    
    const leaderboardItems = props.solves.sort((a, b) => a.millisecondsElapsed - b.millisecondsElapsed)
        .filter(solve => solve.isSolved);

    const leaderboard = leaderboardItems
        .map((solve, index) =>
            <div className="solver-text" key={index}>
                {index + 1}. {
                    solve.userName !== "" ?
                        <a href={"/User/Profile/" + solve.userName}>{solve.userName}</a>
                        : "guest" } - {formatTime(solve.millisecondsElapsed)}
            </div>
        );
    
    return (
        <form action={'/Solve/Create/'} method="post">
            <input type="hidden" name="crosswordId" value={props.id} />
            <Flex>
                <button type="submit" style={{background: "none", border: "none", padding: "0", margin: "0"}}>
                    <div className="crossword-icon-border">
                        {grid.map((row, rowIndex) =>
                            <Flex key={rowIndex} column={false}>{row.map((cell, cellIndex) =>
                                cell === '.' ?
                                    <div key={`${rowIndex}-${cellIndex}`} className={"icon-cell-black"}></div> :
                                    <div key={`${rowIndex}-${cellIndex}`} className={"icon-cell-white"}></div>
                            )}</Flex>
                        )}
                    </div>
                </button>
                &nbsp;
                &nbsp;
                &nbsp;
                <Flex column className="icon-text">
                    <h5 className={"title-text"}>
                        {props.title}
                    </h5>
                    { props.isAnonymous === true ?
                        <div>
                            By Anonymous
                        </div> :
                        <div className={"author-text"}>
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
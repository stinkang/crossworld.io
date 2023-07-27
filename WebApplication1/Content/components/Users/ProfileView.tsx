import React from 'react';
import {CrosswordModel} from "../Crosswords/Models/CrosswordModel";
import {CrosswordIcon} from "../Crosswords/CrosswordIcon";
import {CrosswordIconViewModel} from "../Crosswords/Models/CrosswordIconViewModel";
import Flex from "react-flexview";
import 'react-flexview/lib/flexView.css';

export interface ProfileViewProps {
    userName: string;
    publishedCrosswords: CrosswordModel[];
    completedCrosswords: CrosswordModel[];
}

export const ProfileView = (props: ProfileViewProps) => {
    return (
        <div>
            <h1>{props.userName}</h1>
            <Flex>
                <div>
                    <h2>Published Crosswords</h2>
                    <ul>
                        {props.publishedCrosswords.map((crossword) => {
                            return <div>
                                <CrosswordIcon {...new CrosswordIconViewModel(crossword)} />
                                &nbsp;
                                &nbsp;
                            </div>
                        })}
                    </ul>
                </div>
                <div>
                    <h2>Completed Crosswords</h2>
                    <ul>
                        {props.completedCrosswords.map((crossword) => {
                            return <div>
                                <CrosswordIcon {...new CrosswordIconViewModel(crossword)} />
                                &nbsp;
                                &nbsp;
                            </div>
                        })}
                    </ul>
                </div>
            </Flex>
        </div>
    );
}
import React from 'react';
import { DraftsIndexDraftViewModel } from "./Models/DraftsIndexDraftViewModel";
import {DraftIcon} from "./DraftIcon";
import {DBLoader} from "./DBLoader";

export interface DraftsIndexOptions {
    drafts: DraftsIndexDraftViewModel[];
}

export function DraftsIndex(props: DraftsIndexOptions) {
    
    const handleCreateClick = (e) => {
        e.preventDefault();
        fetch('/drafts/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                // Assuming you want to redirect to an "Edit" route with the returned draft ID
                window.location.href = `/drafts/Edit/${data.id}`;
            })
            .catch(error => {
                console.error("There was an issue:", error);
            });
    };
    
    return (
        <div>
            <button className="link-button" onClick={handleCreateClick}>New</button>
            &nbsp;
            <ul>
                { props.drafts.map((draft, index) =>
                    <div key = {index}>
                        <DraftIcon id={draft.id} title={draft.title} grid={draft.grid} />
                        &nbsp;
                        &nbsp;
                    </div>
                )}
            </ul>
        </div>
    );
}
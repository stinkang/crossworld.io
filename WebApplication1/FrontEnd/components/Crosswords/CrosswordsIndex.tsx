import React, {useEffect, useRef, useState} from 'react';
import {CrosswordIcon} from "./CrosswordIcon";
import {CrosswordIconViewModel} from "./Models/CrosswordIconViewModel";
import {LoginModal} from "./LoginModal";
import './css/crosswords.css';

export interface CrosswordsIndexOptions {
    crosswords: CrosswordIconViewModel[];
    isLoggedIn: boolean;
}  

export function CrosswordsIndex(props: CrosswordsIndexOptions) {
    const [crosswords, setCrosswords] = useState(props.crosswords);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = async () => {
        const { innerHeight, scrollY } = window;
        const { scrollHeight } = document.documentElement;

        const isBottom = Math.ceil(scrollY + innerHeight) >= scrollHeight;

        if (isBottom) {
            await loadMoreCrosswords(); // Trigger the loading of more crosswords
        }
    };
    
    const loadMoreCrosswords = async () => {
        try {
            // You should replace this with your actual API call to fetch more crosswords
            const response = await fetch(`/Crosswords/CrosswordPage?page=${page}&pageSize=${pageSize}`)
                .then(response => response.json())
                .then(data => {
                    const newCrosswords = data.crosswordViewModels;
                    // Append new crosswords to the existing ones
                    setCrosswords(prevCrosswords => [...prevCrosswords, ...newCrosswords]);

                    // Increment the page number for the next request
                    setPage(prevPage => prevPage + 1);
                });
        } catch (error) {
            // Handle any loading errors here
            console.error('Failed to load more crosswords:', error);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreCrosswords]);
    
    return (
        <div>
            {!props.isLoggedIn &&
                <LoginModal />
            }
            <div className="grid-container" ref={containerRef}>
                { crosswords.map(crossword =>
                    <div key={crossword.id} className={crossword.grid.length > 11 ? "grid-item-wide" : "grid-item"}>
                        <CrosswordIcon
                            author={crossword.author}
                            id={crossword.id}
                            title={crossword.title}
                            grid={crossword.grid}
                            userId={crossword.userId}
                            isAnonymous={crossword.isAnonymous}
                            solves={crossword.solves}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
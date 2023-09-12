import React, {useCallback, useEffect, useRef, useState} from 'react';
import _ from 'lodash';
import {Helmet} from 'react-helmet';
import 'react-flexview/lib/flexView.css';
import Flex from 'react-flexview';
import Editor from './Editor';
import { makeClues, makeGridFromComposition } from '../../lib/gameUtils';
import { downloadBlob, isMobile } from "../../lib/jsUtils";
import { TestCrosswordClues } from "./Models/TestCrosswordClues";
import format from "../../lib/format";
import {useWordDB, wordDB} from '../../lib/WordDB';
import {DBLoader, LoadButton} from './DBLoader';
import { Button } from 'react-bootstrap';
import {
    isAutofillCompleteMessage,
    isAutofillResultMessage,
    WorkerMessage,
    LoadDBMessage,
    AutofillMessage,
    CancelAutofillMessage,
} from '../../lib/types';
import { getAutofillWorker } from '../../lib/workerLoader';
import PublishModal from "./PublishModal";
import {DraftingToolbar} from "./DraftingToolbar";

let worker: Worker | null = null;

export interface DraftEditorState {
    title: string;
    clues: TestCrosswordClues;
    grid: string[][];
}

export interface DraftEditorProps {
    id: string;
    initialTitle: string;
    initialClues: TestCrosswordClues;
    initialGrid: string[][];
}

const DraftEditor = (props: DraftEditorProps) => {
    const [ready, error, loading, setLoaded] = useWordDB();
    
    const cid = useRef(props.id);
    const editor = useRef(null);
    
    const [mobile, setMobile] = useState(isMobile());
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [autofillInProgress, setAutofillInProgress] = useState(false);
    const [autofillEnabled, setAutofillEnabled] = useState(true);
    const [showSavedText, setShowSavedText] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [symmetryOn, setSymmetryOn] = useState(false);

    const filterClues = (clues: TestCrosswordClues) => {
        const newClues = new TestCrosswordClues();
        clues.across.forEach((clue, index) => {
            if (clue !== null) {
                newClues["across"][index] = clue;
            }
        });
        clues.down.forEach((clue, index) => {
            if (clue !== null) {
                newClues["down"][index] = clue;
            }
        });
        return newClues;
    };
    
    const [compState, setCompState] = useState<DraftEditorState>({
        title: props.initialTitle,
        clues: filterClues(props.initialClues),
        grid: props.initialGrid
    });

    const compStateRef = useRef(compState); // Create a ref for compState

    useEffect(() => {
        // This will run once when the component is mounted

        // Replace componentDidMount logic here:
        window.addEventListener("beforeunload", handleSaveDraft);
        
        setIsCompleted(prevState => getPublishable() );

        return () => {
            // This will run when the component is unmounted
            // Replace componentWillUnmount logic here:
            window.removeEventListener("beforeunload", handleSaveDraft);
        }
    }, []);

    useEffect(() => {
        compStateRef.current = compState; // Keep the ref updated with the latest state
        setIsCompleted(prevState => getPublishable() );
    }, [compState]);

    // We need a ref to the current grid so we can verify it in worker.onmessage
    const currentCells = useRef(compState.grid);
    const priorSolves = useRef<Array<[Array<string>]>>([]);
    const priorWidth = useRef(compState.grid[0].length);
    const priorHeight = useRef(compState.grid.length);
    const runAutofill = useCallback(() => {
        if (!autofillEnabled) {
            if (worker) {
                const msg: CancelAutofillMessage = { type: 'cancel' };
                setAutofillInProgress(false);
                worker.postMessage(msg);
            }
            return;
        }
        if (!wordDB) {
            throw new Error('missing db!');
        }
        currentCells.current = compState.grid;
        if (
            priorWidth.current !== compState.grid[0].length ||
            priorHeight.current !== compState.grid.length
        ) {
            priorWidth.current = compState.grid[0].length
            priorHeight.current = compState.grid.length
            priorSolves.current = [];
        }
        for (const [priorSolve] of priorSolves.current) {
            let match = true;
            let i = 0;
            compState.grid.forEach((row: string[]) => {
                row.forEach(cell => {
                    if (priorSolve[i] === '.' && cell !== '.') {
                        match = false;
                    }
                    if (cell !== ' ' && priorSolve[i] !== cell) {
                        match = false;
                    }
                    i++;
                });
            });
            
            if (match) {
                if (worker) {
                    const msg: CancelAutofillMessage = { type: 'cancel' };
                    setAutofillInProgress(false);
                    worker.postMessage(msg);
                }
                handleUpdateEntireGrid(priorSolve);
                return;
            }
        }
        if (!worker) {
            console.log('initializing worker');

            worker = getAutofillWorker();

            worker.onmessage = (e) => {
                const data = e.data as WorkerMessage;
                if (isAutofillResultMessage(data)) {
                    priorSolves.current.unshift([data.result]);
                    const currentCellsLength = currentCells.current.length * currentCells.current[0].length;
                    let sameInput = true, i = 0;
                    currentCells.current.forEach(row => { row.forEach(c => {
                        if (c !== data.input[0][i]) { sameInput = false; } i++; });
                    });
                    if (currentCellsLength === data.input[0].length && sameInput) {
                        handleUpdateEntireGrid(data.result);
                    }
                } else if (isAutofillCompleteMessage(data)) {
                    setAutofillInProgress(false);
                } else {
                    console.error('unhandled msg in builder: ', e.data);
                }
            };
            const loaddb: LoadDBMessage = { type: 'loaddb', db: wordDB };
            worker.postMessage(loaddb);
        }
        const flattenedGrid = compState.grid.reduce((acc, val) => acc.concat(val), []);
        const autofill: AutofillMessage = {
            type: 'autofill',
            grid: flattenedGrid,
            width: compState.grid[0].length,
            height: compState.grid.length
        };
        setAutofillInProgress(true);
        worker.postMessage(autofill);
    }, [compState.grid, autofillEnabled]);
    
    // useEffect(() => {
    //     runAutofill();
    // }, [runAutofill]);

    const reRunAutofill = useCallback(() => {
        priorSolves.current = [];
        runAutofill();
    }, [runAutofill]);

    const handleUpdateGrid = (r, c, value) => {
        const newGrid = compState.grid;
        newGrid[r][c] = value;
        setCompState({...compState, grid: newGrid});
    };
    
    const handleUpdateEntireGrid = (newGrid: string[]) => {
        if (newGrid.length == 0) {
            setCompState({...compState, grid: [[]]});
        } else {
            const width = compState.grid[0].length;
            const result = [];
            for (let i = 0; i < newGrid.length; i += width) {
                result.push(newGrid.slice(i, i + width));
            }
            setCompState({...compState, grid: result});
        }
    }
    
    const handleChangeSymmetry = () => {
        setSymmetryOn(!symmetryOn);
    };

    const handleFlipColor = (r, c) => {
        const newGrid = compState.grid;
        newGrid[r][c] = newGrid[r][c] == '.' ? ' ' : '.';
        if (symmetryOn) {
            newGrid[compState.grid.length - r - 1][compState.grid[0].length - c - 1] = newGrid[r][c];
        }
        setCompState({...compState, grid: newGrid});
    };

    const handleUpdateClue = (clueNum, dir, value) => {
        const newClues = new TestCrosswordClues();
        if (dir == 'across') {
            newClues['down'] = compState.clues['down'];
            newClues['across'] = [
                ...compState.clues[dir].slice(0, clueNum),
                value,
                ...compState.clues[dir].slice(clueNum + 1)
            ];
        } else {
            newClues['across'] = compState.clues['across'];
            newClues['down'] = [
                ...compState.clues[dir].slice(0, clueNum),
                value,
                ...compState.clues[dir].slice(clueNum + 1)
            ];
        }

        setCompState({ ...compState, clues: newClues });
    };

    const handleUploadSuccess = (puzzle, filename = '') => {
        const {info, grid, circles, clues} = puzzle;
        let newCompState: DraftEditorState = {
            grid: grid,
            clues: clues,
            title: info.title
        };

        setCompState(newCompState);
    };

    const handleUploadFail = () => {};

    const handleUpdateTitle = (title) => {
        setCompState({...compState, title: title});
    };

    const handleUpdateIsAnonymous = (isAnonymous) => {
        setIsAnonymous(isAnonymous);
    };

    const handleExportClick = () => {
        const byteArray = format().fromCompState(compState).toPuz();
        downloadBlob(byteArray, 'download.puz');
    };

    const handleAutofill = () => {
        runAutofill();
    };

    const handleChangeSize = (newRows, newCols) => {
        const { grid } = compState;
        const oldRows = grid.length;
        const oldCols = grid[0].length;
        const newGrid = _.range(newRows).map((i) =>
            _.range(newCols).map((j) => (i < oldRows && j < oldCols ? grid[i][j] : ' '))
        );
        setCompState({...compState, grid: newGrid});
    };

    const handleChangeRows = (newRows) => {
        if (newRows > 0) {
            handleChangeSize(newRows, compState.grid[0].length);
        }
    };

    const handleChangeColumns = (newCols) => {
        if (newCols > 0) {
            handleChangeSize(compState.grid.length, newCols);
        }
    };

    const handleSaveDraft = (event?: Event) => {
        if (event) {
            event.preventDefault();
        }
        
        setShowSavedText(true);
        setTimeout(() => setShowSavedText(false), 3000);
        
        // since this is set as a callback for beforeunload 
        // in useEffect, it only knows about the initial compState, so 
        // we have to get the current compState from the ref.
        let { clues, grid, title } = compStateRef.current;
        
        clues = filterClues(clues);
        let id = cid.current;

        const puzzle = {
            clues,
            title,
            grid,
            id
        };
        const stringJSON = JSON.stringify(puzzle);

        fetch('/drafts/update', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: stringJSON,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }).catch(error => {
            console.log('Error: ', error);
        });
    }

    const handlePublish = () => {
        
        let { grid, title, clues } = compState;

        const puzzle = { clues, isAnonymous, title, grid };
        
        const stringJSON = JSON.stringify(puzzle);

        fetch('/Crosswords/create2', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: stringJSON,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Navigate to the index page.
                window.location.href = "/Crosswords/Index";
            }).catch(error => {
            console.log('Error: ', error);
        });
    };

    const getCellSize = () => {
        if (mobile) {
            return window.innerWidth / compState.grid.length;
        }
        return (30 * 15) / compState.grid[0].length;
    }
    
    const getPublishable = (): boolean => {
        let { grid, clues } = compState;
        const alteredGrid = makeGridFromComposition(grid).toArray();
        clues = makeClues(clues, alteredGrid);
        const cluesFinished = clues.across.every((clue) => clue !== '')
            && clues.down.every((clue) => clue !== '');
        const gridFinished = grid.every((row) => row.every((cell) => cell !== ' '));
        return cluesFinished && gridFinished;
    }

    const renderEditor = () => {
        let { grid, clues, title } = compState;
        grid = makeGridFromComposition(grid).toArray();
        clues = makeClues(clues, grid);

        return (
            <div>
                {!ready && <DBLoader />}
                &nbsp;
                <DraftingToolbar
                    handleToggleAutofill={runAutofill}
                    handleSaveDraft={handleSaveDraft} 
                    handleExport={handleExportClick} 
                    handleImportSuccess={handleUploadSuccess} 
                    handleImportFail={handleUploadFail}
                    handlePublish={handlePublish}
                    handleUpdateColumns={handleChangeColumns} 
                    handleUpdateRows={handleChangeRows}
                    handleUpdateTitle={handleUpdateTitle} 
                    handleUpdateIsAnonymous={handleUpdateIsAnonymous}
                    handleChangeSymmetry={handleChangeSymmetry}
                    isMobile={mobile} 
                    rows={grid.length}
                    columns={grid[0].length}
                    title={title}
                    isCompleted={isCompleted}
                    symmetryOn={symmetryOn}
                />
                
                <Editor
                    ref={editor}
                    size={getCellSize()}
                    grid={grid}
                    clues={clues}
                    title={title}
                    onUpdateGrid={handleUpdateGrid}
                    onAutofill={handleAutofill}
                    onUpdateClue={handleUpdateClue}
                    onFlipColor={handleFlipColor}
                    onPublish={handlePublish}
                    onChangeRows={handleChangeRows}
                    onChangeColumns={handleChangeColumns}
                    onUploadSuccess={handleUploadSuccess}
                    onUploadFail={handleUploadFail}
                    onExportClick={handleExportClick}
                    onUpdateTitle={handleUpdateTitle}
                    onUpdateIsAnonymous={handleUpdateIsAnonymous}
                />
            </div>
        );
    }

    return (
        <Flex
            className="composition"
            column
            grow={1}
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <Helmet>
                <title>{compState.title}</title>
            </Helmet>
            {mobile ? (
                <div>
                    Mobile constructor coming soon! Please use a desktop browser for now.
                </div>
            ) : <Flex style={{ padding: 20 }} grow={1}>
                <Flex column shrink={0}>
                    {renderEditor()}
                </Flex>
            </Flex>}
        </Flex>
    );
}

export default DraftEditor;

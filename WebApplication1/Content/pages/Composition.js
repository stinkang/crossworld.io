import 'react-flexview/lib/flexView.css';
import './css/composition.css';

import React, {Component} from 'react';
import _ from 'lodash';
import {Helmet} from 'react-helmet';
import Flex from 'react-flexview';
//import Nav from '../components/common/Nav';

import actions from '../actions';
import Editor from '../components/Player/Editor';
import {CompositionModel, getUser} from '../store';
import ComposeHistoryWrapper from '../lib/wrappers/ComposeHistoryWrapper';
import EditableSpan from '../components/common/EditableSpan';
import redirect from '../lib/redirect';
import {downloadBlob, isMobile} from '../lib/jsUtils';
import {
  makeGridFromComposition,
  makeClues,
  convertCluesForComposition,
  convertGridForComposition,
} from '../lib/gameUtils';
import format from '../lib/format';
import * as xwordFiller from '../components/Compose/lib/xword-filler';
export default class Composition extends Component {
  constructor(props) {
    super(props);
    this.cid = props.cid;
    this.state = {
      mobile: isMobile(),
      isAnonymous: false
    };
  }

  get cid() {
    return this._cid;
  }

  set cid(value) {
    this._cid = value;
  }

  get composition() {
    return this.historyWrapper.getSnapshot();
  }

  initializeUser() {
    this.user = getUser();
    this.user.onAuth(() => {
      this.forceUpdate();
    });
  }

  initializeComposition() {
    this.compositionModel = new CompositionModel(`/drafts/${this.cid}`);
    this.historyWrapper = new ComposeHistoryWrapper();
    this.compositionModel.on('createEvent', (event) => {
      this.historyWrapper.setCreateEvent(event);
      this.handleUpdate();
    });
    this.compositionModel.on('event', (event) => {
      this.historyWrapper.addEvent(event);
      this.handleUpdate();
    });
      this.compositionModel.attach();
      // this.handleCreateIfNotExists();
    };
/*
    handleCreateIfNotExists = () => {
        // If the composition doesn't exist, initialize it.
        fetch(`/Drafts/DraftExists?Id=${this.cid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data) {
                console.log("Draft does not exist");
                // handle case when draft does not exist
                this.handleCreateDraft();
            }
        })
        .catch(error => {
            console.error(`There has been a problem with your fetch operation: ${error.message}`);
        });
    };

    handleCreateDraft = () => {
        let { grid, clues, info } = this.composition;
        let id = this.cid;

        clues = makeClues(clues, makeGridFromComposition(grid).grid);
        grid = grid.map((row) => row.map(({ value }) => value || '.'));
        let title = info.title;

        const draft = {
            clues,
            title,
            grid,
            id
        };
        const stringJSON = JSON.stringify(draft);

        fetch("/Drafts/Create", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: stringJSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }).catch(error => {
            console.log('Error: ', error);
        });
    };*/


  componentDidMount() {
    this.initializeComposition();
      this.initializeUser();
      window.addEventListener("beforeunload", this.handleSaveDraft);
  }

  componentWillUnmount() {
      if (this.compositionModel) this.compositionModel.detach();
      window.removeEventListener("beforeunload", this.handleSaveDraft);
  }

  get title() {
    if (!this.compositionModel || !this.compositionModel.attached) {
      return undefined;
    }
    const info = this.composition.info;
    return `Compose: ${info.title}`;
  }

    set title(value) {
        this.title = value;
    }

  get otherCursors() {
    return _.filter(this.composition.cursors, ({id}) => id !== this.user.id);
  }

  handleUpdate = _.debounce(
    () => {
      this.forceUpdate();
    },
    0,
    {
      leading: true,
    }
  );

  handleChange = _.debounce(({isEdit = true, isPublished = false} = {}) => {
    const composition = this.historyWrapper.getSnapshot();
    if (isEdit) {
      const {title, author} = composition.info;
      this.user.joinComposition(this.cid, {
        title,
        author,
        published: isPublished,
      });
    }
  });

  handleUpdateGrid = (r, c, value) => {
    this.compositionModel.updateCellText(r, c, value);
  };

  handleFlipColor = (r, c) => {
    const color = this.composition.grid[r][c].value === '.' ? 'white' : 'black';
    this.compositionModel.updateCellColor(r, c, color);
  };

  handleUpdateClue = (r, c, dir, value) => {
    this.compositionModel.updateClue(r, c, dir, value);
  };

  handleUploadSuccess = (puzzle, filename = '') => {
    const {info, grid, circles, clues} = puzzle;
    const convertedGrid = convertGridForComposition(grid);
    const gridObject = makeGridFromComposition(convertedGrid);
    const convertedClues = convertCluesForComposition(clues, gridObject);
    this.compositionModel.import(filename, {
      info,
      grid: convertedGrid,
      circles,
      clues: convertedClues,
    });
    this.handleChange();
  };

  handleUploadFail = () => {};

  handleChat = (username, id, message) => {
    this.compositionModel.chat(username, id, message);
    this.handleChange();
  };

  handleUpdateTitle = (title) => {
    this.compositionModel.updateTitle(title);
    this.handleChange();
  };

  handleUpdateAuthor = (author) => {
    this.compositionModel.updateAuthor(author);
    this.handleChange();
  };
  
  handleUpdateIsAnonymous = (isAnonymous) => {
    this.isAnonymous = isAnonymous;
  };

  handleUnfocusHeader = () => {
    this.chat && this.chat.focus();
  };

  handleUnfocusEditor = () => {
    this.chat && this.chat.focus();
  };

  handleUnfocusChat = () => {
    this.editor && this.editor.focus();
  };

  handleExportClick = () => {
    const byteArray = format().fromComposition(this.composition).toPuz();
    downloadBlob(byteArray, 'download.puz');
  };

  handleUpdateCursor = (selected) => {
    const {r, c} = selected;
    const {id, color} = this.user;
    this.compositionModel.updateCursor(r, c, id, color);
  };

  handleAutofill = () => {
    console.log('c.grid', this.composition.grid);
    const grid = xwordFiller.fillGrid(this.composition.grid);
    console.log('grid', grid);
    this.compositionModel.setGrid(grid);
  };

  handleChangeSize = (newRows, newCols) => {
    const oldGrid = this.composition.grid;
    const oldRows = oldGrid.length;
    const oldCols = oldGrid[0].length;
    const newGrid = _.range(newRows).map((i) =>
      _.range(newCols).map((j) => (i < oldRows && j < oldCols ? oldGrid[i][j] : {value: ''}))
    );
    this.compositionModel.setGrid(newGrid);
  };

  handleChangeRows = (newRows) => {
    if (newRows > 0) {
      this.handleChangeSize(newRows, this.composition.grid[0].length);
    }
  };

  handleChangeColumns = (newCols) => {
    if (newCols > 0) {
      this.handleChangeSize(this.composition.grid.length, newCols);
    }
  };

    handleSaveDraft = (event) => {
        event.preventDefault();
        let { grid, clues, info } = this.composition;
        let id = this.cid;

        clues = makeClues(clues, makeGridFromComposition(grid).grid);
        grid = grid.map((row) => row.map(({ value }) => value));
        let title = info.title;

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
            // Navigate to the index page.
            //window.location.href = "/Crosswords/Index";
        }).catch(error => {
            console.log('Error: ', error);
        });
    }

  handlePublish = () => {
    let {grid, clues, info} = this.composition;

    clues = makeClues(clues, makeGridFromComposition(grid).grid);
    grid = grid.map((row) => row.map(({value}) => value));
    let isAnonymous = this.isAnonymous;
    let title = info.title;

    const puzzle = {
      clues,
      isAnonymous,
      title,
      grid
    };
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
    // actions.createPuzzle(puzzle, (pid) => {
    //   console.log('Puzzle path: ', `/beta/play/${pid}`);
    //   redirect(`/beta/play/${pid}`);
    // });
  };

  handleClearPencil = () => {
    this.compositionModel.clearPencil();
  };
  
  handleChangeAnonimity = (event) => {
    this.compositionModel.updateAnonimity(event.target.checked);
  };

  getCellSize() {
    return (30 * 15) / this.composition.grid[0].length;
  }

  renderEditor() {
    if (!this.compositionModel || !this.compositionModel.attached) {
      return;
    }

    const gridObject = makeGridFromComposition(this.composition.grid);
    const grid = gridObject.grid;
    const clues = makeClues(this.composition.clues, grid);
    const cursors = this.otherCursors;
    const info = this.composition.info;
    const title = info.title;

    return (
      <Editor
        ref={(c) => {
          this.editor = c;
        }}
        size={this.getCellSize()}
        grid={grid}
        clues={clues}
        title={title}
        cursors={cursors}
        onUpdateGrid={this.handleUpdateGrid}
        onAutofill={this.handleAutofill}
        onClearPencil={this.handleClearPencil}
        onUpdateClue={this.handleUpdateClue}
        onUpdateCursor={this.handleUpdateCursor}
        onChange={this.handleChange}
        onFlipColor={this.handleFlipColor}
        onPublish={this.handlePublish}
        onChangeRows={this.handleChangeRows}
        onChangeColumns={this.handleChangeColumns}
        myColor={this.user.color}
        onUnfocus={this.handleUnfocusEditor}
        onUploadSuccess={this.handleUploadSuccess}
        onUploadFail={this.handleUploadFail}
        onExportClick={this.handleExportClick}
        onUpdateTitle={this.handleUpdateTitle}
        onUpdateIsAnonymous={this.handleUpdateIsAnonymous}
        onChangeAnonimity={this.handleChangeAnonimity}
      />
    );
  }

  renderChatHeader() {
    const {title, author} = this.composition.info;

    return (
      <div className="chat--header">
        <EditableSpan
          className="chat--header--title"
          key_="title"
          onChange={this.handleUpdateTitle}
          onBlur={this.handleUnfocusHeader}
          value={title}
        />

        <EditableSpan
          className="chat--header--subtitle"
          key_="author"
          onChange={this.handleUpdateAuthor}
          onBlur={this.handleUnfocusHeader}
          value={author}
        />
      </div>
    );
  }

  render() {
    const style = {
      padding: 20,
    };
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
          <title>{this.title}</title>
        </Helmet>
        <Flex style={style} grow={1}>
          <Flex column shrink={0}>
            {this.renderEditor()}
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

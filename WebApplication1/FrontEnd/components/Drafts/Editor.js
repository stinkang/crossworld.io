/* eslint react/no-string-refs: "warn" */
import './css/editor.css';
import Flex from 'react-flexview';
import React, {Component} from 'react';
import { Modal, Button } from 'react-bootstrap';
import Grid from '../Grid';
import GridControls from '../Player/GridControls';
import EditableSpan from '../common/EditableSpan';

import GridObject from '../../lib/wrappers/GridWrapper';
import * as gameUtils from '../../lib/gameUtils';
import FullScreenModal from './EditorModal';
import PublishModal from "./PublishModal";

import { IconButton } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

if (typeof window !== 'undefined') {
  window.requestIdleCallback =
    window.requestIdleCallback ||
    function (cb) {
      const start = Date.now();
      return setTimeout(() => {
        cb({
          didTimeout: false,
          timeRemaining() {
            return Math.max(0, 50 - (Date.now() - start));
          },
        });
      }, 1);
    };

  window.cancelIdleCallback =
    window.cancelIdleCallback ||
    function (id) {
      clearTimeout(id);
    };
};
/*
 * Summary of Editor component
 *
 * Props: { grid, clues, updateGrid, updateClues }
 *
 * State: { selected, direction }
 *
 * Children: [ GridControls, Grid, EditableClues ]
 * - GridControls.props:
 *   - attributes: { selected, direction, grid, clues }
 *   - callbacks: { setSelected, setDirection }
 * - Grid.props:
 *   - attributes: { grid, selected, direction }
 *   - callbacks: { setSelected, changeDirection }
 * - EditableClues.props:
 *   - attributes: { getClueList(), selected, halfSelected }
 *   - callbacks: { selectClue }
 *
 * Potential parents (so far):
 * - Compose
 * */

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        r: 0,
        c: 0,
      },
      direction: 'across',
      frozen: false,
      isCompleted: false
    };
    this.prvNum = {};
    this.prvIdleID = {};
  }

  get title() {
    return this.props.title;
  }
  get grid() {
    const grid = new GridObject(this.props.grid);
    grid.assignNumbers();
    return grid;
  }
  
  // get publishable() {
  //   const cluesFinished = this.props.clues.across.every((clue) => clue !== '')
  //       && this.props.clues.down.every((clue) => clue !== '');
  //   const gridFinished = this.grid.grid.every((row) => row.every((cell) => cell.black || cell.value !== ' '));
  //   return cluesFinished && gridFinished;
  // }
  
  componentDidMount() {
    this.setState(() => ({
      isCompleted: this.publishable
    }));
  }

  /* Callback fns, to be passed to child components */

  canSetDirection = () => true;

  handleSetDirection = (direction) => {
    this.setState({
      direction,
    });
  };

  handleSetSelected = (selected) => {
    this.setState({
      selected,
    });
  };

  handleChangeDirection = () => {
    this.setState((prevState) => ({
      direction: gameUtils.getOppositeDirection(prevState.direction),
    }));
  };

  handleSelectClue = (direction, number) => {
    this.refs.gridControls.selectClue(direction, number);
  };

  handleUpdateGrid = (r, c, value) => {
    this.props.onUpdateGrid(r, c, value);
    this.setState(() => ({
      isCompleted: this.publishable
    }));
  };

  handlePressPeriod = () => {
    const {selected} = this.state;
    this.props.onFlipColor(selected.r, selected.c);
    this.setState(() => ({
      isCompleted: this.publishable
    }));
  };

  handleChangeClue = (value) => {
    const {direction} = this.state;
    this.props.onUpdateClue(this.selectedClueNumber, direction, value);
    this.setState(() => ({
      isCompleted: this.publishable
    }));
  };

  handleAutofill = () => {
    this.props.onAutofill();
  };

  handlePublish = () => {
    this.props.onPublish();
  };

  handleChangeRows = (event) => {
    this.props.onChangeRows(event.target.value);
  };

  handleChangeColumns = (event) => {
    this.props.onChangeColumns(event.target.value);
  };

  handleClearPencil = () => {
    this.props.onClearPencil();
  };

  handleToggleFreeze = () => {
    this.setState((prevState) => ({
      frozen: !prevState.frozen,
    }));
  };
  
  handleUpdateIsAnonymous = (event) => {
    this.props.onUpdateIsAnonymous(event.target.checked);
  };

  handleUploadSuccess = (puzzle, filename = '') => {
    this.props.onUploadSuccess(puzzle, filename);
    this.setState(() => ({
      isCompleted: this.publishable
    }));
  };

  handleUploadFail = () => {
    this.props.onUploadFail();
  };

  handleExportClick = () => {
    this.props.onExportClick();
  }

  handleUpdateTitle = (event) => {
    this.props.onUpdateTitle(event.target.value);
  }

  /* Helper functions used when rendering */

  get selectedIsWhite() {
    const {selected} = this.state;
    return this.grid.isWhite(selected.r, selected.c);
  }

  get clueBarAbbreviation() {
    const {direction} = this.state;
    if (!this.selectedIsWhite) return undefined;
    if (!this.selectedClueNumber) return undefined;
    return this.selectedClueNumber + direction.substr(0, 1).toUpperCase();
  }

  get selectedClueNumber() {
    const {selected, direction} = this.state;
    if (!this.selectedIsWhite) return undefined;
    return this.grid.getParent(selected.r, selected.c, direction);
  }

  get halfSelectedClueNumber() {
    const {selected, direction} = this.state;
    if (!this.selectedIsWhite) return undefined;
    return this.grid.getParent(selected.r, selected.c, gameUtils.getOppositeDirection(direction));
  }

  get selectedParent() {
    if (!this.selectedIsWhite) return undefined;
    return this.grid.getCellByNumber(this.selectedClueNumber);
  }

  isClueFilled(direction, number) {
    const clueRoot = this.grid.getCellByNumber(number);
    return !this.grid.hasEmptyCells(clueRoot.r, clueRoot.c, direction);
  }

  isClueSelected(direction, number) {
    return direction === this.state.direction && number === this.selectedClueNumber;
  }

  isClueHalfSelected(direction, number) {
    return direction !== this.state.direction && number === this.halfSelectedClueNumber;
  }

  isHighlighted(r, c) {
    const {selected, direction} = this.state;
    const selectedParent = this.grid.getParent(selected.r, selected.c, direction);
    return (
      !this.isSelected(r, c) &&
      this.grid.isWhite(r, c) &&
      this.grid.getParent(r, c, direction) === selectedParent
    );
  }

  isSelected(r, c) {
    const {selected} = this.state;
    return r === selected.r && c === selected.c;
  }

  /* Misc functions */

  // Interacts directly with the DOM
  // Very slow -- use with care
  scrollToClue(dir, num, el) {
    if (el && this.prvNum[dir] !== num) {
      this.prvNum[dir] = num;
      if (this.prvIdleID[dir]) {
        cancelIdleCallback(this.prvIdleID[dir]);
      }
      this.prvIdleID[dir] = requestIdleCallback(() => {
        if (this.clueScroll === el.offsetTop) return;
        const parent = el.offsetParent;
        parent.scrollTop = el.offsetTop - parent.offsetHeight * 0.4;
        this.clueScroll = el.offsetTop;
      });
    }
  }

  focusGrid() {
    this.refs.gridControls && this.refs.gridControls.focus();
  }

  focusClue() {
    this.refs.clue && this.refs.clue.focus();
  }

  focus() {
    this.focusGrid();
  }

  /* Render */

  renderLeft() {
    const {selected, direction} = this.state;
    return (
      <div className="editor--main--left">
        <Flex>
          <h3 className={"title"}>
            {this.title}
          </h3>
          <FullScreenModal
              onChangeRows={this.handleChangeRows}
              onChangeColumns={this.handleChangeColumns}
              onUpdateTitle={this.handleUpdateTitle}
              onExportClick={this.handleExportClick}
              onUploadSuccess={this.handleUploadSuccess}
              onUploadFail={this.handleUploadFail}
              grid={this.grid}
              title={this.title}
          />
        </Flex>
        <Flex>
          <div className="left--grid--and--clues">
            <div className="editor--main--left--grid blurable">
              <Grid
                ref="grid"
                size={this.props.size}
                grid={this.props.grid}
                cursors={this.props.cursors}
                selected={selected}
                direction={direction}
                onSetSelected={this.handleSetSelected}
                onChangeDirection={this.handleChangeDirection}
                myColor={this.props.myColor}
                references={[]}
                editMode
                cellStyle={{}}
              />
            </div>
            <div className="editor--main--clue-bar">
              <div className="editor--main--clue-bar--number">{this.clueBarAbbreviation}</div>
              <div className="editor--main--clue-bar--text">
                <EditableSpan
                  ref="clue"
                  key_={`${direction}${this.selectedClueNumber}`}
                  value={this.props.clues[direction][this.selectedClueNumber] || ''}
                  onChange={this.handleChangeClue}
                  onUnfocus={() => this.focusGrid()}
                  hidden={!this.selectedIsWhite || !this.selectedClueNumber}
                />
              </div>
            </div>
          </div>
          {/* <Flex className="editor--button" hAlignContent="center" onClick={this.handleToggleFreeze}>
            {this.state.frozen ? 'Unfreeze Grid' : 'Freeze Grid'}
          </Flex> */}
        </Flex>
        
        <Flex>
        </Flex>
      </div>
    );
  }

  renderClueList(dir) {
    return this.props.clues[dir].map(
      (clue, i) =>
        clue !== undefined && (
          <Flex
            shrink={0}
            key={i}
            className={`${
              this.isClueSelected(dir, i)
                ? 'selected '
                : this.isClueHalfSelected(dir, i)
                ? 'half-selected '
                : ' '
            }editor--main--clues--list--scroll--clue`}
            ref={
              this.isClueSelected(dir, i) || this.isClueHalfSelected(dir, i)
                ? this.scrollToClue.bind(this, dir, i)
                : null
            }
            onClick={() => {
              this.handleSelectClue(dir, i);
            }}
          >
            <Flex className="editor--main--clues--list--scroll--clue--number" shrink={0}>
              {i}
            </Flex>
            <Flex className="editor--main--clues--list--scroll--clue--text" shrink={1}>
              {clue}
            </Flex>
          </Flex>
        )
    );
  }

  render() {
    const {selected, direction, frozen, isCompleted} = this.state;
    return (
      <Flex className="editor--main--wrapper">
        <GridControls
          ref="gridControls"
          ignore="input"
          selected={selected}
          editMode
          frozen={frozen}
          direction={direction}
          canSetDirection={this.canSetDirection}
          onSetDirection={this.handleSetDirection}
          onSetSelected={this.handleSetSelected}
          onPressEnter={() => this.setState({}, this.focusClue.bind(this))}
          onPressEscape={() => this.props.onUnfocus()}
          onPressPeriod={this.handlePressPeriod}
          updateGrid={this.handleUpdateGrid}
          grid={this.props.grid}
          clues={this.props.clues}
        >
          <Flex className="editor--main">
            {this.renderLeft()}
            <Flex className="editor--right" column>
              <Flex className="editor--main--clues" grow={1}>
                {
                  // Clues component
                  ['across', 'down'].map((dir, i) => (
                    <Flex key={i} className="editor--main--clues--list">
                      <Flex className="editor--main--clues--list--title">{dir.toUpperCase()}</Flex>
                      <Flex column grow={1}>
                        <Flex
                          column
                          grow={1}
                          basis={1}
                          className={`editor--main--clues--list--scroll ${dir}`}
                          ref={`clues--list--${dir}`}
                        >
                          {this.renderClueList(dir)}
                        </Flex>
                      </Flex>
                    </Flex>
                  ))
                }
                <Tooltip title={    
                  <React.Fragment>
                    <div>Type "." to make a black square</div>
                    <div>Change the dimensions using the pencil button</div>
                    <div>Type clues in bar under grid</div>
                  </React.Fragment>
                } placement="top">
                  <IconButton className={"info-button"}>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Flex>
              {/* <Flex className="editor--right--hints">
                <Hints grid={this.props.grid} num={this.selectedClueNumber} direction={direction} />
              </Flex> */}
              <Flex>
                <div className="spacer"></div>
                {/* <FileUploader success={this.handleUploadSuccess} fail={this.handleUploadFail} v2 /> */}
                {/* <Button variant="primary" onClick={this.handleExportClick}>
                    Export
                </Button> */}
                {/* <button className="icon-button" onClick={this.handleAutofill}>
                    <AiFillControl />
                </button>
                <button className="icon-button" onClick={this.handleClearPencil}>
                    <AiFillStar />
                </button> */}
              </Flex>
            </Flex>
          </Flex>
        </GridControls>
      </Flex>
    );
  }
}
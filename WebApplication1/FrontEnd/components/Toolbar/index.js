import './css/index.css';
import React, { Component } from 'react';
import {MdBorderAll, MdChatBubble, MdList, MdSlowMotionVideo} from 'react-icons/md';
import {RiPaintFill, RiPaintLine} from 'react-icons/ri';
import Flex from 'react-flexview';
import swal from '@sweetalert/with-react';
import Clock from './Clock';
import ActionMenu from './ActionMenu';
import Popup from './Popup';
import {isMobile} from '../../lib/jsUtils';

import { Collapse, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

export default class Toolbar extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isExpanded: false,
        showCopiedMessage: false,
      }
    }
    
    handleExpandClick = () => {
        this.setState({isExpanded: !this.state.isExpanded});
    };
    
  get url() {
    return `${window.location.protocol}//${window.location.host}/solve${this.props.path}`;
  }

  handleCopyClick = () => {
    navigator.clipboard.writeText(this.url).then(() => {
      this.setState({showCopiedMessage: true});
      setTimeout(() => { this.setState({showCopiedMessage: false}); }, 3000); // Hide after 3 seconds
    }).catch(err => {
      console.error('Failed to copy link: ' + err);
    });
    
    // `${window.location.host}/beta${this.props.path}`);
    let link = document.getElementById('pathText');
    link.classList.remove('flashBlue');
    void link.offsetWidth;
    link.classList.add('flashBlue');
  };
  
  handleBlur = () => {
    this.props.onRefocus();
  };

  handleMouseDown = (e) => {
    e.preventDefault();
  };

  handlePencilClick = (e) => {
    e.preventDefault();
    this.props.onTogglePencil();
  };

  handlePencilColorPickerClick = (e) => {
    e.stopPropagation();
    let hexColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--pencil-color')
      .trim()
      .substring(1);
    if (hexColor.length === 3) {
      hexColor = hexColor
        .split('')
        .map(function (hex) {
          return hex + hex;
        })
        .join('');
    }
    this.pencilColorPicker.value = '#' + hexColor;
    this.pencilColorPicker.click();
  };

  handlePencilColorPickerChange = (e) => {
    document.documentElement.style.setProperty('--pencil-color', e.target.value);
  };

  handleAutocheckClick = (e) => {
    e.preventDefault();
    this.props.onToggleAutocheck();
  };

  handleToggleListView = (e) => {
    e.preventDefault();
    this.props.onToggleListView();
  };

  handleToggleChat = (e) => {
    e.preventDefault();
    this.props.onToggleChat();
  };

  renderClockControl() {
    const {startTime } = this.props;
    return startTime ? (
      <button
        className="toolbar--btn pause"
        tabIndex={-1}
        onMouseDown={this.handleMouseDown}
      >
      </button>
    ) : (
      <button
        className="toolbar--btn start"
        tabIndex={-1}
        onMouseDown={this.handleMouseDown}
      >
      </button>
    );
  }

  renderCheckMenu() {
    return (
      <div className="toolbar--menu check">
        <ActionMenu
          label="Check"
          onBlur={this.handleBlur}
          actions={{
            "Check Square": this.check.bind(this, 'square'),
            "Check Word": this.check.bind(this, 'word'),
            "Check Puzzle": this.check.bind(this, 'puzzle'),
            "Reveal Square": this.reveal.bind(this, 'square'),
            "Reveal Word": this.reveal.bind(this, 'word'),
            "Reveal Puzzle": this.reveal.bind(this, 'puzzle')
          }}
        />
      </div>
    );
  }

  renderRevealMenu() {
    return (
      <div className="toolbar--menu reveal">
        <ActionMenu
          label="Reveal"
          onBlur={this.handleBlur}
          actions={{
            Square: this.reveal.bind(this, 'square'),
            Word: this.reveal.bind(this, 'word'),
            Puzzle: this.reveal.bind(this, 'puzzle'),
          }}
        />
      </div>
    );
  }

  renderResetMenu() {
    return (
      <ActionMenu
        label="Reset"
        onBlur={this.handleBlur}
        actions={{
          Square: this.reset.bind(this, 'square'),
          Word: this.reset.bind(this, 'word'),
          Puzzle: this.confirmResetPuzzle.bind(this, () => this.reset('puzzle')),
          'Puzzle and Timer': this.resetPuzzleAndTimer.bind(this),
        }}
      />
    );
  }

  handleVimModeClick = (e) => {
    this.props.onToggleVimMode();
  };

  renderExtrasMenu() {
    const {vimMode, onToggleColorAttributionMode} = this.props;
    const vimModeLabel = vimMode ? 'Disable Vim Mode' : 'Enable Vim Mode';
    return (
      <ActionMenu
        label="Extras"
        onBlur={this.handleBlur}
        actions={{
          [vimModeLabel]: this.handleVimModeClick,
          'Color Attribution': onToggleColorAttributionMode,
          'List View': this.props.onToggleListView,
          Pencil: this.props.onTogglePencil,
          Autocheck: this.props.onToggleAutocheck,
        }}
      />
    );
  }


  renderAddFriendsMenu() {
    return (
        <div>
          <ActionMenu
              label="Add Friends"
              onBlur={this.handleBlur}
              actions={{
                'Copy Link': this.handleCopyClick
              }}
          />
          {this.state.showCopiedMessage && <div className="copied-message">Copied!</div>}
        </div>
    );
  }

  renderReplayLink() {
    const replayLink = `/beta/replay/${this.props.gid}`;
    return (
      <a
        className="toolbar--replay-link"
        title="Open Replay"
        href={replayLink}
        target="_blank"
        rel="noreferrer"
      >
        <MdSlowMotionVideo />
      </a>
    );
  }

  renderColorAttributionToggle() {
    const {colorAttributionMode, onToggleColorAttributionMode} = this.props;
    if (isMobile()) {
      return (
        <div
          className={`toolbar--color-attribution-toggle`}
          title="Color Attribution"
          onClick={onToggleColorAttributionMode}
        >
          {colorAttributionMode ? <RiPaintFill /> : <RiPaintLine />}
        </div>
      );
    }
    return (
      <div
        className={`toolbar--color-attribution-toggle${colorAttributionMode ? ' on' : ''}`}
        title="Color Attribution"
        onClick={onToggleColorAttributionMode}
      >
        <RiPaintFill />
      </div>
    );
  }

  renderListViewButton() {
    const {listMode, mobile} = this.props;
    if (mobile) {
      if (listMode) {
        return (
          <MdBorderAll
            onClick={this.handleToggleListView}
            className={`toolbar--list-view${listMode ? ' on' : ''}`}
          />
        );
      }
      return (
        <MdList
          onClick={this.handleToggleListView}
          className={`toolbar--list-view${listMode ? ' on' : ''}`}
        />
      );
    }
    return (
      <div
        className={`toolbar--list-view${listMode ? ' on' : ''}`}
        onClick={this.handleToggleListView}
        onMouseDown={this.handleMouseDown}
        title="List View"
      >
        <i className="fa fa-list" />
      </div>
    );
  }

  renderChatButton() {
    return <MdChatBubble onClick={this.handleToggleChat} className="toolbar--chat" />;
  }

  renderPencil() {
    const {pencilMode} = this.props;
    return (
      <div
        className={`toolbar--pencil${pencilMode ? ' on' : ''}`}
        onClick={this.handlePencilClick}
        onMouseDown={this.handleMouseDown}
        title="Shortcut: ."
      >
        <i className="fa fa-pencil" />
        {pencilMode && (
          <div className={'toolbar--pencil-color-picker-container'}>
            <div className={'toolbar--pencil-color-picker'} onClick={this.handlePencilColorPickerClick}></div>
            <input
              type="color"
              ref={(input) => (this.pencilColorPicker = input)}
              onClick={(e) => e.stopPropagation()}
              onChange={this.handlePencilColorPickerChange}
            ></input>
          </div>
        )}
      </div>
    );
  }

  renderAutocheck() {
    const {autocheckMode} = this.props;
    return (
      <div
        className={`toolbar--autocheck${autocheckMode ? ' on' : ''}`}
        onClick={this.handleAutocheckClick}
        onMouseDown={this.handleMouseDown}
        title="Autocheck"
      >
        <i className="fa fa-check-square" />
      </div>
    );
  }

  renderInfo() {
    return (
      <div className="toolbar--info">
        <Popup icon="fa-info-circle" onBlur={this.handleBlur}>
          <h3>How to Enter Answers</h3>
          <ul>
            <li>
              Click a cell once to enter an answer, and click that same cell again to switch between
              horizontal and vertical orientations
            </li>
            <li>Click the clues to move the cursor directly to the cell for that answer</li>
            <li>
              Hold down the <code>Shift</code> key to enter multiple characters for rebus answers
            </li>
          </ul>
          <h4>Basic Keyboard Shortcuts</h4>
          <table>
            <tbody>
              <tr>
                <th>Shortcut</th>
                <th>Description</th>
              </tr>
              <tr>
                <td>Letter / Number</td>
                <td>
                  Fill in current cell and advance cursor to next unfilled cell in the same word, if any
                </td>
              </tr>
              <tr>
                <td>
                  <code>.</code> (period)
                </td>
                <td>Toggle pencil mode on/off</td>
              </tr>
              <tr>
                <td>Arrow keys</td>
                <td>
                  Either move cursor along current orientation or change orientation without moving cursor
                </td>
              </tr>
              <tr>
                <td>Space bar</td>
                <td>Flip orientation between down/across</td>
              </tr>
              <tr>
                <td>
                  <code>Delete</code> or <code>Backspace</code>
                </td>
                <td>Clear current cell</td>
              </tr>
              <tr>
                <td>
                  <code>Alt</code> + <code>S</code>, <code>W</code>, or <code>P</code>
                </td>
                <td>
                  Check <b>S</b>quare, <b>W</b>ord, or <b>P</b>uzzle
                </td>
              </tr>
              <tr>
                <td>
                  <code>Alt</code> + <code>Shift</code> + <code>S</code>, <code>W</code>, or <code>P</code>
                </td>
                <td>
                  Reveal <b>S</b>quare, <b>W</b>ord, or <b>P</b>uzzle
                </td>
              </tr>
            </tbody>
          </table>
          <h4>Advanced Keyboard Shortcuts</h4>
          <table>
            <tbody>
              <tr>
                <td>
                  <code>[</code> and <code>]</code> OR <code>Shift</code> with arrow keys
                </td>
                <td>Move cursor perpendicular to current orientation without changing orientation</td>
              </tr>
              <tr>
                <td>
                  <code>Tab</code> and <code>Shift+Tab</code>
                </td>
                <td>Move cursor to first unfilled square of next or previous unfilled clue</td>
              </tr>
              <tr>
                <td>
                  <code>Home</code> OR <code>End</code>
                </td>
                <td>Move cursor to the beginning or end of a clue</td>
              </tr>
            </tbody>
          </table>
        </Popup>
      </div>
    );
  }

  check(scopeString) {
    this.props.onCheck(scopeString);
  }

  reveal(scopeString) {
    swal({
      title: `Are you sure you want to show the ${scopeString}?`,
      text: `All players will be able to see the ${scopeString}'s answer.`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((shouldReveal) => {
      if (shouldReveal) {
        this.props.onReveal(scopeString);
      }
    });
  }

  reset(scopeString) {
    this.props.onReset(scopeString);
  }

  keybind(mode) {
    this.props.onKeybind(mode);
  }

  confirmResetPuzzle(callback) {
    swal({
      title: `Are you sure you want to reset the entire puzzle?`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        callback();
      }
    });
  }

  resetPuzzleAndTimer() {
    this.confirmResetPuzzle(() => {
      this.reset('puzzle');
      this.props.onResetClock();
    });
  }

  render() {
    const {
      mobile,
      startTime,
      stopTime,
      pausedTime,
      onStartClock,
      onPauseClock,
      solved,
      replayMode,
    } = this.props;

    if (mobile) {
      return <div>
        {this.state.isExpanded ?
            <Flex className="toolbar--mobile" vAlignContent="center">
              <Flex className="toolbar--mobile--top" grow={1} vAlignContent="center">
                <h5 className={"title"}>{this.props.title}</h5>
                <Clock
                    v2={this.props.v2}
                    startTime={startTime}
                    stopTime={stopTime}
                    pausedTime={pausedTime}
                    replayMode={replayMode}
                    isPaused={this.props.isPaused || !startTime}
                />
                {!solved && !replayMode && this.renderCheckMenu()}
                {!replayMode && this.renderExtrasMenu()}
                {this.renderAddFriendsMenu()}
                {this.renderChatButton()}
                <IconButton className="expand-button" onClick={this.handleExpandClick}>
                  <ExpandLessIcon />
                </IconButton>
              </Flex>
            </Flex> :
            <div className="expand-button-div">
              <IconButton className="expand-button" onClick={this.handleExpandClick}>
                <ExpandMoreIcon />
              </IconButton>
            </div>
        }
      </div>;
    }

    return (
      <div className="toolbar">
        <h3>{this.props.title}</h3>
        <div className="toolbar--timer">
          <Clock
            v2={this.props.v2}
            replayMode={replayMode}
            startTime={startTime}
            stopTime={stopTime}
            pausedTime={pausedTime}
            isPaused={this.props.isPaused || !startTime}
          />
        </div>
        {!solved && !replayMode && this.renderCheckMenu()}
        {!replayMode && this.renderExtrasMenu()}
        {this.renderAddFriendsMenu()}
        {!replayMode && this.renderInfo()}
      </div>
    );
  }
}

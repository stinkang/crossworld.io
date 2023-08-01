import './css/index.css';
import React, {Component} from 'react';
import _ from 'lodash';
import Flex from 'react-flexview';
import Linkify from 'react-linkify';
import {MdClose} from 'react-icons/md';
import Emoji from '../common/Emoji';
import * as emojiLib from '../../lib/emoji';
import nameGenerator from '../../lib/nameGenerator';
import ChatBar from './ChatBar';
import EditableSpan from '../common/EditableSpan';
import MobileKeyboard from '../Player/MobileKeyboard';
import ColorPicker from './ColorPicker.tsx';

const isEmojis = (str) => {
  const res = str.match(/[A-Za-z,.0-9!-]/g);
  return !res;
};

export default class Chat extends Component {
  constructor() {
    super();
    this.chatBar = React.createRef();
  }

  componentDidMount() {
    this.handleUpdateDisplayName(this.props.userName);
  }

  handleUpdateDisplayName = (username) => {
    if (!this.usernameInput?.current?.focused) {
      username = username || "Guest";
    }
    const {id} = this.props;
    this.props.onUpdateDisplayName(id, username);
    this.setState({username});
    localStorage.setItem(this.usernameKey, username);
  };

  get userName() {
    return this.props.userName;
  }

  get usernameKey() {
    return `username_${window.location.href}`;
  }

  handleSendMessage = (message) => {
    const {id} = this.props;
    this.props.onChat(this.userName, id, message);
  };

  handleUpdateColor = (color) => {
    color = color || this.props.color;
    const {id} = this.props;
    this.props.onUpdateColor(id, color);
  };

  handleUnfocus = () => {
    this.props.onUnfocus && this.props.onUnfocus();
  };

  handleToggleChat = () => {
    this.props.onToggleChat();
  };

  focus = () => {
    const chatBar = this.chatBar.current;
    if (chatBar) {
      chatBar.focus();
    }
  };

  mergeMessages(data, opponentData) {
    if (!opponentData) {
      return data.messages || [];
    }

    const getMessages = (data, isOpponent) => _.map(data.messages, (message) => ({...message, isOpponent}));

    const messages = _.concat(getMessages(data, false), getMessages(opponentData, true));

    return _.sortBy(messages, 'timestamp');
  }

  getMessageColor(senderId, isOpponent) {
    const {users, teams} = this.props;
    if (isOpponent === undefined) {
      if (users[senderId]?.teamId) {
        return teams?.[users[senderId].teamId]?.color;
      }
      return users[senderId]?.color;
    }
    return isOpponent ? 'rgb(220, 107, 103)' : 'rgb(47, 137, 141)';
  }

  renderGameButton() {
    return <MdClose onClick={this.handleToggleChat} className="toolbar--game" />;
  }

  renderToolbar() {
    if (!this.props.mobile) return;
    return (
      <Flex className="toolbar--mobile" vAlignContent="center">
        {/*<Link to="/">Down for a Cross</Link> {this.renderGameButton()}*/}
      </Flex>
    );
  }

  renderChatHeader() {
    if (this.props.header) return this.props.header;
    const {info = {}, bid} = this.props;
    const {title, description, author, type} = info;
    const desc = description?.startsWith('; ') ? description.substring(2) : description;

    return (
      <div className="chat--header">
        {/*<div className="chat--header--title">{title}</div>*/}
        {/*<div className="chat--header--subtitle">{type && `${type} | By ${author}`}</div>*/}
        {desc && (
          <div className="chat--header--description">
            <strong>Note: </strong>
            <Linkify>{desc}</Linkify>
          </div>
        )}

        {bid && (
          <div className="chat--header--subtitle">
            Battle
            {bid}
          </div>
        )}
      </div>
    );
  }

  renderUserPresent(id, displayName, color) {
    const style = color && {
      color,
    };
    return (
      <span key={id} style={style}>
        <span className="dot">{'\u25CF'}</span>
        {displayName}{' '}
      </span>
    );
  }

  renderUsersPresent(users) {
    return this.props.hideChatBar ? null : (
      <div className="chat--users--present">
        {Object.keys(users).map((id) => this.renderUserPresent(id, users[id].displayName, users[id].color))}
      </div>
    );
  }

  renderChatBar() {
    return this.props.hideChatBar ? null : (
      <ChatBar
        ref={this.chatBar}
        mobile={this.props.mobile}
        placeHolder="[Enter] to chat"
        onSendMessage={this.handleSendMessage}
        onUnfocus={this.handleUnfocus}
      />
    );
  }

  renderMessageTimestamp(timestamp) {
    return (
      <span className="chat--message--timestamp">
        {new Date(timestamp).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}
      </span>
    );
  }

  renderMessageSender(name, color) {
    const style = color && {
      color,
    };
    return (
      <span className="chat--message--sender" style={style}>
        {name}:
      </span>
    );
  }

  renderMessageText(text) {
    const words = text.split(' ');
    const tokens = [];
    words.forEach((word) => {
      if (word.length === 0) return;
      if (word.startsWith(':') && word.endsWith(':')) {
        const emoji = word.substring(1, word.length - 1);
        const emojiData = emojiLib.get(emoji);
        if (emojiData) {
          tokens.push({
            type: 'emoji',
            data: emoji,
          });
          return;
        }
      }

      if (word.startsWith('@')) {
        const pattern = word.substring(1);
        if (pattern.match(/^\d+-?\s?(a(cross)?|d(own)?)$/i)) {
          tokens.push({
            type: 'clueref',
            data: `@${pattern}`,
          });
          return;
        }
      }

      if (tokens.length && tokens[tokens.length - 1].type === 'text') {
        tokens[tokens.length - 1].data += ` ${word}`;
      } else {
        tokens.push({
          type: 'text',
          data: word,
        });
      }
    });

    const bigEmoji = tokens.length <= 3 && _.every(tokens, (token) => token.type === 'emoji');
    return (
      <span className="chat--message--text">
        {tokens.map((token, i) => (
          <React.Fragment key={i}>
            {token.type === 'emoji' ? (
              <Emoji emoji={token.data} big={bigEmoji} />
            ) : token.type === 'clueref' ? (
              token.data // for now, don't do anything special to cluerefs
            ) : (
              token.data
            )}
            {token.type !== 'emoji' && ' '}
          </React.Fragment>
        ))}
      </span>
    );
  }

  renderMessage(message) {
    const {text, senderId: id, isOpponent, timestamp} = message;
    const big = text.length <= 10 && isEmojis(text);
    const color = this.getMessageColor(id, isOpponent);
    const users = this.props.users;

    return (
      <div className={`chat--message${big ? ' big' : ''}`}>
        <div className="chat--message--content">
          {this.renderMessageSender(users[id]?.displayName ?? 'Unknown', color)}
          {this.renderMessageText(message.text)}
        </div>
        <div className="chat--message--timestamp">{this.renderMessageTimestamp(timestamp)}</div>
      </div>
    );
  }

  renderMobileKeyboard() {
    if (!this.props.mobile) {
      return;
    }

    return (
      <Flex shrink={0}>
        <MobileKeyboard layout="uppercase" />
      </Flex>
    );
  }

  renderChatSubheader() {
    //if (this.props.subheader) return this.props.subheader;
    const users = this.props.users;

    return (
      <>
        {this.renderUsersPresent(users)}
      </>
    );
  }

  render() {
    const messages = this.mergeMessages(this.props.data, this.props.opponentData);
    return (
      <Flex column grow={1}>
        {this.renderToolbar()}
        <div className="chat">
          <div
            ref={(el) => {
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }}
            className="chat--messages"
          >
            {messages.map((message, i) => (
              <div key={i}>{this.renderMessage(message)}</div>
            ))}
          </div>
          {this.renderChatBar()}
          {this.renderChatSubheader()}
        </div>
      </Flex>
    );
  }
}

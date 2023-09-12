import React, {Component} from 'react';
import _ from 'lodash';
//import {Link} from 'react-router-dom';

//import Nav from '../components/common/Nav';
import actions from '../actions';
import {getUser, GameModel, PuzzleModel } from '../store';
import redirect from '../lib/redirect';

export default class Play extends Component {
  constructor() {
    super();
    this.state = {
      userHistory: null,
      creating: false,
    };
  }

  componentDidMount() {
    this.user = getUser();
    this.user.onAuth(() => {
      this.user.listUserHistory().then((userHistory) => {
        this.setState({userHistory});
      });
    });
    this.create();
  }

  componentDidUpdate() {
  }

  get solveId() {
    return this.props.solveId;
  }
  
  get crosswordId() {
    return this.props.crosswordId;
  }
  
  create() {
    this.setState({
      creating: true,
    });
      const game = new GameModel(`/game/${this.solveId}`);
      const puzzle = new PuzzleModel(this.crosswordId);

      puzzle.once('ready', async () => {
        const rawGame = puzzle.toGame();
        try {
          await Promise.all([
            game.initialize(rawGame),
            this.user.joinGame(this.solveId, {
              pid: this.pid,
              solved: false,
              v2: true,
            }),
          ]);
          redirect(`/solve/game/${this.solveId}`);
        } catch (error) {
          console.error('An error occurred:', error);
        }
      });
  };

  renderMain() {
    if (this.state.creating) {
      return <div style={{padding: 20}}>Creating game...</div>;
    }

    if (!this.games) {
      return <div style={{padding: 20}}>Loading...</div>;
    }

    return (
      <div style={{padding: 20}}>
        Your Games
        <table>
          <tbody>
            {_.map(this.games, ({gid, time}) => (
              <tr key={gid}>
                <td>
                  {/* <Timestamp time={time} /> */}
                </td>
                <td>
                  {/* <Link to={`/game/${gid}`}>Game {gid}</Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div>
        {/* <Nav v2 /> */}
        {this.renderMain()}
      </div>
    );
  }
}

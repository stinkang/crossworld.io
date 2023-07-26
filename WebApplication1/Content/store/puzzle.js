import EventEmitter from 'events';
import _ from 'lodash';
import {db, getTime} from './firebase';
import {makeGrid} from '../lib/gameUtils';

// a wrapper class that models Puzzle

export default class Puzzle extends EventEmitter {
  constructor(crosswordId) {
    super();
    this.crosswordId = crosswordId;
    
    fetch(`/crosswords/details/${this.crosswordId}`)
        .then((response) => response.json())
        .then((data) => {
          this.data = data;
          this.emit('ready');
        }
    );
    
  }

  toGame() {
    const {info, circles = [], shades = [], grid: solution, pid} = this.data;
    const gridObject = makeGrid(solution);
    const clues = gridObject.alignClues(this.data.clues);
    const grid = gridObject.toArray();

    const game = {
      info,
      circles,
      shades,
      clues,
      solution,
      pid,
      grid,
      createTime: getTime(),
      startTime: null,
      chat: {
        users: [],
        messages: [],
      },
    };
    return game;
  }

  get info() {
    if (!this.data) return undefined;
    return this.data.info;
  }
}

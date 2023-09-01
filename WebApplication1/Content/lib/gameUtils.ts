// eslint-disable-next-line import/no-cycle
import GridWrapper from './wrappers/GridWrapper';
import {TestCrosswordClues} from "../components/Compose/Models/TestCrosswordClues";

export const getOppositeDirection = (direction) =>
  ({
    across: 'down',
    down: 'across',
  }[direction]);

export const makeEmptyGame = () => ({
  gid: undefined,
  name: undefined,
  info: undefined,
  clues: {
    across: [],
    down: [],
  },
  solution: [['']],
  grid: [
    [
      {
        black: false,
        number: 1,
        edits: [],
        value: '',
        parents: {
          across: 1,
          down: 1,
        },
      },
    ],
  ],
  createTime: undefined,
  startTime: undefined,
  chat: {
    users: [],
    messages: [],
  },
  circles: [],
});

export const makeGrid = (textGrid, fillWithSol) => {
  const newGridArray = textGrid.map((row) =>
    row.map((cell) => ({
      black: cell === '.',
      edits: [],
      value: fillWithSol ? cell : '',
      number: null,
    }))
  );
  const grid = new GridWrapper(newGridArray);
  grid.assignNumbers();
  return grid;
};

export const makeGridFromComposition = (compositionGrid) => {
  const newGridArray = compositionGrid.map((row) =>
    row.map((value) => ({
      black: value === '.',
      value: value === '.' ? '' : value,
      pencil: false,
      number: null,
    }))
  );
  const grid = new GridWrapper(newGridArray);
  grid.assignNumbers();
  return grid;
};

export const makeClues = (clues: TestCrosswordClues, grid) => {
  const result = {
    across: [],
    down: [],
  };
  
  clues.across.forEach((clue, index) => {
    if (clue !== null) {
      result["across"][index] = clue;
    }
  });

  clues.down.forEach((clue, index) => {
    if (clue !== null) {
      result["down"][index] = clue;
    }
  });
  
  return new GridWrapper(grid).alignClues(result);
};

export const convertCluesForComposition = (clues, gridObject) => {
  const alignedClues = gridObject.alignClues(clues);
  const result = [];
  ['across', 'down'].forEach((dir) => {
    alignedClues[dir].forEach((value, i) => {
      if (value) {
        const cell = gridObject.getCellByNumber(i);
        if (!cell) {
          return;
        }
        const {r, c} = cell;
        result.push({
          dir,
          r,
          c,
          value,
        });
      }
    });
  });
  return result;
};

export const convertGridForComposition = (grid) =>
  grid.map((row) =>
    row.map((value) => ({
      value,
    }))
  );

export const makeEmptyClues = (gridArray) => {
  const grid = new GridWrapper(gridArray);
  return grid.alignClues({
    across: [],
    down: [],
  });
};

export const allNums = (str) => {
  const pattern = /\d+/g;
  return (str.match(pattern) || []).map((x) => Number(x));
};

export const getReferencedClues = (str, clues) => {
  if (!str) return [];
  str = str.toLowerCase();
  let res = [];
  while (str.indexOf('across') !== -1 || str.indexOf('down') !== -1) {
    const a = str.indexOf('across');
    const b = str.indexOf('down');
    if ((a < b || b === -1) && a !== -1) {
      const nums = allNums(str.substring(0, a));
      res = res.concat(
        nums.map((num) => ({
          ori: 'across',
          num,
        }))
      );
      str = str.substr(a + 'across'.length);
    } else {
      const nums = allNums(str.substring(0, b));
      res = res.concat(
        nums.map((num) => ({
          ori: 'down',
          num,
        }))
      );
      str = str.substr(b + 'down'.length);
    }
  }

  const referencesStars =
    str.indexOf('starred') !== -1 &&
    (str.indexOf('clue') !== -1 || str.indexOf('entry') !== -1 || str.indexOf('entries') !== -1);
  if (referencesStars) {
    ['down', 'across'].forEach((dir) => {
      clues[dir].forEach((clueText, i) => {
        const hasStar = clueText && (clueText.trim().startsWith('*') || clueText.trim().endsWith('*'));
        if (hasStar) {
          res.push({
            ori: dir,
            num: i,
          });
        }
      });
    });
  }
  return res;
};

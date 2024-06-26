import Puz from 'puzjs';
import GridObject from './wrappers/GridWrapper';

const infoToMeta = (info) => {
  const {title = '', author = '', description = '', notes = '', copyright = ''} = info;
  return {
    description,
    title,
    notes,
    author,
    copyright,
  };
};

const gridToTextGrid = (grid) => grid.map((row) => row.map((cell) => (cell.black ? '.' : cell.value)));

// to hanlde the various different formats of games
const f = () => ({
  fromPuz: (blob) => {
    const {grid, clues, circles} = Puz.decode(blob);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return intermediate({
      info: {},
      grid,
      clues,
      extras: {
        circles,
      },
    });
  },

  fromCompState: (compState) => {
    const {info = { author: "", title: "" }, title, grid: compositionGrid, clues: compositionClues, circles = []} = compState;

    const grid = compositionGrid.map((row) =>
      row.map(value => ({
        black: value === '.',
        value: value === '.' ? '' : value,
        pencil: false,
        number: null,
      }))
    );
    new GridObject(grid).assignNumbers();
    const clues = new GridObject(grid).alignClues(compositionClues);
    info.title = title;

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return intermediate({
      info,
      grid,
      clues,
      extras: {
        circles,
        shades: [],
      },
    });
  },

  fromPuzzle: () => {
    // TODO
  },

  fromGame: () => {
    // TODO
  },
});

const validateGame = ({grid}) => {
  if (typeof grid[0][0] !== 'object') {
    throw new Error('Game grid should be object');
  }
  // TODO finish this
};

const validateIntermediate = validateGame;

const intermediate = ({info, grid, clues, extras}) => {
  validateIntermediate({
    info,
    grid,
    clues,
    extras,
  });
  return {
    toPuz: () =>
      Puz.encode({
        meta: infoToMeta(info),
        grid: gridToTextGrid(grid),
        clues,
        circles: extras.circles,
      }),

    toComposition: () => ({
      // TODO
    }),

    toPuzzle: () => ({
      grid,
      info,
      circles: extras.circles,
      shades: extras.shades,
      across: clues.across,
      down: clues.down,
    }),

    toGame: () => ({
      // TODO
    }),
  };
};

export default f;

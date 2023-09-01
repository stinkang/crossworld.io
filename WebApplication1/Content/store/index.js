import {offline} from './firebaseConfig';
// // eslint-disable-next-line import/no-cycle
// import battle from './battle';
// import demoGame from './demoGame';
import demoUser, {getUser as _demoGetUser} from './demoUser';
// import demoPuzzlelist from './demoPuzzlelist';
import game from './game';
import user, {getUser as _getUser} from './user';
// import puzzlelist from './puzzlelist';
import puzzle from './puzzle';

// export const BattleModel = battle;
export const GameModel = game;
export const UserModel = offline ? demoUser : user;
// export const PuzzlelistModel = offline ? demoPuzzlelist : puzzlelist;
export const PuzzleModel = puzzle;

export const getUser = offline ? _demoGetUser : _getUser;

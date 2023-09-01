import { isSome, none, Option, some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import type { WordDBT } from './WordDB';

import { DBPuzzleT, CommentWithRepliesT, GlickoScoreT } from './dbtypes';
import { ConstructorPageWithMarkdown } from './constructorPage';
import type { Root } from 'hast';

export type Optionalize<T extends K, K> = Omit<T, keyof K>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function hasOwnProperty<
  X extends Record<string, unknown>,
  Y extends PropertyKey
>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export const BLOCK = '.';

export enum Symmetry {
  Rotational,
  Horizontal,
  Vertical,
  None,
  DiagonalNESW,
  DiagonalNWSE,
}

export enum CheatUnit {
  Square,
  Entry,
  Puzzle,
}

export enum PrefillSquares {
  EvenEven,
  OddOdd,
  EvenOdd,
  OddEven,
}

export enum Direction {
  Across,
  Down,
}

export interface WorkerMessage {
  type: string;
}
export interface AutofillResultMessage extends WorkerMessage {
  type: 'autofill-result';
  input: [string[], /*Set<number>, Set<number>*/];
  result: string[];
}
export function isAutofillResultMessage(
  msg: WorkerMessage
): msg is AutofillResultMessage {
  return msg.type === 'autofill-result';
}
export interface AutofillCompleteMessage extends WorkerMessage {
  type: 'autofill-complete';
}
export function isAutofillCompleteMessage(
  msg: WorkerMessage
): msg is AutofillCompleteMessage {
  return msg.type === 'autofill-complete';
}
export interface LoadDBMessage extends WorkerMessage {
  type: 'loaddb';
  db: WordDBT;
}
export function isLoadDBMessage(msg: WorkerMessage): msg is LoadDBMessage {
  return msg.type === 'loaddb';
}
export interface CancelAutofillMessage extends WorkerMessage {
  type: 'cancel';
}
export function isCancelAutofillMessage(
  msg: WorkerMessage
): msg is CancelAutofillMessage {
  return msg.type === 'cancel';
}
export interface AutofillMessage extends WorkerMessage {
  type: 'autofill';
  grid: string[];
  width: number;
  height: number;
}
export function isAutofillMessage(msg: WorkerMessage): msg is AutofillMessage {
  return msg.type === 'autofill';
}

export interface Position {
  row: number;
  col: number;
}

export interface PosAndDir extends Position {
  dir: Direction;
}

export interface ClueT {
  num: number;
  dir: 0 | 1;
  clue: string;
  explanation: string | null;
}

export interface Comment {
  commentText: string;
  commentHast: Root;
  authorId: string;
  authorDisplayName: string;
  authorUsername?: string;
  /** author solve time in fractional seconds */
  authorSolveTime: number;
  authorCheated: boolean;
  authorSolvedDownsOnly: boolean;
  /** comment publish timestamp in millis since epoch*/
  publishTime: number;
  id: string;
  replies?: Array<Comment>;
  authorIsPatron: boolean;
}

export interface PuzzleT {
  authorId: string;
  authorName: string;
  guestConstructor: string | null;
  moderated: boolean;
  publishTime: number;
  title: string;
  size: {
    rows: number;
    cols: number;
  };
  clues: Array<ClueT>;
  grid: Array<string>;
  vBars: Array<number>;
  hBars: Array<number>;
  hidden: Array<number>;
  highlighted: Array<number>;
  highlight: 'circle' | 'shade';
  comments: Array<CommentWithRepliesT>;
  commentsDisabled: boolean;
  constructorNotes: string | null;
  blogPost: string | null;
  isPrivate: boolean | number;
  isPrivateUntil: number | null;
  contestAnswers: Array<string> | null;
  contestHasPrize: boolean;
  contestSubmissions: Array<{ n: string; t: number; s: string }> | null;
  contestRevealDelay: number | null;
  rating: GlickoScoreT | null;
  alternateSolutions: Array<Array<[number, string]>>;
  dailyMiniDate?: string;
  userTags?: Array<string>;
  autoTags?: Array<string>;
}

export interface PuzzleResult extends PuzzleT {
  id: string;
}

// This is kind of a hack but it helps us to ensure we only query for constructorPages on server side
export interface ServerPuzzleResult
  extends Omit<PuzzleResult, 'comments' | 'constructorNotes' | 'blogPost'> {
  blogPost: Root | null;
  blogPostRaw: string | null;
  constructorNotes: Root | null;
  constructorPage: ConstructorPageWithMarkdown | null;
  constructorIsPatron: boolean;
  clueHasts: Array<Root>;
}
export interface PuzzleResultWithAugmentedComments extends ServerPuzzleResult {
  comments: Array<Comment>;
}

export type Key =
  | { k: KeyK.AllowedCharacter; c: string }
  | { k: Exclude<KeyK, KeyK.AllowedCharacter> };

export enum KeyK {
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Space,
  Tab,
  ShiftTab,
  Enter,
  ShiftEnter,
  Backspace,
  Delete,
  Escape,
  Backtick,
  Dot,
  Comma,
  Exclamation,
  Octothorp,
  AllowedCharacter,
  // Keys specific to on-screen keyboard
  NumLayout,
  AbcLayout,
  Direction,
  Next,
  Prev,
  NextEntry,
  PrevEntry,
  OskBackspace,
  Rebus,
  Block,
}

export const ALLOWABLE_GRID_CHARS = /^[A-Za-z0-9Ññ&]$/;

export function fromKeyString(string: string): Option<Key> {
  return fromKeyboardEvent({ key: string });
}

export function fromKeyboardEvent(event: {
  key: string;
  shiftKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  target?: EventTarget | null;
}): Option<Key> {
  if (event.target) {
    const tagName = (event.target as HTMLElement)?.tagName?.toLowerCase();
    if (tagName === 'textarea' || tagName === 'input') {
      return none;
    }
  }

  if (event.metaKey || event.altKey || event.ctrlKey) {
    return none;
  }

  const basicKey: Option<Exclude<KeyK, KeyK.AllowedCharacter>> = (() => {
    switch (event.key) {
      case 'ArrowLeft':
        return some(KeyK.ArrowLeft);
      case 'ArrowRight':
        return some(KeyK.ArrowRight);
      case 'ArrowUp':
        return some(KeyK.ArrowUp);
      case 'ArrowDown':
        return some(KeyK.ArrowDown);
      case ' ':
        return some(KeyK.Space);
      case 'Tab':
        return !event.shiftKey ? some(KeyK.Tab) : some(KeyK.ShiftTab);
      case 'Enter':
        return !event.shiftKey ? some(KeyK.Enter) : some(KeyK.ShiftEnter);
      case 'Backspace':
        return some(KeyK.Backspace);
      case 'Delete':
        return some(KeyK.Delete);
      case 'Escape':
        return some(KeyK.Escape);
      case '`':
        return some(KeyK.Backtick);
      case '.':
        return some(KeyK.Dot);
      case ',':
        return some(KeyK.Comma);
      case '!':
        return some(KeyK.Exclamation);
      case '#':
        return some(KeyK.Octothorp);
      // Keys specific to on-screen keyboard
      case '{num}':
        return some(KeyK.NumLayout);
      case '{abc}':
        return some(KeyK.AbcLayout);
      case '{dir}':
        return some(KeyK.Direction);
      case '{next}':
        return some(KeyK.Next);
      case '{prev}':
        return some(KeyK.Prev);
      case '{nextEntry}':
        return some(KeyK.NextEntry);
      case '{prevEntry}':
        return some(KeyK.PrevEntry);
      case '{bksp}':
        return some(KeyK.OskBackspace);
      case '{rebus}':
        return some(KeyK.Rebus);
      case '{block}':
        return some(KeyK.Block);
      default:
        return none;
    }
  })();

  if (isSome(basicKey)) {
    return some({ k: basicKey.value });
  }
  if (event.key.match(ALLOWABLE_GRID_CHARS)) {
    return some({ k: KeyK.AllowedCharacter, c: event.key });
  }
  return none;
}

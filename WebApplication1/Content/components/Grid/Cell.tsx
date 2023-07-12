import * as React from 'react';
import * as _ from 'lodash';
import clsx from 'clsx';
import {Ping, CellStyles, CellData, Cursor} from './types';
import './css/cell.css';

export interface EnhancedCellData extends CellData {
  r: number;
  c: number;

  // Player interactions
  cursors: Cursor[];
  pings: Ping[];
  solvedByIconSize: number;

  // Cell states
  selected: boolean;
  highlighted: boolean;
  frozen: boolean;
  circled: boolean;
  shaded: boolean;
  referenced: boolean;
  canFlipColor: boolean;

  // Styles
  attributionColor: string;
  cellStyle: CellStyles;
  myColor: string;
}

interface Props extends EnhancedCellData {
  // Callbacks
  onClick: (r: number, c: number) => void;
  onContextMenu: (r: number, c: number) => void;
  onFlipColor?: (r: number, c: number) => void;
}
/*
 * Summary of Cell component
 *
 * Props: { black, selected, highlighted, bad, good, helped,
 *          value, onClick, cursor }
 *
 * Children: []
 *
 * Potential parents:
 * - Grid
 * */
export default class Cell extends React.Component<Props, {}> {
  private touchStart: {pageX: number; pageY: number} = {pageX: 0, pageY: 0};

  shouldComponentUpdate(nextProps: Props) {
    const pathsToOmit = ['cursors', 'pings', 'cellStyle'] as const;
    if (!_.isEqual(_.omit(nextProps, ...pathsToOmit), _.omit(this.props, pathsToOmit))) {
      console.debug(
        'cell update',
        // @ts-ignore
        _.filter(_.keys(this.props), (k) => this.props[k] !== nextProps[k])
      );
      return true;
    }
    if (_.some(pathsToOmit, (p) => JSON.stringify(nextProps[p]) !== JSON.stringify(this.props[p]))) {
      console.debug('cell update for array');
      return true;
    }

    return false;
  }

  renderFlipButton() {
    const {canFlipColor, onFlipColor} = this.props;
    if (canFlipColor) {
      return (
        <i
          className="cell--flip fa fa-small fa-sticky-note"
          onClick={(e) => {
            e.stopPropagation();
            onFlipColor?.(this.props.r, this.props.c);
          }}
        />
      );
    }
    return null;
  }

  renderCircle() {
    const {circled} = this.props;
    if (circled) {
      return <div className="cell--circle" />;
    }
    return null;
  }

  renderShade() {
    const {shaded} = this.props;
    if (shaded) {
      return <div className="cell--shade" />;
    }
    return null;
  }

  getStyle() {
    const {attributionColor, cellStyle, selected, highlighted, frozen} = this.props;
    if (selected) {
      return cellStyle.selected;
    }
    if (highlighted) {
      if (frozen) {
        return cellStyle.frozen;
      }
      return cellStyle.highlighted;
    }
    return {backgroundColor: attributionColor};
  }

  handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    this.props.onClick(this.props.r, this.props.c);
  };

  handleRightClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    this.props.onContextMenu(this.props.r, this.props.c);
  };

  render() {
    const {
      black,
      isHidden,
      selected,
      highlighted,
      shaded,
      bad,
      good,
      revealed,
      pencil,
      value,
      myColor,
      onClick,
      number,
      referenced,
      frozen,
    } = this.props;
    if (black || isHidden) {
      return (
        <div
          className={clsx('cell', {
            selected,
            black,
            hidden: isHidden,
          })}
          style={selected ? {borderColor: myColor} : undefined}
          onClick={this.handleClick}
          onContextMenu={this.handleRightClick}
        >
        </div>
      );
    }

    const val = value || '';

    const l = Math.max(1, val.length);

    const displayNames = this.props.cursors.map((cursor) => cursor.displayName).join(', ');

    const style = this.getStyle();

    return (
      <div
        className={clsx('cell', {
          selected,
          highlighted,
          referenced,
          shaded,
          bad,
          good,
          revealed,
          pencil,
          frozen,
        })}
        style={style}
        onClick={this.handleClick}
        onContextMenu={this.handleRightClick}
        onTouchStart={(e) => {
          const touch = e.touches[e.touches.length - 1];
          this.touchStart = {pageX: touch.pageX, pageY: touch.pageY};
        }}
        onTouchEnd={(e) => {
          if (e.changedTouches.length !== 1 || e.touches.length !== 0) return;
          const touch = e.changedTouches[0];
          if (
            !this.touchStart ||
            (Math.abs(touch.pageX - this.touchStart.pageX) < 5 &&
              Math.abs(touch.pageY - this.touchStart.pageY) < 5)
          ) {
            e.preventDefault();
            onClick(this.props.r, this.props.c);
          }
        }}
      >
        <div className="cell--wrapper">
          <div
            className={clsx('cell--number', {
              nonempty: !!number,
            })}
          >
            {number}
          </div>
          {this.renderFlipButton()}
          {this.renderCircle()}
          {this.renderShade()}
          <div
            className="cell--value"
            style={{
              fontSize: `${350 / Math.sqrt(l)}%`,
              lineHeight: `${Math.sqrt(l) * 98}%`,
            }}
          >
            {val}
          </div>
        </div>
      </div>
    );
  }
}

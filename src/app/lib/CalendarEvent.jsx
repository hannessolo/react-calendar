import React, {Component} from 'react';

export default class CalendarEvent extends Component {

  constructor(props) {
    super(props);

    this.style = {
      top: this.props.start / 60 * 50,
      height: (this.props.end - this.props.start) / 60 * 50
    };

    this._onDragStart = this._onDragStart.bind(this);
    this._onDrag = this._onDrag.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);

    this.lastDragMousePos = null;

  }

  _onDragStart(e) {

    e.dataTransfer.setDragImage(document.createElement('null'), 0, 0);
    this.lastDragMousePos = e.pageY;

  }

  _onDrag(e) {

    let start = this.lastDragMousePos;
    let current = e.pageY;
    let oldTop = this.style.top;

    let difference = current - start;

    this.lastDragMousePos = current;

    let newTop = oldTop + (difference / 60 * 50);

    this.style = {
      top: newTop,
      height: (this.props.end - this.props.start) / 60 * 50
    };

    this.forceUpdate();

  }

  _onDragEnd(e) {

    let start = this.lastDragMousePos;
    let current = e.pageY;
    let oldTop = this.style.top;

    let difference = current - start;

    this.lastDragMousePos = current;

    let newTop = oldTop + (difference / 60 * 50);

    newTop = Math.round(newTop / 12.5) * 12.5;

    if (newTop < 0) {
      newTop = 0;
    } else if (newTop > 1200 - this.style.height) {
      newTop = 1200 - this.style.height;
    }

    this.style = {
      top: newTop,
      height: (this.props.end - this.props.start) / 60 * 50
    };

    this.forceUpdate();

    this.props.reportLocationChanged(newTop * 60 / 50);

  }

  render() {
    return <div draggable={true}
                onDragStart={this._onDragStart}
                onDragEnd={this._onDragEnd}
                onDrag={this._onDrag}
                className={"event"}
                style={this.style}/>
  }

}
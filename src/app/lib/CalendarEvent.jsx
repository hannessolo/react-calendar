import React, {Component} from 'react';

export default class CalendarEvent extends Component {

  constructor(props) {
    super(props);

    this.previousMousePos = 0;
    this.pixelsPerHour = 30;

    this._onDragStart = this._onDragStart.bind(this);
    this._onDrag = this._onDrag.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._mouseDelta = this._mouseDelta.bind(this);


  }

  _yOffsetToTime(offset) {
    return offset * 60 / this.pixelsPerHour;
  }

  _timeToYOffset(time) {
    return time * this.pixelsPerHour / 60;
  }

  _onDragStart(e) {

    this.previousMousePos = e.pageY;
    e.dataTransfer.setDragImage(document.createElement('null'), 0, 0);

  }

  _mouseDelta(newPageY) {
    return this.previousMousePos - newPageY;
  }

  _onDrag(e) {

    let newStartTime = this.props.start - this._yOffsetToTime(this._mouseDelta(e.pageY));
    this.previousMousePos = e.pageY;
    this.props.reportLocationChanged(this.props.id, newStartTime);

  }

  _onDragEnd(e) {

    let newStartTime = this.props.start - this._yOffsetToTime(this._mouseDelta(e.pageY));
    this.previousMousePos = e.pageY;
    this.props.reportDragFinished(this.props.id, newStartTime);
  }

  render() {
    return <div draggable={true}
                onDragStart={this._onDragStart}
                onDragEnd={this._onDragEnd}
                onDrag={this._onDrag}
                className={"event"}
                style={{
                    top: this._timeToYOffset(this.props.start),
                    height: this._timeToYOffset(this.props.end) - this._timeToYOffset(this.props.start)
                  }}/>
  }

}
import React, {Component} from 'react';

export default class CalendarEvent extends Component {

  constructor(props) {
    super(props);

    this.previousMouseYPos = 0;
    this.startMouseXPos = 0;
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

    this.previousMouseYPos = e.pageY;
    this.startMouseXPos = e.pageX;
    e.dataTransfer.setDragImage(document.createElement('null'), 0, 0);

  }

  _mouseDelta(newPageY) {
    return this.previousMouseYPos - newPageY;
  }

  _onDrag(e) {

    if (e.pageX > this.startMouseXPos + 100) {
      console.log("Went to the right");
      this.props.reportDayChanged(this.props.id, 1, 1);
      this.startMouseXPos = e.pageX;
    } else if (e.pageX < this.startMouseXPos - 100) {
      console.log("Went to the left");
      this.props.reportDayChanged(this.props.id, -1, -1);
      this.startMouseXPos = e.pageX;
    }

    let newStartTime = this.props.start - this._yOffsetToTime(this._mouseDelta(e.pageY));
    this.previousMouseYPos = e.pageY;
    this.props.reportLocationChanged(this.props.id, newStartTime);

  }

  _onDragEnd(e) {

    let newStartTime = this.props.start - this._yOffsetToTime(this._mouseDelta(e.pageY));
    this.previousMouseYPos = e.pageY;
    this.props.reportDragFinished(this.props.id, newStartTime);
  }

  _timeToText(time) {
    return (Math.floor(time / 100)) 
    + ":" 
    + ((Math.floor(time % 100 * 60 / 100)) < 10 ? 
    "0" + (Math.floor(time % 100 * 60 / 100))
    : (Math.floor(time % 100 * 60 / 100)));
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
                  }}>

                  <div className={"eventTime"}>{this._timeToText(this.props.start)} - {this._timeToText(this.props.end)}</div>

            </div>
  }

}
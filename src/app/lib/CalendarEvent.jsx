import React, {Component} from 'react';

export default class CalendarEvent extends Component {

  constructor(props) {
    super(props);

    this.previousMouseYPos = 0;
    this.startMouseXPos = 0;

    this._onDragStart = this._onDragStart.bind(this);
    this._onDrag = this._onDrag.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._mouseDelta = this._mouseDelta.bind(this);
    this._resize = this._resize.bind(this);
    this._resizeEnd = this._resizeEnd.bind(this);

  }

  static getPixelsPerHour() {
    return 30;
  }

  static _yOffsetToTime(offset) {
    return offset * 60 / CalendarEvent.getPixelsPerHour();
  }

  static _timeToYOffset(time) {
    return time * CalendarEvent.getPixelsPerHour() / 60;
  }

  _onDragStart(e) {

    e.stopPropagation();
    this.previousMouseYPos = e.pageY;
    this.startMouseXPos = e.pageX;
    e.dataTransfer.setDragImage(document.createElement('null'), 0, 0);

  }

  _mouseDelta(newPageY) {
    return this.previousMouseYPos - newPageY;
  }

  _onDrag(e) {

    e.stopPropagation();

    if (e.pageX > this.startMouseXPos + 100) {
      console.log("Went to the right");
      this.props.reportDayChanged(this.props.id, 1, 1);
      this.startMouseXPos = e.pageX;
    } else if (e.pageX < this.startMouseXPos - 100) {
      console.log("Went to the left");
      this.props.reportDayChanged(this.props.id, -1, -1);
      this.startMouseXPos = e.pageX;
    }

    let newStartTime = this.props.start - CalendarEvent._yOffsetToTime(this._mouseDelta(e.pageY));
    this.previousMouseYPos = e.pageY;
    this.props.reportLocationChanged(this.props.id, newStartTime);

  }

  _onDragEnd(e) {

    let newStartTime = this.props.start - CalendarEvent._yOffsetToTime(this._mouseDelta(e.pageY));
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

  _resize(e) {
    e.stopPropagation();

    let endTimeDelta = CalendarEvent._yOffsetToTime(this._mouseDelta(e.pageY));
    this.previousMouseYPos = e.pageY;
    this.props.reportResized(this.props.id, 0, -1 * endTimeDelta);

  }

  _resizeEnd(e) {
    e.stopPropagation();
    console.log("here");
    this.props.reportDragFinished(this.props.id, this.props.start);
  }

  render() {
    return <div className="eventContainer"
                style={{
                  top: CalendarEvent._timeToYOffset(this.props.start),
                  height: CalendarEvent._timeToYOffset(this.props.end) - CalendarEvent._timeToYOffset(this.props.start)
                }}>
              <div draggable={true}
                    /* Prevent mouseDown from creating event in background */
                    onMouseDown={(e) => {e.stopPropagation()}}
                    onDragStart={this._onDragStart}
                    onDragEnd={this._onDragEnd}
                    onDrag={this._onDrag}
                    className={"event"}>
                  <div className={"eventTime"}>{this._timeToText(this.props.start)} - {this._timeToText(this.props.end)}</div>
              </div>
              <div 
                draggable={true}
                className={"resizeHandle"} 
                onDragStart={this._onDragStart}
                onDrag={this._resize}
                onDragEnd={this._resizeEnd}
                /* Prevent mouseDown from creating event in background */
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              ></div>
            </div>
  }

}
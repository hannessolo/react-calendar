import React, {Component} from 'react';
import CalendarEvent from './CalendarEvent.jsx';

export default class CalendarDay extends Component {

  constructor(props) {
    super(props);

    this._allowDrop = this._allowDrop.bind(this);
    this._childLocChanged = this._childLocChanged.bind(this);
    this._finaliseChildLoc = this._finaliseChildLoc.bind(this);
    this._childDayChanged = this._childDayChanged.bind(this);
    this._onCreateEvent = this._onCreateEvent.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._childResized = this._childResized.bind(this);

    this.creating = false;
    this.creatingId = this.props.nextCreatingId;
    this.previousMouseY = 0;

  }

  _onCreateEvent(e) {
    e.stopPropagation();
    this.creating = true;
    let start = {
      time: CalendarEvent._yOffsetToTime(e.pageY - e.target.getBoundingClientRect().top),
      day: this.props.num
    };
    this.creatingId = this.props.nextCreatingId;
    this.props.createEvent(this.props.nextCreatingId, start);
    this.previousMouseY = e.pageY;
  }

  _onMouseMove(e) {
    e.stopPropagation();
    if (!this.creating) {
      return;
    }
    
    this._childResized(this.creatingId, 0, e.pageY - this.previousMouseY);
    this.previousMouseY = e.pageY;

  }

  _onMouseUp(e) {
    e.stopPropagation();

    this.creating = false;
    this.props.endResizeEvent(this.creatingId);
  }

  _allowDrop(e) {
    e.preventDefault();
  }

  _childResized(id, startDelta, endDelta) {
    this.props.resizeEvent(id, startDelta, endDelta);
  }

  _childLocChanged(id, newStartTime) {
    this.props.moveEvent(id, newStartTime, false);
  }

  _childDayChanged(id, startDelta, endDelta) {
    this.props.moveEventDay(id, startDelta, endDelta);
  }

  _finaliseChildLoc(id, newStartTime) {
    this.props.moveEvent(id, newStartTime, true);
  }

  render() {

    let events = [];

    this.props.events.forEach((c, k) => {
      events.push(<CalendarEvent start={c.start}
                                 end={c.end}
                                 key={k}
                                 reportLocationChanged={this._childLocChanged}
                                 reportDragFinished={this._finaliseChildLoc}
                                 reportDayChanged={this._childDayChanged}
                                 reportResized={this._childResized}
                                 id={c.id}
      />);
    });

    return (<div className={'calendarDay'} 
                 onDragOver={this._allowDrop} 
                 onMouseDown={this._onCreateEvent}
                 onMouseUp={this._onMouseUp}
                 onMouseMove={this._onMouseMove}>
      {events}
    </div>);
  }

}
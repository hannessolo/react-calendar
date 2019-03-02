import React, {Component} from 'react';
import CalendarEvent from './CalendarEvent.jsx';

export default class CalendarDay extends Component {

  constructor(props) {
    super(props);

    this._allowDrop = this._allowDrop.bind(this);
    this._childLocChanged = this._childLocChanged.bind(this);
    this._finaliseChildLoc = this._finaliseChildLoc.bind(this);
    this._childDayChanged = this._childDayChanged.bind(this);

  }

  _allowDrop(e) {
    e.preventDefault();
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
                                 id={c.id}
      />);
    });

    return (<div className={'calendarDay'} onDragOver={this._allowDrop}>
      {events}
    </div>);
  }

}
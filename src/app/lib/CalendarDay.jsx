import React, {Component} from 'react';
import CalendarEvent from './CalendarEvent.jsx';

export default class CalendarDay extends Component {

  constructor(props) {
    super(props);

    this._allowDrop = this._allowDrop.bind(this);

  }

  _allowDrop(e) {
    e.preventDefault();
  }

  _childLocChanged(newTop) {
    console.log("New start time " + Math.floor(newTop / 60) + 'h' + newTop % 60 + 'm');
  }

  render() {

    let events = [];

    this.props.events.forEach((c, k) => {
      events.push(<CalendarEvent start={c.start}
                                 end={c.end}
                                 key={k}
                                 reportLocationChanged={this._childLocChanged}
      />);
    });

    return (<div className={'calendarDay'} onDragOver={this._allowDrop}>
      {events}
    </div>);
  }

}
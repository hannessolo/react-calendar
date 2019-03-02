import React, {Component} from 'react';
import CalendarDay from './CalendarDay.jsx';

export default class Calendar extends Component {

  constructor(props) {
    super(props);

    this.sortIntoDayEvents = this.sortIntoDayEvents.bind(this);
    this.eventMoved = this.eventMoved.bind(this);
    this._roundStartTime = this._roundStartTime.bind(this);

  }

  _roundStartTime(startTime) {

    return Math.floor(startTime / this.props.timeStep) * this.props.timeStep; 

  }

  eventMoved(id, newStartTime, shouldRound) {

    if (shouldRound) {
      newStartTime = this._roundStartTime(newStartTime);
    }

    let event = this.props.events[id];

    event = {
      start: {
        day: event.start.day,
        time: newStartTime
      },
      end: {
        day: event.end.day,
        time: event.end.time + (newStartTime - event.start.time)
      }
    }

    this.props.moved(id, event);

  }

  sortIntoDayEvents(events) {

    /* Create an empty 2d array. Because this is javascript :( */
    let dayEvents = new Array(this.props.numDays);
    for (let i = 0; i < this.props.numDays; i++) {
      dayEvents[i] = [];
    }

    for (let eventId in events) {

      /* First day start and end times */
      let startTime = events[eventId].start.time;
      let endTime = events[eventId].end.time;

      dayEvents[events[eventId].start.day].push({
        start: startTime,
        end: endTime,
        id: eventId
      });
      console.log(dayEvents)

    }

    return dayEvents;

  }

  render() {

    let dayEvents = this.sortIntoDayEvents(this.props.events);
    let days = [];

    for (let i = 0; i < this.props.numDays; i++) {
      days.push(
          <CalendarDay 
            key={i} 
            num={i} 
            events={dayEvents[i]}
            moveEvent={this.eventMoved}
          />
      )
    }

    return (
        <div className={'calendar'}>{days}</div>
    );

  }

}
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

    return Math.floor(startTime / (this.props.timeStep / 60 * 100)) * (this.props.timeStep / 60 * 100); 

  }

  eventMoved(id, newStartTime, shouldRound) {

    if (shouldRound) {
      newStartTime = this._roundStartTime(newStartTime);
    }

    let event = this.props.events[id];
    let startDay = event.start.day;
    let endDay = event.end.day;
    let startTime = newStartTime;
    let endTime = event.end.time + (newStartTime - event.start.time);

    /* Handle multi-day case where move goes over 24 */
    if (startTime < -1) {
      if (startDay > 0) {
        startDay--;
        startTime = 2400 + startTime;
      } else {
        startTime = 0;
        endTime = event.end.time;
      }
    } else if (startTime > 2401) {
      if (startDay < this.props.numDays - 1) {
        startDay++;
        startTime = 2400 - startTime;
      } else {
        startTime = 2400;
        startTime = event.start.time;
      }
    }

    if (endTime < -1) {
      if (endDay > 0) {
        endDay--;
        endTime = 2400 + endTime;
      } else {
        startTime = 0;
        endTime = event.end.time;
      }
    } else if (endTime > 2401) {
      if (endDay < this.props.numDays - 1) {
        endDay++;
        endTime = 2400 - endTime;
      } else {
        endDay = 0;
        endTime = event.end.time;
      }
    }

    event = {
      start: {
        day: startDay,
        time: startTime
      },
      end: {
        day: endDay,
        time: endTime
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
      let day = events[eventId].start.day;
      let endDay = events[eventId].end.day;
      let startTime = events[eventId].start.time;
      let endTime;
      while (day !== endDay) {
        endTime = 2400;
        dayEvents[day].push({
          start: startTime,
          end: endTime,
          id: eventId
        });
        startTime = 0;
        day++;
      }

      endTime = events[eventId].end.time;
      dayEvents[day].push({
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
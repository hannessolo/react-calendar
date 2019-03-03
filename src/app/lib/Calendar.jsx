import React, {Component} from 'react';
import CalendarDay from './CalendarDay.jsx';

export default class Calendar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      nextCreationId: Object.keys(props.events).length
    }

    this.sortIntoDayEvents = this.sortIntoDayEvents.bind(this);
    this.eventMoved = this.eventMoved.bind(this);
    this._roundTime = this._roundTime.bind(this);
    this.eventDayMoved = this.eventDayMoved.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.resizeEvent = this.resizeEvent.bind(this);
    this.endResizeEvent = this.endResizeEvent.bind(this);

  }

  _roundTime(startTime) {

    return Math.floor(startTime / (this.props.timeStep / 60 * 100)) * (this.props.timeStep / 60 * 100); 

  }

  eventMoved(id, newStartTime, shouldRound) {

    if (shouldRound) {
      newStartTime = this._roundTime(newStartTime);
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

  eventDayMoved(id, startDayDelta, endDayDelta) {

    let event = this.props.events[id];
    let startDay = event.start.day + startDayDelta;
    let endDay = event.end.day + endDayDelta;

    if (startDay < 0) {
      return;
    } else if (endDay > this.props.numDays) {
      return;
    }

    event = {
      start: {
        day: startDay,
        time: this._roundTime(event.start.time)
      },
      end: {
        day: endDay,
        time: this._roundTime(event.end.time)
      }
    }

    this.props.moved(id, event);

  }

  createEvent(id, start) {

    event = {
      start: start,
      end: {
        time: start.time + 15,
        day: start.day
      }
    }

    this.setState(state => ({
      nextCreationId: state.nextCreationId + 1
    }));
    console.log(this.state.nextCreationId);
    this.props.moved(id, event);
  }

  resizeEvent(id, startDelta, endDelta) {

    let event = this.props.events[id];

    let startTime = event.start.time + startDelta;
    let endTime = event.end.time + endDelta;

    if (endTime < startTime + 15 && event.start.day == event.end.day) {
      endTime = startTime + 15;
    }

    event = {
      start: {
        time: startTime,
        day: event.start.day
      },
      end: {
        time: endTime,
        day: event.end.day
      }
    }

    this.props.moved(id, event);

  }

  endResizeEvent(id) {
    let event = this.props.events[id];

    event = {
      start: {
        time: this._roundTime(event.start.time),
        day: event.start.day
      },
      end: {
        time: this._roundTime(event.end.time),
        day: event.end.day
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
            moveEventDay={this.eventDayMoved}
            createEvent={this.createEvent}
            resizeEvent={this.resizeEvent}
            endResizeEvent={this.endResizeEvent}
            nextCreatingId={this.state.nextCreationId}
          />
      )
    }

    return (
        <div className={'calendar'}>{days}</div>
    );

  }

}
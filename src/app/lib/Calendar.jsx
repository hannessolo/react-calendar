import React, {Component} from 'react';
import CalendarDay from './CalendarDay.jsx';

export default class Calendar extends Component {

  constructor(props) {
    super(props);

    this.NUM_DAYS = 10;

    this.eventData = [];

    for (let i = 0; i < this.NUM_DAYS; i++) {
      eventData.push(
          <CalendarDay key={i} num={i} events={[{ start: 360 + 60 * i, end: 360 + 60 * i + 360 }]} />
      )
    }

  }

  render() {

    let days = [];

    for (let i = 0; i < this.NUM_DAYS; i++) {
      days.push(
          <CalendarDay key={i} num={i} events={[{ start: 360 + 60 * i, end: 360 + 60 * i + 360 }]} />
      )
    }

    return (
        <div className={'calendar'}>{days}</div>
    );

  }

}
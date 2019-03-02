import React, {Component} from 'react';
import Calendar from './Calendar.jsx';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      evs: {
        0: {
          start: {
            day: 1,
            time: 1700
          },
          end: {
            day: 1,
            time: 1900
          }
        }
      }
    }
    this._moved = this._moved.bind(this);
  }

  _moved(id, data) {

    let evs = this.state.evs;
    evs[id] = data;

    this.setState({
      evs
    });

  }

  render() {

    return <Calendar 
    numDays={3}
    events={this.state.evs}
    moved={this._moved}
    timeStep={15}
    />
  }

}
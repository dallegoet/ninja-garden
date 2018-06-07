import React, { Component } from 'react';
import Game from './Game';
import Menu from './Menu';
import createIo from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleAddRoom = this.handleAddRoom.bind(this);
    this.handleJoinRoom = this.handleJoinRoom.bind(this);

    this.state = {
      rooms: [],
    };
  }

  componentDidMount() {
    this.io = createIo('http://localhost:3001');

    this.io.on('set_rooms', (rooms) => {
      this.setState({
        rooms,
      });
      console.log(this.state);
    });
  }

  handleAddRoom(room) {
    this.io.emit('create_room', room);
  }

  handleJoinRoom(room) {
    this.io.emit('join_room', room.id);
  }

  render() {
    const {
      rooms,
    } = this.state;

    return (
      <div className="App">
        <Menu onAddRoom={this.handleAddRoom} onJoinRoom={this.handleJoinRoom} rooms={rooms} />
        <Game />
      </div>
    );
  }
}

export default App;

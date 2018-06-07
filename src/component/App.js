import React, { Component, Fragment } from 'react';
import Game from './Game';
import RoomList from './RoomList';
import createIo from 'socket.io-client';
import backgroundMp3 from '../sound/background.mp3'

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
    this.socket = createIo('http://localhost:3001');

    this.socket.on('set_rooms', (rooms) => {
      this.setState({
        rooms,
      });
    });

    var audio = new Audio(backgroundMp3);
    audio.play();
  }

  getSelectedRoom() {
    return this.state.rooms.find(room => room.players.find(player => player.id === this.getPlayerId()))
  }

  getPlayerId() {
    return this.socket.io.engine.id;
  }

  handleAddRoom(room) {
    this.socket.emit('create_room', room);
  }

  handleJoinRoom(room) {
    this.socket.emit('join_room', room.id);
  }

  render() {
    const {
      rooms,
    } = this.state;

    if (!this.socket) {
      return null;
    }

    const selectedRoom = this.getSelectedRoom();

    return (
      <div>
        {!selectedRoom && (
          <Fragment>
            <header className="header">
              Ninja Garden
            </header>
            
            <RoomList onAddRoom={this.handleAddRoom} onJoinRoom={this.handleJoinRoom} rooms={rooms} />
          </Fragment>
        )}

        {selectedRoom && <Game room={selectedRoom} socket={this.socket} />}
      </div>
    );
  }
}

export default App;

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

    this.socket.on('update_rooms', (rooms) => {
      this.setState({
        rooms,
      });
    });

    this.socket.on('update_player', (playerToUpdate) => {
      const newRooms = this.state.rooms.map(room => {
        const newPlayers = room.players.map(player => {
          if (player.id === playerToUpdate.id) {
            player = playerToUpdate;
          }

          return player;
        });

        room.players = newPlayers;
        return room;
      });

      this.setState({
        newRooms,
      });
    });

    this.setupAudio();

    setInterval(() => {
      this.loop();
    }, 300);
  }

  loop() {
    const newRooms = this.state.rooms.map(room => {
      const newPlayers = room.players.map(player => {
        if (player.status === 'left') {
          player.x -= 3;
        }

        if (player.status === 'right') {
          player.x += 3;
        }

        if (player.status === 'up') {
          player.y -= 3;
        }

        if (player.status === 'down') {
          player.y += 3;
        }

        return player
      });

      room.players = newPlayers;

      return room;
    });

    this.setState({
      rooms: newRooms,
    })
  }

  setupAudio() {
    var audio = new Audio(backgroundMp3);
    audio.play();
  }

  getRoomOfPlayer(playerId) {
    return this.state.rooms.find(room => room.players.find(player => player.id === playerId));
  }

  getSelectedRoom() {
    return this.getRoomOfPlayer(this.getPlayerId());
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

import React, { Component } from 'react';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.setRoomName = this.setRoomName.bind(this);
    this.createRoom = this.createRoom.bind(this);

    this.state = {
      room: {
        name: null,
      },
      player: {
        name: null,
      },
    };
  }

  createRoom() {
    this.props.onAddRoom(this.state.room);
  }

  setRoomName(event) {
    this.setState({
      room: {
        name: event.target.value,
      },
    });
  }

  setPlayerName(event) {
    this.setState({
      player: {
        name: event.target.value,
      },
    });
  }

  render() {
    const {
      rooms,
    } = this.props;

    return (
      <div className="container">
        <div className="roomList--header">
          <h2>You can join {rooms.length} room(s)</h2>
          <div className="create-room">
            <input type="text" placeholder="Room name" onChange={this.setRoomName} />
            <button onClick={this.createRoom}>Create room</button>
          </div>
        </div>
        <div>
          {rooms.map((room, i) => {
            return (
              <div key={i} className="room">
                <h1 className="room--name">{room.name}</h1>
                <span className="room--playerNumber">{room.players.length} player(s)</span>
                <button className="room--joinRoomButton" onClick={event => this.props.onJoinRoom(room)}>Join room</button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default RoomList;

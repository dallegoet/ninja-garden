import React, { Component } from 'react';

class Menu extends Component {
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

    const {rooms} = this.props;

    return (
      <div>
        <div>
          Name
          <input type="text" onChange={this.setRoomName} />
          Player number
          <button onClick={this.createRoom}>Create room</button>
        </div>
        <div>
          {rooms.map((room, i) => {
            return (
              <div key={i}>
                <h1>{room.name}</h1>
                <button onClick={event => this.props.onJoinRoom(room)}>Join room</button>
                <ul>
                  {room.players.map(player => {
                    return (
                      <li key={player.id}>{player.id}</li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Menu;

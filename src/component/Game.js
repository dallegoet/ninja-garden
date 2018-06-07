import React, { Component } from 'react';
import Ninja from '../sprite/Ninja';
import roomStatuesImage from '../sprite/room-statues.png';

class Game extends Component {
  constructor(props) {
    super(props);

    this.onKeyPressed = this.onKeyPressed.bind(this);

    this.state = {};
    this.gameDivRef = React.createRef();
  }

  componentDidMount() {
    this.gameDivRef.current.focus();
  }

  onKeyPressed(event) {
    this.props.socket.emit('key_pressed', event.key);
  }

  render() {
    const players = this.props.room.players;

    return (
      <div
        tabIndex="0"
        ref={this.gameDivRef}
        onKeyDown={this.onKeyPressed}
        className="game"
        style={{backgroundImage: `url(${roomStatuesImage})`}}
      >
        {players.map(player => <Ninja key={player.id} {...player} />)}
      </div>
    );
  }
}

export default Game;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require('node-json-color-stringify');

let rooms = [];
const debug = false;

function updatePlayerStatus(playerId, status) {
  updatePlayer(playerId, {
    status,
  });
}

function updatePlayer(playerId, data) {
  rooms.forEach((room, roomIndex) => {
    room.players.forEach((player, playerIndex) => {
      if (player.id === playerId) {
        rooms[roomIndex].players[playerIndex].status = data.status;
        io.emit('update_player', rooms[roomIndex].players[playerIndex]);
      }
    });
  });

  printInfo();
}

function removePlayerFromAllRooms(playerId) {
  rooms.forEach((room, index) => {
    const playerIndex = rooms[index].players.findIndex(player => player.id === playerId);
    if (playerIndex !== -1) {
      rooms[index].players.splice(playerIndex, 1);
    }
  });
}

function addIA(roomId) {
  for (var i = 0; i < 10; i++) {
    addPlayerToRoom(generateId(), roomId, false);
  }
}

function findRoomIndex(roomId) {
  const roomIndex = rooms.findIndex(room => room.id === roomId);
  return roomIndex;
}

function findPlayerIndex(playerId, roomId) {
  const roomIndex = findRoomIndex(roomId);
  const playerIndex = rooms[roomIndex].players.findIndex(player => player.id === playerId);
  return playerIndex;
}

function addPlayerToRoom(playerId, roomId, isHuman) {
    const roomIndex = findRoomIndex(roomId);

    rooms[roomIndex].players.push({
      id: playerId,
      x: Math.round(Math.random() * 95 + 5),
      y: Math.round(Math.random() * 95 + 10),
      status: 'down',
      isHuman,
    });
}

function loop() {
  rooms.forEach((room, roomIndex) => {
    room.players.forEach((player, playerIndex) => {

      // IA moves
      if (!player.isHuman) {
        const randomMove = Math.round(Math.random() * 50);

        switch (randomMove) {
          case 1: 
            updatePlayerStatus(player.id, 'up');
            break;
          case 2: 
            updatePlayerStatus(player.id, 'down');
            break;
          case 3: 
            updatePlayerStatus(player.id, 'left');
            break;
          case 4: 
            updatePlayerStatus(player.id, 'right');
            break;
        }
      }

      // map borders
      if (player.x < 5) {
        updatePlayerStatus(player.id, 'right');
      }

      if (player.x > 95) {
        updatePlayerStatus(player.id, 'left');
      }

      if (player.y < 14) {
        updatePlayerStatus(player.id, 'down');
      }

      if (player.y > 95) {
        updatePlayerStatus(player.id, 'up');
      }

      // server moves control
      if (player.status === 'left') {
        rooms[roomIndex].players[playerIndex].x -= 3;
      }

      if (player.status === 'right') {
        rooms[roomIndex].players[playerIndex].x += 3;
      }

      if (player.status === 'up') {
        rooms[roomIndex].players[playerIndex].y -= 3;
      }

      if (player.status === 'down') {
        rooms[roomIndex].players[playerIndex].y += 3;
      }
    });
  });
}

function generateId() {
  return Math.round(Math.random() * 1000000000 + 1000000000);
}

function createRoom(name) {
  rooms.push({
    id: generateId(),
    name: name,
    players: [],
  });

  updateRooms();
}

function updateRooms() {
  io.emit('update_rooms', rooms);
  printInfo();
}

function printInfo() {
  if (debug) {
    process.stdout.write('\033c');
    console.log(JSON.colorStringify(rooms));
  }
}

io.on('connection', function(socket) {
  updateRooms();

  socket.on('disconnect', function() {
    removePlayerFromAllRooms(socket.id);
    updateRooms();
  });

  socket.on('create_room', (message) => {
    createRoom(message.name);
    printInfo();
  });

  socket.on('join_room', (roomId) => {
    removePlayerFromAllRooms(socket.id);
    addPlayerToRoom(socket.id, roomId, true);
    addIA(roomId);
    updateRooms();
    printInfo();
  });

  socket.on('key_pressed', (key) => {
    console.log(socket.id + " press " + key);

    let status;

    switch (key) {
      case 'ArrowRight':
        status = 'right';
        break;
      case 'ArrowLeft':
        status = 'left';
        break;
      case 'ArrowUp':
        status = 'up';
        break;
      case 'ArrowDown':
        status = 'down';
        break;
    }

    updatePlayer(socket.id, {
      status,
    });
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
  createRoom('Mapado');

  setInterval(() => {
    loop();
  }, 300);
});

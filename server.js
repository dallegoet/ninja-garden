var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/build/index.html');
});

let rooms = [];

io.on('connection', function(socket){
  socket.emit('set_rooms', rooms);

  socket.on('create_room', (message) => {
    rooms.push({
      id: Math.round(Math.random() * 100000),
      name: message.name,
      players: [],
    });
    io.emit('set_rooms', rooms);
  });

  socket.on('join_room', (roomId) => {
    // remove player from all rooms
    rooms.forEach((room, index) => {
      console.log('index', index);
      const playerIndex = rooms[index].players.findIndex(player => player.id === socket.id);
      rooms[index].players.splice(playerIndex, 1);
    });

    // add player to the given room
    const roomIndex = rooms.findIndex(room => room.id === roomId);
    const playerIndex = rooms[roomIndex].players.findIndex(player => player.id === socket.id);
    rooms[roomIndex].players.push({
      id: socket.id,
    });

    io.emit('set_rooms', rooms);
  });
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
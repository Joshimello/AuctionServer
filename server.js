//made with ❤ by Joshimello
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

var price = 0
var bidnum = 0
// Run when a client connects
io.on('connection', socket => {
	socket.emit('updatebid', price)
	socket.emit('updatebidnum', bidnum)

	socket.on('bidamount', amount => {
		price = price + amount
		io.emit('updatebid', price)
		
		++bidnum
		io.emit('updatebidnum', bidnum)
	})

	socket.on('name', name => { 
		io.emit('addbid', {'name': name, 'amount': price, 'bidnum': bidnum})
	})

	socket.on('reset', value => {
		price = value
		io.emit('updatebid', price)

		bidnum = 0
		io.emit('updatebidnum', bidnum)

		io.emit('resetbank', 1000)
	})

	socket.on('nextitem', value => {
		price = 0
		io.emit('updatebid', price)

		bidnum = 0
		io.emit('updatebidnum', bidnum)

		io.emit('updatebank', value)
	})

	socket.on('disconnect', () => {
		
	})

	// Send to 1 client -- socket.emit('key', value);
	// Send to everyone except that client -- socket.broadcast.emit();
	// Send to everyone -- io.emit();
	// Send to specific -- io.to(id).emit();
})

const PORT = 3001 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


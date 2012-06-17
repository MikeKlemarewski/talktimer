var app = require('express').createServer();
var io = require('socket.io').listen(app);

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
app.set('views', './views/');
app.register('.html', require('jade'));

app.get('/*.(js|css)', function(req, res){
  res.sendfile("./public/"+req.url);
});

app.get('/', function(req, res){
  res.render('index.html');
});


io.on('connection', function(client){
	
	num_clients = Object.keys(io.sockets.manager.connected).length;
	if(num_clients !== 1){

		index     = Math.floor(Math.random()*(num_clients - 1));
		socket_id = Object.keys(io.sockets.manager.connected)[index];
		socket    = io.sockets.manager.sockets.sockets[socket_id];

		socket.emit('get_time', client.id);
	}
	client.on('disconnect', function(){clientDisconnect(client)});
	client.on('start_clock', function(index){
					console.log("STARTING CLOCK: " + index);
					io.sockets.emit('start_clock', index);});
	client.on('stop_clock', function(index){io.sockets.emit('stop_clock', index)});
	client.on('init_time', function(id, times){
		io.sockets.manager.sockets.sockets[id].emit('set_clocks', times);
	});
	listClients();
});

//Test function
function listClients(){
	clients = io.sockets.manager.connected;
	//console.log(io.sockets.manager);
}

function clientDisconnect(client){
}

app.listen(3000);

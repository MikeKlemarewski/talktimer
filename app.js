var app = require('express').createServer();
var io = require('socket.io').listen(app);

var MY_APP = {
		'running_clock':-1,
		'saved_timers':[0,0,0]
	};

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

setInterval(getTimes, 1000);

io.on('connection', function(client){
	num_clients = Object.keys(io.sockets.manager.connected).length;

	client.on('disconnect', function(){clientDisconnect(client)});
	client.on('start_clock', function(index){
					io.sockets.emit('start_clock', index);
					setRunningClock(index);
					//console.log("STARTING CLOCK: " + index + "Running Clock: " + MY_APP.running_clock);
					});

	client.on('stop_clock', function(index){
					io.sockets.emit('stop_clock', index);
					setRunningClock(-1);
					});

	client.on('init_time', function(id, times){
		io.sockets.manager.sockets.sockets[id].emit('set_clocks', times);
	});

	client.on('save_time', function(times){
		saveTimers(times);
	});

	if(num_clients !== 1){
		socket = randomSocket();
		socket.emit('get_time', client.id);
		if(MY_APP.running_clock !== -1){
			client.emit('start_clock', MY_APP.running_clock);
		}
	}
	else{
		client.emit('set_clocks', MY_APP.saved_timers);
	}

	listClients();
});

//Test function
function listClients(){
	clients = io.sockets.manager.connected;
	//console.log(io.sockets.manager);
}

function clientDisconnect(client){

	//The last person is disconnecting
	if(Object.keys(io.sockets.manager.connected).length === 1){
		client.emit('get_time');
		running_clock = -1;

	}
}

function setRunningClock(index){
	MY_APP.running_clock = index;
}


function getTimes(){
	socket = randomSocket();
	if(socket){
		socket.emit('get_time');
	}
}

function saveTimers(times){
	MY_APP.saved_timers = times;
}

function randomSocket(){
	num_clients = Object.keys(io.sockets.manager.connected).length;
	if(num_clients > 0){
		index       = Math.floor(Math.random()*(num_clients - 1));
		socket_id   = Object.keys(io.sockets.manager.connected)[index];
		socket      = io.sockets.manager.sockets.sockets[socket_id];
		return socket;
	}
	else{
		return null;
	}
}

app.listen(3000);

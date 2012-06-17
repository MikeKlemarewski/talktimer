var timers=[];
var socket;

$(document).ready(function () {
	$clientCounter = $("#client_count")

	socket = new io.connect();
 	socket.on('start_clock', function(index){startClock(index)}); 
 	socket.on('stop_clock', function(index){stopClock(index)}); 
	socket.on('get_time', function(id){getTime(id)});
	socket.on('set_clocks', function(times){setClocks(times)});
	
	$clock1 = $('#clock1');
	$clock2 = $('#clock2');
	$clock3 = $('#clock3');
	$clock1.stopwatch('Ted');
	$clock2.stopwatch('Jon');
	$clock3.stopwatch('Berny');
	
	timers = [$clock1, $clock2, $clock3];
	
	setEvents();
	setInterval(drawGraph, 1000);
  	
});


function setEvents(){
	var i;
	for(i = 0; i < timers.length; i++){
	  	timers[i].find('.start').unbind('click');
	  	timers[i].find('.stop').unbind('click');
		timers[i].find('.start').bind('click',new Function("socket.emit('start_clock', "+i+");"));
		timers[i].find('.stop').bind('click',new Function("socket.emit('stop_clock', "+i+");"));
	}	
}

function drawGraph(){
  var data = getGraphData();
  var plot1 = jQuery.jqplot ('chart1', [data], 
    { 
      seriesDefaults: {
	// Make this a pie chart.
	renderer: jQuery.jqplot.PieRenderer, 
	rendererOptions: {
		// Put data labels on the pie slices.
		// By default, labels show the percentage of the slice.
        	showDataLabels: true,
		seriesColors:['#76c800', '#1B56E0', '#E0461B']
        }
      }, 
      legend: { show:true, location: 'e' }
    }
  );
}

function getGraphData(){

	var i;
	var data = [];
	for(i=0; i < timers.length; i++){
		data.push([''+timers[i].name+'', parseFloat(timers[i].find('.seconds').text()) | 0]);
	}
	return data;
}


function startClock(index){

	var j;
	timers[index].trigger("start");
	for(j = 0; j < timers.length; j++){
		if(j!==index){
			timers[j].find('.stop').click();
		}
	}
}

function stopClock(index){
	var i;
	timers[index].trigger("stop");	
}

function getTime(id){
	times = [];
	var i;
	for(i = 0; i < timers.length; i++){
		times.push(timers[i].find('.seconds').text());
	}
	socket.emit('init_time', id, times);
}

function setClocks(times){
	var i;
	for(i = 0; i < times.length; i++){
		if(timers[i]){
			timers[i].trigger('setTime',times[i]);
		}
	}	
}

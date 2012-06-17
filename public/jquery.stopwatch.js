(function($) {
    $.fn.stopwatch = function(_name) {
        var clock = this;
        var timer = 0;
        
        clock.addClass('stopwatch');
        
        //console.log(clock);
        
        // This is bit messy, but IE is a crybaby and must be coddled. 
        clock.html('<span class="name"></span>');
        clock.append('<div class="display"><span class="hr">00</span>:<span class="min">00</span>:<span class="sec">00</span></div>');
        clock.append('<input type="button" class="start" value="Start" />');
        clock.append('<input type="button" class="stop" value="Stop" />');
        clock.append('<input type="button" class="reset" value="Reset" />');
        clock.append('<span id="seconds" class="seconds" ></span>');
        
        //console.log(clock.html());
        
        clock.name = _name;
        clock.find('.name').html(clock.name);

        // We have to do some searching, so we'll do it here, so we only have to do it once.
        var h = clock.find('.hr');
        var m = clock.find('.min');
        var s = clock.find('.sec');
        var start = clock.find('.start');
        var stop = clock.find('.stop');
        var reset = clock.find('.reset');
        var seconds = clock.find('.seconds');
        seconds.html(0);
        seconds.hide();

        stop.css('visibility', 'hidden');
        
        clock.bind('start', function(){
            timer = setInterval(do_time, 1000);
            stop.css('visibility', 'visible');
            start.css('visibility', 'hidden');
        });
        
        clock.bind('stop', function(){
            clearInterval(timer);
            timer = 0;
            start.css('visibility', 'visible');
            stop.css('visibility', 'hidden');
        });

        clock.bind('setTime', function(event, secs){

            console.log("SETTING CLOCK: " + secs);
            seconds.html(secs);        
    
            hour = Math.floor(secs/3600);
            secs = secs - (hour * 3600);
            minute = Math.floor(secs/60);
            second = secs - (minute * 60);
            
            h.html("0".substring(hour >= 10) + hour);
            m.html("0".substring(minute >= 10) + minute);
            s.html("0".substring(second >= 10) + second);
            
        
        });

        start.bind('click', function() {
            timer = setInterval(do_time, 1000);
            stop.css('visibility', 'visible');
            start.css('visibility', 'hidden');
        });
        
        stop.bind('click', function() {
            clearInterval(timer);
            timer = 0;
            start.css('visibility', 'visible');
            stop.css('visibility', 'hidden');
        });
        
        reset.bind('click', function() {
            clearInterval(timer);
            timer = 0;
            h.html("00");
            m.html("00");
            s.html("00");
            stop.css('visibility', 'hidden');
            start.css('visibility', 'visible');
        });

        function do_time() {
            // parseInt() doesn't work here...
            hour = parseFloat(h.text());
            minute = parseFloat(m.text());
            second = parseFloat(s.text());
            

            second++;
            
            if(second > 59) {
                second = 0;
                minute = minute + 1;
            }
            if(minute > 59) {
                minute = 0;
                hour = hour + 1;
            }
            
            h.html("0".substring(hour >= 10) + hour);
            m.html("0".substring(minute >= 10) + minute);
            s.html("0".substring(second >= 10) + second);

            total_seconds = (hour*3600) + (minute*60) + second;
            seconds.html(total_seconds);
        }

    };
})(jQuery);
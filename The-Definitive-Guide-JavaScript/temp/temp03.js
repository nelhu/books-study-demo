var i = 0;

var interval = setInterval(function() {
    console.log(i);
    i++;
    if (i > 10) {
        clearInterval(interval);
    }
}, 1000);

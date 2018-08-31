// normal
function practice(times) {
    var arr = new Array(4); 
    var count = 0;

    for (var i = 0; i < times; i++) {
        var cash_index = Math.floor(Math.random() * 4);
        arr[cash_index] = 1;
        var selected_index = Math.floor(Math.random() * 4);
        
        if (cash_index === selected_index) {
            count++;
        }

    }

    return count / times;
}

practice(100000); 



// reelect
function reelet(times) {
    var arr = new Array(4); 
    var count = 0;

    for (var i = 0; i < times; i++) {
        var cash_index = Math.floor(Math.random() * 4);
        arr[cash_index] = 1;
        var selected_index = Math.floor(Math.random() * 4);
        
        for (var j = 0; j < arr.length; j++) {
            if (j !== selected_index && !arr[j]) {
                arr.splice(j, 1);
                break;
            }
        }

        var reelect_index = Math.random() > 0.5 ? arr[0] : arr[arr.length - 1];

        if (cash_index === reelect_index) {
            count++;
        }     

    }

    return count / times;
}

reelet(1000);



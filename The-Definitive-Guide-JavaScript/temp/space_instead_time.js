// 目的： 模拟 牺牲空间换取时间的Demo
 
var a1 = [];
var a2 = [];
var merged = [];
var idIndexMap = new Map();

function init() {
    var time_begin = new Date().valueOf();

    for (var i = 0; i <10; i++) {
        for (var j = 1; j <= 100; j++) {
            a1.push({
                id: j,
                score: Math.floor(Math.random() * 100),
            });
        }
    }

    var time_end = new Date().valueOf();
    // console.log(time_end - time_begin);
    
    // init a2
    for (var k = 1; k <= 100; k++) {
        a2.push({
            id: k,
            name: 'tom' + k,
        });
    } 
    
}


function merge() {
    var time_begin = new Date().valueOf();


    for (var i = 0; i < a2.length; i++) {
        merged.push({
            id: a2[i].id,
            name: a2[i].name,
            scores: [],
        });

        for (var j = 0; j < a1.length; j++) {
            if (a2[i].id === a1[j].id) {
                merged[i].scores.push(a1[j].score);
            }
        }
    }

    var time_end = new Date().valueOf();
    console.log(time_end - time_begin);
}
init();
// merge();


// 优化思路： 空间换取时间最常用的场景就是缓存， 为了提高性能可以设置讴歌不同类型的缓存
// 本题中： 100个学生的基本信息放在a2中，而他们的10门课分数信息放在a1中， 现在想要展示的是这100个学生的基本信息和10门课的分数信息 
// 旧方案： 外部循环基本信息数组， 内部循环分数数组， 根据id是否相同， 获取对应的分数， 放在scores中， 这样做， 每一次基本信息都会循环100条数组来查找，共计 100 * 1000  = 100000次；非常耗时
// 新方案（牺牲空间换取时间）：我们只是想要根据id， 来把分数取出来， 可以先把id对应的分数事先存在一个map里， map的时间浮渣度为o（1）， 需要的时候去取就行

function idIndex() {
    
    for (var i =0; i < a1.length; i++) {
        if (idIndexMap.has(a1[i].id)) {
            idIndexMap.get(a1[i].id).push(a1[i].score);
        } else {
            idIndexMap.set(a1[i].id, [a1[i].score]); 
        }
        
    }

    return idIndexMap;
}

// idIndex();

function init() {
    var time_begin = new Date().valueOf();

    for (var i = 0; i <10; i++) {
        for (var j = 1; j <= 100; j++) {
            a1.push({
                id: j,
                score: Math.floor(Math.random() * 100),
            });
        }
    }

    var time_end = new Date().valueOf();
    // console.log(time_end - time_begin);
    
    // init a2
    for (var k = 1; k <= 100; k++) {
        a2.push({
            id: k,
            name: 'tom' + k,
        });
    } 
    
}


function merge2() {
    var time_begin = new Date().valueOf();

    idIndex();


    for (var i = 0; i < a2.length; i++) {
        merged.push({
            id: a2[i].id,
            name: a2[i].name,
            scores: idIndexMap.get(a2[i].id),
        });

        
    }

    var time_end = new Date().valueOf();
    console.log(time_end - time_begin); 
}
merge2();
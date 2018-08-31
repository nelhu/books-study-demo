// 函数作用域内的变量和函数只在函数作用域内有效， 只有不在任何函数内定义的变量和函数才在全局作用域内有效
(function(root, param) {
    function aaaaa1() {
        console.log('inner');
    }
    console.log('aaa');
})(this, {
    name: 'tom',
    age: '23'
});

function aaaaa2() {
    console.log('outer');
}
aaaaa2();





var d1 = new Date




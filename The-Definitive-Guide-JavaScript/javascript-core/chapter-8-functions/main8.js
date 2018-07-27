// 函数
// 1 函数是一段js代码， 它定义一次，可被执行或调用多次
// 2 在js中函数就是对象 我们可以向操作对象一样操作函数，
// 比如可以把函数赋值给变量或者作为参数传递给其他函数
// 3. 因为函数也是队形， 所以可以给他们设置属性和方法
//

// 函数定义
// 1. 函数定义表达式: 紧跟在function关键字后的函数名称（functionName）可有可无
// 函数定义表达式最适用于那些只调用一次的函数
var functionname = function() {
    // body
};
// 函数定义表达式的函数可以包含名称， 此名称仅仅在函数体内可用
var f = function factorial() {
    // body
    return 1 * factorial();
};
// 2. 函数声明语句: 紧跟在function关键字后的函数名称（functionName）不可省略
function functionName(param) {
    // body
}

// 函数调用： 1. 函数调用 2. 方法调用 3. 构造函数调用 4. 简介调用
//

// 嵌套函数的和其中的this
function outer() {
    var scope = 'outer';
    var self = this;
        var a = 'haha';

        function inner() {
            var scope = 'inner';
            var _this = this;// 内嵌函数的this指向undefined(strict)或全局对象(非strict)
    }
    inner();
}
outer();

// var obj = {
//     name: 'obj',
//     f: function() {
//         var scope = 'outer';
//         var self = this;
//         var a = 'haha';
//
//         function inner() {
//             var scope = 'inner';
//             var _this = this; // 内嵌函数的this指向undefined(strict)或全局对象(非strict)
//         }
//         inner();
//     }
// }
// obj.f();

// var obj = {
//     name: 'obj',
//     f: function() {
//         var scope = 'outer';
//         var self = this;
//         var a = 'haha';
//
//         function inner() {
//             var scope = 'inner';
//             var _this = this; // 内嵌函数的this指向undefined(strict)或全局对象(非strict)
//         }
//         return inner;
//     }
// }
// obj.f()();

// 测试闭包
// var r1 = (function(a, b) {
//     console.log(a);
// })(this.a1, this.a100 || {})


// 函数的实参和形参
// 可选的形参
function f1(p1, /*optional*/p2) {
    p2 = p2 || {}; // 用于替代if参数为空的惯用方式
}
// 可变长的实参列表， 参数对象
function f1(p1) {
    console.log(p1);
}
// f1(1, 2);

// 判断最大值的函数：传入任意数量的实参
function get_max1(/*any number*/) {
    var max = Number.NEGATIVE_INFINITY;

    for (var i = 0, len = arguments.length; i < len; i++) {
        if (arguments[i] > max) {
            max = arguments[i];
        }
    }
    return max;
}
// console.log(get_max1(2, 1, 45, 345, 3455, 43));
function get_max2(/*any number*/) {
    for (var i = 0, len = arguments.length; i < len; i++) {
        if (typeof arguments[i] !== 'number') {
            throw TypeError('parameter must be a number');
        }
    }

    var sorted_array = [];
    for (var j = 0, len = arguments.length; j < len; j++) {
        sorted_array.push(arguments[j]);
    }
    sorted_array.sort(function (pre, next) {
        return pre < next;
    });
    return sorted_array[0];
}
console.log(get_max2(2, 1, 45, 345, 3455, 43));

// arguments对象的的callee和caller属性
// callee： 表示当前正在执行的函数
// caller： 表示当前正在执行函数的函数， 通过caller可以访问调用栈
// 实现递归函数
function factorial(n) {
    if (n === 1) {
    return 1;
}
    return n * arguments.callee(n - 1);
    // return n * factorial(n - 1);
}
console.log(factorial(6));

// 当实参个数超过3个时， 应当将实参以键值对的形式保存为一个对象， 传入这个对象
function multiple_param(config) {
    var p1 = config.p1;
    var p2 = config.p2;
}
multiple_param({p1: 'p1', P2: 'p2', p3: 'p3'});

// 当函数调用时， 传入的实参并未进行类型检查， 为了避免函数运行时报错， 应当尽可能早的进行类型检查。

// 作为值的函数： 函数可以定义， 可以调用， 但函数同样作为对象， 也可以赋值给变量， 作为参数传递等， 此时的函数仅仅作为普通值
(function function_as_value_closure() {
    'use strict'

    function add(x, y) {return x + y;}
    function multiply(x, y) {return x * y;}

    function operate(operator, operand1, operand2) {
        if (typeof operator !== 'function') {
            throw TypeError('fiorsdt param must be an operator');
        }

        return operator(operand1, operand2)
    }

    console.log(operate(add, 3, 4));

}());

var s1 = 'outer string1';
var s2 = 'outer string2';
// 作为命名空间的函数： 定义一个匿名函数， 在单个表达式中调用它.
(function() {
    // body
    console.log(s2);
    console.log(s1);
    console.log(this.s1); //
    var s1 = 'inner string'
}());

// 闭包
// 首先要记住的是： this和闭包是不同的，千万不要混淆。
// JavaScript采用词法作用域， 这个作用域是在函数定义时决定的， 称作闭包。
// 函数运行时能够确定的是当前的调用对象， 称作this。

// 闭包
var scope = 'global scope';
function checkScope() {
    var scope = 'local scope';

    function localF() {
        return scope;
    }

    return localF;
}
checkScope()();

// 闭包作用1: 保护局部变量
// 保护函数内的局部变量，用作私有状态，提供一个内部函数用于操作局部变量，
//   这样当外部函数返回后， 就只有内部函数才能访问局部变量，然后把内部函数返回给闭包外的变量
var outer_variable = (function() {
   var count = 0;
   return function() { // 只有该函数能够操作局部变量count
       return count++;
   }
}())
console.log(outer_variable());
console.log(outer_variable());

//
//
//
//
//




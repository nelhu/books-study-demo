// test01
// var a = typeof "";
// var b = typeof null;
// var c = typeof undefined;
// var d = typeof NaN;console.log(b);

// 3.6 包装对象 -> jsz中的数字 字符串和布尔值这三种数据类型是原始类型， 他们是只读的， 不可创建新属性
// var s = 'test';
// s.len = 4;
// var r1 = s.len;

// 3.7 不可变的原始值和可变的对象引用
// > js中的原始值（null undefined 数字 字符串 布尔值）是不可改变的, 任何方法都无法改变
// var s1 = 'test';
// var s2 = s1.toUpperCase();
// var o1 = {name: 'tom'};
// var o2 = {name: 'tom'};
// var o3 = o1;
// var r1 = o1 === o3; //true
// // var r1 = o2 === o3; // false
//
// // 复制对象或数组到新副本
// var a1 = ['a', 'b', 'c'];
// var a2 = [];
// for (var i = 0; i < a1.length; i++) {
//     a2[i] = a1[i];
// }
// console.log('jajaja');

// 比较两个数组是否相等

// js中显示的类型转换： 目的： 为了使代码变得清晰易读等
// 使用类型构造函数 Stirng Number Boolean Object， 当不使用new操作符调用时，他们会作为类型转换函数， 按照类型转换规则进行转换
// var a = new Number("");
// var b = new String([1]);
// var c = new Boolean(undefined);

// 对象转换为原始值
// > 对象转换为布尔值: 所有非空对象都将转换为true
// > 对象转换为字符串:
//    >> 所欲对象都继承两个转换字符串的方法 toString() 和valueOf();
//    >> toString: 不同的对象（数组， 函数， 日期， 正则， 其他）有不同的实现
//    >> valueOf: 包含原始值得对象将返回原始值； 否则简单地返回对象本身
//    >> 先调用toString方法， 在调用valueOf方法
// > 对象转换为数字:
//   >> 先调用valueOf方法， 在调用toString方法

// 嵌套函数作用域和返回函数引用
// var  outer = function() {
//     this;
//     var scope = 'outer';
//     var _this = this;
//     console.log('1' + scope);
//     function inner(a) {
//         this;
//         a;
//         var scope = 'inner';
//         console.log('2' + scope);
//     }
//     return inner(_this); // 1 返回函数的调用结果
//     return inner; // 2 返回函数的内部函数的引用， 此时外部函数并没有被销毁， 形成了闭包
// }
// outer(); // 1 直接调用
// outer()(); // 2 第一对圆括号调用至外部函数， 此时得到的是内部函数的引用， 第二对括号才真正调用了内部函数


// 可删除的全局变量
// var truevar = 'truevar';
// fakevar = 'fakevar';
// delete(truevar);
// delete(fakevar)
// this.truevar;
// this.fakevar;



// 作用域链（变量作用域）：
// javascript是基于词法作用域的语言， 全局变量在程序中始终都有定义， 局部变量在定义它的函数体内和嵌套函数体内是有定义的
// 可以这样理解作用域链： 每一段js代码（全局代码或函数）都有一个与之关联的作用域链， 这个作用域链可以看成是一个列表对象（无length属性），
//   包含这段代码中与之相关的对象，作用域链在函数定义时创建， 在函数调用时用于查找变量。
// 当定义一个函数的时候， 实际上它是保存一个作用域链（这条作用域链上已经至少有一个对象global了， 若为嵌套函数， 还会有n个包含父函数的闭包对象）
//   当调用该函数的时候，它创建一个新的对象用于保存它的局部变量， 然后把这个对象添加到作用域链上。
//   当javascript需要查找某个变量X的时候， 先从列表中的第一个对象中查找，若找到， 则直接使用这个值， 否则继续查找链中的下一个对象，
//   直到找到或者查询完所有对象都未找到， 则抛出一个引用错误ReferenceError异常。
// 在js的顶层代码中： 作用域链由一个全局对象组成: global -> 全局对象
// var v1 = 'v1';
// var v2 = 'v2';
// 在不包含嵌套函数的函数体内，作用域链由两个对象组成: local -> 参数局部变量组成的对象, global -> 全局对象
//   一个是包含函数参数和局部变量的local对象， 另一个是global全局对象
function f1(pa, pb) {
    var v1 = 'v1';
}
f1('pa', 'pb');
// 在嵌套函数内， 作用域链至少由三个对象组成，
//   一个是包含函数参数和局部变量的local对象， 另一个是global全局对象,
//   还有几个是它所能访问的来自于父函数的局部变量组成的闭包(closure)对象， 每一个父函数都会对应一个闭包变量。
//
//
//
//
//
//
//
//
//
//
//
//
//
//





























var debug;
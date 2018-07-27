// test
// var a1 = true + true;


// ==和===区别
// =: 赋值,
// ==: 相等, 包含类型转换
// ===: 严格相等，不包含类型转换a


// instanceof 运算符
// 例： a instanceof f;
// javascript解释器首先计算a.perototype， 在原型链中查找o， 找到就返回true， 否则返回false；

// 逻辑运算符: 判断运算符左右两边的操作数是否满足：都真才为真， 有假即为假的条件， 返回布尔值true/false
// 操作数一般情况下为布尔值， 但在js中也有可能是真值/假值表达式
// &&(逻辑与): 当操作数为真值/假值表达式时，计算规则：
// 1 当左侧表达式为假时，整个表达式的结果就肯定为假， 此时将不会计算右侧表达式， 直接返回左侧的假值表达式的值
// 2 当左侧表达式为真时， 整个表达式的结果将取决于右侧表达式， 此时将返回右侧表达式的值
// ||(逻辑或)： 有真即为真， 都假才为假。根据逻辑与&&的计算规则，可得逻辑或的计算规则：
// 1 当左侧表达式为真时， 整个表达式的结果肯定为真， 不需要计算右侧表达式， 直接返回左侧表达式的值
// 2 当左侧表达式为假时， 整个表达式的结果将取决于右侧表达式， 直接返回右侧表达式的值
var obj1 = {
    name: 'tom', detail: {
        age: '25'
    }
};
var r1 = undefined && "content"; // undefined
var r2 = null && "content"; // null
var r3 = obj1 && obj1.detail && obj1.detail.age; // 25

var r4 = "content" || ""; // content
var r5 = "" || undefined; // undefined
var r5 = "" || obj1.detail; // {name: '25'}

// 函数定义表达式
var f = function(x) {return x;}
// 函数声明
function f(x) {
    return x;
}

// 空语句
var a = [];
for(var i = 0; i < 10; a[i++] = i++) /*empty statement*/;  // ; 表示一条空语句

// 测试for循环
for (var j = 0; j < 3; j++) {
    console.log(j);
}

// for in 循环
var obj = {name: 'neller', age: '23', grade: '3'};
for (p in {name: 'neller', age: '23'}) {

    console.log(p);
}
// 把对象中的属性添加到数组中
var a1 = []; var i = 0;
for (a1[i++] in obj);
console.log(a1);

// 闭包的作用： 避免污染命名空间， 独立作用域...
// 判断是否支持严格模式: 闭包1
var hasStritMode = (function() {
    "use strict";
    return this === undefined; // true
} ());

// 闭包2
var hasNotStrictMode = (function() {
    return this; // global
})();







console.log(a);



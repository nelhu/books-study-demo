// 函数的属性

// 函数的length属性和arguments.length属性
function f(name) {
    console.log(arguments.length); // 实参个数
}
f('tom', 23);
console.log(f.length); // 形参个数

// prototype属性
console.log(f.prototype);

// call和apply： 函数也可以拥有方法， call和apply是所有函数都拥有的方法
// 通过这两个方法， 可以吧任何函数当做任何对象的方法来使用，
// f.call（o, p1, ...）: o: 调用当前函数的对象（既this）， p1/...:之后的都是函数f的参数


// 闭包中的arguments属性
function outer() {
    var a = 'a';

    function middle() {
        var b = 'b';a;

        function inner() {
            var c = 'c';a;b;
        }

        return inner('ip1', 'ip2', 'ip3');

    }

    return middle('middle_param1', 'middle_param2');
}
outer('outer_param1');

// 函数的bind方法： 把函数绑定到对象上， 当做对象的方法来调用
function f2() {
    console.log('f2');
}
var o1 = {
    name: 'tom'
};
var f3 = f2.bind(o1);
f3('f3_invoke')

// 函数的toString方法: 自定义函数返回原源代码， 内置函数返回： function functionname() { [native code] }
console.log(f2.toString());
console.log(Math.max.toString());

// 使用Functions来动态创建函数:
// 不推荐使用， 此函数不遵循此法作用域， 相当于全局函数
var fn = new Function("x" , "y", "return x * y;");

// 判断一个对象是否为函数对象
var isFunction = function(o) {
    return Object.prototype.toString.call(o) === '[object Function]';
}


// 函数式编程： 3，4 目前用不到
// 1. 使用ES5中提供的方法来操作数组
// 2. 高阶函数： 操作函数的函数， 它接收n个函数作为参数， 并且返回函数
// 3. 不完全函数
// 4. 记忆
//
//
//
//
//
//
//
//
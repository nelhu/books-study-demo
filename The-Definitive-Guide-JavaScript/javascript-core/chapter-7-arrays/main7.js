// 数组
// 数组是有序的集合，每个值叫做一个元素， 每个元素在数组中有一个位置， 以数字表示， 叫做索引。javascript中的数组是无类型的， 数组可以是任意类型， 数组不同元素也可以是不同类型
// js中的数组是js对象的特殊形式， 通常，数组的实现是经过优化的， 通过数字索引来访问数组元素一般比访问对象那个属性要快.

// 数组特性
// 1. 自动维护其length属性， 意味着数组能自增length的值， 且当length属性小于当前数组长度时， 会删除索引超出的元素， 这是修改数组的一个方式。
// 2. 数组只是对象属性名的一种特殊实现, 意味着js数组没有越界的概念
// 3. 从Array.prototype继承一些有用的方法
// 4. 其类属性是 ‘Array’

// 创建数组
// 直接量方式
var a1 = ['0', 1, {name: '2'}, [3]];
// new操作符创建数组
var a2 = new Array(1, 2, 3, 4, 5);

// 稀疏数组： 数组的索引不连续的数组
//

// 数组遍历
for (var i =0, len = a1.length; i < len; i++) { // 数组长度在initial表达式中， 只查询一次
    if (!a1[i]) continue; // 判断合法性

    // body
    console.log(i + '-->' + a1[i]);
}

// 多维数组： js中可用使用数组元素嵌套数组的形式实现多维数组
// 九九乘法表
function multiplication_table() {
    var table = new Array(10);

    for (var i = 1; i < 10; i++) {
        table[i] = new Array(i);
        for (var j = 1; j <= i; j++) {
            table[i][j] = i * j;
        }
    }

    return table;
}
var table = multiplication_table();
table[7][5]; // 35

//  数组方法
// 1. 注意： 会改变原始数组的方法： reverse, sort, slice, splice, push, pop, shift, unshift,
// 2. concat： 数组的concat放方法用于链接新元素到数组， 他可以链接参数中一位数组的每个元素，
// 但是不能扁平化数组的数组（不能解析餐参数中包含的二维以上的数组）
//
//3. ES5中提供了9个新的数组方法用于遍历， 映射， 过滤， 检测， 简化和搜索数组。
// forEach, map, filter, every, some, reduce, ...

// 判断是对象否为数组
var is_array = Function.isArray || function(o) {
    return typeof o === 'object' && Object.prototype.toString.call(0) === '[object Array]';
};

// 作为数组的字符串
// 字符串也可以看做是有多个单字符串组成的且包含length属性的类数组对象
// 实际上字符串作为类数组对象可以动作数组来操作
String.prototype.join = function(sep, extra) {
    return Array.prototype.join.call(this, sep);
}
var s1 = 'content';
console.log(s1.join(' - ', '666'));



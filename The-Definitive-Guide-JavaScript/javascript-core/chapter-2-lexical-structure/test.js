// 例子1：
// 问：外层的this和内层的this， s1和s2注册在哪里？， 执行匿名函数时， 如何获取外层的是s1;
var s1 = 'outer string1';
var s2 = 'outer string2';
var self = this;
// 作为命名空间的函数： 定义一个匿名函数， 在单个表达式中调用它.
(function(self) {
    // body
    self;
    console.log(s2);
    console.log(s1);
    console.log(self.s1);
    var s1 = 'inner string'
}(self));

// 在javascript中使用构造函数来定义类是常见的方法，
// 构造函数就是来初始化新创建对象的， 在javascript中使用new关键字来来创建并初始化对象，
//   构造函数内部会创建一个新对象，所以在构造函数体内只需要初始化这个对象即可。
// 构造函数的特性： 构造函数的prototype属性会被用作新对象的原型， 这就意味着通过该构造函数创建的对象都拥有相同的原型对象， 因此他们是一个类的实例
// 构造函数的特性： 每个javascript函数都可以用作构造函数， 每个构造函数的又都需要一个prototype属性，
//   javascript在每个函数中为我们定义好了prototype属性， 该属性是一个对象，
//   这个对象中包含一个不可枚举的属性constructor， constructor属性是一个函数对象， 指向构造函数本身。
// ！！！总结： 我们在编写js类时， 编写的就是constructor函数， constructor包含prototype属性，
//    每个对象实例都继承构造函数的prototype作为原型对象， 而prototype的constructor属性又指向构造函数本身。(这些行为都是js预定义的)
// 所以该表达式恒成立：以下面的Range类为例
// console.log(r.__proto__ === Range.prototype); // true
// console.log(r.constructor.prototype === Range.prototype); // true
// console.log(r.__proto__.constructor.prototype === Range.prototype); // true




// 构造函数的名称首字母常用大写， 这是一种规约
// 实际上， 原型对象才是类的唯一标识， 构造函数只是类的外在表现， 构造函数的名称只是用作类的名称而已，
//   当两个不同的构造函数用着相同的prototype时， 他们的实例也是属于同一个类的。

// 构造函数的prototype属性是一个对象， 所有实例都继承自这个对象。
// 1 使用预定义的prototype定义原型对象: （适用于仅定义个别的原型方法）
Range.prototype.length = function () {
    return this.to - this.from + 1;
};

// 2 使用新对象重写预定义的prototype属性：（适用于重新定义构造函数的原型）
// 注意 1：显示的反向引用构造函数
Range.prototype = {
    constructor: Range, // 显示指明构造函数的引用
    includes: function (number) {
        if ((number >= this.from) && (number <= this.to)) {
            return true;
        }

        return false;
    },
    foreach: function () {
        for (var i = this.from, to = this.to; i <= to; i++) {
            console.log(i);
        }
    },
    toString: function () {
        return 'this range is from ' + this.from + ' to ' + this.to;
    }
}


var r =  new Range(3, 6);
console.log(r.includes(5));
console.log(r.includes(7));
r.foreach()
// console.log(r.length());
console.log(r.toString());

console.log(r.__proto__ === Range.prototype);
console.log(r.constructor.prototype === Range.prototype);
console.log(r.__proto__.constructor.prototype === Range.prototype);




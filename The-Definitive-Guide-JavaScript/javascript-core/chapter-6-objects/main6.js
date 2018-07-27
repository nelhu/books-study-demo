var msg = 'objects';

// 对象
// 对象是键值对的无序集合，是字符串到值的映射集合， 这种接班的数据结构还有和很多叫法，
// 如：散列（hash）， 散列表（hashtable）， 字典（dictionary），关联数组（associative array）
// 对象不仅仅有自己的属性，还可以从一个称之为原型的对象中继承，称为原型式继承(prototypal inheritance)
// 这是js的核心特征

// 原型
// 每一个js对象（null除外）, 都和另一个对象关联，这个对象就是原型对象， 对象从原型对象中继承属性
// 在现在浏览器（如chrome）的实现中， 提供了一个属性用于访问/引用原型对象：__proto__，该属性指向该对象的原型对象,
// 既该对象的构造函数constructor的prototype属性
// 没有原型对象的不多， Object.prototype就是其中一个,他不继承任何属性， 其他原型对象都是普通对象， 普通对象都有自己的原型对象，
// 所有内置的构造函数都有一个继承自Object.prototype的原型属性prototype， 比如Array， 所以由new Array()创建的对象的原型
// 指向Array.prototype， 而Array.prototype就是Array.constructor.prototype， 而该属性继承自Object.prototype,
// 这一系列链接的原型对象就是我们所说的原型链
//

// 假如要查询对象o的属性x, 如果o中不存在属性x， name将会在o的原型对象中查找x， 如果原型对象也没有， 就查看该3原型对象的原型对象、
// 直至查到x， 或者查到一个原型prototype为null的对象为止。可以看到，对象的原型属性构成了一个链，这就是原型链查找。
//

// 使用下面的术语来对三类javascript对象和两类javascript属性作区分
// 1. 内置对象： 由ECMAScript委员会规定的对象或类， 如： 数组，函数， 日期， 正则表达式都是内置对象
// 2. 宿主对象： javascript解释器所嵌入的宿主环境（浏览器： window， nodejs： global）
// 3. 自定义对象： javascript代码运行中所创建的对象
// 4. 自有属性： 直接在对象中定义的属性
// 5. 继承属性：从对象的原型对象中继承的属性

// 对行的操作包括： 创建 修改 查找(query) 删除 检索(test) 枚举(enumerate)

// 创建
// 1. 对象直接量
var obj1 = {
    name: 'neller',
    age: '23',
    behavior: {
        say: 'hello'
    }
};
// 2. new操作符
var obj2 = new Object();
var a1 = new Array();
// 3. 原型： 参照原型的解释
// 4. Object.create
var obj3 = Object.create({name: 'neller', age: '23'});
var obj4 = Object.create(Object.prototype);

// 在es3中模仿Object.create
function inherit(prototype) {
    if (!prototype) {
        throw ReferenceError('prototype is not defined');
    }

    if (Object.create) {
        return Object.create(prototype);
    }

    var type = typeof prototype;
    if (type !== "object" && type !== "function") {
        throw TypeError("prototype is not a object or function");
    }
    function F() {};
    F.prototype = prototype;
    return new F();
}
// inherit(null);

// 关联数组
// 访问方法： object["property"], 由方括号和字符串组成访问表达式,
// 看起来像是数组， 只是数组元素是通过字符串索引而不是数字索引，这种数组就是我们所说关联数组， 散列， 散列表
// js中的对象都是关联数组， 它很重要。

(function() {
    "use strict";
    // 设置属性失败
    // Object.prototype = null; // 报错
   // 删除属性失败
   // delete x; // 报错 因改为 delete this.x;
}());

// js中属性的存储器值：getter和setter
// js中正常的对象都是键值对， 键是字符串， 值是任意类型的值，
// 其中的值可以是方法， 用于对值的读和写（相当于java中属性的set和get方法）
// setter用于设置属性值， getter用于获取属性值
// 定义有个拥有属性存取器的对象： 使用对象直接量的方式
var obj5 = {
    simple_prop: 'sp',
    set accessor_prop(param) {
        return this.accessor_prop = param + 'setted';
    },
    get accessor_prop() {
        return 'param getted'
    }
};
console.log(obj5.accessor_prop);
// console.log(obj5.accessor_prop = 'set');
console.log(obj5.accessor_prop);

// js中对象的三个属性
// 1. 原型属性
// 2 类属性
function classof(o) {
    if (O === undefined) {
        return 'undefined';
    }

    if (O === null) {
        return 'null';
    }

    return Object.prototype.toString.call(a).slice(8, -1)
}
classof(null); // null
classof(false); // Boolean
classof([]); // Array

// 3 可扩展性
// 包括方法 Object.isExtensible(obj); Object.preventExtensions(obj);
// Object.seal(); Object.freeze(); Object.isFrizen(); Object.isSealed();
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
//
//

// 类的扩充
// javascript中基于原型的继承是动态的， 所有基于原型的实例， 在原型对象发生变化后，所有的实例都将拥有这个变化
// 这就意味着我们可以通过给原型对象添加新方法来扩充Javascript类

// 扩充上例的Complex类的梳理方法
Complex.prototype.minus = function(that) {
    return new Complex(this.real + that.real, this.imaginary + that.imaginary);
}

// 除此之外： javascript内置类也是允许扩充的
String.prototype.definiteEquals = function(that) {
    return this === that;
}

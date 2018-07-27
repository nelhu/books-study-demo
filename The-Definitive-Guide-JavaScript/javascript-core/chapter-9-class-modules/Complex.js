// 在javascript中定义类 一般可以分为三步：
// 1 定义一个构造函数， 设置初始化对象的实例属性
// 2 给构造函数的prototype对象定义实例方法
// 3 给构造函数定义类字段和类属性

// step1
// 构造方法并初始化
function Complex(real, imaginary) {
    if (this.isNaN(real) || this.isNaN(imaginary)) {
        throw new TypeError('real and imaginary are both number needed');
    }
    this.real = real;
    this.imaginary = imaginary;
}


// step2
// 实例方法
Complex.prototype.add = function(that) {
    return new Complex(this.real + that.real, this.imaginary + that.imaginary);
}


// step3
// 类属性
Complex.ZERO = new Complex(0, 0);
Complex.I = new Complex(0, 1);
// 类方法
Complex.equals = function(c1, c2) {
    if (c1.real === c2.real ) {
        return true;
    }
}


function MVVM(options) {
    //将数据保存到vm对象中
    this.$options = options;
    //将data对象保存到vm和data变量中
    var data = this._data = this.$options.data;
    //将vm保存在me变量中
    var me = this;
    alert(this)
    Object.keys(data).forEach(function (key) {
        me._proxy(key);
    });
    observe(data, this)
    this.$compile = new Compile(options.el || document.body, this);
}

MVVM.prototype = {
    //注意监视属性，回调函数，参数列表
    $watch: function (key, cb, options) {
        //回调函数声明，每个属性创建一个监视对象
        new Watcher(this, key, cb);
    },
    _proxy: function (key) {
        //保存vm
        var me = this
        //给vm添加指定属性名的属性
        Object.defineProperty(me, key, {
            configurable: false,
            enumerable: true,//可以枚举
            get: function proxyGetter() {
                return me._data[key];
            },
            set: function proxySetter() {
                me.data[key] = newVal;
            }
        })

    }

}

function Watcher(vm, exp, cb) {
    this.cb = cb;
//保存vm对象
    this.vm = vm;
//这个是表达式
    this.exp = exp;
    this.depIds = {}; //{0,d0,1:d1,2:d2}
    this.value = this.get();
}

Watcher.prototype = {
    update: function () {
        this.run();
    },
    run: function () {
//得到最新的值
        var value = this.get();
//得到旧值
        var oldVal = this.value;
//如果不相同
        if (value !== oldVal) {
            this.value = value;
//调用回调函数更新相应的界面
            this.cb.call(this.vm, value, oldVal);
        }
    },
    addDep: function (dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            //建立dep到watcher
            dep.addSub(this);
            //建立watcher到dep的关系
            this.depIds[dep.id] = dep;
        }
    },
    get: function () {
        Dep.target = this;
//获取当前表达式的值，内部会导致属性的get()调用
        var value = this.getVMval();
        Dep.target = null;
        return value;

    },
    getVMval: function () {
        var exp = this.exp.split('.')
        var val = this.vm._data;
        exp.forEach(function (k) {
                val = val[k];
            }
        );
        return val;
    }
}
}
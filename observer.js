function Observer(data) {
//保存data对象
    this.data = data;
    this.walk(data)
}

Observer.prototype = {
    walk: function (data) {
        //保存对象
        var me = this
//遍历data中所有属性
        Object.keys(data).forEach(function (key) {
            //对指定属性进行处理
            me.convert(key, data[key]);
        })
    },
    convert: function (key, val) {
        this.defineReactive(this.data, key, val);
    },
    defineReactive: function (data, key, val) {
        //创建与当前属性对应的dep对象
        var dep = new Dep();
        //间接递归调用实现对data所有层次属性的劫持
        var childObj = observer(val);
        //给data重新定义属性(添加set/get)
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: function () {
                //建立dep与watcher的关系
                if (Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set: function (newVal) {
                if (newVal == val) {
                    return;
                }
                val = newVal;
                //新的值是object的话，进行监听
//通过dep
                dep.notify();
            }

        })
    }
};

function observer(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};
var uid = 0;

function Dep() {
//构造函数
    //标识属性
    this.id = uid++;
//相关的所有的watcher数组
    this.subs = [];
}

Dep.prototype = {
    addSub: function (sub) {
//向数组中添加相应的元素
        this.subs.push(sub);
    },
    depend: function () {
        Dep.target.addDeep(this)
    },
    removeSub: function (sub) {
        var index = this.subs.indexOf(sub);
        if (index != 1) {
            this.subs.splice(index, 1)
        }
    },
    notify: function () {
        //通知所有相关的watcher(一个订阅者)
        this.subs.forEach(function (sub) {
            sub.update();
        })
    }
};
Dep.target=null;
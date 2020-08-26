"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceManager_1 = require("../manager/ResourceManager");
const LogsManager_1 = require("../manager/LogsManager");
//动态的3dsprite扩展.  对于一些不需要操作子对象的3d模型来说.这个方法很适合. 非阻塞的创建3d模型
class Sprite3DExpand extends Laya.Sprite3D {
    constructor(name) {
        super(name);
        this._childMap = [];
    }
    //开始加载model
    startLoadModel(modelName, completeFunc = null, thisObj = null, args = null) {
        this.modelName = modelName;
        if (completeFunc) {
            this._onCompleteBack = new Laya.Handler(thisObj, completeFunc, args);
        }
        ResourceManager_1.default.load3dmodel(modelName, false, this.onLoadComplete, this);
    }
    //给一个子对象赋一个包含路径的全名.applyfullname;
    applyChildFullName(view, path = "") {
        if (path == "") {
            view["__fullName"] = view.name;
        }
        else {
            view["__fullName"] = path + "." + view.name;
        }
        path = view["__fullName"];
        //根据fullname存储view
        if (this._childMap[path]) {
            LogsManager_1.default.errorTag("viewError", "这个对象同层级有对象重名了,路径:", path, "模型:", this.modelName);
        }
        this._childMap[path] = view;
        for (var i = 0; i < view.numChildren; i++) {
            var child = view.getChildAt(i);
            this.applyChildFullName(child, path);
        }
    }
    //获取子对象.根据全路径 必须要等加载完成之后才能获取.否则为空
    getChildViewByFullName(fullname) {
        return this._childMap[fullname];
    }
    //加载成功回调  
    onLoadComplete() {
        this.currentView = ResourceManager_1.default.get3dmodelRes(this.modelName, false, true);
        this.addChild(this.currentView);
        //给子对象赋值全名 第一层子对象 path为空
        for (var i = 0; i < this.currentView.numChildren; i++) {
            this.applyChildFullName(this.currentView.getChildAt(i), "");
        }
        this.showChildView();
        this.doExpandOnShow();
        if (this._onCompleteBack) {
            this._onCompleteBack.run();
            this._onCompleteBack = null;
        }
    }
    //子类重写 .比如需要播放特效的
    doExpandOnShow() {
    }
    //显示子对象
    showChildView() {
        for (var i in this._childMap) {
            var view = this._childMap[i];
            var needShow = false;
            if (this.showViewArr) {
                for (var s = 0; s < this.showViewArr.length; s++) {
                    var tempUrl = this.showViewArr[s];
                    //如果路径前缀互相包含就直接显示
                    if (i.slice(0, tempUrl.length) == tempUrl || tempUrl.slice(0, i.length) == i) {
                        needShow = true;
                        break;
                    }
                }
            }
            else {
                needShow = true;
            }
            view.active = needShow;
        }
    }
    //设置showViewArr  传空表示显示所有子对象
    setShowViewArr(showViewArr) {
        //这里需要动态
        if (this.showViewArr == showViewArr) {
            return;
        }
        this.showViewArr = showViewArr;
        //如果还没加载完 不执行
        if (!this.currentView) {
            return;
        }
        this.showChildView();
    }
    //销毁
    destroy() {
        this._childMap = null;
        if (this._onCompleteBack) {
            delete this._onCompleteBack;
        }
        this.showViewArr = null;
        //移除自己
        if (this.currentView) {
            this.currentView.removeSelf();
        }
        this.currentView = null;
        if (this.parent) {
            this.removeSelf();
        }
    }
}
exports.default = Sprite3DExpand;
//# sourceMappingURL=Sprite3DExpand.js.map
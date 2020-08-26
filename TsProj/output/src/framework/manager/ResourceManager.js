"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoadManager_1 = require("./LoadManager");
const SubPackageManager_1 = require("./SubPackageManager");
const LogsManager_1 = require("./LogsManager");
const SubPackageConst_1 = require("../../game/sys/consts/SubPackageConst");
class ResourceManager {
    constructor() {
    }
    static get instance() {
        if (!ResourceManager._instance) {
            ResourceManager._instance = new ResourceManager();
        }
        return ResourceManager._instance;
    }
    //加载多个3dmodel 以及场景
    //示例:loadMult3dmodel(["role_001","role_101","effect_110"],"scene_battle");
    // params 自带的回调参数
    static loadMult3dmodel(models, sceneModel = null, callBack = null, thisObj = null, params = null) {
        var scenePackName;
        var packs = [];
        var urls = [];
        if (sceneModel) {
            scenePackName = this.get3dodelPackName(sceneModel);
            if (this.check3dIsSubpack()) {
                SubPackageManager_1.default.insertDynamicSubPack(scenePackName, this.get3DModelPath(sceneModel) + "/" + scenePackName);
            }
            urls.push(this.get3dmodelUrl(sceneModel, true));
            packs.push(scenePackName);
        }
        for (var i = 0; i < models.length; i++) {
            var packName = this.get3dodelPackName(models[i]);
            if (this.check3dIsSubpack()) {
                SubPackageManager_1.default.insertDynamicSubPack(packName, this.get3DModelPath(models[i]) + "/" + packName);
            }
            urls.push(this.get3dmodelUrl(models[i]));
            packs.push(packName);
        }
        //如果是不需要分包的 
        if (!this.check3dIsSubpack()) {
            packs = [];
        }
        if (params) {
            LoadManager_1.LoadManager.instance.createPackAndRes(packs, urls, Laya.Handler.create(thisObj, callBack, params));
        }
        else {
            LoadManager_1.LoadManager.instance.createPackAndRes(packs, urls, Laya.Handler.create(thisObj, callBack));
        }
    }
    //判断是否3d模块需要分包
    static check3dIsSubpack() {
        return SubPackageManager_1.default.getModelFileStyle(SubPackageConst_1.default.packName_model3d) == SubPackageConst_1.default.PATH_STYLE_SUBPACK;
    }
    //加载一个3dmodel
    static load3dmodel(modelName, isScene, callBack, thisObj, params = null) {
        var packName = this.get3dodelPackName(modelName);
        SubPackageManager_1.default.insertDynamicSubPack(packName, this.get3DModelPath(modelName) + "/" + packName);
        //如果是不需要分包的 
        if (!this.check3dIsSubpack()) {
            packName = null;
        }
        if (params) {
            LoadManager_1.LoadManager.instance.createPackAndRes(packName, this.get3dmodelUrl(modelName, isScene), Laya.Handler.create(thisObj, callBack, params));
        }
        else {
            LoadManager_1.LoadManager.instance.createPackAndRes(packName, this.get3dmodelUrl(modelName, isScene), Laya.Handler.create(thisObj, callBack));
        }
    }
    //获取一个3dmodel的分包名
    static get3dodelPackName(modelName) {
        return this.PATHHEAD + modelName;
    }
    //获取3d模型的url,比如传入 role_1001  返回 3dmodel/LayaScene_role_1001/Conventional/role_1001.lh
    //isScene  如果是场景 返回ls 否则返回lh
    static get3dmodelUrl(modelName, isScene = false) {
        var houzhui = isScene && ".ls" || ".lh";
        return this.get3DModelPath(modelName) + "/" + this.PATHHEAD + modelName + "/" + this.resplatform + "/" + modelName + houzhui;
    }
    //获取一个3demol的sprite3D对象.根据业务逻辑自己去clone withClone 是否克隆.原则上都需要克隆 默认false;
    static get3dmodelRes(modelName, isScene = false, withClone = false) {
        var url = this.get3dmodelUrl(modelName, isScene);
        var res = Laya.Loader.getRes(url);
        if (!res) {
            LogsManager_1.default.warn("没有这个资源-", modelName);
        }
        else {
            if (withClone && res.clone) {
                res = res.clone();
            }
            this.checkParticalRendeMode(res, modelName);
        }
        return res;
    }
    //检查粒子renderMode
    static checkParticalRendeMode(view, modelName) {
        // if(!UserInfo.isTT() ){
        //     return;
        // }
        // //必须是ios系统
        // if(!UserInfo.isIos()){
        //     return;
        // }
        var partical = view;
        if (partical._particleSystem) {
            var renmode = partical._render.renderMode;
            if (renmode != 0) {
                if (!this._checkRenderModeMap[modelName]) {
                    this._checkRenderModeMap[modelName] = true;
                    LogsManager_1.default.warn("-----------renderMode 为mesh了");
                }
                partical._render.renderMode = 0;
            }
        }
        for (var i = 0; i < view.numChildren; i++) {
            var child = view.getChildAt(i);
            this.checkParticalRendeMode(child, modelName);
        }
    }
    //clone一个粒子
    static cloneOneSprite(sourceSp) {
        var rt = sourceSp.clone();
        this.checkParticalRendeMode(sourceSp, sourceSp.name || "test");
        return rt;
    }
    //加载一个spine动画  根据spine动画名字作为动态分包 ,回调参数顺序:  callback(ani,params); 会把 动画对象放到回调里面
    //  ani  是 Laya.Skeleton对象
    //这个接口废弃
    static loadSpine(spineName, callBack, thisObj, params = null, needChangeSkin = false) {
        var ani = this.createSpineAni(spineName);
        if (ani) {
            if (callBack)
                callBack.call(thisObj, ani, params);
        }
        SubPackageManager_1.default.insertDynamicSubPack(spineName, this.SPINEPATH + "/" + spineName);
        //分包加载完成 后 加载模版
        var onSubPackComplete = () => {
            var temp = new Laya.Templet();
            temp.loadAni(this.SPINEPATH + "/" + spineName + "/" + spineName + ".sk");
            temp.on(Laya.Event.COMPLETE, this, this.onSpineComplete, [temp, spineName, callBack, thisObj, params, needChangeSkin]);
            temp.on(Laya.Event.ERROR, this, this.onSpineLoadError, [temp, spineName, callBack, thisObj, params, needChangeSkin]);
        };
        SubPackageManager_1.default.loadDynamics(this.getSpineSubpack(spineName), this.getSpinePath(spineName), onSubPackComplete, this);
    }
    //获取spine对应的分包 因为考虑到如果有组的分包
    static getSpineSubpack(shortName) {
        var groupInfo = SubPackageManager_1.default.getSpineGroupInfo(shortName);
        if (!groupInfo) {
            return shortName;
        }
        return groupInfo.name;
    }
    //获取spine的路径
    static getSpinePath(shortName) {
        var subpak = SubPackageConst_1.default.subPackData[shortName];
        var groupInfo = SubPackageManager_1.default.getSpineGroupInfo(shortName);
        //如果是组spine
        if (groupInfo) {
            return groupInfo.path + "/" + groupInfo.name + "/" + shortName + "/";
        }
        var forderPath;
        if (!subpak || subpak.style == SubPackageConst_1.default.PATH_STYLE_SUBPACK) {
            forderPath = "spine";
        }
        else if (subpak.style == SubPackageConst_1.default.PATH_STYLE_NATIVE) {
            forderPath = "spine_native";
        }
        else {
            forderPath = "spine_cdn";
        }
        return forderPath + "/" + shortName + "/";
    }
    //获取spineskurl
    static getSpineSkUrl(shortName) {
        return this.getSpinePath(shortName) + shortName + ".sk";
    }
    static onSpineLoadError(spineName, callBack, thisObj, params, needChangeSkin) {
        LogsManager_1.default.warn(spineName, "___创建失败");
    }
    //spine动画加载完成
    static onSpineComplete(temp, spineName, callBack, thisObj, params = null, needChangeSkin = false) {
        this._spineModelMap[spineName] = temp;
        var ani = this.createSpineAni(spineName);
        LogsManager_1.default.echo(spineName, "___spinename");
        if (ani) {
            if (callBack)
                callBack.call(thisObj, ani, params);
        }
        else {
            LogsManager_1.default.warn("创建动画失败");
        }
    }
    // needChangeSkin 是否需要换装 默认false 不换砖. 换装会占用更多的模版内存
    static createSpineAni(spineName, needChangeSkin = false) {
        var tempModel = this._spineModelMap[spineName];
        if (!tempModel) {
            return null;
        }
        var t = needChangeSkin ? 1 : 0;
        var ani = tempModel.buildArmature(t);
        // ani.play(0,tru)
        return ani;
    }
    //获取一个3d模型的路径 不带Layascene的 model
    static get3DModelPath(model) {
        var packName = this.get3dodelPackName(model);
        var packinfo = SubPackageConst_1.default.subPackData[packName];
        if (!packinfo) {
            return "3dmodels";
        }
        var subStyle = packinfo.style;
        if (subStyle == null) {
            return "3dmodels";
        }
        else if (subStyle == SubPackageConst_1.default.PATH_STYLE_CDN) {
            return "3dcdns";
        }
        else if (subStyle == SubPackageConst_1.default.PATH_STYLE_NATIVE) {
            return "3dnatives";
        }
        else {
            return "3dmodels";
        }
    }
}
exports.default = ResourceManager;
ResourceManager.PATHHEAD = "LayaScene_"; //laya 场景
ResourceManager.resplatform = "Conventional"; //资源平台
ResourceManager.SPINEPATH = "spine"; //2d骨骼动画路径
ResourceManager._checkRenderModeMap = {};
//缓存spine加载完成, 缓存对应的spine缓冲模版
ResourceManager._spineModelMap = {};
//# sourceMappingURL=ResourceManager.js.map
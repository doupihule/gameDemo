"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserInfo_1 = require("../common/UserInfo");
const LogsManager_1 = require("./LogsManager");
const SubPackageConst_1 = require("../../game/sys/consts/SubPackageConst");
const FileUtils_1 = require("../utils/FileUtils");
/**
 * 分系统分包加载管理
 */
class SubPackageManager {
    //初始化组分包
    static _initGroupSubpack() {
        if (this._hasInitGroup) {
            return;
        }
        this._hasInitGroup = true;
        // var arr = SubPackageConst["spineGroupCfgs"];
        this._initOneGroup(SubPackageConst_1.default["spineGroupCfgs"]);
        this._initOneGroup(SubPackageConst_1.default["soundGroupCfgs"]);
        this._initOneGroup(SubPackageConst_1.default["model3dGroupCfgs"]);
    }
    //初始化一个组
    static _initOneGroup(arr) {
        if (!arr) {
            return;
        }
        for (var i = 0; i < arr.length; i++) {
            var groupInfo = arr[i];
            var packName = groupInfo.name;
            var path = groupInfo.path;
            this.insertDynamicSubPack(packName, path);
        }
    }
    /**加载分包，及回调 */
    static loadSubPackage(packageName, callback = null, thisObj = null, isShowPop = false) {
        if (!this.checkNeedLoad(packageName)) {
            if (callback) {
                callback.call(thisObj);
            }
            return;
        }
        else {
            LogsManager_1.default.echo("xd _开始下载分包", packageName, "_____");
            UserInfo_1.default.platform.loadSubPackage(packageName, callback, thisObj, isShowPop);
        }
    }
    //判断是否需要加载一个分包
    static checkNeedLoad(packageName) {
        if (!UserInfo_1.default.isSystemMini()) {
            return false;
        }
        if (UserInfo_1.default.isOppo() || UserInfo_1.default.isTT() || UserInfo_1.default.isUC()) {
            return false;
        }
        if (!this.canSubpack) {
            return false;
        }
        //如果是非分包的
        if (this.getPackStyle(packageName) != SubPackageConst_1.default.PATH_STYLE_SUBPACK) {
            return false;
        }
        //如果已经加载过了 那么也返回false
        if (this.getLoadStatus(packageName)) {
            return false;
        }
        return true;
    }
    /**加载完分包后，记住分包的状态 */
    static setLoadStatus(packageName) {
        this.subPackLoadData[packageName] = true;
        var filePath = SubPackageConst_1.default.subPackData[packageName].path;
        FileUtils_1.default.insertOneNativeFile(filePath);
    }
    /**获取加载分包的状态 */
    static getLoadStatus(packageName) {
        return this.subPackLoadData[packageName];
    }
    /**重写获取atlas方法，返回新的atlas路径 */
    static getNewAtlasPath(filePath) {
        return filePath;
    }
    /**将需要分包的合图路径转为对应的路径 */
    static getTurnPath(path) {
        return null;
    }
    /**
     * 以数组形式加载分包，分包全部加载成功后执行回调
     * 回调参数为true(全部加载成功)、false(有加载失败的)
     * @param names 分包名，数组或字符串
     * @param callback 完成的回调
     * @param thisObj
     */
    static load(names, callback = null, thisObj = null, isInsert = false) {
        this._initGroupSubpack();
        if (!this.canSubpack) {
            LogsManager_1.default.echo("xd load 分包加载开关已关闭");
            callback && callback.call(thisObj, false);
            return;
        }
        if (typeof names == "string") {
            //如果是不需要再次加载的
            if (!this.checkNeedLoad(names)) {
                callback && callback.call(thisObj, true);
                return;
            }
            names = [names];
        }
        if (!names.length || names.length < 1) {
            LogsManager_1.default.echo("SubPackageManager load names error:", names);
            callback && callback.call(thisObj, false);
            return;
        }
        var params = {
            names: names,
            allNum: names.length,
            callback: callback,
            thisObj: thisObj,
            curIndex: 0,
        };
        var isAllComplete = true;
        //判断下是否已经下载完成了
        for (var i = 0; i < names.length; i++) {
            var tempValue = names[i];
            ;
            //如果有需要加载的分包 表示不是所有分包都完成 那么就需要等待
            if (this.checkNeedLoad(tempValue)) {
                isAllComplete = false;
            }
        }
        //所有分包已经加载完成直接做回调
        if (isAllComplete) {
            callback && callback.call(thisObj, true);
            return;
        }
        if (isInsert) {
            this.loadCacheArr.splice(0, 0, params);
        }
        else {
            this.loadCacheArr.push(params);
        }
        this.checkLoad();
    }
    //插入一个动态分包 path相对于 bin的路径
    //name 可以是数组  如果是数组 那么 path也必须是数组长度和name一致
    static insertDynamicSubPack(names, paths) {
        //如果已经有动态分包了 return
        if (typeof names == "string") {
            if (!SubPackageConst_1.default.subPackData[names]) {
                SubPackageConst_1.default.subPackData[names] = { path: paths, style: SubPackageConst_1.default.PATH_STYLE_SUBPACK };
            }
        }
        else {
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                var path = paths[i];
                if (!SubPackageConst_1.default.subPackData[name]) {
                    SubPackageConst_1.default.subPackData[name] = { path: path, style: SubPackageConst_1.default.PATH_STYLE_SUBPACK };
                }
            }
        }
    }
    //加载多个动态组 
    //names 可以是数组  如果是数组 那么 path也必须是数组长度和name一致 ,也可以是字符串
    static loadDynamics(names, paths, callback = null, thisObj = null, isInsert = false) {
        this.insertDynamicSubPack(names, paths);
        this.load(names, callback, thisObj, isInsert);
    }
    /**判断是否进入队列的下一个加载 */
    static checkLoad() {
        if (this.curLoadInfo) {
            // LogsManager.echo("yrc111 SubPackageManager checkLoad 排队中")
            return;
        }
        if (this.loadCacheArr.length == 0) {
            return;
        }
        var info = this.loadCacheArr.shift();
        this.sureLoad(info);
    }
    /**确实开始加载了，调取加载分包的接口 */
    static sureLoad(info) {
        this.curLoadInfo = info;
        var packName = this.curLoadInfo.names[0];
        this.loadSubPackage(packName, this.loadNext, this, true);
    }
    /**分包支持数组加载，加载该任务所需分包数组的下一个 */
    static loadNext(isSuc = false) {
        if (!this.curLoadInfo) {
            return;
        }
        var curIndex = this.curLoadInfo.curIndex;
        //现在是这个loadName的加载完成回调
        var loadName = this.curLoadInfo.names[curIndex];
        LogsManager_1.default.echo("yrc loadNext loadName:", loadName, ">>isSuc:", isSuc);
        var allNum = this.curLoadInfo.allNum;
        if (curIndex >= allNum - 1) {
            //全部走完了
            var callback = this.curLoadInfo.callback;
            var thisObj = this.curLoadInfo.thisObj;
            callback && callback.call(thisObj);
            this.curLoadInfo = null;
            this.checkLoad();
        }
        else {
            curIndex++;
            this.curLoadInfo.curIndex = curIndex;
            var nextName = this.curLoadInfo.names[curIndex];
            this.loadSubPackage(nextName, this.loadNext, this, true);
        }
    }
    //获取一个模块的路径配置方式
    static getModelFileStyle(model) {
        return this.getPackStyle(model);
    }
    static getSubData(model) {
        return SubPackageConst_1.default.subPackData[model];
    }
    //判断一个模块是否是native
    static checkSubModelIsNative(model) {
        var info = SubPackageConst_1.default.subPackData[model];
        if (!info) {
            return false;
        }
        return info.style == SubPackageConst_1.default.PATH_STYLE_NATIVE;
    }
    //获取分包的style
    static getPackStyle(packName) {
        if (!FileUtils_1.default.isUserWXSource()) {
            return SubPackageConst_1.default.PATH_STYLE_NATIVE;
        }
        var packinfo = SubPackageConst_1.default.subPackData[packName];
        if (!packinfo) {
            return SubPackageConst_1.default.PATH_STYLE_NATIVE;
        }
        return packinfo.style;
    }
    static _getGroupInfoByName(name, type, souceGroupArr) {
        if (!souceGroupArr) {
            return null;
        }
        var obj = this._groupInfoCache[type];
        if (obj[name]) {
            return obj[name].groupInfo;
        }
        obj[name] = {};
        for (var i = 0; i < souceGroupArr.length; i++) {
            var groupInfo = souceGroupArr[i];
            var child = groupInfo.child;
            if (child.indexOf(name) != -1) {
                obj[name].groupInfo = groupInfo;
                return groupInfo;
            }
        }
        return null;
    }
    /**获取spine对应的组信息 */
    static getSpineGroupInfo(spineName) {
        return this._getGroupInfoByName(spineName, "spine", SubPackageConst_1.default["spineGroupCfgs"]);
    }
    static getSoundGroupInfo(sound) {
        return this._getGroupInfoByName(sound, "sound", SubPackageConst_1.default["soundGroupCfgs"]);
    }
    static getModel3DGroupInfo(model) {
        return this._getGroupInfoByName(model, "model3d", SubPackageConst_1.default["model3dGroupCfgs"]);
    }
}
exports.default = SubPackageManager;
/**分包加载情况 */
SubPackageManager.subPackLoadData = {};
/**是否可以使用分包 */
SubPackageManager.canSubpack = true;
SubPackageManager._hasInitGroup = false;
/**要加载的分包队列 */
SubPackageManager.loadCacheArr = [];
SubPackageManager._groupInfoCache = {
    "spine": {},
    "sound": {},
    "model3d": {}
};
/**
分系统 走 分包下载逻辑. 需求
支持动态配置.  egret 配置的是组名,  laya配置的是资源名 .(优先处理egret的,laya复杂一些.)
示例:
模块名:battle. 相关的所有资源合图后 把这些资源放到首包里面. 同时删除version.list里面的对应项.(因为这个资源需要优先从本地读取)
修改egret loadManager. 加载组.逻辑 先判断这个组是否是子包的.
如果是子包.   先走微信加载子包逻辑. 加载完成 后 在走egret的load.
加载子包失败弹出网络提示. 并重新加载.
 */ 
//# sourceMappingURL=SubPackageManager.js.map
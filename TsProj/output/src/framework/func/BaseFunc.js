"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseFunc {
    constructor() {
        this.hasInit = false;
        this._allCfgs = {};
        //初始化的时候 直接开始加载配表				
        this.startLoadCfg();
        Message_1.default.instance.add(MsgCMD_1.default.LOAD_JSONCOMPLETE, this);
    }
    //当配表group加载完成. 只针对合表 需要把translate 表 和 global表 单独分组. 如果想合组也可以
    static onConfigGroupLoadComplete() {
        if (!this.isMergeConfig) {
            return;
        }
        BaseFunc.globalCfgsHasLoad = true;
        var congfigName = this._globalConfigsName;
        if (GameUtils_1.default.isReview) {
            congfigName = this._globalConfigsReviewName;
        }
        this._globalConfigMap = Laya.loader.getRes(congfigName);
        var hotCfg = GameSwitch_1.default.switchMap[this.SWITCH_CONFIG_HOT];
        if (hotCfg && hotCfg != "") {
            try {
                hotCfg = JSON.parse(hotCfg);
                BaseFunc.hotCfg = hotCfg;
                if (BaseFunc.exportType == BaseFunc.exportType_Old) {
                    TableUtils_1.default.deepMerge(this._globalConfigMap, hotCfg);
                }
            }
            catch (e) {
                window["LogsManager"].errorTag("confighoterror", "热更的配表格式错误", hotCfg);
            }
        }
        //分系统添加资源加载完成监听
        Message_1.default.instance.send(MsgCMD_1.default.LOAD_JSONCOMPLETE);
    }
    /**设置配表导出方式 */
    static setCfgExportType(type) {
        this.exportType = type;
    }
    //当多语言表加载完成.
    static onTranslateGroupLoadComplete() {
        if (!this.isMergeConfig) {
            return;
        }
        this._translateConfigs = Laya.loader.getRes(this._translateCfgsName) || {};
        var cfgsArr = this._globalConfigMap;
        var translateKey = "Translate";
        var translatekeyLen = translateKey.length;
        for (var path in cfgsArr) {
            //如果定义这个表是多语言表  那么走多语言插入设置
            if (path.slice(0, translatekeyLen) == translateKey) {
                TranslateFunc_1.default.instance.insertOneCfgs(path);
            }
        }
    }
    static turnPath(path) {
        var endStr = "_json";
        if (path.slice(path.length - endStr.length, path.length) == endStr) {
            path = path.slice(0, path.length - endStr.length);
        }
        return path;
    }
    static getGlobalCfg(configKey, ignoreNoExist = false) {
        //判断是否已_json结尾
        configKey = BaseFunc.turnPath(configKey);
        var translateKey = "Translate";
        var translatekeyLen = translateKey.length;
        var resultTb;
        if (configKey.slice(0, translatekeyLen) == translateKey) {
            resultTb = this._translateConfigs[configKey];
            if (!resultTb) {
                resultTb = this._globalConfigMap[configKey];
            }
        }
        else {
            resultTb = this._globalConfigMap[configKey];
        }
        if (!resultTb) {
            if (BaseFunc.hotCfg && BaseFunc.hotCfg[configKey]) {
                resultTb = BaseFunc.hotCfg[configKey];
            }
        }
        if (!resultTb) {
            if (!ignoreNoExist) {
                window["LogsManager"].errorTag(LogsErrorCode_1.default.CONFIG_ERROR, "没有这个表:" + configKey);
            }
            return {};
        }
        return resultTb;
    }
    //开始加载配表.每个func初始化的时候需要调用这个接口
    startLoadCfg() {
        if (BaseFunc.globalCfgsHasLoad) {
            this.onGloablCfgLoadComplete();
        }
    }
    onGloablCfgLoadComplete() {
        //如果已经初始化了
        if (this.hasInit) {
            return;
        }
        this.hasInit = true;
        var cfgsArr = this.getCfgsPathArr();
        var translateKey = "Translate";
        var translatekeyLen = translateKey.length;
        for (var i = 0; i < cfgsArr.length; i++) {
            var pathInfo = cfgsArr[i];
            if (typeof pathInfo == "string") {
                pathInfo = { name: pathInfo };
            }
            var path;
            var name = pathInfo.name;
            var ignoreNoExist = pathInfo.ignoreNoExist;
            if (!pathInfo.path || pathInfo.path == "") {
                path = name;
            }
            else {
                path = pathInfo.path + "/" + name;
            }
            //如果定义这个表是多语言表  那么走多语言插入设置
            if (pathInfo.translate || path.slice(0, translatekeyLen) == translateKey) {
                var ins = TranslateFunc_1.default.instance;
                //这里为了安全,带_json的和不带_json的 都存一份
                ins.insertOneCfgs(BaseFunc.turnPath(name));
                ins.insertOneCfgs(name);
            }
            this.insertOneCfgs(name, ignoreNoExist);
            this.insertOneCfgs(BaseFunc.turnPath(name), ignoreNoExist);
        }
    }
    //插入一条表数据, 目前主要是考虑到 translate需要分系统自己插入.
    insertOneCfgs(path, ignoreNoExist = false) {
        path = BaseFunc.turnPath(path);
        if (BaseFunc.isMergeConfig) {
            this._allCfgs[path] = BaseFunc.getGlobalCfg(path, ignoreNoExist);
        }
        else {
            // LoadManager.instance.load("json/" + path, Laya.Handler.create(this, () => {
            // 	var jsonCfgs = Laya.loader.getRes("json/" + path)
            // 	if (!jsonCfgs) {
            // 		window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "配表加载失败:", path);
            // 		return
            // 	}
            // 	this._allCfgs[path] = jsonCfgs;
            // }), null, Laya.Loader.JSON);
        }
    }
    //获取配表名数组每个子类需要重写这个函数
    /**
     * 需要返回配表名 以及路径,如果没有路径,那么配null 或者 空字符串
     * 返回示例:
     * return {
     * 	{name:"ExploreBuff",path:"explore"}
     * }
     */
    getCfgsPathArr() {
        return [];
    }
    //根据配置名称,获取该配置的所有信息
    // ignoreError 是否忽略错误.默认false当获取不到某个表的时候会提示报错
    getAllCfgData(cfgsName, ignoreError = false) {
        cfgsName = BaseFunc.turnPath(cfgsName);
        var cfgs = this._allCfgs[cfgsName];
        if (!cfgs) {
            if (!ignoreError) {
                window["LogsManager"].errorTag(LogsErrorCode_1.default.CONFIG_ERROR, "对应的配表没找到,请检查配置:" + cfgsName);
            }
            return {};
        }
        if (BaseFunc.exportType == BaseFunc.exportType_New) {
            var itemData = cfgs.d;
            if (!itemData || Object.keys(itemData).length == 0) {
                BaseFunc._changeCfgs[cfgsName] = {};
                if (BaseFunc.hotCfg && BaseFunc.hotCfg[cfgsName]) {
                    //热更的是个新表的情况下，直接取热更内容
                    cfgs = BaseFunc.hotCfg && BaseFunc.hotCfg[cfgsName];
                    if (cfgs) {
                        BaseFunc._changeCfgs[cfgsName] = cfgs;
                        return cfgs;
                    }
                }
                return {};
            }
            if (!BaseFunc.initAllCfgs[cfgsName]) {
                for (var key in itemData) {
                    this.setOneChangeData(cfgsName, key);
                }
                BaseFunc.initAllCfgs[cfgsName] = true;
            }
            cfgs = BaseFunc._changeCfgs[cfgsName];
        }
        return cfgs;
    }
    //根据配置名称,对应的id 获取对应的数据
    // ignoreError 是否忽略错误.默认false当获取不到某个表的时候会提示报错
    getCfgDatas(cfgsName, id, ignoreError = false) {
        cfgsName = BaseFunc.turnPath(cfgsName);
        var cfgs = this._allCfgs[cfgsName];
        if (!cfgs) {
            if (!ignoreError) {
                //
                window["LogsManager"].errorTag(LogsErrorCode_1.default.CONFIG_ERROR, "配表还没有加载成功:" + cfgsName);
            }
            return {};
        }
        var data = this.changeDataById(cfgsName, id, ignoreError);
        if (!data) {
            if (!ignoreError) {
                window["LogsManager"].errorTag(LogsErrorCode_1.default.CONFIG_ERROR, "请找策划,配表名字:" + cfgsName + "对应的id找不到" + id);
            }
            return {};
        }
        return data;
    }
    /**转换数据结构 */
    changeDataById(cfgsName, id, ignoreError = false) {
        var data;
        if (BaseFunc.exportType == BaseFunc.exportType_Old) {
            data = this._allCfgs[cfgsName][id];
        }
        else {
            if (BaseFunc._changeCfgs[cfgsName] && BaseFunc._changeCfgs[cfgsName][id]) {
                data = BaseFunc._changeCfgs[cfgsName][id];
            }
            else {
                this.setOneChangeData(cfgsName, id, ignoreError);
                data = BaseFunc._changeCfgs[cfgsName] && BaseFunc._changeCfgs[cfgsName][id];
            }
        }
        return data;
    }
    /**转换一个id的数据 */
    setOneChangeData(cfgsName, id, ignoreError = false) {
        var cfgs = this._allCfgs[cfgsName];
        var type = Number(cfgs.t);
        var key = cfgs.m;
        var mkey = cfgs.k;
        var itemData = cfgs.d;
        //如果有这一条的数据了  直接返回
        if (BaseFunc._changeCfgs[cfgsName] && BaseFunc._changeCfgs[cfgsName][id])
            return;
        if (!BaseFunc._changeCfgs[cfgsName]) {
            BaseFunc._changeCfgs[cfgsName] = {};
        }
        var curInfo = itemData && itemData[id];
        if (!curInfo) {
            //如果是新表或者旧表的新字段的热更 直接取值  旧表或旧字段的热更还是先转换数据再合并
            if (BaseFunc.hotCfg && BaseFunc.hotCfg[cfgsName] && BaseFunc.hotCfg[cfgsName][id]) {
                BaseFunc._changeCfgs[cfgsName][id] = BaseFunc.hotCfg[cfgsName][id];
                return;
            }
        }
        if (!curInfo && !ignoreError) {
            window["LogsManager"].errorTag("configError", "请找策划,配表名字:" + cfgsName + "对应的id" + id + "没有配置");
            return;
        }
        if (!curInfo)
            return;
        var info = {};
        var outInfo = {};
        var mulKey;
        var addNum = 1;
        if (type == BaseFunc.streamType_DelHead) {
            //去表头
            if (mkey) {
                //如果是二维配表
                for (var item in curInfo) {
                    var info2 = {};
                    info2[key[0]] = id;
                    var itemInfo = curInfo[item];
                    mulKey = item;
                    info2[key[1]] = mulKey;
                    addNum = 2;
                    for (var i = 0; i < itemInfo.length; i++) {
                        var value = itemInfo[i];
                        if ((typeof value == "string" && value == "") || value == undefined)
                            continue;
                        info2[key[i + addNum]] = value;
                    }
                    outInfo[mulKey] = info2;
                }
                BaseFunc._changeCfgs[cfgsName][id] = outInfo;
            }
            else {
                info[key[0]] = id;
                for (var i = 0; i < curInfo.length; i++) {
                    var value = curInfo[i];
                    if ((typeof value == "string" && value == "") || value == undefined)
                        continue;
                    info[key[i + addNum]] = value;
                }
                BaseFunc._changeCfgs[cfgsName][id] = info;
            }
        }
        else if (type == BaseFunc.streamType_ShortHead) {
            //缩短表头
            if (mkey) {
                //如果是二维配表
                for (var item in curInfo) {
                    var info2 = {};
                    info2[key[0]] = id;
                    var itemInfo = curInfo[item];
                    mulKey = item;
                    info2[key[1]] = mulKey;
                    addNum = 2;
                    for (var index in itemInfo) {
                        if (itemInfo.hasOwnProperty(index)) {
                            var value = itemInfo[index];
                            info2[key[Number(index) - 1]] = value;
                        }
                    }
                    outInfo[mulKey] = info2;
                }
                BaseFunc._changeCfgs[cfgsName][id] = outInfo;
            }
            else {
                info[key[0]] = id;
                for (var index in curInfo) {
                    if (curInfo.hasOwnProperty(index)) {
                        var value = curInfo[index];
                        info[key[Number(index) - 1]] = value;
                    }
                }
                BaseFunc._changeCfgs[cfgsName][id] = info;
            }
        }
        if (BaseFunc.hotCfg && BaseFunc.hotCfg[cfgsName] && BaseFunc.hotCfg[cfgsName][id]) {
            TableUtils_1.default.deepMerge(BaseFunc._changeCfgs[cfgsName][id], BaseFunc.hotCfg[cfgsName][id]);
        }
    }
    //传入配表名, 对应的id, 对应的字段名 获取对应的数据
    getCfgDatasByKey(cfgsName, id, key1, ignoreError = false) {
        cfgsName = BaseFunc.turnPath(cfgsName);
        var data = this.getCfgDatas(cfgsName, id, ignoreError);
        var resultValue = data[key1];
        if (resultValue == null) {
            if (!ignoreError) {
                window["LogsManager"].errorTag(LogsErrorCode_1.default.CONFIG_ERROR, "请找策划,配表名字:" + cfgsName + "对应的id" + id + "字段" + key1 + "没有配置");
            }
        }
        return resultValue;
    }
    //获取某个配表对应多层key的数据
    //一般对应的是二维表. key1 可以是int
    getCfgDatasByMultyKey(cfgsName, id, key1, key2, ignoreError = false) {
        var data = this.getCfgDatas(cfgsName, id, ignoreError);
        var key1Data = data[key1];
        if (!key1Data) {
            if (!ignoreError) {
                window["LogsManager"].errorTag(LogsErrorCode_1.default.CONFIG_ERROR, "请找策划,配表名字:" + cfgsName + "对应的id" + id + "字段" + key1 + "没有配置");
            }
            return null;
        }
        var resultValue = key1Data[key2];
        if (!resultValue) {
            if (!ignoreError) {
                window["LogsManager"].errorTag(LogsErrorCode_1.default.CONFIG_ERROR, "请找策划,配表名字:" + cfgsName + "对应的id" + id + "字段" + key1 +
                    "_" + key2 + "没有配置");
            }
        }
        return resultValue;
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            case MsgCMD_1.default.LOAD_JSONCOMPLETE:
                this.onGloablCfgLoadComplete();
                break;
        }
    }
}
exports.default = BaseFunc;
//是否是合表的 默认为true, 那么全局只有2个表 globalTranslate 和 global
BaseFunc.isMergeConfig = true;
BaseFunc._globalConfigsName = "json/globalCfgs.json";
BaseFunc._globalConfigsReviewName = "jsonreview/globalCfgs.json";
BaseFunc._translateCfgsName = "json/translateCfgs.json";
BaseFunc._globalConfigMap = {};
BaseFunc._translateConfigs = {};
BaseFunc.globalCfgsHasLoad = false;
BaseFunc.hasInit = false;
BaseFunc.SWITCH_CONFIG_HOT = "SWITCH_CONFIG_HOT";
//转换后的数据结构
BaseFunc._changeCfgs = {};
BaseFunc.exportType_Old = 1;
BaseFunc.exportType_New = 2;
/**导出方式：1是旧的格式 2是新格式 */
BaseFunc.exportType = BaseFunc.exportType_Old;
/**新型导表格式：去表头 */
BaseFunc.streamType_DelHead = 1;
/**新型导表格式：缩短表头 */
BaseFunc.streamType_ShortHead = 2;
BaseFunc.hotCfg = {};
BaseFunc.initAllCfgs = {};
const TranslateFunc_1 = require("./TranslateFunc");
const Message_1 = require("../common/Message");
// import {LoadManager} from "../manager/LoadManager";
const MsgCMD_1 = require("../../game/sys/common/MsgCMD");
const LogsErrorCode_1 = require("../consts/LogsErrorCode");
const GameSwitch_1 = require("../common/GameSwitch");
const TableUtils_1 = require("../utils/TableUtils");
const GameUtils_1 = require("../../utils/GameUtils");
//# sourceMappingURL=BaseFunc.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../common/kakura/Client");
const Global_1 = require("../../utils/Global");
const UserModel_1 = require("../../game/sys/model/UserModel");
const TableUtils_1 = require("../utils/TableUtils");
const CacheManager_1 = require("../manager/CacheManager");
const StorageCode_1 = require("../../game/sys/consts/StorageCode");
const LogsManager_1 = require("../manager/LogsManager");
const KakuraClient_1 = require("../common/kakura/KakuraClient");
const WindowManager_1 = require("../manager/WindowManager");
const TimerManager_1 = require("../manager/TimerManager");
const GameSwitch_1 = require("../common/GameSwitch");
const DataResourceFunc_1 = require("../../game/sys/func/DataResourceFunc");
const BigNumUtils_1 = require("../utils/BigNumUtils");
/*
user
 */
class SingleCommonServer {
    /**
     * //当获取用户数据返回之后需要备份下数据
     * @param autoUpdate  ,是否自动同步数据.根据项目需要 判断是否有必要自动同步数据
     * 调用入口在UserModel.initData函数里面 .
     * 如果对于有金币同步频次较高的游戏.建议开启.同时同步频率建议调到30秒以上
     * 可通过修改 Global.updateUserDataDelay或者SWITCH_UPDATE_USERDATA_CD开关值调整同步频率
     */
    static initData(autoUpdate = false) {
        //获取服务器同步用户数据cd
        var delayValue = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_UPDATE_USERDATA_CD);
        if (delayValue) {
            delayValue = Number(delayValue);
            if (delayValue > 0) {
                Global_1.default.updateUserDataDelay = delayValue;
            }
            LogsManager_1.default.echo("使用服务器配置的同步cd", delayValue);
        }
        var minUpdateTime = GameSwitch_1.default.getSwitchState("SWITCH_MINUPDATETIME");
        if (minUpdateTime) {
            this.minUpdateTime = minUpdateTime;
        }
        if (this._lastBackUpData) {
            SingleCommonServer.startSaveClientData();
        }
        else {
            this._lastBackUpData = {};
            TableUtils_1.default.deepCopy(UserModel_1.default.instance.getData(), this._lastBackUpData);
        }
        // this.testConn();
        //如果是单人模式才会去定时同步客户端数据
        if (Global_1.default.checkIsSingleMode()) {
            //暂定10秒同步一次 如果有频繁数据修改需求. 这个值需要调
            // 定时同步功能关闭。云存储不在有延迟同步需求 fix by 黄璐骁
            if (autoUpdate) {
                TimerManager_1.default.instance.add(this.startSaveClientData, this, Global_1.default.updateUserDataDelay, 9999999);
            }
        }
    }
    //开始保存客户端数据 是否延迟保存 是为了提升性能. 原则上都需要延迟保存的.除非重要数据. .比如1秒内来了10个同步请求. 那么只会同步一次
    /**
     *
     * @param isDelaySave  暂时废弃
     * @param callBack   同步回调.
     * @param thisObj
     * @param dummyBackData  客户端手动模拟的服务器返回数据
     */
    static startSaveClientData(isDelaySave = false, callBack = null, thisObj = null, dummyBackData = null) {
        if (this._saveLock) {
            this._hasDataChange = true;
            LogsManager_1.default.echo("server 当前保存数据cd没到");
            callBack && callBack.call(thisObj, dummyBackData);
            return;
        }
        this._saveLock = true;
        this.sureDoSaveData(false, callBack, thisObj, dummyBackData);
        TimerManager_1.default.instance.remove(this._delayCode);
        //3秒内只能同步一次
        if (this.minUpdateTime > 0) {
            this._delayCode = TimerManager_1.default.instance.add(this.delayCheck, this, this.minUpdateTime, 1, false);
        }
    }
    static delayCheck() {
        this._saveLock = false;
        LogsManager_1.default.echo("server 保存数据cd到了,是否有数据变化:", this._hasDataChange);
        //如果期间又有数据变化. 那么重新保存一次数据. 
        if (this._hasDataChange) {
            this._hasDataChange = false;
            this.startSaveClientData(false);
        }
    }
    //手动执行数据同步表示要强制执行成功
    static sureDoSaveData(forceConnect = false, callBack = null, thisObj = null, dummyBackData = null) {
        if (this._isDestoryData) {
            WindowManager_1.default.ShowTip("xd 数据已经删除,请重启游戏");
            return;
        }
        if (!Global_1.default.checkIsSingleMode()) {
            //非单机项目的数据同步
            if (Object.keys(Client_1.default.temDirtList).length > 0) {
                var data = Client_1.default.temDirtList;
                var param = {};
                if (data["u"]) {
                    param["u"] = data["u"];
                }
                if (data["d"]) {
                    param["d"] = data["d"];
                }
                this.sendNoAliCloudData({ clientDirty: param });
            }
            callBack && callBack.call(thisObj, dummyBackData);
            return;
        }
        var params;
        var lastBackData = {};
        var tempUserData = UserModel_1.default.instance.getData();
        //必须是没有同步过完整数据,而且是2秒以后的请求 我才会做一次完整同步
        if (!this.hasUpdateAllData) {
            tempUserData.hasUpdateData = true;
            var tempData = {};
            TableUtils_1.default.deepCopy(tempUserData, tempData);
            params = { clientDirty: { u: tempData } };
            CacheManager_1.default.instance.setGlobalCache(StorageCode_1.default.storage_userinfo, JSON.stringify(tempUserData));
            LogsManager_1.default.echo("_还没有完整的同步过数据,需要先整体同步");
            // this.upDateAllData(lastBackData, this.onUserDataSaveComplete, this);
        }
        else {
            params = {
                clientDirty: this.getClientDirtyList()
            };
            //如果是空table 说明没有数据变化不用做数据同步
            if (TableUtils_1.default.isEmptyTable(params.clientDirty)) {
                callBack && callBack.call(thisObj, dummyBackData);
                return;
            }
        }
        //如果帐号是销毁状态 
        if (!tempUserData.uid) {
            delete tempUserData.sendTime;
        }
        else {
            //存储上一次同步的时间
            tempUserData.sendTime = Client_1.default.instance.serverTime;
            params.sendTime = tempUserData.sendTime;
        }
        if (!params.clientDirty.u) {
            params.clientDirty.u = {};
        }
        params.clientDirty.u.sendTime = tempUserData.sendTime;
        var userDataStr = JSON.stringify(tempUserData);
        //立马同步一次数据
        CacheManager_1.default.instance.setGlobalCache(StorageCode_1.default.storage_userinfo, userDataStr);
        //临时备份下数据 等更新成功后 本地数据需要记录这次同步的数据. 好做差异化更新
        TableUtils_1.default.deepCopy(tempUserData, lastBackData);
        //请求服务器同步数据 同步成功之后 才会把本地的back数据更新. 防止某一步数据同步失败后本地数据遗漏
        //这里暂时写死,因为分系统还没有定义这个协议后面游戏自行修改这个参数
        LogsManager_1.default.echo("开始同步数据,length:" + userDataStr.length);
        KakuraClient_1.default.instance.clearOneMethod(this.user_updateData_349);
        var tempParams = {
            callBack: callBack,
            thisObj: thisObj,
            backData: lastBackData,
            params: dummyBackData,
        };
        if (forceConnect) {
            Client_1.default.instance.send(this.user_updateData_349, params, this.doSureDoSaveDataBack, this, null, false, tempParams, this._forceExpandParams);
        }
        else {
            Client_1.default.instance.send(this.user_updateData_349, params, this.doSureDoSaveDataBack, this, null, false, tempParams);
        }
    }
    //保存数据成功时 需要执行回调
    static doSureDoSaveDataBack(serverInfo, addParams) {
        // this.onUserDataSaveComplete(serverInfo,addParams.backData);
        //又没有result 又没有serverinfo 那么
        var isError = false;
        //因为底层转化可能会去掉一层result  .如果有result 表示数据成功
        if (!serverInfo.result) {
            if (!serverInfo.serverInfo) {
                isError = true;
            }
        }
        if (isError) {
            if (addParams.callBack) {
                addParams.callBack.call(addParams.thisObj, addParams.params);
            }
            return;
        }
        this.hasUpdateAllData = true;
        LogsManager_1.default.echo("__客户端同步数据成功");
        //更新成功就重新覆盖上一次本地缓存的数据
        this._lastBackUpData = addParams.backData;
        if (addParams.callBack) {
            addParams.callBack.call(addParams.thisObj, addParams.params);
        }
    }
    //发送非单机项目的数据同步
    static sendNoAliCloudData(params) {
        if (Global_1.default.checkIsSingleMode())
            return;
        LogsManager_1.default.echo("开始非单机项目同步数据");
        KakuraClient_1.default.instance.clearOneMethod(this.user_updateData_349);
        Client_1.default.instance.send(this.user_updateData_349, params, (result) => {
            Client_1.default.temDirtList = {};
            if (result.error) {
                return;
            }
            LogsManager_1.default.echo("__非单机客户端同步数据成功");
        }, this, null, false);
    }
    static getClientDirtyList() {
        //如果当前有请求 那么关闭
        var dData = {};
        var uData = {};
        var userData = UserModel_1.default.instance.getData();
        //把user数据和上一次缓存的数据进行比较 得到增量更新的数据
        TableUtils_1.default.compareTable(this._lastBackUpData, userData, uData);
        delete uData.loginToken;
        delete uData.sendTime;
        //缓存上一次备份的数据
        var lastBackData = {};
        TableUtils_1.default.deepCopy(userData, lastBackData);
        TableUtils_1.default.findDelKey(this._lastBackUpData, userData, dData, true);
        delete dData.loginToken;
        if (TableUtils_1.default.isEmptyTable(uData)) {
            uData = undefined;
        }
        if (TableUtils_1.default.isEmptyTable(dData)) {
            dData = undefined;
        }
        if (!uData && !dData) {
            return this._emptyObj;
        }
        return { u: uData, d: dData };
    }
    /**
     * 确认同步
     */
    static setUpdateDataFlag(thisObj, data) {
        LogsManager_1.default.echo("krma. 确认同步，存入本地");
        CacheManager_1.default.instance.setGlobalCache(StorageCode_1.default.storage_userinfo, JSON.stringify(data));
    }
    //云存储清除账号数据
    static disposeAccount() {
        if (Global_1.default.checkUserCloudStorage()) {
            this.disposeCloudStorageAccount();
        }
        else {
            WindowManager_1.default.ShowTip("非云存储不可使用");
        }
    }
    //清除云存储账号数据
    static disposeCloudStorageAccount() {
        //先删除数据后同步服务器
        var userData = UserModel_1.default.instance.getData();
        for (var key in userData) {
            delete userData[key];
        }
        // this.startSaveClientData();
        //这里立马执行一次
        this.sureDoSaveData(false);
        //然后删除本地缓存
        this.destoryUserData();
        this._isDestoryData = true;
    }
    // 销毁玩家本地数据
    static destoryUserData() {
        CacheManager_1.default.instance.setGlobalCache(StorageCode_1.default.storage_userinfo, '');
    }
    //获取充值奖励
    static getChargeReward(list, callback, thisObj) {
        var reward = list;
        var upData = {};
        var tipNum = 0;
        for (var key in reward) {
            var result = reward[key].split(",");
            switch (Number(result[0])) {
                case DataResourceFunc_1.DataResourceType.COIN:
                    var coinNum = result[1];
                    if (coinNum) {
                        upData["coin"] = BigNumUtils_1.default.sum(UserModel_1.default.instance.getCoin(), coinNum);
                    }
                    break;
                case DataResourceFunc_1.DataResourceType.GOLD:
                    var goldNum = Number(result[1]);
                    if (goldNum) {
                        upData["giftGold"] = UserModel_1.default.instance.getGold() + goldNum;
                    }
                    break;
            }
        }
        var backData = Client_1.default.instance.doDummyServerBack(null, upData, null);
        if (callback) {
            callback.call(thisObj, backData);
        }
        SingleCommonServer.startSaveClientData();
    }
}
exports.default = SingleCommonServer;
SingleCommonServer._lastCacheClientDirtyList = {};
SingleCommonServer.user_updateData_349 = "349";
SingleCommonServer._emptyObj = {};
SingleCommonServer._testNums = 0;
//是否同步过所有数据
SingleCommonServer.hasUpdateAllData = false;
//最小的同步时间
SingleCommonServer.minUpdateTime = 3000;
SingleCommonServer._delayCode = 0;
SingleCommonServer._saveLock = false;
SingleCommonServer._hasDataChange = false;
SingleCommonServer._forceExpandParams = { forceConnect: true };
SingleCommonServer._isDestoryData = false;
//# sourceMappingURL=SingleCommonServer.js.map
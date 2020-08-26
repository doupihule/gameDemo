"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const UserModel_1 = require("../model/UserModel");
class GlobalParamsFunc extends BaseFunc_1.default {
    constructor() {
        super(...arguments);
        /**分享失败处理类型 1: 通用飘字，  2： 弹微信框（点击确认后继续拉取分享） */
        this.shareHandleType = 2;
        /**视频中途退出处理类型 1: 通用飘字，  2： 弹微信框（点击确认后重新拉取视频） */
        this.videoHandleType = 2;
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new GlobalParamsFunc();
        }
        return this._instance;
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new GlobalParamsFunc();
        }
        return this._instance;
    }
    getCfgsPathArr() {
        return [
            { name: "GlobalParams_json" },
            { name: "TranslateGlobal_json" },
        ];
    }
    /**根据id获取数据*/
    getGlobalCfgDatas(id) {
        // return this.cfg[id];
        return this.getCfgDatas("GlobalParams_json", id);
    }
    /**根据id获取TranslateGlobal数据*/
    getTranslateGlobalCfgDatas(id) {
        // return this.cfg[id];
        return this.getCfgDatas("TranslateGlobal_json", id);
    }
    /**根据id1,id2获取数据*/
    getDataByTwoId(id1, id2) {
        // return this.cfg[id];
        return this.getCfgDatasByKey("GlobalParams_json", id1, id2);
    }
    //获取配置数据的num
    getDataNum(id) {
        return this.getGlobalCfgDatas(id).num;
    }
    //获取字符串配置
    getDataString(id) {
        return this.getGlobalCfgDatas(id).string;
    }
    //获取数组配置
    getDataArray(id) {
        return this.getGlobalCfgDatas(id).arr;
    }
    /**获取banner的随机数据 */
    getBannerRandomById(id) {
        return this.getCfgDatasByKey("secretBox_json", id, "touchRound");
    }
    //获取基地技能解锁信息
    getBaseSkillList() {
        return this.getCfgDatasByKey("GlobalParams_json", "baseSkillList", "arr");
    }
    /**获取当前解锁了的阵位数 */
    getUnlockLineCount(level = null) {
        if (!level) {
            level = UserModel_1.default.instance.getMaxBattleLevel();
        }
        var count = 0;
        var info = this.getCfgDatasByKey("GlobalParams_json", "squadUnlock", "arr");
        for (var i = 0; i < info.length; i++) {
            var item = info[i].split(",");
            if (Number(item[1]) <= level) {
                count += 1;
            }
        }
        return count;
    }
}
exports.default = GlobalParamsFunc;
GlobalParamsFunc.coin = 2; //金币
GlobalParamsFunc.gold = 3; //钻石
GlobalParamsFunc.power = 4; //体力
//# sourceMappingURL=GlobalParamsFunc.js.map
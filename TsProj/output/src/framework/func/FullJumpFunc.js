"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("./BaseFunc");
const GameUtils_1 = require("../../utils/GameUtils");
const LogsManager_1 = require("../manager/LogsManager");
class FullJumpFunc extends BaseFunc_1.default {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "FullJump_json", ignoreNoExist: true },
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new FullJumpFunc();
        }
        return this._instance;
    }
    /**
     * 能否展示全屏互推
     * @param id 场景id
     */
    canShowFUllJump(id) {
        var jumpData = this.getCfgDatas("FullJump_json", id, true);
        if (!jumpData)
            return false;
        var jumpProb = jumpData.probab;
        var randNum = GameUtils_1.default.getRandomInt(1, 10000);
        LogsManager_1.default.echo("ycn full jump jumpProb:", jumpProb, ",randNum:", randNum);
        if (randNum <= jumpProb) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.default = FullJumpFunc;
// onshow情况下展示全屏互推
FullJumpFunc.ID_ONSHOW = "1";
//  在确认跳转弹窗中，点击取消时（现在本身就有，无需处理）
FullJumpFunc.ID_JUMP_FALSE = "2";
// 普通关卡结束时
FullJumpFunc.ID_COMMON_GAME = "3";
// 远征关卡结束时
FullJumpFunc.ID_WAR_GAME = "4";
// 当用户关闭抽奖面板时
FullJumpFunc.ID_EXIT_LOTTERY = "5";
// 当用户关闭七日登陆面板时
FullJumpFunc.ID_EXIT_SEVEN_DAY = "6";
// 当用户关闭排行榜时
FullJumpFunc.ID_EXIT_RANK = "7";
// 当用户关闭邀请面板时
FullJumpFunc.ID_EXIT_SHARE = "8";
// 关闭基地升级面板时
FullJumpFunc.ID_EXIT_UPDATE = "9";
// 关闭上阵面板时
FullJumpFunc.ID_EXIT_FORMATE = "10";
//# sourceMappingURL=FullJumpFunc.js.map
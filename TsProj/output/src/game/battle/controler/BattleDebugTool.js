"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
const BattleLogsManager_1 = require("../../sys/manager/BattleLogsManager");
const GameSwitch_1 = require("../../../framework/common/GameSwitch");
const GameSwitchConst_1 = require("../../sys/consts/GameSwitchConst");
const TableUtils_1 = require("../../../framework/utils/TableUtils");
/**
 * 战斗调试工具. 比如startExportRoleInfo输出一些战斗的角色属性. 帮助策划验证数值是否正确.
 * 战斗中的调试开关. 比如 属否大招免cd . 配置格式 参考SWITCH_BATTLE_DEBUGLEVEL
 
 *  * 1, 大招免cd,无参数.
     * 2, 释放固定技能, 参数:技能id,技能等级
     * 3,固定使用某个被动技能, 参数:技能id,技能等级
     * 4,无限血量,参数: (哪个阵营无限血量,0双方,1我方,2敌方)
     * 6,游戏加速 , 加速倍速
     * 9, 调试角色日志,参数:角色id; 可以配置多个角色.可以是我的,也可以是怪的. 0或者不配置表示调试所有角色日志
     *
 *  web版本 在浏览器地址后缀开关值 , 比如  @1,0;4,0@  表示 大招免cd;同时给所有人无限血量
 *  或者修改开关值SWITCH_BATTLE_DEBUGLEVEL ="1,0;4,0;6,4";
 *
 *
 */
class BattleDebugTool {
    constructor(controler) {
        this.controler = controler;
        this._attrCfgs = BattleFunc_1.default.instance.getAllCfgData("AttributeList");
        BattleDebugTool.initDebugValue();
    }
    //战斗调试器
    startExportRoleInfo() {
        //拿到当前所有的角色 
        BattleLogsManager_1.default.battleEcho("我方阵营数据:\n");
        this.exportCampInfo(this.controler.campArr_1);
        BattleLogsManager_1.default.battleEcho("对方阵营数据:\n");
        this.exportCampInfo(this.controler.campArr_2);
    }
    exportCampInfo(campArr) {
        for (var i = 0; i < campArr.length; i++) {
            this.exportOneRoleInfo(campArr[i]);
        }
    }
    //输出一条角色信息
    exportOneRoleInfo(role) {
        var str;
        if (role.cfgData.name) {
            str = "id:" + role.dataId + ",name:" + TranslateFunc_1.default.instance.getTranslate(role.cfgData.name) + ",";
        }
        else {
            str = "id:" + role.dataId + ",monster,";
        }
        var index = 3;
        for (var i in this._attrCfgs) {
            var info = this._attrCfgs[i];
            if (Number(i) < 100) {
                index++;
                var keyName = TranslateFunc_1.default.instance.getTranslate(info.AttributeName);
                var value = role.attrData.getOneAttr(i);
                str += keyName + ":" + value + ", ";
                if (index % 8 == 0) {
                    str += "\n";
                }
            }
        }
        BattleLogsManager_1.default.battleEcho(str, "attrInfo:", role.attrData, "\n");
    }
    //--------------------调试参数-------------------------------
    //初始化调试参数
    static initDebugValue() {
        if (!BattleDebugTool._debugMap) {
            BattleDebugTool._debugMap = {};
            var debugMap = BattleDebugTool._debugMap;
            var value = GameSwitch_1.default.getSwitchState(GameSwitchConst_1.default.SWITCH_BATTLE_DEBUGLEVEL);
            if (value && value != "0") {
                var arr = TableUtils_1.default.turnCsvStrTogGameArr(value);
                for (var i = 0; i < arr.length; i++) {
                    var tempArr = arr[i];
                    if (tempArr.length == 1) {
                        debugMap[tempArr[0]] = true;
                    }
                    else {
                        debugMap[tempArr[0]] = tempArr.slice(1, tempArr.length);
                    }
                }
            }
        }
        var t = BattleDebugTool.getDebugRoleId();
        if (t == true) {
            t = [];
        }
        //设置调试角色日志id
        BattleLogsManager_1.default.debugRoleIDs = t;
    }
    //是否免cd
    static isNoHeroCd() {
        return this._debugMap["1"];
    }
    //获取调试技能
    static getDebugSkill() {
        return this._debugMap["2"];
    }
    //获取调试被动技能
    static getDebugPassiveSkill() {
        return this._debugMap["3"];
    }
    //是否无限血量
    static isInfiniteHp() {
        return this._debugMap["4"];
    }
    //获取游戏加速倍数
    static getBattleAddSped() {
        var rt = this._debugMap["6"];
        if (!rt) {
            return 1;
        }
        return Number(rt[0]) || 1;
    }
    //获取调试日志的角色id. 会跟踪这个角色的所有技能相关日志输出. 
    static getDebugRoleId() {
        return this._debugMap["9"];
    }
}
exports.default = BattleDebugTool;
//# sourceMappingURL=BattleDebugTool.js.map
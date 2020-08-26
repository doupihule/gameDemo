"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseFunc_1 = require("../../../framework/func/BaseFunc");
const GameUtils_1 = require("../../../utils/GameUtils");
/**怪物相关 */
class MonsterFunc extends BaseFunc_1.default {
    //处理用户配表相关接口.用静态方法
    //初始化 加载配表
    //存储所有配表
    getCfgsPathArr() {
        return [
            { name: "Monster" },
            // { name: "MonsterName" },
            { name: "Role" },
        ];
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new MonsterFunc();
        }
        return this._instance;
    }
    /**
     * 获取指定怪物某个属性
     */
    getMonsterModelById(id) {
        var monsterInfo = this.getCfgDatas("Monster", id);
        return this.getCfgDatasByKey("Role", monsterInfo.level, "model");
    }
    /**
     * 获取Monster的Role基础信息
     * @param id monsterid
     */
    getMonsterRoleById(id, level) {
        return this.getCfgDatasByKey("Monster", id, level);
    }
    getMonsterNameList() {
        var allList = this.getAllCfgData("MonsterName");
        var length = 0;
        for (var index in allList) {
            length++;
        }
        var id1 = GameUtils_1.default.getRandomInt(1, length);
        var id2 = GameUtils_1.default.getRandomInt(1, length);
        while (id2 == id1) {
            id2 = GameUtils_1.default.getRandomInt(1, length);
        }
        var id3 = GameUtils_1.default.getRandomInt(1, length);
        while (id3 == id1 || id3 == id2) {
            id3 = GameUtils_1.default.getRandomInt(1, length);
        }
        return [allList[id1].name, allList[id2].name, allList[id3].name];
    }
}
exports.default = MonsterFunc;
MonsterFunc.monsterIndex = 1;
//# sourceMappingURL=MonsterFunc.js.map
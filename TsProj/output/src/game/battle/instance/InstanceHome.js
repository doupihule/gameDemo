"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceLogical_1 = require("./InstanceLogical");
const BattleConst_1 = require("../../sys/consts/BattleConst");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const GlobalParamsFunc_1 = require("../../sys/func/GlobalParamsFunc");
//基地类
class InstanceHome extends InstanceLogical_1.default {
    constructor(controler) {
        super(controler);
        //是否是无敌状态
        this.unmatched = false;
        this.classModel = BattleConst_1.default.model_home;
        this.lifeType = BattleConst_1.default.LIFE_JIDI;
    }
    setData(data) {
        super.setData(data);
        this.unmatched = false;
    }
    //检测移动或者攻击
    checkMoveOrAttack(force = false) {
        //远征基地不攻击
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR)
            return;
        super.checkMoveOrAttack(force);
    }
    //改变血量
    changeHp(value) {
        if (this.unmatched)
            return;
        super.changeHp(value);
    }
    /**设置无敌时间 */
    setUnmatchState() {
        this.unmatched = true;
        var time = BattleFunc_1.default.instance.turnMinisecondToframe(GlobalParamsFunc_1.default.instance.getDataNum("resurrectionInvincibleTime"));
        this.controler.setCallBack(time, () => { this.unmatched = false; }, this);
    }
}
exports.default = InstanceHome;
//# sourceMappingURL=InstanceHome.js.map
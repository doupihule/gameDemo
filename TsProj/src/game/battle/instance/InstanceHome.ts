import InstanceLogical from "./InstanceLogical";
import BattleConst from "../../sys/consts/BattleConst";
import BattleFunc from "../../sys/func/BattleFunc";
import GlobalParamsFunc from "../../sys/func/GlobalParamsFunc";



//基地类
export default class InstanceHome extends InstanceLogical {
    //是否是无敌状态
    public unmatched = false;
    constructor(controler) {
        super(controler);
        this.classModel = BattleConst.model_home;
        this.lifeType = BattleConst.LIFE_JIDI;
    }
    setData(data: any) {
        super.setData(data)
        this.unmatched = false;
    }
    //检测移动或者攻击
    public checkMoveOrAttack(force: boolean = false) {
        //远征基地不攻击
        if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) return;
        super.checkMoveOrAttack(force);
    }
    //改变血量
    public changeHp(value: number) {
        if (this.unmatched) return;
        super.changeHp(value);
    }
    /**设置无敌时间 */
    public setUnmatchState() {
        this.unmatched = true;
        var time = BattleFunc.instance.turnMinisecondToframe(GlobalParamsFunc.instance.getDataNum("resurrectionInvincibleTime"))
        this.controler.setCallBack(time, () => { this.unmatched = false }, this);
    }
}
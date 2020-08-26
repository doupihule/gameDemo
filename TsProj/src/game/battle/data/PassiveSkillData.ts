import BattleSkillData from "./BattleSkillData";
import BattleFunc from "../../sys/func/BattleFunc";
import SkillActionData from "./SkillActionData";

export default class PassiveSkillData extends BattleSkillData {
    //被动技能效果数值以及参数
    public skillLogicalParams: any[];
    //触发次数
    public triggerNums: number = 0;
    //触发的帧数. 是为了检测死循环
    public triggerFrame: number = 0;

    //被动技能的来源buff,默认为空. 用来buff清除时 清除技能
    public fromValue: any;

    constructor(skillId: string, level: number, role: any, skillType: number, relyonSkill: any = null) {
        super(skillId, level, role, skillType, relyonSkill);
        //被动技能的数据和主动技不一样  后续扩展.
        //触发次数做标记的防止死循环
        this.triggerNums = 0;



        this.skillActionArr = [];
    }

    //缓存一个技能action
    public cacheOneSkillAction(skillAction: SkillActionData) {
        this.skillActionArr.push(skillAction);
    }

    //等级发生变化的时候 重置属性
    public updateLevel(level) {
        super.updateLevel(level);
        this.cfgData = BattleFunc.instance.getCfgDatas("PassiveSkill", this._skillId);
        if (this.cfgData.cdTime) {
            this._cfgSkillCd = Math.ceil(this.cfgData.cdTime * BattleFunc.miniSecondToFrame);
        }
        var tempArr = this.cfgData.effectParams
        //获取这个技能效果的作用值  比如加攻击力,是读技能表的还是读自身的等. 
        var tagStr = "PassiveSkillData" + this._skillId
        if (tempArr) {
            if (!this.skillLogicalParams) {
                this.skillLogicalParams = []
            }
            this.skillLogicalParams = []
            for (var i = 0; i < tempArr.length; i++) {

                if (!this.skillLogicalParams[i]) {
                    this.skillLogicalParams[i] = [];
                }
                var temp = tempArr[i];
                for (var s = 0; s < temp.length; s++) {
                    this.skillLogicalParams[i][s] = this.getSkillValue(temp[s], tagStr)
                }
            }
        }


    }







}
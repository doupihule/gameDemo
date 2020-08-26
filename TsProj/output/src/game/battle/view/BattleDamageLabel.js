"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleConst_1 = require("../../sys/consts/BattleConst");
const BigNumUtils_1 = require("../../../framework/utils/BigNumUtils");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
/**
 * 战斗伤害数字类
 * 超过100000后就按照大数显示
 */
class BattleDamageLabel extends Laya.Sprite {
    constructor() {
        super();
        this._childLabels = [];
    }
    //设置数据    kind 类型 治疗,伤害,护盾.爆伤,暴击治 value一定是正的. 根据需要拿
    setValue(kind, value) {
        //如果数据一致 就不需要重算了 提升性能
        if (this._currentValue == value) {
            return;
        }
        this.kind = kind;
        this._cfgs = BattleDamageLabel._labelCfgs[kind];
        var cfg = this._cfgs;
        var scale = cfg.scale || 1;
        this.scale(scale, scale);
        this._baseUrl = "uisource/txt/txt/battle_txt_" + this._cfgs.name;
        if (kind == BattleConst_1.default.effect_label_miss) {
            this._headLabel = this.updateLabel("", 0, 0, this._headLabel);
            //miss特殊处理. 居中对其坐标为0
            this._headLabel.anchorX = 0.5;
        }
        else {
            if (value < 1) {
                value = 1;
            }
            var headWid = cfg.head || 0;
            //计算总宽度 如果大于100W的伤害按照大数去存
            //数字字符部分 
            var strValue = String(value);
            var tempStr = strValue;
            //每个数字宽度
            var perWid = cfg.w;
            var fuhaoWid = cfg.fuhao && perWid || 0;
            var nums = 6;
            //数字部分的宽度
            var numsWidth;
            var perSourceWid = cfg.sw;
            //大数符号数量 
            var bigNums = 0;
            //大数部分宽度
            var bigWid = 0;
            var compareValue = "1000";
            var bigValue;
            if (value < 100000) {
                nums = strValue.length;
                numsWidth = nums * perWid;
                bigValue = "";
            }
            else {
                var index = 1;
                while (BigNumUtils_1.default.compare(BigNumUtils_1.default.devide(tempStr, compareValue), compareValue)) {
                    index++;
                    tempStr = BigNumUtils_1.default.devide(tempStr, "1000");
                }
                var reducedUnitArr = BattleFunc_1.default.reducedUnitArr;
                if (index > reducedUnitArr.length - 1) {
                    index = reducedUnitArr.length - 1;
                }
                bigValue = reducedUnitArr[index - 1];
                strValue = BigNumUtils_1.default.devide(value, BigNumUtils_1.default.pow(1000, index), 0);
                numsWidth = tempStr.length * perWid;
                bigNums = 1;
            }
            bigWid = bigNums * perSourceWid;
            //计算总宽度 
            var totalWid = headWid + fuhaoWid + numsWidth + bigWid;
            //半宽
            var halfTotalWid = totalWid / 2 + fuhaoWid;
            var startPos = 0;
            //开始排布了
            if (headWid) {
                this._headLabel = this.updateLabel("", startPos - halfTotalWid, 0, this._headLabel);
                startPos += headWid;
            }
            //如果有符号
            if (fuhaoWid) {
                this._fuhaoLabel = this.updateLabel(this._cfgs.fuhao, startPos - halfTotalWid, 0, this._fuhaoLabel);
                startPos += perWid;
            }
            else {
                if (this._fuhaoLabel) {
                    this._fuhaoLabel.visible = false;
                }
            }
            //遍历数字
            for (var s = 0; s < strValue.length; s++) {
                this._childLabels[s] = this.updateLabel(strValue.slice(s, s + 1), startPos - halfTotalWid, 0, this._childLabels[s]);
                startPos += perWid;
            }
            //隐藏其他数字
            for (var s = strValue.length; s < this._childLabels.length; s++) {
                this._childLabels[s].visible = false;
            }
            //大数符号数字
            if (bigNums > 0) {
                this._bigStrLabel = this.updateLabel(bigValue.toLowerCase(), startPos - halfTotalWid, 0, this._bigStrLabel);
            }
            else {
                if (this._bigStrLabel) {
                    this._bigStrLabel.visible = false;
                }
            }
        }
    }
    //传入key 
    updateLabel(key, x, y, label) {
        if (!label) {
            label = new Laya.Image();
            label.anchorX = 0;
            label.anchorY = 0.5;
            this.addChild(label);
        }
        else {
            label.visible = true;
        }
        if (key == "") {
            label.skin = this._baseUrl + ".png";
        }
        else {
            label.skin = this._baseUrl + "_" + key + ".png";
        }
        label.x = x;
        label.y = y;
        return label;
    }
}
exports.default = BattleDamageLabel;
//w:0-9数字宽度,head:暴击字宽度,sw:原始图片宽度,主要针对大数符号,sh:原始高度,fuhao:符号对应的图片名
BattleDamageLabel._labelCfgs = {
    [BattleConst_1.default.effect_label_dmg]: { w: 13, sw: 30, sh: 20, fuhao: "jian", name: "putong", scale: 1.5 },
    [BattleConst_1.default.effect_label_crit]: { w: 15, head: 35, sw: 30, sh: 18, fuhao: "jian", name: "baoji", scale: 1.5 },
    [BattleConst_1.default.effect_label_trit]: { w: 13, sw: 30, sh: 20, fuhao: "jia", name: "zhiliao", scale: 1.5 },
    [BattleConst_1.default.effect_label_tritCrit]: { w: 13, sw: 30, sh: 20, fuhao: "jia", name: "zhiliao", scale: 1.8 },
    [BattleConst_1.default.effect_label_hudun]: { w: 13, sw: 30, sh: 20, fuhao: "jian", name: "putong", scale: 1 },
    [BattleConst_1.default.effect_label_miss]: { name: "miss" },
};
//# sourceMappingURL=BattleDamageLabel.js.map
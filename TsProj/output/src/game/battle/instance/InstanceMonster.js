"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceLogical_1 = require("./InstanceLogical");
const BattleConst_1 = require("../../sys/consts/BattleConst");
class InstanceMonster extends InstanceLogical_1.default {
    constructor(controler) {
        super(controler);
        this._changeTrackCd = 0;
        //是否是睡眠状态
        this._isSleep = false;
        //ai翻滚的帧数
        this._aiFlyFrame = 0;
        this.isAutoSKill = true;
        this.classModel = BattleConst_1.default.model_monster;
        this._goldTweenParams = {};
    }
    //设置存活时间
    setLiveFrame(value) {
        this._liveFrame = value;
        if (this._liveFrame > 0) {
            this.controler.setCallBack(this._liveFrame, this.doDiedLogical, this);
        }
    }
}
exports.default = InstanceMonster;
InstanceMonster._tempPos = new Laya.Point();
//# sourceMappingURL=InstanceMonster.js.map
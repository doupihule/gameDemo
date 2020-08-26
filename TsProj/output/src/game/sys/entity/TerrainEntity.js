"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleFunc_1 = require("../func/BattleFunc");
const LogsManager_1 = require("../../../framework/manager/LogsManager");
const BattleConst_1 = require("../consts/BattleConst");
class TerrainEntity {
    constructor(terrcfg, index, lastEntity, startAngle) {
        this.type = terrcfg.type || BattleConst_1.default.TERRAIN_LINE;
        var type = this.type;
        this.index = index;
        if (index == 0) {
            this.startPos = new Laya.Vector3();
            this.startAng = startAngle;
            this.startStep = 0;
        }
        else {
            this.startAng = lastEntity.endAng;
            this.startPos = lastEntity.endPos;
            this.startStep = lastEntity.endStep;
        }
        // 
        if (type == BattleConst_1.default.TERRAIN_LINE) {
            this.length = terrcfg.length / 10000;
            this.endAng = this.startAng;
            this.area = 0;
            this._cosAngValue = Math.cos(this.startAng);
            this._sinAngValue = Math.sin(this.startAng);
            this._cosPlumAngValue = Math.cos(this.startAng + BattleFunc_1.default.halfpi);
            this._sinPlumAngValue = Math.sin(this.startAng + BattleFunc_1.default.halfpi);
        }
        else {
            var r = terrcfg.radio / 10000;
            var area = terrcfg.area * BattleFunc_1.default.angletoRad;
            this.area = area;
            this.length = r * area;
            this.r = r;
            this.endAng = this.startAng + area * type;
        }
        this.endStep = this.startStep + this.length;
        if (this.type == BattleConst_1.default.TERRAIN_LINE) {
            this.getPosByLength = this.getPosByLineLength;
        }
        else {
            //计算圆心
            this.centerCircle = new Laya.Vector3();
            this.centerCircle.z = this.startPos.z + this.r * Math.cos(this.startAng + BattleFunc_1.default.halfpi * this.type);
            this.centerCircle.x = this.startPos.x + this.r * Math.sin(this.startAng + BattleFunc_1.default.halfpi * this.type);
            //把起点角度转化成相对于圆心的角度
            this._turnStartAng = this.startAng - BattleFunc_1.default.halfpi * this.type;
            this.getPosByLength = this.getPosByCircle;
        }
        this.endPos = new Laya.Vector3();
        //计算终点坐标
        this.getPosByLength(this.endStep, this.endPos);
    }
    //根据位置获取角度
    getAngleByStep(step) {
        if (this.type == BattleConst_1.default.TERRAIN_LINE) {
            return this.startAng;
        }
        var through = step - this.startStep;
        var ang = through / this.length * this.area;
        return this.startAng + ang * this.type;
    }
    //获取直线坐标
    getPosByLineLength(length, outp, trackValue = 0) {
        var through = length - this.startStep;
        // if (through < 0 || length > this.endStep) {
        //     LogsManager.errorTag("battle", "传入的length 小于起始位置或者高于终止位置", length, "index:", this.index);
        //     return;
        // }
        //因为算坐标是每帧都需要机型的大量浮点运算.所以能缓存的值 尽量缓存.
        outp.z = through * this._cosAngValue + this.startPos.z;
        outp.x = through * this._sinAngValue + this.startPos.x;
        if (trackValue != 0) {
            outp.z += trackValue * this._cosPlumAngValue;
            outp.x += trackValue * this._sinPlumAngValue;
        }
    }
    //根据距离获取对应的坐标
    getPosByCircle(length, outp, trackValue = 0) {
        //在这个弯道上经过的距离
        var through = length - this.startStep;
        if (through < 0 || length > this.endStep) {
            LogsManager_1.default.errorTag("battle", "传入的length 小于起始位置或者高于终止位置", length, "index:", this.index);
            return;
        }
        var ang = through / this.r;
        var targetAng = this._turnStartAng + ang * this.type;
        outp.z = this.centerCircle.z + this.r * Math.cos(targetAng);
        outp.x = this.centerCircle.x + this.r * Math.sin(targetAng);
        if (trackValue != 0) {
            var trackAng = this.startAng + ang * this.type + BattleFunc_1.default.halfpi;
            outp.z += trackValue * Math.cos(trackAng);
            outp.x += trackValue * Math.sin(trackAng);
        }
    }
}
exports.default = TerrainEntity;
//# sourceMappingURL=TerrainEntity.js.map
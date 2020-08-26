"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FogInstanceMove_1 = require("../../fog/instance/FogInstanceMove");
/**
 * 游戏中所有可以运动的对象的基类
 * 如果需要对instance的view进行拖拽, 那么需要在onTouchMove里面 改变的应该是 this.pos.x 而不能直接去设置myview.x,myView.y
 * 禁止在任何地址直接设置myView的坐标
 */
class ChapterInstanceMove extends FogInstanceMove_1.default {
    constructor(controler) {
        super(controler);
        this.moveCount = 0;
        this.speed = new Laya.Vector3();
        this.addSpeed = new Laya.Vector3();
        this.unitVector = new Laya.Vector3();
    }
    //判断是否到达终点
    checkMoveEnd() {
        if (this.movePointType == FogInstanceMove_1.default.moveType_none) {
            return;
        }
        //如果是做缓动行为的
        if (this.movePointType == FogInstanceMove_1.default.moveType_tween) {
            this.pos.x = this.x;
            this.pos.y = this.y;
            return;
        }
        this._moveParams.moveFrame++;
        var speedRadio = this._moveParams.getSpeedRadio();
        //根据moveParams 实时刷新速度
        this.speed.x = this._moveParams.initSpeed.x * speedRadio;
        this.speed.y = this._moveParams.initSpeed.y * speedRadio;
        this.speed.z = this._moveParams.initSpeed.z * speedRadio;
        var distance = Laya.Vector3.distance(this._moveParams.target, this.pos);
        var speedAbs = Laya.Vector3.scalarLength(this.speed);
        //如果距离小于一个速度绝对值 那么判定到达
        var whetherEnd = false;
        //如果有下一个点 则运动到这个点的位置开始向下个点移动
        if (!this.moveCount && distance < speedAbs) {
            this.moveCount += 1;
            whetherEnd = true;
        }
        else if (this.moveCount && distance < this.fogControler.distance) {
            //如果没有下个点 就移动到这个点前方100像素
            whetherEnd = true;
        }
        if (whetherEnd) {
            if (this.movePointType == FogInstanceMove_1.default.moveType_onePoint) {
                this.overFinalPoint();
            }
            else {
                var param = this._multyparams.getNextpos();
                //如果没有给返回值,直接到达终点
                if (!param) {
                    this.overFinalPoint();
                }
                else {
                    this.onArriveOnePoint();
                    // this._moveParams = param;
                    //重新开始运动到下一个点
                    this.moveToOnePointByEntity(param, FogInstanceMove_1.default.moveType_multyPoint, this._multyparams.isGrid);
                }
            }
        }
        else {
        }
    }
}
exports.default = ChapterInstanceMove;
//# sourceMappingURL=ChapterInstanceMove.js.map
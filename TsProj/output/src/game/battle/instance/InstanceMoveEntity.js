"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InstanceMoveEntity {
    constructor(target, spd = 0, callFunc = null, thisObj = null, expandParams = null) {
        //按照帧给的速度绝对值,到时会把速度根据运动方向分配给x和y速度.游戏中尽量禁止使用tween动画. 
        this.spd = 0;
        //当前运动的帧数通过这个 好判断是否需要更新速度 比如算曲线运动或者 复杂的扩展运动 这个是时间单位
        this.moveFrame = 0;
        //预期运动的总帧数,需要通过计算赋值
        this.totalFrame = 0;
        this.isGrid = false;
        this.target = target;
        this.spd = spd;
        this.callFunc = callFunc;
        this.thisObj = thisObj;
        this.expandParams = expandParams;
        this.offsetPos = new Laya.Vector3();
        this.initSpeed = new Laya.Vector3();
    }
    //初始化数据
    initData() {
    }
    //更新目标坐标  当是跟随运动目标的时候 需要动态调整
    updateTargetPos() {
        if (!this.followTarget) {
            return;
        }
        this.target.x = this.followTarget.pos.x + this.offsetPos.x;
        this.target.y = this.followTarget.pos.y + this.offsetPos.y;
        this.target.z = this.followTarget.pos.z + this.offsetPos.z;
    }
    //根据运动时间获取速度快慢 百分比系数. 默认返回1 后面根据需要 返回
    //如果想先快后慢 或者 先慢后快  可以在expandParams 自行定义参数.
    getSpeedRadio() {
        if (this.totalFrame <= 0) {
            return 1;
        }
        //目前是给匀减速运动
        var raidio = 1.5 - this.moveFrame / this.totalFrame;
        if (raidio < 0.5) {
            raidio = 0.5;
        }
        // raidio  =Math.sin( this.moveFrame/this.totalFrame ) *1.2;
        return 1;
    }
    //重置
    //销毁
    dispose() {
        this.callFunc = null;
        this.thisObj = null;
        this.target = null;
        this.expandParams = null;
        this.moveFrame = 0;
        this.totalFrame = 0;
    }
    //重置 目前和做销毁是同一件事
    reset() {
        this.callFunc = null;
        this.thisObj = null;
        this.expandParams = null;
        this.moveFrame = 0;
        this.totalFrame = 0;
    }
}
exports.default = InstanceMoveEntity;
//# sourceMappingURL=InstanceMoveEntity.js.map
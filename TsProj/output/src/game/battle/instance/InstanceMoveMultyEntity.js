"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InstanceMoveEntity_1 = require("./InstanceMoveEntity");
class InstanceMoveMultyEntity {
    constructor() {
        /**
         * 多点运动对象
         *
         */
        this.currentStep = 0; //当前运动到的点的位置,
        this.isGrid = false; //是否是按照网格点
        this.currentLoopIndex = 0;
    }
    /**
     * @loopParams 默认为空
     * 	@@ loopNums = 0 表示无线循环 ,对应的loopNums表示单程循环次数
     */
    initData(pointArr, speed = 0, callFunc = null, thisObj = null, loopParams = null, isGrid = false) {
        this.pointArr = pointArr;
        this.spd = speed;
        this.callFunc = callFunc;
        this.thisObj = thisObj;
        this.totalStep = this.pointArr.length;
        this.currentEntity = new InstanceMoveEntity_1.default(pointArr[1], speed);
        this.loopParams = loopParams;
        this.isGrid = isGrid;
        this.currentStep = 0;
    }
    getNextpos() {
        this.currentStep += 1;
        if (this.loopParams) {
            return this.getLoopPos();
        }
        //如果到达了 那么返回空
        if (this.currentStep == this.totalStep + 1) {
            //后面扩展循环运动,.
            return null;
        }
        this.currentEntity.target = this.pointArr[this.currentStep - 1];
        if (this.expandParams && this.expandParams.length > 0) {
            if (this.expandParams.length == 1) {
                this.currentEntity.expandParams = this.expandParams[0];
            }
            else {
                this.currentEntity.expandParams = this.expandParams[this.currentStep - 1];
            }
        }
        return this.currentEntity;
    }
    //获取循环方式获得的坐标
    getLoopPos() {
        var roundNum = Math.floor(this.currentStep / this.totalStep);
        var pos = this.currentStep % this.totalStep;
        //如果是单线
        if (roundNum % 2 == 0) {
            this.currentEntity.target = this.pointArr[pos];
        }
        else {
            this.currentEntity.target = this.pointArr[this.totalStep - pos - 1];
        }
        return this.currentEntity;
    }
    //销毁
    dispose() {
        this.currentEntity = null;
        this.callFunc = null;
        this.thisObj = null;
    }
}
exports.default = InstanceMoveMultyEntity;
//# sourceMappingURL=InstanceMoveMultyEntity.js.map
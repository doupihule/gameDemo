"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BattleConst_1 = require("../../sys/consts/BattleConst");
/**
 * 战斗缓存行为控制器
 *
 */
class BattleTweenControler {
    constructor(controler) {
        this.controler = controler;
        this._tweenInfoMap = [];
    }
    setData() {
        this._tweenInfoMap = [];
    }
    //由主控制器 控制
    updateFrame() {
        for (var i = this._tweenInfoMap.length - 1; i >= 0; i--) {
            var info = this._tweenInfoMap[i];
            var isEnd = this.updateOneTween(info);
            if (isEnd) {
                this._tweenInfoMap.splice(i, 1);
            }
        }
    }
    //更新一个tween
    updateOneTween(tweenInfo) {
        var type = tweenInfo.type;
        tweenInfo.frame++;
        var ratio = tweenInfo.frame / tweenInfo.totalFrame;
        var mode = tweenInfo.mode;
        //暂时给匀速运动
        var startParams = tweenInfo.startParams;
        var targetParams = tweenInfo.targetParams;
        var disParams = tweenInfo.disParams;
        var instance = tweenInfo.instance;
        //如果是有运动行为的
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_MOVE)) {
            var targetx, targety, targetz;
            if (mode == 1) {
                disParams.x == 0 ? targetx = instance.pos.x : targetx = startParams.x + disParams.x * ratio;
                disParams.y == 0 ? targety = instance.pos.y : targety = startParams.y + disParams.y * ratio;
                disParams.z == 0 ? targetz = instance.pos.z : targetz = startParams.z + disParams.z * ratio;
                instance.setPos(targetx, targety, targetz);
            }
            else {
                disParams.x == 0 ? targetx = instance.x : instance.x = startParams.x + disParams.x * ratio;
                disParams.y == 0 ? targety = instance.y : instance.y = startParams.y + disParams.y * ratio;
            }
        }
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_ROTATE)) {
            var rx, ry, rz;
            if (mode == 1) {
                disParams.r == 0 ? false : instance.setRotation(startParams.r + disParams.r * ratio);
            }
            else {
                disParams.r == 0 ? false : instance.rotation = (startParams.r + disParams.r * ratio);
            }
        }
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_SCALE)) {
            var scale = startParams.s + disParams.s * ratio;
            if (mode == 1) {
                instance.setViewScale(scale);
            }
            else {
                instance.scale(scale, scale);
            }
        }
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_ALPHA)) {
            var value = startParams.a + disParams.a * ratio;
            if (mode == 1) {
                instance.setViewAlpha(value);
            }
            else {
                instance.alpha = value;
            }
        }
        //如果到达最后一帧了
        if (tweenInfo.frame == tweenInfo.totalFrame) {
            if (tweenInfo.callBack) {
                tweenInfo.callBack.call(tweenInfo.thisObj, tweenInfo.callParams);
            }
            return true;
        }
        return false;
    }
    //设置一个缓动信息
    /**
     *
     * @param frame 运动时间
     * @param targetParams:  {x:1,y:1,z:1,s:1,rx:1,ry:1,rz:1};
     * x,y,z 必须同时配,  rx,ry,rz 也必须同时配
     */
    setOneTween(frame, instance, targetParams, type, callBack = null, thisObj = null, callBackParams = null) {
        this.clearOneTween(instance);
        var startParams = {
            x: instance.pos.x, y: instance.pos.y, z: instance.pos.z, s: instance.viewScale,
            r: instance._myView.rotation, a: instance.getView().alpha
        };
        var disParams = {};
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_MOVE)) {
            disParams.x = this.adjustNumber(targetParams.x - startParams.x);
            disParams.y = this.adjustNumber(targetParams.y - startParams.y);
            disParams.z = this.adjustNumber(targetParams.z - startParams.z);
        }
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_ROTATE)) {
            disParams.r = this.adjustNumber(targetParams.r - startParams.r);
        }
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_SCALE)) {
            disParams.s = targetParams.s - startParams.s;
        }
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_ALPHA)) {
            disParams.a = targetParams.a - startParams.a;
        }
        var tweenInfo = {
            startParams: startParams,
            targetParams: targetParams,
            type: type,
            callBack: callBack,
            thisObj: thisObj,
            callParams: callBackParams,
            instance: instance,
            frame: 0,
            totalFrame: frame,
            disParams: disParams,
            mode: 1,
        };
        this._tweenInfoMap.push(tweenInfo);
    }
    //直接对view设置一个tween
    setTweenByView(frame, view, targetParams, type, callBack = null, thisObj = null, callBackParams = null) {
        this.clearOneTween(view);
        var startParams = {
            x: view.x, y: view.y, s: view.scale,
            r: view.rotation, a: view.alpha
        };
        var disParams = {};
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_MOVE)) {
            disParams.x = this.adjustNumber(targetParams.x - startParams.x);
            disParams.y = this.adjustNumber(targetParams.y - startParams.y);
            disParams.z = this.adjustNumber(targetParams.z - startParams.z);
        }
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_ROTATE)) {
            disParams.r = this.adjustNumber(targetParams.r - startParams.r);
        }
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_SCALE)) {
            disParams.s = targetParams.s - startParams.s;
        }
        if (this.checkHasType(type, BattleConst_1.default.TWEEN_ALPHA)) {
            disParams.a = targetParams.a - startParams.a;
        }
        var tweenInfo = {
            startParams: startParams,
            targetParams: targetParams,
            type: type,
            callBack: callBack,
            thisObj: thisObj,
            callParams: callBackParams,
            instance: view,
            frame: 0,
            totalFrame: frame,
            disParams: disParams,
            mode: 2,
        };
        this._tweenInfoMap.push(tweenInfo);
    }
    //销毁一个tween
    clearOneTween(instance) {
        for (var i = this._tweenInfoMap.length - 1; i >= 0; i--) {
            var info = this._tweenInfoMap[i];
            if (info.instance == instance) {
                //移除这个tween
                this._tweenInfoMap.splice(i, 1);
            }
        }
    }
    //判断是否有某一个类型
    checkHasType(bit, type) {
        return (bit & type) != 0;
    }
    //对number 进行接近0的判断
    adjustNumber(value) {
        if (Math.abs(value) < 0.001) {
            return 0;
        }
        return value;
    }
    // 销毁所有的tween对象
    dispose() {
        for (var i = this._tweenInfoMap.length - 1; i >= 0; i--) {
            var info = this._tweenInfoMap[i];
            //立马做一次回调
            if (info.callBack) {
                info.callBack.call(info.thisObj, info.callParams);
            }
        }
    }
}
exports.default = BattleTweenControler;
//# sourceMappingURL=BattleTweenControler.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Equation_1 = require("../../../framework/utils/Equation");
const ScreenAdapterTools_1 = require("../../../framework/utils/ScreenAdapterTools");
/**
 * 战斗中的镜头控制器.
 * 控制镜头移动.震屏等
 *
 *
 */
class CameraControler {
    constructor(controler) {
        //震屏相关参数   
        this.shakeFrame = 0;
        this.shakeStyle = 0; //震屏样式 x,y,xy
        this.shakeIntervel = 2; //震屏频率 
        this._followOffset = -50;
        this._halfWidth = 0;
        this._isPosChange = false;
        /**我方最前边的x */
        this.frontPos1 = 0;
        /**正在控制背景 */
        this.inControlBg = false;
        this.controler = controler;
        this._halfWidth = ScreenAdapterTools_1.default.designWidth / 2;
        this.focusPos = new Laya.Vector3(this._halfWidth, 0, 0);
        this.frontPos1 = 0;
        this._shakeParams = { frame: 0, style: 1, strength: 1, intervel: 1, x: 0, y: 0 };
    }
    //初始化数据
    setData() {
        this.focusPos.x = this._halfWidth;
    }
    //刷新函数
    updateFrame() {
        this._isPosChange = false;
        this.updateShake();
        this.followPlayer();
        if (this._isPosChange || this.inControlBg) {
            this.updateCtnPos();
        }
    }
    //更新容器坐标
    updateCtnPos(tweenFrame = 0.1) {
        var targetPos = this._halfWidth - this.focusPos.x;
        targetPos += this._shakeParams.x;
        if (targetPos > 0) {
            targetPos = 0;
        }
        if (targetPos < this.controler.layerControler.minX) {
            targetPos = this.controler.layerControler.minX;
        }
        var pos = Equation_1.default.easyToTargetPos(targetPos, this.controler.layerControler.a2.x, tweenFrame, 5);
        this.updateScenePos(pos);
    }
    updateScenePos(pos) {
        var targetPos = this.controler.layerControler.a2.x + pos;
        if (targetPos > 0) {
            targetPos = 0;
        }
        if (targetPos < this.controler.layerControler.minX) {
            targetPos = this.controler.layerControler.minX;
        }
        var move = targetPos - this.controler.layerControler.a2.x;
        this.controler.layerControler.a2.x = targetPos;
        this.controler.layerControler.a2.y = this._shakeParams.y;
        this.controler.mapControler.onMapMove(this._shakeParams.y, move);
        this.controler.battleUI.freshSmallMap(-pos / this.controler.layerControler.sceneWidthRate);
    }
    //看向player
    followPlayer() {
        if (this.controler.layerControler.isInTouch)
            return;
        if (!this.controler.battleUI.isAllowFollw)
            return;
        if (!this.controler.battleUI.isUseCamera)
            return;
        this.frontPos1 = this.controler.frontPos1;
        var frontPos1 = this.frontPos1 + this._followOffset;
        //最前面的坐标超过了最大宽度-正常显示宽度的一半
        if (frontPos1 > this.controler.mapControler._maxSceneWidth - this._halfWidth) {
            return;
        }
        this.focusPos.x = frontPos1;
        this._isPosChange = true;
    }
    updateShake() {
        if (this._shakeParams.frame == 0) {
            return;
        }
        //更新震动参数
        this.updateShakeParams(this._shakeParams);
        this._isPosChange = true;
    }
    //震动摄像机 震动时长,  震动方式,style:1 (只x方向震动),2(只y方向震动),其他(xy方向同时震动),strength: 振幅 像素 intervel震动间隔 默认2帧减一次
    shakeCamera(shakeFrame, style = 1, strength = 3, intervel = 2) {
        this._shakeParams.frame = shakeFrame;
        this._shakeParams.style = style;
        this._shakeParams.strength = strength;
        this._shakeParams.intervel = intervel;
    }
    //按照参数震屏
    // 震屏参数, 延迟时间,震屏方式,持续时间,震屏力度,震屏频率 
    shakeCameraByParams(params) {
        var frame = Number(params[3]);
        this.shakeCamera(frame, Number(params[2]), Number(params[4]), Number(params[5]));
    }
    //更新晃动参数. 角色晃动和摄像机缓动走同一套逻辑
    updateShakeParams(shakeParams) {
        if (shakeParams.frame <= 0) {
            return;
        }
        var frame = shakeParams.frame;
        shakeParams.frame--;
        var style = shakeParams.style;
        var shakeWay;
        var index = Math.ceil(frame / shakeParams.intervel);
        var yushu = frame % shakeParams.intervel;
        if (yushu != 0 && frame > 1) {
            return;
        }
        if (index % 2 == 1) {
            shakeWay = 1;
        }
        else {
            shakeWay = -1;
        }
        //把像素转化成米
        var shakeValue = shakeParams.strength * shakeWay;
        var x = 0;
        var y = 0;
        //如果为0了 那么就会把偏移量还原
        if (frame > 1) {
            if (style == 1) {
                x = shakeValue;
            }
            else if (style == 2) {
                y = shakeValue;
            }
            else {
                x = shakeValue;
                y = shakeValue;
            }
        }
        shakeParams.x = x;
        shakeParams.y = y;
    }
    dispose() {
        this.controler = null;
    }
}
exports.default = CameraControler;
//# sourceMappingURL=CameraControler.js.map
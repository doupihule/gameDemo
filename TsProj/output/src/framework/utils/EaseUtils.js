"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EaseUtils {
    /**
     * 为组件注册拖拽事件
     * @param thisObj 函数回调的this
     * @param onPosChangeFunc 拖动/惯性移动时回调
     * @param onEaseEndFunc 惯性移动结束时回调
     * @param easeNum 缓动系数，越高惯性越大，拖拽结束后持续移动距离越长
     * @param touchObject 拖拽操作触发组件，一般与执行组件一致
     */
    constructor(touchObject, onPosChangeFunc, onEaseEndFunc, easeNum = 0.75, thisObj = null, onClickFunc = null, onGloablEndFunc = null, onMovedFunc = null, onTouchDownFunc = null, onTwoMovedFunc = null, onTwoTouchDownFunc = null) {
        this._easeObject = null;
        this._touchObject = null;
        this._startX = 0;
        this._startY = 0;
        this._start2X = 0;
        this._start2Y = 0;
        this._easeNum = 0;
        this._disX = 0;
        this._disY = 0;
        this._speedX = 0;
        this._speedY = 0;
        this._isDragMoved = false;
        //是否缓动按下了
        this._isDragDown = false;
        this._originX = 0;
        this._originY = 0;
        this._origin2X = 0;
        this._origin2Y = 0;
        this._moveStart = false;
        this._easeObject = thisObj;
        this._onPosChangeFunc = onPosChangeFunc;
        this._onEaseEndFunc = onEaseEndFunc;
        this._easeNum = easeNum;
        this._touchObject = touchObject;
        this._onClickFunc = onClickFunc;
        this._onGloablEndFunc = onGloablEndFunc;
        this._onMovedFunc = onMovedFunc;
        this._onTouchDownFunc = onTouchDownFunc;
        this._onTwoMovedFunc = onTwoMovedFunc;
        this._onTwoTouchDownFunc = onTwoTouchDownFunc;
        this._touchObject.on(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
        // this._touchObject.loadImage("uisource/common/login_box.png");
        this._touchObject.on(Laya.Event.MOUSE_MOVE, this, this.touchMoveHandler);
        this._touchObject.on(Laya.Event.MOUSE_UP, this, this.touchEndHandler);
        this._touchObject.on(Laya.Event.MOUSE_OUT, this, this.touchEndHandler);
        this._touchObject.mouseEnabled = true;
        // this._touchObject.addEventListener(Laya.Event.TOUCH_TAP,this.onTouchTap,this);
    }
    onTouchTap(event) {
        if (this._onClickFunc) {
            this._onClickFunc.call(this._easeObject, event.stageX, event.stageY);
        }
    }
    touchBeginHandler(event) {
        if (event.touches.length > 1) {
            this._originX = event.touches[0].stageX;
            this._originY = event.touches[0].stageY;
            this._startX = event.touches[0].stageX;
            this._startY = event.touches[0].stageY;
            this._origin2X = event.touches[1].stageX;
            this._origin2Y = event.touches[1].stageY;
            this._start2X = event.touches[1].stageX;
            this._start2Y = event.touches[1].stageY;
            this._isDragDown = true;
            this._isDragMoved = false;
            this.stopEase();
            if (this._onTwoTouchDownFunc) {
                this._onTwoTouchDownFunc.call(this._easeObject, event.touches[0].stageX, event.touches[0].stageY, event.touches[1].stageX, event.touches[1].stageY);
            }
            this._touchObject.off(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
        }
        else {
            this._originX = event.stageX;
            this._originY = event.stageY;
            this._startX = event.stageX;
            this._startY = event.stageY;
            this._isDragDown = true;
            this._isDragMoved = false;
            this.stopEase();
            if (this._onTouchDownFunc) {
                this._onTouchDownFunc.call(this._easeObject, event.stageX, event.stageY);
            }
            this._touchObject.off(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
        }
    }
    touchMoveHandler(event) {
        //如果没有按下的 那么不相应move事件
        if (event.touches.length > 1) {
            if (!this._isDragDown) {
                return;
            }
            if (!this._moveStart)
                if (Math.pow(event.stageX - this._originX, 2) + Math.pow(event.stageY - this._originY, 2) >= 900) {
                    this._moveStart = true;
                }
            if (!this._moveStart)
                return;
            var disX = event.touches[0].stageX - this._startX;
            var disY = event.touches[0].stageY - this._startY;
            var dis2X = event.touches[1].stageX - this._start2X;
            var dis2Y = event.touches[1].stageY - this._start2Y;
            this._speedX = 0;
            this._speedY = 0;
            this._onPosChangeFunc.call(this._easeObject, disX, disY, event.touches[0].stageX, event.touches[0].stageY, dis2X, dis2Y, event.touches[1].stageX, event.touches[1].stageY);
            this._startX = event.touches[0].stageX;
            this._startY = event.touches[0].stageY;
            this._start2X = event.touches[1].stageX;
            this._start2Y = event.touches[1].stageY;
            if (this._onMovedFunc) {
                this._onMovedFunc.call(this._easeObject, event.stageX, event.stageY);
            }
            this._isDragMoved = true;
        }
        else {
            if (!this._isDragDown) {
                return;
            }
            if (!this._moveStart)
                if (Math.pow(event.stageX - this._originX, 2) + Math.pow(event.stageY - this._originY, 2) >= 900) {
                    this._moveStart = true;
                }
            if (!this._moveStart)
                return;
            var disX = event.stageX - this._startX;
            var disY = event.stageY - this._startY;
            this._speedX = disX;
            this._speedY = disY;
            this._onPosChangeFunc.call(this._easeObject, disX, disY, event.stageX, event.stageY);
            this._startX = event.stageX;
            this._startY = event.stageY;
            if (this._onMovedFunc) {
                this._onMovedFunc.call(this._easeObject, event.stageX, event.stageY);
            }
            this._isDragMoved = true;
        }
    }
    touchEndHandler(event) {
        if (this._onClickFunc && event.type == "mouseup") {
            //只有在不移动的情况下 才会执行moveStart
            if (!this._moveStart) {
                this._onClickFunc.call(this._easeObject, event.stageX, event.stageY);
            }
        }
        this._isDragDown = false;
        this._moveStart = false;
        var disX = event.stageX - this._startX;
        var disY = event.stageY - this._startY;
        console.log(disX + " " + event.stageX + " " + this._startX + " " + disY + " " + event.stageY + " " + this._startY + " ");
        this._startX = event.stageX;
        this._startY = event.stageY;
        if (this._isDragMoved) {
            this.startEase(this._speedX, this._speedY);
        }
        else if (this._onEaseEndFunc) {
            this._onEaseEndFunc.call(this._easeObject, 0, 0);
        }
        if (this._onGloablEndFunc) {
            this._onGloablEndFunc.call(this._easeObject, event.stageX, event.stageY);
        }
        this._isDragMoved = false;
        console.log(event.type);
        this._touchObject.on(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
    }
    startEase(x, y) {
        Laya.timer.frameLoop(1, this, this.onEase);
        // egret.startTick(this.onEase, this)
    }
    onEase() {
        this._speedX = this._speedX * this._easeNum;
        this._speedY = this._speedY * this._easeNum;
        if (Math.abs(this._speedX) <= 1 && Math.abs(this._speedY) <= 1) {
            this._speedX = 0;
            this._speedY = 0;
            this.stopEase();
            if (this._onEaseEndFunc) {
                this._onEaseEndFunc.call(this._easeObject, 0, 0);
            }
        }
        var func;
        this._onPosChangeFunc.call(this._easeObject, this._speedX, this._speedY);
        return false;
    }
    stopEase() {
        Laya.timer.clear(this, this.onEase);
        // egret.stopTick(this.onEase, this);
    }
    dispose() {
        this._touchObject.off(Laya.Event.MOUSE_DOWN, this, this.touchBeginHandler);
        this._touchObject.off(Laya.Event.MOUSE_MOVE, this, this.touchMoveHandler);
        this._touchObject.off(Laya.Event.MOUSE_UP, this, this.touchEndHandler);
        this._touchObject.off(Laya.Event.MOUSE_OUT, this, this.touchEndHandler);
        // this._touchObject.removeEventListener(Laya.Event.TOUCH_TAP, this.onTouchTap, this);
    }
}
exports.default = EaseUtils;
//# sourceMappingURL=EaseUtils.js.map
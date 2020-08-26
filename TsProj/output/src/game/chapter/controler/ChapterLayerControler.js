"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterLayerControler = void 0;
const TimerManager_1 = require("../../../framework/manager/TimerManager");
class ChapterLayerControler {
    constructor(controler, rootCtn) {
        this.minY = 0;
        this.maxHeight = 1400;
        //展示的总长度
        this.showHeight = 1400 * 3;
        this.isInTouch = false;
        this.timeCode = 0;
        this.controler = controler;
        this.rootCtn = rootCtn;
        this.a = new Laya.Sprite();
        this.a1 = new Laya.Sprite();
        this.a2 = new Laya.Sprite();
        this.a21 = new Laya.Sprite();
        rootCtn.addChild(this.a);
        this.a.addChild(this.a1);
        this.a.addChild(this.a2);
        this.a2.addChild(this.a21);
    }
    setMinY(y) {
        this.minY = y;
    }
    onTouchBegin(event) {
        this._startTouchY = event.stageY;
        TimerManager_1.default.instance.clearTimeout(this.timeCode);
        this.isInTouch = true;
        this.controler.chapterCameraControler.inControlBg = false;
    }
    onTouchMove(event) {
        if (!this._startTouchY)
            return;
        var tempPos = this.controler.chapterCameraControler.focusPos.y + (this._startTouchY - event.stageY);
        tempPos = this.getTweenEndPos(tempPos);
        this.controler.chapterCameraControler.focusPos.y = tempPos;
        this.controler.chapterCameraControler.updateCtnPos(1);
        this._startTouchY = event.stageY;
    }
    onTouchUp(event) {
        this._startTouchY = null;
        this.timeCode = TimerManager_1.default.instance.setTimeout(() => { this.isInTouch = false; }, this, 3000);
    }
    /**获取forceX的值 */
    getTweenEndPos(tempPos) {
        if (tempPos > this.maxHeight) {
            tempPos = this.maxHeight;
        }
        else if (tempPos <= this.maxHeight - this.showHeight) {
            tempPos = this.maxHeight - this.showHeight;
        }
        return tempPos;
    }
    //销毁函数
    dispose() {
        this.a && this.a.removeChildren();
        this.a = null;
        this.a1 = null;
        this.a2 = null;
    }
}
exports.ChapterLayerControler = ChapterLayerControler;
//# sourceMappingURL=ChapterLayerControler.js.map
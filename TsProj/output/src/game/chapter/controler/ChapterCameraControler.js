"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Equation_1 = require("../../../framework/utils/Equation");
const ScreenAdapterTools_1 = require("../../../framework/utils/ScreenAdapterTools");
const TimerManager_1 = require("../../../framework/manager/TimerManager");
/**
 * 战斗中的镜头控制器.
 * 控制镜头移动.震屏等
 *
 *
 */
class ChapterCameraControler {
    constructor(controler) {
        this._halfHeight = 0;
        this._isPosChange = false;
        /**我方最前边的x */
        this.frontPos1 = 0;
        /**正在控制背景 */
        this.inControlBg = false;
        this.controler = controler;
        this._halfHeight = ScreenAdapterTools_1.default.designHeight / 2;
        this.focusPos = new Laya.Vector3(0, 0, 0);
        this.frontPos1 = 0;
    }
    //初始化数据
    setData() {
        //先把焦点放在最下边的屏幕中心
        this.focusPos.y = this.controler.chapterLayerControler.maxHeight - this._halfHeight;
        this.updateCtnPos(1);
        TimerManager_1.default.instance.registObjUpdate(this.updateFrame, this);
    }
    //刷新函数
    updateFrame() {
        this._isPosChange = false;
        this.followPlayer();
        if (this._isPosChange || this.inControlBg) {
            this.updateCtnPos();
        }
    }
    //更新容器坐标
    updateCtnPos(tweenFrame = 0.1) {
        var targetPos = this._halfHeight - this.focusPos.y;
        if (targetPos > this.controler.chapterMapControler.offestY) {
            targetPos = this.controler.chapterMapControler.offestY;
        }
        if (targetPos < this.controler.chapterLayerControler.minY) {
            targetPos = this.controler.chapterLayerControler.minY;
        }
        var pos = Equation_1.default.easyToTargetPos(targetPos, this.controler.chapterLayerControler.a2.y, tweenFrame, 5);
        this.updateScenePos(pos);
    }
    updateScenePos(pos) {
        var targetPos = this.controler.chapterLayerControler.a2.y + pos;
        if (targetPos > this.controler.chapterMapControler.offestY) {
            targetPos = this.controler.chapterMapControler.offestY;
        }
        if (targetPos < this.controler.chapterLayerControler.minY) {
            targetPos = this.controler.chapterLayerControler.minY;
        }
        var move = targetPos - this.controler.chapterLayerControler.a2.y;
        this.controler.chapterLayerControler.a2.y = targetPos;
        this.controler.chapterMapControler.onMapMove(move);
    }
    //看向player
    followPlayer() {
        if (this.controler.chapterLayerControler.isInTouch)
            return;
        if (this.inControlBg)
            return;
        if (!this.controler.player)
            return;
        this.frontPos1 = this.controler.player.pos.y;
        var frontPos1 = this.frontPos1 + 0.5;
        this.focusPos.y = frontPos1;
        this._isPosChange = true;
    }
    dispose() {
        TimerManager_1.default.instance.deleteObjUpdate(null, this.updateFrame, this);
        this.controler = null;
    }
}
exports.default = ChapterCameraControler;
//# sourceMappingURL=ChapterCameraControler.js.map
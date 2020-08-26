"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattleLayerControler = void 0;
const ScreenAdapterTools_1 = require("../../../framework/utils/ScreenAdapterTools");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const BattleConst_1 = require("../../sys/consts/BattleConst");
class BattleLayerControler {
    constructor(controler, rootCtn) {
        this.isInTouch = false;
        /**当前场景移动（a）能达到的最小x坐标 */
        this.minX = 0;
        /**当前场景移动（a）能达到的最大x坐标 */
        this.maxX = 0;
        /**当前关卡背景和手机宽度的比例 */
        this.sceneWidthRate = 1;
        this.controler = controler;
        this.rootCtn = rootCtn;
        this.a = new Laya.Sprite();
        this.a.x = ScreenAdapterTools_1.default.UIOffsetX;
        this.a.y = ScreenAdapterTools_1.default.UIOffsetY;
        this.a1 = new Laya.Sprite();
        this.a2 = new Laya.Sprite();
        this.a3 = new Laya.Sprite();
        this.a2Offset = new Laya.Sprite();
        this.a21 = new Laya.Sprite();
        this.a22 = new Laya.Sprite();
        this.a23 = new Laya.Sprite();
        rootCtn.addChild(this.a);
        this.a.addChild(this.a1);
        this.a.addChild(this.a2);
        this.a.addChild(this.a3);
        //为了方便坐标好算. 网格的(0,0)点会和 原点有一个相对坐标偏移
        this.a2.addChild(this.a2Offset);
        this.a2Offset.x = 0;
        this.a2Offset.y = 0;
        this.a2Offset.addChild(this.a21);
        this.a2Offset.addChild(this.a22);
        this.a2Offset.addChild(this.a23);
        this.isInTouch = false;
    }
    setSceneInfo() {
        this.minX = ScreenAdapterTools_1.default.width - this.controler.mapControler._maxSceneWidth + 64;
        this.sceneWidthRate = this.controler.mapControler._maxSceneWidth / 597;
    }
    //逐帧刷新函数
    updateFrame() {
        //这里主要做震屏
    }
    onTouchBegin(event) {
        this._startTouchX = event.stageX;
        this.isInTouch = true;
        this.controler.clearCallBack(this);
    }
    onTouchMove(event) {
        if (!this._startTouchX)
            return;
        this.controler.cameraControler.inControlBg = false;
        var tempPos = this.controler.cameraControler.focusPos.x + (this._startTouchX - event.stageX);
        tempPos = this.getTweenEndPos(tempPos);
        this.controler.cameraControler.focusPos.x = tempPos;
        this.controler.cameraControler.updateCtnPos(1);
        this._startTouchX = event.stageX;
        //刷新标志显示
        if (BattleFunc_1.default.curBattleType == BattleConst_1.default.BATTLETYPE_WAR) {
            if (this.a2.x < this.maxX && this.maxX - this.a2.x < 20 && this.controler.battleUI.roleSignBtn.visible) {
                this.controler.battleUI.roleSignBtn.visible = false;
                this.controler.battleUI.enemySignBtn.visible = true;
            }
            if (this.a2.x > this.minX && this.minX - this.a2.x > -20 && this.controler.battleUI.enemySignBtn.visible) {
                this.controler.battleUI.enemySignBtn.visible = false;
                this.controler.battleUI.roleSignBtn.visible = true;
            }
        }
    }
    onTouchUp(event) {
        this._startTouchX = null;
        this.controler.setCallBack(60 * 5, () => { this.isInTouch = false; }, this);
    }
    /**获取forceX的值 */
    getTweenEndPos(tempPos) {
        if (tempPos > this.controler.mapControler._maxSceneWidth) {
            tempPos = this.controler.mapControler._maxSceneWidth;
        }
        else if (tempPos <= 0) {
            tempPos = 0;
        }
        return tempPos;
    }
    //销毁函数
    dispose() {
        this.a && this.a.removeChildren();
        this.a = null;
        this.a1 = null;
        this.a2 = null;
        this.a3 = null;
        this.a21 = null;
        this.a22 = null;
        this.a23 = null;
        this.controler = null;
    }
}
exports.BattleLayerControler = BattleLayerControler;
//# sourceMappingURL=BattleLayerControler.js.map
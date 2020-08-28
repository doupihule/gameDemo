"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceConst_1 = require("../../../game/sys/consts/ResourceConst");
const ButtonUtils_1 = require("../../utils/ButtonUtils");
const JumpManager_1 = require("../../manager/JumpManager");
const JumpConst_1 = require("../../../game/sys/consts/JumpConst");
const KariqiShareManager_1 = require("../../manager/KariqiShareManager");
/**互推打开抽屉按钮 */
class MainJumpReturnUI extends Laya.View {
    constructor() {
        super();
        var url = ResourceConst_1.default["JUMP_RETURNBTN"];
        this.returnBtn = new Laya.Image(url);
        this.returnRed = new Laya.Image(ResourceConst_1.default["COMMON_REDPOINT"]);
        this.returnRed.anchorX = 0.5;
        this.returnRed.anchorY = 0.5;
        this.returnRed.x = 56;
        this.returnRed.y = 4;
        var txt = new Laya.Label("!");
        txt.font = "Microsoft YaHei";
        txt.bold = true;
        txt.color = "#ffffff";
        txt.fontSize = 18;
        txt.x = 8;
        txt.y = 6;
        this.returnRed.addChild(txt);
        this.returnBtn.addChild(this.returnRed);
        this.addChild(this.returnBtn);
        new ButtonUtils_1.ButtonUtils(this.returnBtn, this.onClickExit, this);
    }
    //呼吸动画
    scaleQipaoAni(view, scale = 1.5, callback = null, obj = null, isLoop = true, time = 800) {
        Laya.Tween.clearAll(view);
        Laya.Tween.to(view, { scaleX: scale, scaleY: scale }, time, Laya.Ease.circOut, Laya.Handler.create(this, () => {
            Laya.Tween.to(view, { scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, () => {
                if (isLoop) {
                    this.scaleQipaoAni(view, scale, callback, obj, isLoop);
                }
            }));
        }));
    }
    onAddToStage() {
        if (!this.returnRed)
            return;
        this.scaleQipaoAni(this.returnRed);
    }
    /*点击退出按钮*/
    onClickExit() {
        if (KariqiShareManager_1.default.checkIsKariquChannel()) {
            // 添加互推图标
            JumpManager_1.default.initJumpData(JumpManager_1.default.showMainJumpKariqu, JumpManager_1.default, JumpConst_1.default.MAIN_SIDE);
        }
    }
    initData() {
        this.onAddToStage();
    }
    onRemoveStage() {
        Laya.Tween.clearTween(this.returnRed);
        this.removeSelf();
    }
}
exports.default = MainJumpReturnUI;
//# sourceMappingURL=MainJumpReturnUI.js.map
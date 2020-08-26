"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FogInstanceBasic_1 = require("../../fog/instance/FogInstanceBasic");
const ButtonUtils_1 = require("../../../framework/utils/ButtonUtils");
const UserModel_1 = require("../../sys/model/UserModel");
const DisplayUtils_1 = require("../../../framework/utils/DisplayUtils");
const TranslateFunc_1 = require("../../../framework/func/TranslateFunc");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../sys/consts/WindowCfgs");
const ChapterConst_1 = require("../../sys/consts/ChapterConst");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const TimerManager_1 = require("../../../framework/manager/TimerManager");
const LevelFunc_1 = require("../../sys/func/LevelFunc");
/**章节怪 */
class ChapInstanceEnemy extends FogInstanceBasic_1.default {
    constructor(fogControler) {
        super(fogControler);
        this.anchorX = 0.5;
        this.anchorY = 1;
        this.width = 200;
        this.height = 150;
        this.nameTxt = new Laya.Label("");
        this.nameTxt.width = 200;
        this.nameTxt.fontSize = 24;
        this.nameTxt.font = "Microsoft YaHei";
        this.nameTxt.color = "#ffffff";
        this.nameTxt.align = "center";
        this.nameTxt.y = this.height + 20;
        this.nameTxt.stroke = 2;
        this.nameTxt.bold = true;
        this.addChild(this.nameTxt);
        new ButtonUtils_1.ButtonUtils(this, this.onClickItem, this);
        this.passSign = new Laya.Image("native/main/main/main_image_yishangzhen.png");
        var txt = new Laya.Label(TranslateFunc_1.default.instance.getTranslate("#tid_chapter_finishLevel"));
        txt.width = 130;
        txt.height = 48;
        txt.fontSize = 22;
        txt.font = "Microsoft YaHei";
        txt.color = "#000000";
        txt.align = "center";
        txt.valign = "middle";
        this.passSign.anchorX = 0.5;
        this.passSign.x = this.width / 2;
        this.passSign.addChild(txt);
        this.addChild(this.passSign);
    }
    ;
    setData(data) {
        this.levelId = data.id;
        this.levelName = this.fogControler.chapterId + "-" + data.index;
        this.nameTxt.text = this.levelName + "  " + TranslateFunc_1.default.instance.getTranslate(LevelFunc_1.default.instance.getCfgDatasByKey("Level", this.levelId, "name"));
    }
    /**刷新状态 */
    freshInfo() {
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        this.passSign.visible = false;
        DisplayUtils_1.default.clearViewFilter(this._myView);
        if (this.levelId == level + 1) {
            //当前关卡
            if (this.fogControler.doCurLevelCode) {
                TimerManager_1.default.instance.remove(this.fogControler.doCurLevelCode);
                this.fogControler.doCurLevelCode = 0;
            }
            this.fogControler.doCurLevelCode = TimerManager_1.default.instance.add(this.fogControler.nowLevelAni, this.fogControler, 800, Number.MAX_VALUE, false, [{ x: this.pos.x, y: this.pos.y - this.height + 20 }]);
        }
        else if (this.levelId > level) {
            //未解锁关卡
            DisplayUtils_1.default.setViewDark(this._myView);
        }
        else {
            //已通过关卡
            this.passSign.visible = true;
        }
    }
    setPos(x, y, z) {
        super.setPos(x, y, z);
        this.freshInfo();
    }
    onClickItem() {
        var level = UserModel_1.default.instance.getMaxBattleLevel();
        if (this.levelId > level + 1)
            return;
        var isReturn = false;
        if (this.levelId == level + 1) {
            var arr = this.fogControler.boxArr;
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (item.levelId == this.levelId - 1) {
                    if (item.type != ChapterConst_1.default.Chapter_boxState_receive) {
                        isReturn = true;
                        WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_chapter_openBox"));
                        break;
                    }
                }
            }
        }
        if (!isReturn) {
            if (BattleFunc_1.default.instance.showGetPower())
                return;
            if (Number(this.levelId) == 2) {
                this.fogControler.showGuide_206_finish();
            }
            WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.BattleDetailUI, { level: this.levelId, name: this.levelName });
        }
    }
    //销毁函数. 这个一般都是需要缓存的 而且单独缓存. 因为全局总共就不会创建超过20个
    dispose() {
        this.removeSelf();
        this.fogControler = null;
    }
    //从舞台移除
    onSetToCache() {
        this.removeSelf();
    }
}
exports.default = ChapInstanceEnemy;
//# sourceMappingURL=ChapInstanceEnemy.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../../sys/model/UserModel");
const GuideManager_1 = require("../../sys/manager/GuideManager");
const GuideConst_1 = require("../../sys/consts/GuideConst");
const WindowManager_1 = require("../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../sys/consts/WindowCfgs");
const GlobalParamsFunc_1 = require("../../sys/func/GlobalParamsFunc");
const BattleFunc_1 = require("../../sys/func/BattleFunc");
const StatisticsManager_1 = require("../../sys/manager/StatisticsManager");
/**
 *
 * 战斗中先关的引导控制器.逻辑抽离出来.
 * 方便扩展
 *
 */
class BattleGuideControler {
    constructor(controler) {
        this.controler = controler;
        this.battleUI = this.controler.battleUI;
    }
    /**第一步引导检测 */
    checkGuide_101() {
        if (UserModel_1.default.instance.getMainGuide() == 0 && !GuideManager_1.default.ins.recentGuideId) {
            this.battleUI.isUseCamera = false;
            this.battleUI.pauseBtn.visible = false;
            this.showGuide_101();
            return true;
        }
        return false;
    }
    showGuide_101() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_1_101, GuideManager_1.default.GuideType.None);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_1_101, this.checkGuide_101_finish, this, this.checkGuide_107_finish);
    }
    checkGuide_101_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_1_101, this.checkGuide_101_1, this, false);
    }
    checkGuide_101_1() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_1_101_1, GuideManager_1.default.GuideType.None);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_1_101_1, this.checkGuide_101_1_finish, this, this.checkGuide_107_finish);
    }
    checkGuide_101_1_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_1_101_1, this.checkGuide_101_2, this, false);
    }
    checkGuide_101_2() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_1_101_2, GuideManager_1.default.GuideType.None);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_1_101_2, this.checkGuide_101_2_finish, this, this.checkGuide_107_finish);
    }
    checkGuide_101_2_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_1_101_2, this.checkGuide_102, this, false);
    }
    //能量引导
    checkGuide_102() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_1_102, GuideManager_1.default.GuideType.Static, this.battleUI.energyGroup, this.battleUI, 78, 209);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_1_102, this.checkGuide_102_finish, this, this.checkGuide_107_finish);
    }
    checkGuide_102_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_1_102, this.checkGuide_103, this, false);
    }
    //点击角色引导
    checkGuide_103() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_1_103, GuideManager_1.default.GuideType.Static, this.battleUI.firstRole, this.battleUI, 165, 103);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_1_103, this.checkGuide_103_finish, this, this.checkGuide_107_finish);
    }
    checkGuide_103_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_1_103, () => {
            this.controler.createMyRole(this.battleUI.firstRole["id"] || "1009");
            this.checkGuide_104();
        }, this, false);
    }
    //滑屏引导
    checkGuide_104() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_1_104, GuideManager_1.default.GuideType.Static, this.battleUI.smallMapGroup, this.battleUI, 597, 69);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_1_104, null, this, this.checkGuide_107_finish);
        this.controler.setCallBack(BattleFunc_1.default.instance.turnMinisecondToframe(GlobalParamsFunc_1.default.instance.getDataNum("GuideNoHandleTime")), this.checkGuide_104_finish, this);
    }
    checkGuide_104_finish() {
        this.controler.clearCallBack(this, this.checkGuide_104_finish);
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_1_103) {
            //确保这一步引导的结束只走了一次
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_1_104, () => {
                WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
                this.checkGuide_105();
            }, this, false);
        }
    }
    //敌方基地引导
    checkGuide_105() {
        var img = new Laya.Image();
        img.x = 0;
        img.y = BattleFunc_1.default.battleCenterY - 280;
        img.width = 768;
        img.height = 300;
        this.controler.layerControler.a22.addChild(img);
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_1_105, GuideManager_1.default.GuideType.Static, img, this.battleUI, null, null, null, null, { handOffestX: 100 });
        this.controler.cameraControler.focusPos.x = this.controler.enemyHome.pos.x;
        this.controler.cameraControler.inControlBg = true;
        this.controler.cameraControler.updateCtnPos();
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_1_105, this.checkGuide_105_finish, this, this.checkGuide_107_finish);
        this.controler.layerControler.a22.removeChild(img);
    }
    checkGuide_105_finish() {
        this.controler.cameraControler.inControlBg = false;
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_1_105, this.checkGuide_106, this, false);
    }
    //技能释放引导
    checkGuide_106() {
        var item = this.battleUI.skillGroup.getChildAt(0);
        var skillData = this.controler.skillContent.normalSkills[0];
        skillData.leftSkillCd = 0;
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_1_106, GuideManager_1.default.GuideType.Static, item, this.battleUI);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_1_106, this.checkGuide_106_finish, this, this.checkGuide_107_finish);
    }
    checkGuide_106_finish() {
        this.controler.skillContent.onClickSkill(0);
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_1_106, this.checkGuide_107, this, false);
    }
    checkGuide_107() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_1_107, GuideManager_1.default.GuideType.None);
        StatisticsManager_1.default.ins.onEvent(GuideManager_1.default.ins.guideData[GuideConst_1.default.GUIDE_1_107].statisticsIndex);
        this.battleUI.showArrow();
        this.checkGuide_107_finish();
    }
    checkGuide_107_finish() {
        this.battleUI.isUseCamera = true;
        this.battleUI.isAllowFollw = true;
        this.battleUI.freshCameraImg();
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_1_107, null, null, true);
    }
    checkFogGuide_801() {
        if (GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_7_702) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_8_801, GuideManager_1.default.GuideType.Static, this.battleUI.energyGroup, this.battleUI, 78, 209);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_8_801, this.checkGuide_801_finish, this);
            return true;
        }
        return false;
    }
    checkGuide_801_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_8_801, this.checkFogGuide_802, this, false);
    }
    checkFogGuide_802() {
        var img = new Laya.Image();
        img.x = 0;
        img.y = BattleFunc_1.default.battleCenterY - 280;
        img.width = 768;
        img.height = 300;
        this.battleUI.addChild(img);
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_8_802, GuideManager_1.default.GuideType.Static, img, this.battleUI);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_8_802, this.checkGuide_802_finish, this);
        this.battleUI.removeChild(img);
    }
    checkGuide_802_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_8_802, this.checkGuide_803, this, false);
    }
    checkGuide_803() {
        GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_8_803, GuideManager_1.default.GuideType.Static, this.battleUI.roleList, this.battleUI);
        GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_8_803);
    }
    checkGuide_803_finish() {
        GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_8_803, null, null, true);
    }
}
exports.default = BattleGuideControler;
//# sourceMappingURL=BattleGuideControler.js.map
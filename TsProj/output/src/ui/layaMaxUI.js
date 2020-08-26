"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ui = void 0;
var REG = Laya.ClassUtils.regClass;
var ui;
(function (ui) {
    var gameui;
    (function (gameui) {
        var battle;
        (function (battle) {
            class BattleUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/battle/Battle");
                }
            }
            battle.BattleUI = BattleUI;
            REG("ui.gameui.battle.BattleUI", BattleUI);
            class BattleDetailUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/battle/BattleDetail");
                }
            }
            battle.BattleDetailUI = BattleDetailUI;
            REG("ui.gameui.battle.BattleDetailUI", BattleDetailUI);
            class BattleFullEnergyUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/battle/BattleFullEnergy");
                }
            }
            battle.BattleFullEnergyUI = BattleFullEnergyUI;
            REG("ui.gameui.battle.BattleFullEnergyUI", BattleFullEnergyUI);
            class BattleHelpRoleUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/battle/BattleHelpRole");
                }
            }
            battle.BattleHelpRoleUI = BattleHelpRoleUI;
            REG("ui.gameui.battle.BattleHelpRoleUI", BattleHelpRoleUI);
            class BattleResultUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/battle/BattleResult");
                }
            }
            battle.BattleResultUI = BattleResultUI;
            REG("ui.gameui.battle.BattleResultUI", BattleResultUI);
            class BattleReviveUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/battle/BattleRevive");
                }
            }
            battle.BattleReviveUI = BattleReviveUI;
            REG("ui.gameui.battle.BattleReviveUI", BattleReviveUI);
            class BattleUseSkillUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/battle/BattleUseSkill");
                }
            }
            battle.BattleUseSkillUI = BattleUseSkillUI;
            REG("ui.gameui.battle.BattleUseSkillUI", BattleUseSkillUI);
        })(battle = gameui.battle || (gameui.battle = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var cartoon;
        (function (cartoon) {
            class CartoonPicUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/cartoon/CartoonPic");
                }
            }
            cartoon.CartoonPicUI = CartoonPicUI;
            REG("ui.gameui.cartoon.CartoonPicUI", CartoonPicUI);
            class FogCartoonPicUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/cartoon/FogCartoonPic");
                }
            }
            cartoon.FogCartoonPicUI = FogCartoonPicUI;
            REG("ui.gameui.cartoon.FogCartoonPicUI", FogCartoonPicUI);
        })(cartoon = gameui.cartoon || (gameui.cartoon = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var changeData;
        (function (changeData) {
            class ChangeDataUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/changeData/ChangeData");
                }
            }
            changeData.ChangeDataUI = ChangeDataUI;
            REG("ui.gameui.changeData.ChangeDataUI", ChangeDataUI);
        })(changeData = gameui.changeData || (gameui.changeData = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var chapter;
        (function (chapter) {
            class ChapterBoxDoubleUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/chapter/ChapterBoxDouble");
                }
            }
            chapter.ChapterBoxDoubleUI = ChapterBoxDoubleUI;
            REG("ui.gameui.chapter.ChapterBoxDoubleUI", ChapterBoxDoubleUI);
            class ChapterBoxRewardUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/chapter/ChapterBoxReward");
                }
            }
            chapter.ChapterBoxRewardUI = ChapterBoxRewardUI;
            REG("ui.gameui.chapter.ChapterBoxRewardUI", ChapterBoxRewardUI);
            class ChapterListUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/chapter/ChapterList");
                }
            }
            chapter.ChapterListUI = ChapterListUI;
            REG("ui.gameui.chapter.ChapterListUI", ChapterListUI);
            class ChapterMapUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/chapter/ChapterMap");
                }
            }
            chapter.ChapterMapUI = ChapterMapUI;
            REG("ui.gameui.chapter.ChapterMapUI", ChapterMapUI);
        })(chapter = gameui.chapter || (gameui.chapter = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var common;
        (function (common) {
            class ComRewardDoubleUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/common/ComRewardDouble");
                }
            }
            common.ComRewardDoubleUI = ComRewardDoubleUI;
            REG("ui.gameui.common.ComRewardDoubleUI", ComRewardDoubleUI);
        })(common = gameui.common || (gameui.common = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var fog;
        (function (fog) {
            class FogAnswerUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogAnswer");
                }
            }
            fog.FogAnswerUI = FogAnswerUI;
            REG("ui.gameui.fog.FogAnswerUI", FogAnswerUI);
            class FogBagUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogBag");
                }
            }
            fog.FogBagUI = FogBagUI;
            REG("ui.gameui.fog.FogBagUI", FogBagUI);
            class FogBagItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogBagItem");
                }
            }
            fog.FogBagItemUI = FogBagItemUI;
            REG("ui.gameui.fog.FogBagItemUI", FogBagItemUI);
            class FogBagItemDetailUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogBagItemDetail");
                }
            }
            fog.FogBagItemDetailUI = FogBagItemDetailUI;
            REG("ui.gameui.fog.FogBagItemDetailUI", FogBagItemDetailUI);
            class FogBagItemFullLevelUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogBagItemFullLevel");
                }
            }
            fog.FogBagItemFullLevelUI = FogBagItemFullLevelUI;
            REG("ui.gameui.fog.FogBagItemFullLevelUI", FogBagItemFullLevelUI);
            class FogBattleReviveUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogBattleRevive");
                }
            }
            fog.FogBattleReviveUI = FogBattleReviveUI;
            REG("ui.gameui.fog.FogBattleReviveUI", FogBattleReviveUI);
            class FogBattleStartAlertUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogBattleStartAlert");
                }
            }
            fog.FogBattleStartAlertUI = FogBattleStartAlertUI;
            REG("ui.gameui.fog.FogBattleStartAlertUI", FogBattleStartAlertUI);
            class FogBoxUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogBox");
                }
            }
            fog.FogBoxUI = FogBoxUI;
            REG("ui.gameui.fog.FogBoxUI", FogBoxUI);
            class FogBusUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogBus");
                }
            }
            fog.FogBusUI = FogBusUI;
            REG("ui.gameui.fog.FogBusUI", FogBusUI);
            class FogBusinessmanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogBusinessman");
                }
            }
            fog.FogBusinessmanUI = FogBusinessmanUI;
            REG("ui.gameui.fog.FogBusinessmanUI", FogBusinessmanUI);
            class FogChooseUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogChoose");
                }
            }
            fog.FogChooseUI = FogChooseUI;
            REG("ui.gameui.fog.FogChooseUI", FogChooseUI);
            class FogComRewardUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogComReward");
                }
            }
            fog.FogComRewardUI = FogComRewardUI;
            REG("ui.gameui.fog.FogComRewardUI", FogComRewardUI);
            class FogDoorUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogDoor");
                }
            }
            fog.FogDoorUI = FogDoorUI;
            REG("ui.gameui.fog.FogDoorUI", FogDoorUI);
            class FogFreeActUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogFreeAct");
                }
            }
            fog.FogFreeActUI = FogFreeActUI;
            REG("ui.gameui.fog.FogFreeActUI", FogFreeActUI);
            class FogHandinUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogHandin");
                }
            }
            fog.FogHandinUI = FogHandinUI;
            REG("ui.gameui.fog.FogHandinUI", FogHandinUI);
            class FogInitRoleUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogInitRole");
                }
            }
            fog.FogInitRoleUI = FogInitRoleUI;
            REG("ui.gameui.fog.FogInitRoleUI", FogInitRoleUI);
            class FogMainUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogMain");
                }
            }
            fog.FogMainUI = FogMainUI;
            REG("ui.gameui.fog.FogMainUI", FogMainUI);
            class FogMultiRewardUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogMultiReward");
                }
            }
            fog.FogMultiRewardUI = FogMultiRewardUI;
            REG("ui.gameui.fog.FogMultiRewardUI", FogMultiRewardUI);
            class FogNpcTalkUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogNpcTalk");
                }
            }
            fog.FogNpcTalkUI = FogNpcTalkUI;
            REG("ui.gameui.fog.FogNpcTalkUI", FogNpcTalkUI);
            class FogObstacleUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogObstacle");
                }
            }
            fog.FogObstacleUI = FogObstacleUI;
            REG("ui.gameui.fog.FogObstacleUI", FogObstacleUI);
            class FogResultUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogResult");
                }
            }
            fog.FogResultUI = FogResultUI;
            REG("ui.gameui.fog.FogResultUI", FogResultUI);
            class FogResultRewardUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogResultReward");
                }
            }
            fog.FogResultRewardUI = FogResultRewardUI;
            REG("ui.gameui.fog.FogResultRewardUI", FogResultRewardUI);
            class FogRewardItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogRewardItem");
                }
            }
            fog.FogRewardItemUI = FogRewardItemUI;
            REG("ui.gameui.fog.FogRewardItemUI", FogRewardItemUI);
            class FogRoleItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogRoleItem");
                }
            }
            fog.FogRoleItemUI = FogRoleItemUI;
            REG("ui.gameui.fog.FogRoleItemUI", FogRoleItemUI);
            class FogRoleLineItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogRoleLineItem");
                }
            }
            fog.FogRoleLineItemUI = FogRoleLineItemUI;
            REG("ui.gameui.fog.FogRoleLineItemUI", FogRoleLineItemUI);
            class FogShopUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogShop");
                }
            }
            fog.FogShopUI = FogShopUI;
            REG("ui.gameui.fog.FogShopUI", FogShopUI);
            class FogShopItemDetailUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogShopItemDetail");
                }
            }
            fog.FogShopItemDetailUI = FogShopItemDetailUI;
            REG("ui.gameui.fog.FogShopItemDetailUI", FogShopItemDetailUI);
            class FogStartWarUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogStartWar");
                }
            }
            fog.FogStartWarUI = FogStartWarUI;
            REG("ui.gameui.fog.FogStartWarUI", FogStartWarUI);
            class FogTipUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogTip");
                }
            }
            fog.FogTipUI = FogTipUI;
            REG("ui.gameui.fog.FogTipUI", FogTipUI);
            class FogUserRoleUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogUserRole");
                }
            }
            fog.FogUserRoleUI = FogUserRoleUI;
            REG("ui.gameui.fog.FogUserRoleUI", FogUserRoleUI);
            class FogVideoEnterUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/fog/FogVideoEnter");
                }
            }
            fog.FogVideoEnterUI = FogVideoEnterUI;
            REG("ui.gameui.fog.FogVideoEnterUI", FogVideoEnterUI);
        })(fog = gameui.fog || (gameui.fog = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var guide;
        (function (guide) {
            class GuideUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/guide/Guide");
                }
            }
            guide.GuideUI = GuideUI;
            REG("ui.gameui.guide.GuideUI", GuideUI);
        })(guide = gameui.guide || (gameui.guide = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var jump;
        (function (jump) {
            class InterJumpUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/jump/InterJump");
                }
            }
            jump.InterJumpUI = InterJumpUI;
            REG("ui.gameui.jump.InterJumpUI", InterJumpUI);
            class JumpExitUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/jump/JumpExit");
                }
            }
            jump.JumpExitUI = JumpExitUI;
            REG("ui.gameui.jump.JumpExitUI", JumpExitUI);
            class JumpListUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/jump/JumpList");
                }
            }
            jump.JumpListUI = JumpListUI;
            REG("ui.gameui.jump.JumpListUI", JumpListUI);
            class JumpListZhiseUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/jump/JumpListZhise");
                }
            }
            jump.JumpListZhiseUI = JumpListZhiseUI;
            REG("ui.gameui.jump.JumpListZhiseUI", JumpListZhiseUI);
            class MainJumpKariquUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/jump/MainJumpKariqu");
                }
            }
            jump.MainJumpKariquUI = MainJumpKariquUI;
            REG("ui.gameui.jump.MainJumpKariquUI", MainJumpKariquUI);
            class MainJumpZhiseUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/jump/MainJumpZhise");
                }
            }
            jump.MainJumpZhiseUI = MainJumpZhiseUI;
            REG("ui.gameui.jump.MainJumpZhiseUI", MainJumpZhiseUI);
            class ResultJumpUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/jump/ResultJump");
                }
            }
            jump.ResultJumpUI = ResultJumpUI;
            REG("ui.gameui.jump.ResultJumpUI", ResultJumpUI);
            class ResultJumpDoubleUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/jump/ResultJumpDouble");
                }
            }
            jump.ResultJumpDoubleUI = ResultJumpDoubleUI;
            REG("ui.gameui.jump.ResultJumpDoubleUI", ResultJumpDoubleUI);
        })(jump = gameui.jump || (gameui.jump = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var login;
        (function (login) {
            class LoginUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/login/Login");
                }
            }
            login.LoginUI = LoginUI;
            REG("ui.gameui.login.LoginUI", LoginUI);
        })(login = gameui.login || (gameui.login = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var main;
        (function (main) {
            class AirDropDetailUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/main/AirDropDetail");
                }
            }
            main.AirDropDetailUI = AirDropDetailUI;
            REG("ui.gameui.main.AirDropDetailUI", AirDropDetailUI);
            class BoxInfoUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/main/BoxInfo");
                }
            }
            main.BoxInfoUI = BoxInfoUI;
            REG("ui.gameui.main.BoxInfoUI", BoxInfoUI);
            class DailyGoldUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/main/DailyGold");
                }
            }
            main.DailyGoldUI = DailyGoldUI;
            REG("ui.gameui.main.DailyGoldUI", DailyGoldUI);
            class FlatItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/main/FlatItem");
                }
            }
            main.FlatItemUI = FlatItemUI;
            REG("ui.gameui.main.FlatItemUI", FlatItemUI);
            class FreeResourceUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/main/FreeResource");
                }
            }
            main.FreeResourceUI = FreeResourceUI;
            REG("ui.gameui.main.FreeResourceUI", FreeResourceUI);
            class OfflineIncomeUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/main/OfflineIncome");
                }
            }
            main.OfflineIncomeUI = OfflineIncomeUI;
            REG("ui.gameui.main.OfflineIncomeUI", OfflineIncomeUI);
            class OfflineRewardDoubleUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/main/OfflineRewardDouble");
                }
            }
            main.OfflineRewardDoubleUI = OfflineRewardDoubleUI;
            REG("ui.gameui.main.OfflineRewardDoubleUI", OfflineRewardDoubleUI);
            class SettingUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/main/Setting");
                }
            }
            main.SettingUI = SettingUI;
            REG("ui.gameui.main.SettingUI", SettingUI);
            class SevenDaysUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/main/SevenDays");
                }
            }
            main.SevenDaysUI = SevenDaysUI;
            REG("ui.gameui.main.SevenDaysUI", SevenDaysUI);
            class TurnableUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/main/Turnable");
                }
            }
            main.TurnableUI = TurnableUI;
            REG("ui.gameui.main.TurnableUI", TurnableUI);
        })(main = gameui.main || (gameui.main = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var role;
        (function (role) {
            class EquipComposeUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/role/EquipCompose");
                }
            }
            role.EquipComposeUI = EquipComposeUI;
            REG("ui.gameui.role.EquipComposeUI", EquipComposeUI);
            class EquipItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/role/EquipItem");
                }
            }
            role.EquipItemUI = EquipItemUI;
            REG("ui.gameui.role.EquipItemUI", EquipItemUI);
            class EvoPreviewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/role/EvoPreview");
                }
            }
            role.EvoPreviewUI = EvoPreviewUI;
            REG("ui.gameui.role.EvoPreviewUI", EvoPreviewUI);
            class EvoRewardUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/role/EvoReward");
                }
            }
            role.EvoRewardUI = EvoRewardUI;
            REG("ui.gameui.role.EvoRewardUI", EvoRewardUI);
            class HomeUpgradeUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/role/HomeUpgrade");
                }
            }
            role.HomeUpgradeUI = HomeUpgradeUI;
            REG("ui.gameui.role.HomeUpgradeUI", HomeUpgradeUI);
            class RoleBarrageUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/role/RoleBarrage");
                }
            }
            role.RoleBarrageUI = RoleBarrageUI;
            REG("ui.gameui.role.RoleBarrageUI", RoleBarrageUI);
            class RoleDetailUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/role/RoleDetail");
                }
            }
            role.RoleDetailUI = RoleDetailUI;
            REG("ui.gameui.role.RoleDetailUI", RoleDetailUI);
            class RoleEquipmentUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/role/RoleEquipment");
                }
            }
            role.RoleEquipmentUI = RoleEquipmentUI;
            REG("ui.gameui.role.RoleEquipmentUI", RoleEquipmentUI);
            class RoleInfoUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/role/RoleInfo");
                }
            }
            role.RoleInfoUI = RoleInfoUI;
            REG("ui.gameui.role.RoleInfoUI", RoleInfoUI);
            class UnlockRoleUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/role/UnlockRole");
                }
            }
            role.UnlockRoleUI = UnlockRoleUI;
            REG("ui.gameui.role.UnlockRoleUI", UnlockRoleUI);
        })(role = gameui.role || (gameui.role = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var roleLine;
        (function (roleLine) {
            class RoleInLineUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/roleLine/RoleInLine");
                }
            }
            roleLine.RoleInLineUI = RoleInLineUI;
            REG("ui.gameui.roleLine.RoleInLineUI", RoleInLineUI);
            class RoleItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/roleLine/RoleItem");
                }
            }
            roleLine.RoleItemUI = RoleItemUI;
            REG("ui.gameui.roleLine.RoleItemUI", RoleItemUI);
            class RoleLineItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/roleLine/RoleLineItem");
                }
            }
            roleLine.RoleLineItemUI = RoleLineItemUI;
            REG("ui.gameui.roleLine.RoleLineItemUI", RoleLineItemUI);
        })(roleLine = gameui.roleLine || (gameui.roleLine = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var share;
        (function (share) {
            class InviteUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/share/Invite");
                }
            }
            share.InviteUI = InviteUI;
            REG("ui.gameui.share.InviteUI", InviteUI);
            class InviteListUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/share/InviteList");
                }
            }
            share.InviteListUI = InviteListUI;
            REG("ui.gameui.share.InviteListUI", InviteListUI);
        })(share = gameui.share || (gameui.share = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var shop;
        (function (shop) {
            class EquipPieceGetUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/shop/EquipPieceGet");
                }
            }
            shop.EquipPieceGetUI = EquipPieceGetUI;
            REG("ui.gameui.shop.EquipPieceGetUI", EquipPieceGetUI);
            class MainShopUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/shop/MainShop");
                }
            }
            shop.MainShopUI = MainShopUI;
            REG("ui.gameui.shop.MainShopUI", MainShopUI);
            class MainShopItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/shop/MainShopItem");
                }
            }
            shop.MainShopItemUI = MainShopItemUI;
            REG("ui.gameui.shop.MainShopItemUI", MainShopItemUI);
        })(shop = gameui.shop || (gameui.shop = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var task;
        (function (task) {
            class ChatDetailUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/task/ChatDetail");
                }
            }
            task.ChatDetailUI = ChatDetailUI;
            REG("ui.gameui.task.ChatDetailUI", ChatDetailUI);
            class ChatDialogUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/task/ChatDialog");
                }
            }
            task.ChatDialogUI = ChatDialogUI;
            REG("ui.gameui.task.ChatDialogUI", ChatDialogUI);
            class ChatItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/task/ChatItem");
                }
            }
            task.ChatItemUI = ChatItemUI;
            REG("ui.gameui.task.ChatItemUI", ChatItemUI);
            class ChatTaskUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/task/ChatTask");
                }
            }
            task.ChatTaskUI = ChatTaskUI;
            REG("ui.gameui.task.ChatTaskUI", ChatTaskUI);
            class DailyTaskUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/task/DailyTask");
                }
            }
            task.DailyTaskUI = DailyTaskUI;
            REG("ui.gameui.task.DailyTaskUI", DailyTaskUI);
            class TaskUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/task/Task");
                }
            }
            task.TaskUI = TaskUI;
            REG("ui.gameui.task.TaskUI", TaskUI);
            class TaskDoubleRewardUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/task/TaskDoubleReward");
                }
            }
            task.TaskDoubleRewardUI = TaskDoubleRewardUI;
            REG("ui.gameui.task.TaskDoubleRewardUI", TaskDoubleRewardUI);
        })(task = gameui.task || (gameui.task = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var test;
        (function (test) {
            class TestOpListUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/test/TestOpList");
                }
            }
            test.TestOpListUI = TestOpListUI;
            REG("ui.gameui.test.TestOpListUI", TestOpListUI);
        })(test = gameui.test || (gameui.test = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var gameui;
    (function (gameui) {
        var work;
        (function (work) {
            class WorkCompanyUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/work/WorkCompany");
                }
            }
            work.WorkCompanyUI = WorkCompanyUI;
            REG("ui.gameui.work.WorkCompanyUI", WorkCompanyUI);
            class WorkDetailUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/work/WorkDetail");
                }
            }
            work.WorkDetailUI = WorkDetailUI;
            REG("ui.gameui.work.WorkDetailUI", WorkDetailUI);
            class WorkInfoItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/work/WorkInfoItem");
                }
            }
            work.WorkInfoItemUI = WorkInfoItemUI;
            REG("ui.gameui.work.WorkInfoItemUI", WorkInfoItemUI);
            class WorkRoleUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/work/WorkRole");
                }
            }
            work.WorkRoleUI = WorkRoleUI;
            REG("ui.gameui.work.WorkRoleUI", WorkRoleUI);
            class WorkRoleItemUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("gameui/work/WorkRoleItem");
                }
            }
            work.WorkRoleItemUI = WorkRoleItemUI;
            REG("ui.gameui.work.WorkRoleItemUI", WorkRoleItemUI);
        })(work = gameui.work || (gameui.work = {}));
    })(gameui = ui.gameui || (ui.gameui = {}));
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    class MainSceneUI extends Laya.Scene {
        constructor() { super(); }
        createChildren() {
            super.createChildren();
            this.loadScene("MainScene");
        }
    }
    ui.MainSceneUI = MainSceneUI;
    REG("ui.MainSceneUI", MainSceneUI);
})(ui = exports.ui || (exports.ui = {}));
(function (ui) {
    var native;
    (function (native) {
        class GameMainUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("native/GameMain");
            }
        }
        native.GameMainUI = GameMainUI;
        REG("ui.native.GameMainUI", GameMainUI);
    })(native = ui.native || (ui.native = {}));
})(ui = exports.ui || (exports.ui = {}));
//# sourceMappingURL=layaMaxUI.js.map
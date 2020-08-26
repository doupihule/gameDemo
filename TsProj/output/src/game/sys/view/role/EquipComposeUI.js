"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const RolesFunc_1 = require("../../func/RolesFunc");
const ResourceConst_1 = require("../../consts/ResourceConst");
const RolesModel_1 = require("../../model/RolesModel");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const UserModel_1 = require("../../model/UserModel");
const PiecesModel_1 = require("../../model/PiecesModel");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const BattleFunc_1 = require("../../func/BattleFunc");
const RolesServer_1 = require("../../server/RolesServer");
const Message_1 = require("../../../../framework/common/Message");
const RoleEvent_1 = require("../../event/RoleEvent");
const BigNumUtils_1 = require("../../../../framework/utils/BigNumUtils");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const GuideManager_1 = require("../../manager/GuideManager");
const GuideConst_1 = require("../../consts/GuideConst");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const PieceEvent_1 = require("../../event/PieceEvent");
class EquipComposeUI extends layaMaxUI_1.ui.gameui.role.EquipComposeUI {
    constructor() {
        super();
        this.attrAdd = "";
        new ButtonUtils_1.ButtonUtils(this.getBtn, this.onClickGet, this);
        new ButtonUtils_1.ButtonUtils(this.composeBtn, this.onClickCompose, this);
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
    }
    setData(data) {
        this.attrAdd = "";
        this.roleId = data.roleId;
        this.equipId = data.equipId;
        var info = RolesFunc_1.default.instance.getCfgDatas("Equip", this.equipId);
        if (info.icon) {
            this.iconImg.skin = RolesFunc_1.default.instance.getEquipIcon(info.icon);
        }
        this.nameTxt.text = TranslateFunc_1.default.instance.getTranslate(info.name);
        if (info.desc) {
            this.desTxt.text = TranslateFunc_1.default.instance.getTranslate(info.desc);
        }
        this.bgImg.skin = ResourceConst_1.default.EQUIP_QUAL_DI[info.quality];
        this.initAttr(info);
        this.freshState();
        this.showGuide_405();
    }
    //初始化属性
    initAttr(info) {
        this.attrTxt.text = "";
        var attr = info.attribute;
        for (var i = 0; i < attr.length; i++) {
            var item = attr[i].split(",");
            if (Number(item[1]) != 0) {
                var itemInfo = BattleFunc_1.default.instance.getCfgDatas("AttributeList", item[0]);
                var num;
                if (itemInfo.display == 1) {
                    //整数
                    num = item[1];
                }
                else if (itemInfo.display == 2) {
                    //百分比
                    num = Number(item[1]) / 100 + "%";
                }
                else if (item.display == 3) {
                    // /s
                    num = Number(item[1]) / 1000 + "/s";
                }
                var txt = TranslateFunc_1.default.instance.getTranslate(itemInfo.AttributeName) + "+" + num;
                this.attrTxt.text += txt + "\n";
                this.attrAdd += txt + " ";
            }
        }
    }
    //刷新状态
    freshState() {
        this.getBtn.visible = false;
        this.composeBtn.visible = false;
        this.proDi.visible = false;
        if (RolesModel_1.default.instance.getIsHaveEquip(this.roleId, this.equipId))
            return;
        this.proDi.visible = true;
        var cost = RolesFunc_1.default.instance.getCfgDatasByKey("Equip", this.equipId, "cost");
        for (var i = 0; i < cost.length; i++) {
            var costItem = cost[i].split(",");
            if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.COIN) {
                var coin = UserModel_1.default.instance.getCoin();
                this.costImg.skin = DataResourceFunc_1.default.instance.getIconById(costItem[0]);
                this.costTxt.text = costItem[1];
                this.costTxt.color = "#000000";
                if (coin < Number(costItem[1])) {
                    this.costTxt.color = "#ff0400";
                }
                this.cost = costItem;
            }
            else if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
                var gold = UserModel_1.default.instance.getGiftGold();
                this.costImg.skin = DataResourceFunc_1.default.instance.getIconById(costItem[0]);
                this.costTxt.text = costItem[1];
                this.costTxt.color = "#000000";
                if (gold < Number(costItem[1])) {
                    this.costTxt.color = "#ff0400";
                }
                this.cost = costItem;
            }
            else if (Number(costItem[0]) == DataResourceFunc_1.DataResourceType.PIECE) {
                var count = PiecesModel_1.default.instance.getPieceCount(costItem[1]);
                var width = count * this.proDi.width / Number(costItem[2]);
                this.proImg.width = width > this.proDi.width ? this.proDi.width : width;
                this.proTxt.text = count + "/" + Number(costItem[2]);
                if (count < Number(costItem[2])) {
                    this.getBtn.visible = true;
                }
                else {
                    this.composeBtn.visible = true;
                }
            }
        }
    }
    //合成引导
    showGuide_405() {
        if (UserModel_1.default.instance.getMainGuide() == 6 && GuideManager_1.default.ins.recentGuideId == GuideConst_1.default.GUIDE_4_404) {
            GuideManager_1.default.ins.setGuideData(GuideConst_1.default.GUIDE_4_405, GuideManager_1.default.GuideType.Static, this.composeBtn, this);
            GuideManager_1.default.ins.openGuideUI(GuideConst_1.default.GUIDE_4_405, null, this);
        }
    }
    showGuide_405_finish() {
        if (GuideManager_1.default.ins.nowGuideId == GuideConst_1.default.GUIDE_4_405) {
            GuideManager_1.default.ins.guideFin(GuideConst_1.default.GUIDE_4_405, () => {
                WindowManager_1.default.CloseGuideUI(WindowCfgs_1.WindowCfgs.GuideUI);
                this.close();
            }, this);
        }
    }
    onClickGet() {
        var unlock = GlobalParamsFunc_1.default.instance.getDataNum("equipUnlock");
        if (UserModel_1.default.instance.getMaxBattleLevel() < unlock) {
            WindowManager_1.default.ShowTip("装备宝箱功能尚未开启");
            return;
        }
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.MainShopUI);
    }
    onClickCompose() {
        if (Number(this.cost[0]) == DataResourceFunc_1.DataResourceType.COIN) {
            if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getCoin(), this.cost[1])) {
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughcoin"));
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI, { callBack: this.freshState, thisObj: this });
                return;
            }
        }
        else if (Number(this.cost[0]) == DataResourceFunc_1.DataResourceType.GOLD) {
            if (!BigNumUtils_1.default.compare(UserModel_1.default.instance.getGiftGold(), this.cost[1])) {
                WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughgold"));
                WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.TurnableUI, { callBack: this.freshState, thisObj: this });
                return;
            }
        }
        // 发送合成请求
        RolesServer_1.default.composeEquip({ equipId: this.equipId, roleId: this.roleId }, () => {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.EQUIP_COMPOSE, { roleId: this.roleId, equipId: this.equipId });
            this.freshState();
            WindowManager_1.default.ShowTip("合成成功," + this.attrAdd);
            this.showGuide_405_finish();
            Message_1.default.instance.send(RoleEvent_1.default.ROLE_EVENT_COMPOSE_EQUIP);
        }, this);
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.EquipComposeUI);
    }
    recvMsg(cmd, data) {
        if (cmd == PieceEvent_1.default.PIECE_EVENT_UPDATE) {
            this.freshState();
        }
    }
}
exports.default = EquipComposeUI;
//# sourceMappingURL=EquipComposeUI.js.map
import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import RolesFunc from "../../func/RolesFunc";
import ResourceConst from "../../consts/ResourceConst";
import RolesModel from "../../model/RolesModel";
import DataResourceFunc, {DataResourceType} from "../../func/DataResourceFunc";
import UserModel from "../../model/UserModel";
import PiecesModel from "../../model/PiecesModel";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import BattleFunc from "../../func/BattleFunc";
import RolesServer from "../../server/RolesServer";
import Message from "../../../../framework/common/Message";
import RoleEvent from "../../event/RoleEvent";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import StatisticsManager from "../../manager/StatisticsManager";
import PieceEvent from "../../event/PieceEvent";


export default class EquipComposeUI extends ui.gameui.role.EquipComposeUI implements IMessage {

	private equipId;
	private roleId;
	private cost;
	private attrAdd = ""

	constructor() {
		super();
		new ButtonUtils(this.getBtn, this.onClickGet, this)
		new ButtonUtils(this.composeBtn, this.onClickCompose, this)
		new ButtonUtils(this.closeBtn, this.close, this)
	}

	public setData(data) {
		this.attrAdd = ""
		this.roleId = data.roleId
		this.equipId = data.equipId;
		var info = RolesFunc.instance.getCfgDatas("Equip", this.equipId);
		if (info.icon) {
			this.iconImg.skin = RolesFunc.instance.getEquipIcon(info.icon);
		}
		this.nameTxt.text = TranslateFunc.instance.getTranslate(info.name);
		if (info.desc) {
			this.desTxt.text = TranslateFunc.instance.getTranslate(info.desc);
		}
		this.bgImg.skin = ResourceConst.EQUIP_QUAL_DI[info.quality]
		this.initAttr(info);
		this.freshState();
		this.showGuide_405();
	}

	//初始化属性
	initAttr(info) {
		this.attrTxt.text = ""
		var attr = info.attribute;
		for (var i = 0; i < attr.length; i++) {
			var item = attr[i].split(",");
			if (Number(item[1]) != 0) {
				var itemInfo = BattleFunc.instance.getCfgDatas("AttributeList", item[0]);
				var num;
				if (itemInfo.display == 1) {
					//整数
					num = item[1];
				} else if (itemInfo.display == 2) {
					//百分比
					num = Number(item[1]) / 100 + "%";
				} else if (item.display == 3) {
					// /s
					num = Number(item[1]) / 1000 + "/s";
				}
				var txt = TranslateFunc.instance.getTranslate(itemInfo.AttributeName) + "+" + num
				this.attrTxt.text += txt + "\n";
				this.attrAdd += txt + " "

			}
		}
	}

	//刷新状态
	freshState() {
		this.getBtn.visible = false;
		this.composeBtn.visible = false;
		this.proDi.visible = false;
		if (RolesModel.instance.getIsHaveEquip(this.roleId, this.equipId)) return;
		this.proDi.visible = true;
		var cost = RolesFunc.instance.getCfgDatasByKey("Equip", this.equipId, "cost")
		for (var i = 0; i < cost.length; i++) {
			var costItem = cost[i].split(",");
			if (Number(costItem[0]) == DataResourceType.COIN) {
				var coin = UserModel.instance.getCoin();
				this.costImg.skin = DataResourceFunc.instance.getIconById(costItem[0]);
				this.costTxt.text = costItem[1];
				this.costTxt.color = "#000000";
				if (coin < Number(costItem[1])) {
					this.costTxt.color = "#ff0400";
				}
				this.cost = costItem
			} else if (Number(costItem[0]) == DataResourceType.GOLD) {
				var gold = UserModel.instance.getGiftGold();
				this.costImg.skin = DataResourceFunc.instance.getIconById(costItem[0]);
				this.costTxt.text = costItem[1];
				this.costTxt.color = "#000000";
				if (gold < Number(costItem[1])) {
					this.costTxt.color = "#ff0400";
				}
				this.cost = costItem
			} else if (Number(costItem[0]) == DataResourceType.PIECE) {
				var count = PiecesModel.instance.getPieceCount(costItem[1]);
				var width = count * this.proDi.width / Number(costItem[2])
				this.proImg.width = width > this.proDi.width ? this.proDi.width : width;
				this.proTxt.text = count + "/" + Number(costItem[2]);
				if (count < Number(costItem[2])) {
					this.getBtn.visible = true;
				} else {
					this.composeBtn.visible = true;
				}
			}
		}


	}

	//合成引导
	showGuide_405() {
		if (UserModel.instance.getMainGuide() == 6 && GuideManager.ins.recentGuideId == GuideConst.GUIDE_4_404) {
			GuideManager.ins.setGuideData(GuideConst.GUIDE_4_405, GuideManager.GuideType.Static, this.composeBtn, this);
			GuideManager.ins.openGuideUI(GuideConst.GUIDE_4_405, null, this)
		}
	}

	showGuide_405_finish() {
		if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_4_405) {
			GuideManager.ins.guideFin(GuideConst.GUIDE_4_405, () => {
				WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
				this.close();
			}, this)
		}
	}

	onClickGet() {
		var unlock = GlobalParamsFunc.instance.getDataNum("equipUnlock")
		if (UserModel.instance.getMaxBattleLevel() < unlock) {
			WindowManager.ShowTip("装备宝箱功能尚未开启");
			return;
		}
		WindowManager.OpenUI(WindowCfgs.MainShopUI);
	}

	onClickCompose() {
		if (Number(this.cost[0]) == DataResourceType.COIN) {
			if (!BigNumUtils.compare(UserModel.instance.getCoin(), this.cost[1])) {
				WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughcoin"));
				WindowManager.OpenUI(WindowCfgs.TurnableUI, {callBack: this.freshState, thisObj: this});
				return;
			}
		} else if (Number(this.cost[0]) == DataResourceType.GOLD) {
			if (!BigNumUtils.compare(UserModel.instance.getGiftGold(), this.cost[1])) {
				WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughgold"));
				WindowManager.OpenUI(WindowCfgs.TurnableUI, {callBack: this.freshState, thisObj: this});
				return;
			}
		}
		// 发送合成请求
		RolesServer.composeEquip({equipId: this.equipId, roleId: this.roleId}, () => {
			StatisticsManager.ins.onEvent(StatisticsManager.EQUIP_COMPOSE, {roleId: this.roleId, equipId: this.equipId})
			this.freshState();
			WindowManager.ShowTip("合成成功," + this.attrAdd);
			this.showGuide_405_finish();
			Message.instance.send(RoleEvent.ROLE_EVENT_COMPOSE_EQUIP);
		}, this)

	}

	close() {
		WindowManager.CloseUI(WindowCfgs.EquipComposeUI);
	}

	recvMsg(cmd: string, data: any): void {
		if (cmd == PieceEvent.PIECE_EVENT_UPDATE) {
			this.freshState();
		}
	}
}
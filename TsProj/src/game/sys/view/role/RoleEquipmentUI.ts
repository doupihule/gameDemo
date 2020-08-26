import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import {LoadManager} from "../../../../framework/manager/LoadManager";
import RolesFunc from "../../func/RolesFunc";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import PoolCode from "../../consts/PoolCode";
import PoolTools from "../../../../framework/utils/PoolTools";
import RolesModel from "../../model/RolesModel";
import BattleFunc from "../../func/BattleFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import EquipItemUI from "./EquipItemUI";
import UserExtModel from "../../model/UserExtModel";
import DataResourceFunc, {DataResourceType} from "../../func/DataResourceFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import Message from "../../../../framework/common/Message";
import RoleEvent from "../../event/RoleEvent";
import UserModel from "../../model/UserModel";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import RolesServer from "../../server/RolesServer";
import RoleDetailUI from "./RoleDetailUI";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import StatisticsManager from "../../manager/StatisticsManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import ChapterFunc from "../../func/ChapterFunc";


export default class RoleEquipmentUI extends ui.gameui.role.RoleEquipmentUI implements IMessage {

	private id;
	//角色动画
	private roleAnim: BattleRoleView;
	//上次缓存角色spine的id
	private _lastRoleId: string;
	private equipArr;
	private starInfo;
	private cost;
	private myParent: RoleDetailUI;
	private type;
	private timeCode = 0;

	constructor() {
		super();
		Message.instance.add(RoleEvent.ROLE_EVENT_COMPOSE_EQUIP, this);
		new ButtonUtils(this.costBtn, this.onClickCostBtn, this);
		new ButtonUtils(this.adEvoBtn, this.onClickAdEvo, this);
		new ButtonUtils(this.evoluShow, this.onClickEvoPreview, this);
		new ButtonUtils(this.unlockEvoBtn, this.onClickUnlockEvo, this);
	}

	public setData(id, parnet) {
		this.type = null
		this.id = id;
		this.myParent = parnet;
		var roleInfo = RolesFunc.instance.getRoleInfoById(this.id);
		this.nameTxt.text = TranslateFunc.instance.getTranslate(roleInfo.name, "TranslateRole");
		this.showRoleAni(id);
		this.freshInfo();
		StatisticsManager.ins.onEvent(StatisticsManager.EQUIP_OPEN, {roleId: this.id})

	}

	//进化或合成装备后会刷新的信息
	freshInfo() {
		this.cost = null;
		RolesFunc.instance.addStarImg(this.starGroup, this.id);
		var nextStar = RolesModel.instance.getRoleStarLevel(this.id) + 1;
		if (nextStar > 5) {
			nextStar = 5;
		}
		this.starInfo = RolesFunc.instance.getCfgDatasByKey("RoleStar", this.id, nextStar);
		this.initEquipItem();
		this.initEvoCondition();
		this.myParent.freshEquipRed();


	}

	/**初始化进化信息 */
	initEvoCondition() {
		var starLevel = RolesModel.instance.getRoleStarLevel(this.id);
		this.unlockTxt.visible = false;
		this.adEvoBtn.visible = false;
		this.costBtn.visible = false;
		//已经满级了
		if (starLevel == 5) return;
		var equip = RolesModel.instance.getRoleEquip(this.id);
		if (equip && Object.keys(equip).length == 4) {
			//装备够了 ，判断是否有等级限制
			if (this.starInfo.condition) {
				var level = UserExtModel.instance.getMaxLevel();
				if (level < this.starInfo.condition) {
					this.unlockTxt.visible = true;
					this.unlockTxt.text = TranslateFunc.instance.getTranslate("#tid_role_evoContionLevel", null, ChapterFunc.instance.getOpenConditionByLevel(this.starInfo.condition))
				} else {
					//过了限制等级了
					var cost = (this.starInfo.cost[0]).split(",");
					//视频进化
					if (Number(cost[0]) == -1) {
						this.type = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_EVOLUTION_FREE);
						if (this.type == ShareOrTvManager.TYPE_QUICKRECEIVE) {
							cost = (this.starInfo.cost[1]).split(",")
							this.showCostBtn(cost)

						} else {
							StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_ROLEEVO_SHOW, {roleId: this.id})
							this.adEvoBtn.visible = true;
							this.adImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.type);

						}
					} else {
						this.showCostBtn(cost)
					}
				}
			}
		} else {
			this.unlockTxt.visible = true;
			this.unlockTxt.text = TranslateFunc.instance.getTranslate("#tid_role_evoContion");
		}
	}

	showCostBtn(cost) {
		this.cost = cost;
		this.costBtn.visible = true;
		this.costImg.skin = DataResourceFunc.instance.getIconById(cost[0]);
		this.costTxt.text = cost[1];
	}

	//初始化装备信息
	initEquipItem() {
		var res = WindowManager.getUILoadGroup(WindowCfgs.EquipItemUI) || [];
		var resAll = [];
		for (var url of res) {
			resAll.push(url);
		}
		LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initEquipItemBack));

	}

	initEquipItemBack() {
		if (!this.equipArr) {
			this.equipArr = [];
			for (var i = 0; i < 4; i++) {
				var item: EquipItemUI = new EquipItemUI();
				item.x = i % 2 * (this.equipGroup.width - item.width);
				item.y = Math.floor(i / 2) * (this.equipGroup.height - item.height);
				this.equipGroup.addChild(item);
				this.equipArr.push(item);
			}
		}
		var isCan = false;
		var equip = this.starInfo.equipId;
		for (var i = 0; i < this.equipArr.length; i++) {
			var items = this.equipArr[i];
			items.setData(this.id, equip[i], i + 1);
			if (items.state == RolesFunc.STATE_CANCOMPOSE && !isCan) {
				isCan = true;
			}
		}
		this.showGuide_404();
		if (isCan) {
			if (!this.timeCode) {
				this.timeCode = TimerManager.instance.add(this.freshComposeTxt, this, 1000);
			}
		} else {
			TimerManager.instance.remove(this.timeCode);
			this.timeCode = 0;
		}
	}

	freshComposeTxt() {
		for (var i = 0; i < this.equipArr.length; i++) {
			var items = this.equipArr[i];
			if (items.state == RolesFunc.STATE_CANCOMPOSE) {
				items.freshComposeTxt();
			}
		}
	}

	//显示角色
	showRoleAni(roleId) {
		if (this.roleAnim) {
			this.aniGroup.removeChild(this.roleAnim);
			PoolTools.cacheItem(PoolCode.POOL_ROLE + this._lastRoleId, this.roleAnim);
		}
		var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + roleId);
		var scaleRoleInfo = RolesFunc.instance.getRoleDataById(roleId, "scaleRoleInfo") / 10000 * BattleFunc.defaultScale;
		if (!cacheItem) {
			var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
			this.roleAnim = BattleFunc.instance.createRoleSpine(roleId, roleLevel, 2, scaleRoleInfo, false, false, "RoleEquipmentUI");
		} else {
			cacheItem.setItemViewScale(scaleRoleInfo);
			this.roleAnim = cacheItem;
		}
		this.aniGroup.addChild(this.roleAnim);
		this.roleAnim.play("idle", true);
		this._lastRoleId = roleId;
	}

	//点击进化
	onClickCostBtn() {
		if (!this.cost) return;
		if (Number(this.cost[0]) == DataResourceType.COIN) {
			if (!BigNumUtils.compare(UserModel.instance.getCoin(), this.cost[1])) {
				WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughcoin"));
				WindowManager.OpenUI(WindowCfgs.TurnableUI);
				return;
			}
		} else if (Number(this.cost[0]) == DataResourceType.GOLD) {
			if (!BigNumUtils.compare(UserModel.instance.getGiftGold(), this.cost[1])) {
				WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughgold"));
				WindowManager.OpenUI(WindowCfgs.TurnableUI);
				return;
			}
		}
		RolesServer.roleEvolution({roleId: this.id, cost: this.cost}, () => {
			this.evoSuccess()
		}, this)
	}

	//点击视频进化
	onClickAdEvo() {
		StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_ROLEEVO_CLICK, {roleId: this.id})
		ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_EVOLUTION_FREE, ShareOrTvManager.TYPE_ADV, {
			id: 1,
			extraData: {}
		}, this.successCall, this.failCall, this)
	}

	successCall() {
		if (this.type == ShareOrTvManager.TYPE_ADV) {
			StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_ROLEEVO_FINISH, {roleId: this.id})
		} else {
			StatisticsManager.ins.onEvent(StatisticsManager.SHARE_ROLEEVO_FINISH, {roleId: this.id})
		}
		RolesServer.roleEvolution({roleId: this.id}, () => {
			this.evoSuccess()
		}, this)
	}

	failCall() {
		this.initEvoCondition();
	}

	evoSuccess() {
		this.freshInfo();
		Message.instance.send(RoleEvent.ROLE_EVENT_EVOLUTION, this.id)
		WindowManager.OpenUI(WindowCfgs.EvoRewardUI, {roleId: this.id})
	}

	//进化描述
	onClickEvoPreview() {
		WindowManager.OpenUI(WindowCfgs.EvoPreviewUI, this.id);
	}

	onClickUnlockEvo() {
		WindowManager.ShowTip(this.unlockTxt.text)
	}

	close() {
		TimerManager.instance.remove(this.timeCode);
		this.timeCode = 0;
	}

	//合成装备引导
	showGuide_404() {
		if (GuideManager.ins.recentGuideId == GuideConst.GUIDE_4_403) {
			GuideManager.ins.setGuideData(GuideConst.GUIDE_4_404, GuideManager.GuideType.Static, this.equipArr[0], this.myParent);
			GuideManager.ins.openGuideUI(GuideConst.GUIDE_4_404, () => {
				this.showGuide_404_finish();
			}, this)
		}
	}

	showGuide_404_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_4_404, () => {
			WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
			this.equipArr[0].onClickItem();
		}, this, false);
	}

	//进化引导
	showGuide_406() {
		if (UserModel.instance.getMainGuide() == 6 && GuideManager.ins.recentGuideId == GuideConst.GUIDE_4_405) {
			GuideManager.ins.setGuideData(GuideConst.GUIDE_4_406, GuideManager.GuideType.Static, this.unlockEvoBtn, this.myParent);
			GuideManager.ins.openGuideUI(GuideConst.GUIDE_4_406, this.showGuide_406_finish, this)
		}
	}

	showGuide_406_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_4_406, () => {
			WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
			this.myParent.showGuide_407();
		}, this)
	}

	recvMsg(cmd: string, data: any): void {
		if (cmd == RoleEvent.ROLE_EVENT_COMPOSE_EQUIP) {
			this.freshInfo();
			this.showGuide_406();
		}
	}
}
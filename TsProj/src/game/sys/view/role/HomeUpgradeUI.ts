import IMessage from "../../interfaces/IMessage";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import RolesModel from "../../model/RolesModel";
import RolesFunc from "../../func/RolesFunc";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import UserModel from "../../model/UserModel";
import DataResourceFunc, {DataResourceType} from "../../func/DataResourceFunc";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import SkillFunc from "../../func/SkillFunc";
import Message from "../../../../framework/common/Message";
import GameMainEvent from "../../event/GameMainEvent";
import RolesServer from "../../server/RolesServer";
import BattleFunc from "../../func/BattleFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import SkeletonExpand from "../../../../framework/viewcomp/SkeletonExpand";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import DisplayUtils from "../../../../framework/utils/DisplayUtils";
import {ui} from "../../../../ui/layaMaxUI";
import RoleEvent from "../../event/RoleEvent";
import BattleConst from "../../consts/BattleConst";
import GameUtils from "../../../../utils/GameUtils";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import TurnableModel from "../../model/TurnableModel";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import TimerManager from "../../../../framework/manager/TimerManager";
import RedPointConst from "../../consts/RedPointConst";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";

export default class HomeUpgradeUI extends ui.gameui.role.HomeUpgradeUI implements IMessage {
	//基地动画
	private homeAnim: BattleRoleView;
	//基地id
	private homeId;
	/**角色当前等级信息 */
	private roleUpdateInfo: any;
	/**角色属性 */
	private roleAttribute: any;
	/**角色下一级属性 */
	private roleNextLevelAttribute: any;
	/**配置的全部技能id */
	allSkillArr: string[] = [];
	/**配置的全部技能详细信息 */
	allSkillInfoArr: any[] = [];
	/**已解锁的技能 */
	unlockedSkillArr: string[] = [];
	/**当前预览的技能index */
	nowShowSkillIndex: number = 0;
	//技能显示框箭头指向数组
	private skillDescIndexPosArr = [46, 166, 288, 410];

	private levelUpType;
	private levelUpCost;


	private removeUpSpineTimer: number = 0;
	private upSpine: SkeletonExpand;

	constructor() {
		super();
		this.addEvent();
		this.initBtn();
	}

	//添加事件监听
	addEvent() {
		Message.instance.add(GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY, this);
	}

	initBtn() {
		new ButtonUtils(this.btn_close, this.close, this);
		new ButtonUtils(this.upgradeBtn, this.onClickUpgrade, this);
		for (var i = 0; i < 4; i++) {
			new ButtonUtils(this["skillBtn" + i], this.onSkillBtn, this, null, null, [i]);
		}
	}

	//初始化
	setData() {
		BannerAdManager.addBannerQuick(this);
		AdVideoManager.instance.showInterstitialAdById(PlaqueConst.Plaque_HomeUpgrade, this);
		this.homeId = GlobalParamsFunc.instance.getDataNum("bornHomeId");
		var homeLevel = RolesModel.instance.getRoleLevelById(this.homeId);

		this.initPanel(homeLevel);
		//属性初始化
		this.initAttribute(homeLevel);
		//刷新技能信息
		this.freshSkillInfo();
		//刷新技能详细信息展示
		this.freshSkillInfoShow();
		//升级按钮刷新
		this.refreshBtn();
	}

	initPanel(homeLevel) {
		//基地spine
		this.showRoleAni();
		//角色等级
		this.homeLevel.text = "基地 Lv." + homeLevel;
	}

	initAttribute(level) {
		var roleInfo = RolesFunc.instance.getRoleInfoById(this.homeId);

		//获取对应当前等级的属性
		this.roleUpdateInfo = RolesFunc.instance.getRoleUpdateInfo(this.homeId, level);
		var roleAttribute = this.roleUpdateInfo.attribute;

		this.roleAttribute = {};
		for (var j = 0; j < roleAttribute.length; j++) {
			var infoArr = roleAttribute[j].split(",");
			this.roleAttribute[infoArr[0]] = Number(infoArr[1]);
		}
		//属性展示
		this.freshAttrView(false, this.roleAttribute);
		//先隐藏右边的（下一级属性）
		for (var i = 0; i < 4; i++) {
			this["attrValueAdd_" + i].visible = false;
		}

		var roleMaxLevel = GlobalParamsFunc.instance.getDataNum("flatMaxLevel");
		if (level < roleMaxLevel) {
			//显示下一等级对应的属性
			var roleNextLevelAttribute = RolesFunc.instance.getRoleUpdateInfo(this.homeId, level + 1).attribute;
			this.roleNextLevelAttribute = {};
			for (var j = 0; j < roleNextLevelAttribute.length; j++) {
				var infoArr = roleNextLevelAttribute[j].split(",");
				this.roleNextLevelAttribute[infoArr[0]] = parseInt(infoArr[1]);
			}
			for (var i = 0; i < 4; i++) {
				this["attrValueAdd_" + i].visible = true;
			}
			this.freshAttrView(true, this.roleNextLevelAttribute);
		}
	}

	//刷新属性展示区		add: 是否为下一级增加属性
	freshAttrView(add: boolean = false, attributeInfo: any) {
		//如果是右边的属性  则需要减去左边的 只显示差值
		if (add) {
			for (var id in attributeInfo) {
				attributeInfo[id] -= this.roleAttribute[id];
				if (attributeInfo[id] < 0) {
					attributeInfo[id] = 0;
				}
			}
		}

		//显示当前等级对应的属性
		var attributeShow = RolesFunc.instance.getRoleDataById(this.homeId, "attributeShow");
		for (var i = 0; i < attributeShow.length; i++) {
			var attrId = attributeShow[i];
			this["attrDesc_" + i].text = TranslateFunc.instance.getTranslate("#tid_attribute_" + attrId, "TranslateAttributeList") + ":";
			var lab = add ? this["attrValueAdd_" + i] : this["attrValue_" + i];
			lab.text = '';
			if (attrId == BattleConst.attr_attack) {
				lab.text = attributeInfo[attrId];
			} else if (attrId == BattleConst.attr_maxHp) {
				lab.text = attributeInfo[attrId];
			} else if (attrId == BattleConst.attr_def) {
				lab.text = attributeInfo[attrId];
			} else if (attrId == BattleConst.attr_hit) {
				lab.text = GameUtils.numberToString(attributeInfo[attrId] / 100, 1) + "%";
			} else if (attrId == BattleConst.attr_crit) {
				lab.text = GameUtils.numberToString(attributeInfo[attrId] / 100, 1) + "%";
			} else if (attrId == BattleConst.attr_dodge) {
				lab.text = GameUtils.numberToString(attributeInfo[attrId] / 100, 1) + "%";
			} else if (attrId == BattleConst.attr_critDmg) {
				lab.text = GameUtils.numberToString(attributeInfo[attrId] / 100, 1) + "%";
			} else if (attrId == BattleConst.attr_toughness) {
				lab.text = GameUtils.numberToString(attributeInfo[attrId] / 100, 1) + "%";
			} else if (attrId == BattleConst.attr_damage) {
				lab.text = GameUtils.numberToString(attributeInfo[attrId] / 100, 1) + "%";
			} else if (attrId == BattleConst.attr_relief) {
				lab.text = GameUtils.numberToString(attributeInfo[attrId] / 100, 1) + "%";
			} else if (attrId == BattleConst.attr_treate) {
				lab.text = GameUtils.numberToString(attributeInfo[attrId] / 100, 1) + "%";
			} else if (attrId == BattleConst.attr_betreated) {
				lab.text = GameUtils.numberToString(attributeInfo[attrId] / 100, 1) + "%";
			} else if (attrId == BattleConst.attr_speed) {
				lab.text = GameUtils.numberToString(attributeInfo[attrId] / 1000, 1) + "s";
			}


			if (add) {
				if (attributeInfo[attrId] > 0) {
					lab.text = "+" + lab.text;
				} else {
					lab.text = '';
				}
			}
		}
	}

	refreshBtn() {
		var roleLevel = RolesModel.instance.getRoleLevelById(this.homeId);
		var roleMaxLevel = GlobalParamsFunc.instance.getDataNum("flatMaxLevel");
		if (roleLevel >= roleMaxLevel) {
			this.fullLevelLab.visible = true;
			this.canUpgradeGroup.visible = false;
		} else {
			var levelPay = RolesFunc.instance.getRoleUpCostById(this.homeId, roleLevel);
			var levelPayArr = levelPay[0].split(",");
			var result = DataResourceFunc.instance.getDataResourceInfo(levelPayArr);
			this.upgradeCostImg.skin = result["img"];
			this.upgradeCostNum.text = StringUtils.getCoinStr(result["num"]);

			this.fullLevelLab.visible = false;
			this.canUpgradeGroup.visible = true;
			this.levelUpType = Number(levelPayArr[0]);
			this.levelUpCost = levelPayArr[1];

			if (Number(levelPayArr[0]) == DataResourceType.COIN) {		//金币
				if (!BigNumUtils.compare(UserModel.instance.getCoin(), BigNumUtils.round(result["num"]))) {
					this.upgradeCostNum.color = "#ff0000";
				} else {
					this.upgradeCostNum.color = "#000000";
				}
				this.upgradeLab.text = "金币升级";
			} else if (Number(levelPayArr[0]) == DataResourceType.GOLD) {		//钻石
				if (Number(UserModel.instance.getGold()) < Math.floor(Number(result["num"]))) {
					this.upgradeCostNum.color = "#ff0000";
				} else {
					this.upgradeCostNum.color = "#000000";
				}
				this.upgradeLab.text = "钻石升级";
			}
		}
	}

	showRoleAni() {
		if (this.homeAnim) {
			this.homeSpine.removeChild(this.homeAnim);
			PoolTools.cacheItem(PoolCode.POOL_ROLE + this.homeId, this.homeAnim);
		}
		var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + this.homeId);
		if (!cacheItem) {
			var scaleRoleInfo = RolesFunc.instance.getRoleDataById(this.homeId, "scaleRoleInfo") / 10000 * BattleFunc.defaultScale;
			var homeLevel = RolesModel.instance.getRoleLevelById(this.homeId);
			this.homeAnim = BattleFunc.instance.createRoleSpine(this.homeId, homeLevel, 2, scaleRoleInfo, false, false, "HomeUPgradeUI");
		} else {
			this.homeAnim = cacheItem;
		}

		this.homeSpine.addChild(this.homeAnim);
		this.homeAnim.x = this.homeSpine.width - 30;
		this.homeAnim.y = this.homeSpine.height;
		this.homeAnim.play("idle", true);
	}

	//刷新技能信息
	freshSkillInfo() {
		var skillUnlockInfo = GlobalParamsFunc.instance.getBaseSkillList();
		var homeLevel = RolesModel.instance.getRoleLevelById(this.homeId);

		this.allSkillArr = [];
		this.allSkillInfoArr = [];
		this.unlockedSkillArr = [];
		//隐藏技能组
		for (var i = 0; i < 4; i++) {
			this["skillGroup" + i].visible = false;
		}
		//先筛选出已解锁的技能
		for (var i = 0; i < skillUnlockInfo.length; i++) {
			var unlockInfoArr = skillUnlockInfo[i].split(",");
			this["skillGroup" + i].visible = true;
			this.allSkillArr.push(unlockInfoArr[1]);
			var skillInfo = SkillFunc.instance.getSkillInfoById(unlockInfoArr[1]);
			this.allSkillInfoArr.push(skillInfo);
			this["skillIcon" + i].skin = SkillFunc.instance.getSkillIcon(skillInfo.pic);

			if (homeLevel >= Number(unlockInfoArr[0])) {
				//已解锁
				this.unlockedSkillArr.push(unlockInfoArr[1]);
				this["unlockLab" + i].visible = false;
				this["skillIcon" + i].gray = false;
			} else {
				this["unlockLab" + i].visible = true;
				this["unlockLab" + i].text = unlockInfoArr[0] + "级后解锁";
				this["skillIcon" + i].gray = true;
			}
		}
	}

	//刷新技能详细信息展示
	freshSkillInfoShow() {
		var skillInfo = SkillFunc.instance.getSkillInfoById(this.allSkillArr[this.nowShowSkillIndex]);
		this.cdLab.text = skillInfo.cdTime / 1000 + "秒";
		this.skillDesclab.text = "技能描述：" + TranslateFunc.instance.getTranslate(skillInfo.desc);
		this.descIndexPos.x = this.skillDescIndexPosArr[this.nowShowSkillIndex];
	}

	//点了技能按钮
	onSkillBtn(data) {
		this.nowShowSkillIndex = data[0];
		this.freshSkillInfoShow();
	}

	//升级
	onClickUpgrade() {
		var roleLevel = RolesModel.instance.getRoleLevelById(this.homeId);
		var roleMaxLevel = GlobalParamsFunc.instance.getDataNum("flatMaxLevel");
		if (roleLevel >= roleMaxLevel) {
			WindowManager.ShowTip("已满级");
			return;
		}

		if (this.levelUpType == DataResourceType.COIN) {
			if (!BigNumUtils.compare(UserModel.instance.getCoin(), BigNumUtils.round(this.levelUpCost))) {
				if (TurnableModel.instance.checkTurnable()) {
					WindowManager.OpenUI(WindowCfgs.TurnableUI);
				}
				WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughcoin"));

				return;
			}
		} else if (this.levelUpType == DataResourceType.GOLD) {
			if (Number(UserModel.instance.getGold()) < Math.floor(Number(this.levelUpCost))) {
				if (TurnableModel.instance.checkTurnable()) {
					WindowManager.OpenUI(WindowCfgs.TurnableUI);
				}
				WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughgold"));
				return;
			}
		}


		//英雄升级
		RolesServer.upgradeRole({
			"roleId": this.homeId,
			"costType": this.levelUpType,
			"costNum": this.levelUpCost
		}, () => {
			//升级后刷新界面
			this.freshView();
			//播放升级特效
			this.homeUpgradeSpine();
			//移除升级特效
			this.removeUpgradeSpine();
		}, this);
	}

	//播放升级特效
	homeUpgradeSpine() {
		if (this.removeUpSpineTimer) {
			TimerManager.instance.remove(this.removeUpSpineTimer);
			this.removeUpSpineTimer = 0;
		}
		if (!this.upSpine) {
			var upSpineName = RolesFunc.ROLE_UPGRADE_SPINE;
			this.upSpine = DisplayUtils.createSkeletonExpand(upSpineName);
		}
		this.upSpine.play(0, false, true);

		this.upSpine.visible = true;
		this.upSpine.scaleX = this.upSpine.scaleY = 1.27;
		this.upSpine.x = this.upSpineArea.x;
		this.upSpine.y = this.upSpineArea.y;
		this.upSpineArea.addChild(this.upSpine);
	}

	//移除升级特效
	removeUpgradeSpine() {
		if (!this.removeUpSpineTimer) {
			this.removeUpSpineTimer = TimerManager.instance.add(this.hideUpgradeSpine, this, 1000, 1);
		}
	}

	hideUpgradeSpine() {
		if (this.upSpine) {
			this.upSpine.visible = false;
		}
	}

	//升级后刷新界面
	freshView() {
		//等级刷新
		var homeLevel = RolesModel.instance.getRoleLevelById(this.homeId);
		this.homeLevel.text = "基地 Lv." + homeLevel;
		//属性刷新
		this.initAttribute(homeLevel);
		//按钮刷新
		this.refreshBtn();
		//技能列表刷新
		this.freshSkillInfo();
		//刷新主界面基地红点
		Message.instance.send(RoleEvent.ROLE_EVENT_GAMEMAIN_FALT_REDPOINT);

	}

	close() {
		WindowManager.CloseUI(WindowCfgs.HomeUpgradeUI);
		Message.instance.send(GameMainEvent.GAMEMAIN_EVENT_REDPOINT, RedPointConst.POINT_MAIN_TASKRED)
	}

	clear() {

	}

	dispose() {

	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {
			case GameMainEvent.GAMEMAIN_EVENT_FRESHMONEY:
				this.refreshBtn();
				break;
		}
	}

}
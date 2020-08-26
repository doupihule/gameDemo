import IMessage from "../../interfaces/IMessage";
import {ui} from "../../../../ui/layaMaxUI";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import Message from "../../../../framework/common/Message";
import FlatFunc from "../../func/FlatFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import TimerManager from "../../../../framework/manager/TimerManager";
import RolesFunc from "../../func/RolesFunc";
import RolesModel from "../../model/RolesModel";
import TweenAniManager from "../../manager/TweenAniManager";
import DisplayUtils from "../../../../framework/utils/DisplayUtils";
import WindowManager from "../../../../framework/manager/WindowManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import BattleFunc from "../../func/BattleFunc";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import {WindowCfgs} from "../../consts/WindowCfgs";
import SkeletonExpand from "../../../../framework/viewcomp/SkeletonExpand";
import UserExtModel from "../../model/UserExtModel";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import RoleEvent from "../../event/RoleEvent";
import PieceEvent from "../../event/PieceEvent";
import GameMainUI from "./GameMainUI";
import {DataResourceType} from "../../func/DataResourceFunc";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import UserModel from "../../model/UserModel";
import SubPackageManager from "../../../../framework/manager/SubPackageManager";
import SubPackageConst from "../../consts/SubPackageConst";
import ChapterFunc from "../../func/ChapterFunc";

;


export default class FlatItemUI extends ui.gameui.main.FlatItemUI implements IMessage {

	private static instance: FlatItemUI = null;
	public leftRoleData;
	public rightRoleData;
	private flatNum;


	//定时器数组
	private _timeList: any[];

	//角色动画
	public leftRoleAnim: SkeletonExpand;
	public rightRoleAnim: SkeletonExpand;
	//上次缓存角色spine的id
	private _lastRoleId: string;

	private leftRoleMoveIndex: 0;
	private rightRoleMoveIndex: 0;
	private leftRoleMoveRouteArr = [];
	private rightRoleMoveRouteArr = [];

	//角色动画状态
	private leftRoleStatus = 1;//1 idle;2 walk；3等待
	private rightRoleStatus = 1;//1 idle;2 walk；3等待

	//角色名字坐标数组
	private leftRoleNamePosX = [-50, -40];
	private rightRoleNamePosX = [-72, -40];
	private mainUI: GameMainUI


	private isGuide = null

	constructor(flatNum, leftRoleData, rightRoleData, mainUI) {
		super();

		FlatItemUI.instance = this;
		this.flatNum = flatNum;
		this.leftRoleData = leftRoleData;
		this.rightRoleData = rightRoleData;
		this.mainUI = mainUI
		this.addEvent();
		this.initBtn();

		this.leftRoleMoveIndex = 0;
		this.rightRoleMoveIndex = 0;
		this.leftRoleMoveRouteArr = [];
		this.rightRoleMoveRouteArr = [];
		this.leftRoleStatus = 1;
		this.rightRoleStatus = 1;

		this.initData();

	}

	initBtn() {
		//点击角色打开解锁升级界面
		if (this.leftRoleData && this.leftRoleData.id) {
			new ButtonUtils(this.leftRoleClickArea, this.onClickRoleItem, this, null, null, [this.leftRoleData.id]);
		}
		if (this.rightRoleData && this.rightRoleData.id) {
			new ButtonUtils(this.rightRoleClickArea, this.onClickRoleItem, this, null, null, [this.rightRoleData.id]);
		}
	}

	addEvent() {
		Message.instance.add(RoleEvent.ROLE_EVENT_EVOLUTION, this);
		Message.instance.add(PieceEvent.PIECE_EVENT_UPDATE, this);


	}

	//初始化
	initData() {
		this._timeList = [];
		this.isGuide = this.isInGuide();
		this.initFlat();
		this.initRole("left");
		this.initRole("right");
	}

	initFlat() {
		//楼层背景及装饰
		var flatInfo = FlatFunc.instance.getFlatInfoById(this.flatNum);
		var imageUrl1 = "scene/" + flatInfo.pic + "/" + flatInfo.pic + "/" + flatInfo.pic + ".png"
		var image = this.flatImg;
		var onMapComplete = () => {
			image.skin = imageUrl1;
			image.x += 64;
		}
		//必须地图组是分包的就直接走;
		if (SubPackageManager.getPackStyle(SubPackageConst.packName_scene) == SubPackageConst.PATH_STYLE_SUBPACK) {
			SubPackageManager.loadDynamics(flatInfo.pic, "scene/" + flatInfo.pic + "/" + flatInfo.pic, onMapComplete, this);
		} else {
			onMapComplete();
		}

		if (flatInfo.decoration) {
			var decoration = flatInfo.decoration;
			for (var i = 0; i < decoration.length; i++) {
				var img = "uisource/scene/scene/" + decoration[i][0] + ".png";
				var decorationImg = new Laya.Image(img);
				this.flatImg.addChild(decorationImg);
				decorationImg.x = Number(decoration[i][1]) - this.flatImg.x;
				decorationImg.y = Number(decoration[i][2]);
			}
		}
	}

	isInGuide() {
		if (this.unlockNewRole()) return true;
		//如果是滑小稽的碎片引导 也不能移动
		if (BattleFunc.instance.IshowGuide_403() && this.leftRoleData.id == (GlobalParamsFunc.instance.getDataNum("bornRoleId") + "")) {
			return true;
		}
		return false;
	}

	initRole(roleWay) {
		if (!this[roleWay + "RoleData"] || !this[roleWay + "RoleData"].id) {
			this[roleWay + "RoleSpine"].visible = false;
			return;
		}
		var roleId = this[roleWay + "RoleData"].id;
		this[roleWay + "Star"].visible = false;
		this[roleWay + "Compose"].visible = false;
		//角色名字
		var roleName = TranslateFunc.instance.getTranslate(this[roleWay + "RoleData"].name, "TranslateRole");

		//角色说话
		this[roleWay + "Speak"].visible = false;

		//角色spine
		this.showRoleAni(roleId, roleWay);

		var scaleMain = RolesFunc.instance.getRoleDataById(roleId, "scaleMain") / 10000;
		var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
		var roleSize = RolesFunc.instance.getRoleSizeById(roleId, roleLevel);
		//判断是否已经解锁
		if (RolesModel.instance.checkRoleUnlock(roleId)) {
			this.freshStar(roleId, roleWay)
			this[roleWay + "UnlockCond"].visible = false;
			//角色等级
			this[roleWay + "RoleName"].text = roleName + " Lv." + roleLevel;

			//角色名字位置调整
			this[roleWay + "RoleName"].x = this[roleWay + "RoleNamePosX"][0];

			//判断是否上阵
			if (RolesModel.instance.checkRolInLine(roleId)) {
				this[roleWay + "EquipedImg"].visible = true;
				//上阵图标调整位置
				this[roleWay + "EquipedImg"].x = -0.5 * this[roleWay + "EquipedImg"].width;
				this[roleWay + "EquipedImg"].y = -scaleMain * Number(roleSize[1]) - this[roleWay + "EquipedImg"].height;


			} else {
				this[roleWay + "EquipedImg"].visible = false;
			}
			this.freshComposeState(roleId, roleWay);
			//判断是否可升级
			if (RolesModel.instance.checkRoleUpgrade(roleId)) {
				this[roleWay + "CanUpgrade"].visible = true;
				TweenAniManager.instance.scaleQipaoAni(this[roleWay + "CanUpgrade"], 1.2);
				//调整位置
				this[roleWay + "CanUpgrade"].x = Number(roleSize[0]) * scaleMain * 0.7;
				this[roleWay + "CanUpgrade"].y = -this[roleWay + "CanUpgrade"].height * 0.5;

			} else {
				this[roleWay + "CanUpgrade"].visible = false;
				Laya.Tween.clearAll(this[roleWay + "CanUpgrade"]);
			}


		} else {
			this[roleWay + "UnlockCond"].visible = true;
			this[roleWay + "UnlockCond"].y = -scaleMain * Number(roleSize[1]) - this[roleWay + "UnlockCond"].height - 40;
			//判断是否达到关卡解锁条件
			this.refreshUnlockCondLab(roleId, roleWay);
			this[roleWay + "RoleName"].text = roleName;
			this[roleWay + "RoleName"].cacheAs = "bitmap";
			this[roleWay + "EquipedImg"].visible = false;
			this[roleWay + "CanUpgrade"].visible = false;
			Laya.Tween.clearAll(this[roleWay + "CanUpgrade"]);


			//角色名字位置调整
			this[roleWay + "RoleName"].x = this[roleWay + "RoleNamePosX"][1];

			DisplayUtils.setViewDark(this[roleWay + "RoleAnim"]);
		}
		this[roleWay + "Compose"].y = -scaleMain * Number(roleSize[1]) - this[roleWay + "EquipedImg"].height - 26;

	}

	freshComposeState(id, roleWay) {
		this[roleWay + "Compose"].visible = false;
		var unlock = GlobalParamsFunc.instance.getDataNum("equipUnlock")
		if (UserModel.instance.getMaxBattleLevel() < unlock) {
			return;
		}
		Laya.Tween.clearTween(this[roleWay + "Compose"])
		this[roleWay + "Compose"].alpha = 1;
		var starLevel = RolesModel.instance.getRoleStarLevel(id);
		if (starLevel == 5) return;
		var starInfo = RolesFunc.instance.getCfgDatasByKey("RoleStar", id, starLevel + 1);
		var equip = starInfo.equipId;
		for (var i = 0; i < equip.length; i++) {
			var state = RolesFunc.instance.getEquipState(id, equip[i]);
			if (state == RolesFunc.STATE_CANCOMPOSE) {
				this[roleWay + "Compose"].visible = true;
				this[roleWay + "Compose"].text = TranslateFunc.instance.getTranslate("tid_role_compose");

				break;
			}
		}
		//不能合成 看当前是否可进化
		if (!this[roleWay + "Compose"].visible) {
			var equip = RolesModel.instance.getRoleEquip(id);
			if (equip && Object.keys(equip).length == 4) {
				//装备够了 ，判断是否有等级限制
				if (starInfo.condition) {
					var level = UserExtModel.instance.getMaxLevel();
					if (level < starInfo.condition) return;
					//过了限制等级了
					var cost = (starInfo.cost[0]).split(",");
					//视频进化
					if (Number(cost[0]) == -1) {
						this[roleWay + "Compose"].visible = true;
						this[roleWay + "Compose"].text = TranslateFunc.instance.getTranslate("tid_role_evo");
					} else {
						if (Number(cost[0]) == DataResourceType.COIN) {
							if (!BigNumUtils.compare(UserModel.instance.getCoin(), cost[1])) {
								return;
							}
						} else if (Number(cost[0]) == DataResourceType.GOLD) {
							if (!BigNumUtils.compare(UserModel.instance.getGiftGold(), cost[1])) {
								return;
							}
						}
						this[roleWay + "Compose"].visible = true;
						this[roleWay + "Compose"].text = TranslateFunc.instance.getTranslate("tid_role_evo");
					}
				}
			}
		}
	}

	freshLeftComposeTxt() {
		if (this.leftCompose.visible) {
			TweenAniManager.instance.fadeOutAni(this.leftCompose, this.hideLeftTxt, 300, this, 1, 0)
		}
	}

	hideLeftTxt() {
		TweenAniManager.instance.fadeInAni(this.leftCompose, null, 200, this, 0, 1);
	}

	freshRightComposeTxt() {
		if (this.rightCompose.visible) {
			TweenAniManager.instance.fadeOutAni(this.rightCompose, this.hideRightTxt, 300, this, 1, 0)
		}
	}

	hideRightTxt() {
		TweenAniManager.instance.fadeInAni(this.rightCompose, null, 200, this, 0, 1);
	}

	/**是否解锁新角色 */
	public unlockNewRole(isnew = true) {
		if (this.getUnlockInfo("right", isnew)) {
			return {
				item: this.rightRoleClickArea,
				level: RolesFunc.instance.getUnlockLevel(this.rightRoleData.id),
				id: this.rightRoleData.id
			}
		}
		if (this.getUnlockInfo("left", isnew)) {
			return {
				item: this.leftRoleClickArea,
				level: RolesFunc.instance.getUnlockLevel(this.leftRoleData.id),
				id: this.leftRoleData.id
			}
		}
		return null
	}

	getUnlockInfo(roleWay, isnew = true) {
		if (!this[roleWay + "RoleData"] || !this[roleWay + "RoleData"].id) {
			return false;
		}
		var roleId = this[roleWay + "RoleData"].id;
		var needLevel = RolesFunc.instance.getUnlockLevel(roleId);
		var curLevel = UserExtModel.instance.getMaxLevel();
		if (isnew) {
			if (needLevel == curLevel && !RolesModel.instance.getIsHaveRole(roleId)) {
				return true
			}
		} else {
			if (needLevel <= curLevel && !RolesModel.instance.getIsHaveRole(roleId)) {
				return true
			}
		}
		return false;

	}

	//更新角色等级
	updateLevel(roleId, roleWay) {
		this[roleWay + "Star"].visible = true;
		var roleName = TranslateFunc.instance.getTranslate(this[roleWay + "RoleData"].name, "TranslateRole");
		var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
		this[roleWay + "RoleName"].text = roleName + " Lv." + roleLevel;
	}

	//刷新角色升级按钮
	updateUpgradeBtn(roleId, roleWay) {
		if (RolesModel.instance.checkRoleUpgrade(roleId)) {
			this[roleWay + "CanUpgrade"].visible = true;
			TweenAniManager.instance.scaleQipaoAni(this[roleWay + "CanUpgrade"], 1.2);
			//调整位置
			var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
			var scaleMain = RolesFunc.instance.getRoleDataById(roleId, "scaleMain") / 10000;
			var roleSize = RolesFunc.instance.getRoleSizeById(roleId, roleLevel);
			this[roleWay + "CanUpgrade"].x = Number(roleSize[0]) * scaleMain * 0.7;
			this[roleWay + "CanUpgrade"].y = -this[roleWay + "CanUpgrade"].height * 0.5;
		} else {
			this[roleWay + "CanUpgrade"].visible = false;
			Laya.Tween.clearAll(this[roleWay + "CanUpgrade"]);
		}
		DisplayUtils.clearViewFilter([roleWay + "RoleAnim"]);
	}

	//刷新角色解锁条件
	refreshUnlockCondLab(roleId, roleWay) {
		if (RolesModel.instance.checkRoleLevelunlock(roleId)) {
			this[roleWay + "UnlockCondLab"].text = TranslateFunc.instance.getTranslate("#tid_flat_clickunlock");
		} else {
			//解锁条件
			var unlockLevel = RolesFunc.instance.getUnlockLevel(roleId);
			if (unlockLevel) {
				this[roleWay + "UnlockCondLab"].text = TranslateFunc.instance.getTranslate("#tid_flat_unlockTip", null, ChapterFunc.instance.getOpenConditionByLevel(unlockLevel));
			}
		}
	}

	//角色解锁后刷新显示
	unlockRole(roleId, roleWay) {
		this[roleWay + "UnlockCond"].visible = false;

		//角色等级
		var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
		var roleName = TranslateFunc.instance.getTranslate(this[roleWay + "RoleData"].name, "TranslateRole");
		this[roleWay + "RoleName"].text = roleName + " Lv." + roleLevel;
		this[roleWay + "RoleName"].cacheAs = "none";


		//角色名字位置调整
		this[roleWay + "RoleName"].x = this[roleWay + "RoleNamePosX"][0];

		var scaleMain = RolesFunc.instance.getRoleDataById(roleId, "scaleMain") / 10000;

		//判断是否上阵
		if (RolesModel.instance.checkRolInLine(roleId)) {
			this[roleWay + "EquipedImg"].visible = true;
			//调整位置
			this[roleWay + "EquipedImg"].x = -0.5 * this[roleWay + "EquipedImg"].width;
			var roleSize = RolesFunc.instance.getRoleSizeById(roleId, roleLevel);
			this[roleWay + "EquipedImg"].y = -scaleMain * Number(roleSize[1]) - this[roleWay + "EquipedImg"].height;

		} else {
			this[roleWay + "EquipedImg"].visible = false;
		}

		//判断是否可升级
		if (RolesModel.instance.checkRoleUpgrade(roleId)) {
			this[roleWay + "CanUpgrade"].visible = true;
			TweenAniManager.instance.scaleQipaoAni(this[roleWay + "CanUpgrade"], 1.2);
			//调整位置
			var roleSize = RolesFunc.instance.getRoleSizeById(roleId, roleLevel);
			this[roleWay + "CanUpgrade"].x = Number(roleSize[0]) * scaleMain * 0.7;
			this[roleWay + "CanUpgrade"].y = -this[roleWay + "CanUpgrade"].height * 0.5;
		} else {
			this[roleWay + "CanUpgrade"].visible = false;
			Laya.Tween.clearAll(this[roleWay + "CanUpgrade"]);
		}


		DisplayUtils.clearViewFilter(this[roleWay + "RoleAnim"]);
		/**刷新星级 */
		this.freshStar(roleId, roleWay);
		this.freshComposeState(roleId, roleWay);
	}

	/**刷新星级 */
	freshStar(id, roleWay) {
		this[roleWay + "Star"].visible = true;
		RolesFunc.instance.addStarImg(this[roleWay + "Star"], id, 20, 20);
	}

	//角色上阵刷新界面
	inlineRole(roleId, roleWay) {
		//判断是否上阵
		if (RolesModel.instance.checkRolInLine(roleId)) {
			this[roleWay + "EquipedImg"].visible = true;
			//上阵图标调整位置

			var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
			var scaleMain = RolesFunc.instance.getRoleDataById(roleId, "scaleMain") / 10000;

			this[roleWay + "EquipedImg"].x = -0.5 * this[roleWay + "EquipedImg"].width;
			var roleSize = RolesFunc.instance.getRoleSizeById(roleId, roleLevel);
			this[roleWay + "EquipedImg"].y = -scaleMain * Number(roleSize[1]) - this[roleWay + "EquipedImg"].height;

		} else {
			this[roleWay + "EquipedImg"].visible = false;
		}
	}

	roleDoMove(roleWay) {
		if ("GameMainUI" != WindowManager.getCurrentWindowName()) {
			return;
		}
		if (!this[roleWay + "RoleData"] || !this[roleWay + "RoleData"].id) {
			return false;
		}
		//判断是否解锁
		var roleId = this[roleWay + "RoleData"].id;
		if (!RolesModel.instance.checkRoleUnlock(roleId)) {
			return;
		}

		if (this[roleWay + "RoleStatus"] == 2 || this[roleWay + "RoleStatus"] == 3) {
			return;
		}

		var roleInfo = RolesFunc.instance.getRoleInfoById(roleId);
		if (roleInfo && roleInfo.moveRoute) {
			this[roleWay + "RoleMoveRouteArr"] = roleInfo.moveRoute;
		}
		if (this[roleWay + "RoleMoveRouteArr"].length == 0) {
			return;
		}


		var moveRouteArr = this[roleWay + "RoleMoveRouteArr"];
		var moveIndex = this[roleWay + "RoleMoveIndex"];
		var moveRouteLength = this[roleWay + "RoleMoveRouteArr"].length;
		var moveRoute = moveRouteArr[moveIndex % moveRouteLength];

		//判断前后两点是否是同一点
		if (moveRoute[0] == this[roleWay + "RoleSpine"].x && moveRoute[1] == this[roleWay + "RoleSpine"].y) {
			return;
		}

		var nextMoveRoute = moveRouteArr[(moveIndex + 1) % moveRouteLength];
		var nextMoveRoute1 = moveRouteArr[(moveIndex + 2) % moveRouteLength];
		//角色移动
		this[roleWay + "RoleStatus"] = 2;
		this[roleWay + "RoleAnim"].play("move", true);
		Laya.Tween.to(this[roleWay + "RoleSpine"], {
			x: moveRoute[0],
			y: moveRoute[1]
		}, moveRoute[2], null, Laya.Handler.create(this, () => {
			//状态置为idle
			this[roleWay + "RoleAnim"].play("idle", true);
			//修改状态为等待
			this[roleWay + "RoleStatus"] = 3;

			//spine方向调整
			var roleSite;
			if (roleWay == "left") {
				roleSite = GlobalParamsFunc.instance.getDataArray("roleSite1");
			} else {
				roleSite = GlobalParamsFunc.instance.getDataArray("roleSite2");
			}
			var scaleMain = RolesFunc.instance.getRoleDataById(roleId, "scaleMain") / 10000;
			if (roleWay == "left") {
				if (Number(nextMoveRoute[0]) < Number(moveRoute[0])) {
					//向左走
					this[roleWay + "RoleAnim"].scaleX = -1;
				} else if (Number(roleSite[0]) == Number(moveRoute[0]) && Number(roleSite[1]) == Number(moveRoute[1])) {
					this[roleWay + "RoleAnim"].scaleX = 1;
				}
			} else {
				if (Number(nextMoveRoute[0]) > Number(moveRoute[0]) && Number(nextMoveRoute1[0]) > Number(nextMoveRoute[0])) {
					this[roleWay + "RoleAnim"].scaleX = 1;
				} else if (Number(roleSite[0]) == Number(moveRoute[0]) && Number(roleSite[1]) == Number(moveRoute[1])) {
					this[roleWay + "RoleAnim"].scaleX = -1;
				}
			}
			//修改深度
			if (this.leftRoleSpine.y < this.rightRoleSpine.y) {
				this.setZorderOffset("left", 0);
				this.setZorderOffset("right", 2);
			} else if (this.leftRoleSpine.y > this.rightRoleSpine.y) {
				this.setZorderOffset("left", 2);
				this.setZorderOffset("right", 0);
			} else {
				this.setZorderOffset("left", 1);
				this.setZorderOffset("right", 0);
			}

			//修改index
			this[roleWay + "RoleMoveIndex"] = (moveIndex + 1) % moveRouteLength;


			TimerManager.instance.add(() => {
				this[roleWay + "RoleStatus"] = 1;
			}, this, moveRoute[3], 1);

		}));

	}

	showRoleAni(roleId, roleWay, roleAction = "idle", isInit = true) {
		if (roleAction == "idle") {
			this[roleWay + "RoleStatus"] = 1;
		} else {
			this[roleWay + "RoleStatus"] = 2;
		}
		var scaleMain = RolesFunc.instance.getRoleDataById(roleId, "scaleMain") / 10000 * BattleFunc.defaultScale;

		var roleSite;
		if (roleWay == "left") {
			roleSite = GlobalParamsFunc.instance.getDataArray("roleSite1");
		} else {
			roleSite = GlobalParamsFunc.instance.getDataArray("roleSite2");
		}

		var roleSiteX = Number(roleSite[0]);
		var roleSiteY = Number(roleSite[1]);

		if (this[roleWay + "RoleAnim"]) {
			this[roleWay + "RoleSpine"].removeChild(this[roleWay + "RoleAnim"]);
			PoolTools.cacheItem(PoolCode.POOL_ROLE + roleId, this[roleWay + "RoleAnim"]);
		}
		var cacheItem = PoolTools.getItem(PoolCode.POOL_ROLE + roleId);
		if (!cacheItem) {
			var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
			this[roleWay + "RoleAnim"] = BattleFunc.instance.createRoleSpine(roleId, roleLevel, 2, scaleMain, true, false, "FlatItemUI");
		} else {
			cacheItem.setItemViewScale(scaleMain);
			this[roleWay + "RoleAnim"] = cacheItem;
		}

		this[roleWay + "RoleSpine"].addChildAt(this[roleWay + "RoleAnim"], 1);
		this[roleWay + "RoleAnim"].play(roleAction, true);
		if (isInit) {
			this[roleWay + "RoleSpine"].x = roleSiteX;
			this[roleWay + "RoleSpine"].y = roleSiteY;

			if (roleWay == "right") {
				// this[roleWay + "RoleAnim"].scaleX = -this[roleWay + "RoleAnim"].scaleX;
				this[roleWay + "RoleAnim"].scaleX = -1;
			}
		}
	}

	hideSpeakShow(roleWay = "left") {
		this[roleWay + "Speak"].visible = false;
	}

	showSpeak(roleId, mainSpeak, roleWay = "left") {
		if (mainSpeak != "") {
			//调整说话框的位置
			var scaleMain = RolesFunc.instance.getRoleDataById(roleId, "scaleMain") / 10000;
			if (roleWay == "right") {
				this[roleWay + "Speak"].x = -this[roleWay + "Speak"].width;
				var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
				var roleSize = RolesFunc.instance.getRoleSizeById(roleId, roleLevel);
				this[roleWay + "Speak"].y = -scaleMain * Number(roleSize[1]) - this[roleWay + "Speak"].height;
			} else {
				this[roleWay + "Speak"].x = 0;
				var roleLevel = RolesModel.instance.getRoleLevelById(roleId);
				var roleSize = RolesFunc.instance.getRoleSizeById(roleId, roleLevel);
				this[roleWay + "Speak"].y = -scaleMain * Number(roleSize[1]) - this[roleWay + "Speak"].height;
			}

			this[roleWay + "Speak"].visible = true;
			this[roleWay + "SpeakLab"].text = TranslateFunc.instance.getTranslate(mainSpeak, "TranslateRole");


		} else {
			this[roleWay + "Speak"].visible = false;
		}
	}

	//角色升级或解锁
	onClickRoleItem(data) {
		if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_2_202) {
			GuideManager.ins.guideFin(GuideConst.GUIDE_2_202, null, null, false);
		}
		if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_4_403) {
			GuideManager.ins.guideFin(GuideConst.GUIDE_4_403, null, null, false);
		}
		// 0代表显示升级 1代表显示装备
		var tab = 0;
		WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
		WindowManager.OpenUI(WindowCfgs.RoleDetailUI, {id: data[0], tab: tab});
	}

	//设置zorder偏移
	setZorderOffset(roleWay, value) {
		this[roleWay + "RoleSpine"].zOrder = value;
	}

	close() {

	}

	clear() {

	}

	dispose() {

	}

	freshRoleStar(id) {
		if (this.leftRoleData && this.leftRoleData.id && id == this.leftRoleData.id) {
			this.freshStar(id, "left");
		} else if (this.rightRoleData && this.rightRoleData.id && id == this.rightRoleData.id) {
			this.freshStar(id, "right");
		}
	}

	freshCompose() {
		if (this.leftRoleData && this.leftRoleData.id && RolesModel.instance.checkRoleUnlock(this.leftRoleData.id)) {
			this.freshComposeState(this.leftRoleData.id, "left")
		}
		if (this.rightRoleData && this.rightRoleData.id && RolesModel.instance.checkRoleUnlock(this.rightRoleData.id)) {
			this.freshComposeState(this.rightRoleData.id, "right")
		}
	}

	recvMsg(cmd: string, data: any): void {
		if (cmd == RoleEvent.ROLE_EVENT_EVOLUTION) {
			this.freshRoleStar(data)
			this.freshCompose();
		} else if (cmd == PieceEvent.PIECE_EVENT_UPDATE) {
			this.freshCompose();
		}
	}

}
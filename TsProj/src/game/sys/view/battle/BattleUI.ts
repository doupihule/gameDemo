import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import IMessage from "../../interfaces/IMessage";
import BattleLogicalControler from "../../../battle/controler/BattleLogicalControler";
import BattleSceneManager from "../../manager/BattleSceneManager";
import Message from "../../../../framework/common/Message";
import BattleEvent from "../../event/BattleEvent";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import BattleFunc from "../../func/BattleFunc";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import SoundManager from "../../../../framework/manager/SoundManager";
import {MusicConst} from "../../consts/MusicConst";
import StatisticsManager from "../../manager/StatisticsManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import LevelFunc from "../../func/LevelFunc";
import RolesFunc from "../../func/RolesFunc";
import RolesModel from "../../model/RolesModel";
import BattleConst from "../../consts/BattleConst";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import {DataResourceType} from "../../func/DataResourceFunc";
import ResourceConst from "../../consts/ResourceConst";
import InstanceLogical from "../../../battle/instance/InstanceLogical";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import TimerManager from "../../../../framework/manager/TimerManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import SubPackageManager from "../../../../framework/manager/SubPackageManager";
import FogFunc from "../../func/FogFunc";
import FogModel from "../../model/FogModel";
import FogPropTrigger from "../../../fog/trigger/FogPropTrigger";
import FogConst from "../../consts/FogConst";
import {ui} from "../../../../ui/layaMaxUI";
import JumpManager from "../../../../framework/manager/JumpManager";
import JumpConst from "../../consts/JumpConst";
import GameConsts from "../../consts/GameConsts";
import TweenAniManager from "../../manager/TweenAniManager";
import GameSwitch from "../../../../framework/common/GameSwitch";
import GameSwitchConst from "../../consts/GameSwitchConst";
import UserInfo from "../../../../framework/common/UserInfo";

export class BattleUI extends ui.gameui.battle.BattleUI implements IMessage {
	private controler: BattleLogicalControler;
	private levelId;
	private reviveHeroType;
	/**是否启用自动跟随 */
	public isUseCamera = true;
	/**最大能量 */
	public maxEnergy = 0;
	/**当前能量 */
	public nowEnergy = 0;
	/**恢复一点能量耗时 帧数 */
	public recoverPer = 60;
	private nowAreaMaxX = 0;
	/**开始触摸nowArea时的x坐标 */
	private _sMapStartTouchX: number;
	/**当前手机高度和小地图高度的比例 */
	public mapHeightRate: number = 1;
	public isAllowFollw = true
	//第一个角色
	public firstRole;
	private handBaseY = 0;
	private arrowCode = 0;
	//豪华开局效果id
	public battleAdditionId = 0;
	private tweenCode = 0;
	//飘字持续时间
	private continueTime = 0;
	//战斗变慢倍数
	private timeRate = 0;
	private recoverCode = 0;
	private energyCostTable = {};
	public levelName = ""
	private isVideoGetRole: boolean = false;//是否看视频获得角色
	private freeType: Number;
	private isShowRandomRoleEvent: Boolean = true;//是否可以进行随机角色的show打点

	constructor() {
		super();
		new ButtonUtils(this.pauseBtn, this.onClickPauseBtn, this);
		new ButtonUtils(this.returnMainBtn, this.onClickMainBtn, this);
		new ButtonUtils(this.continueBtn, this.onContinueBtn, this);
		new ButtonUtils(this.rePlayBtn, this.onReplayGame, this);
		new ButtonUtils(this.autoGroup, this.onClickCameraFollow, this);

		ScreenAdapterTools.alignNotch(this.topGroup, ScreenAdapterTools.Align_MiddleTop);
		this.battleCtn.on(Laya.Event.MOUSE_DOWN, this, this.onTouchBegin)
		this.battleCtn.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMove)
		this.battleCtn.on(Laya.Event.MOUSE_UP, this, this.onTouchUp)
		new ButtonUtils(this.startWarBtn, this.onClickStartWar, this);
		new ButtonUtils(this.roleSignBtn, this.onClickRoleSign, this);
		new ButtonUtils(this.enemySignBtn, this.onClickEnemySign, this);
		new ButtonUtils(this.revokeLineBtn, this.onClickRevokeLine, this);
		new ButtonUtils(this.helpRoleGroup, this.onClickHelpRole, this);
		TimerManager.instance.setTimeout(this.loadRes, this, 2000)
	}

	setData(data) {
		this.energyCostTable = {};
		this.battleAdditionId = 0;
		this.isVideoGetRole = false;
		this.isShowRandomRoleEvent = true;

		if (data && data.fullStart) {
			this.battleAdditionId = data.fullStart
		}


		SoundManager.playBGM(MusicConst.SOUND_BATTLE_BG);
		WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
		this.mapHeightRate = ScreenAdapterTools.height / 65;   //65为小地图高度
		this.pauseGroup.visible = false;
		this.isUseCamera = true;
		this.isAllowFollw = true;
		this.pauseBtn.visible = true;
		this.guideArrow.visible = false;
		this.skillTipGroup.visible = false;
		this.initTopShow(data);
		this.controler.initGame();
		if (data.helpRole) {
			this.controler.helpRoleId = data.helpRole;
			this.createHelpRole();
		} else {
			this.helpRoleGroup.visible = false;
		}
		BattleFunc.curGameState = null
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			this.controler.cameraControler.focusPos.x = this.controler.enemyHome.pos.x
			this.controler.cameraControler.inControlBg = true;
			BattleFunc.curGameState = BattleConst.WARSTATE_LINE;
			this.enemySignBtn.visible = false;
			this.roleSignBtn.visible = true;
			this.freshWarTipShow();
		} else {
			this.initHomeSkill();
		}
		this.initSmallMapTouchEvent();

		// 添加互推图标
		JumpManager.initJumpData(this.initJumpCall, this);
	}

	//后台加载资源
	loadRes() {
		SubPackageManager.loadDynamics(["group_role_08"], []);
	}

	/**创建助阵英雄 */
	createHelpRole() {
		this.helpRoleGroup.visible = true;
		var data = RolesFunc.instance.getCfgDatas("Role", this.controler.helpRoleId);
		this.helpbgImg.skin = ResourceConst.BATTLE_ICON_DI[data.qualityType];
		this.helpiconImg.skin = RolesFunc.instance.getBattleRoleIcon(data.battleIcon);
		this.controler.helpRoleCd = BattleFunc.instance.turnMinisecondToframe(data.tryParams.split(",")[1]);
		this.controler.helpRoleLeftCd = 0;
		this.freshHelpRoleState(0);

	}

	/**点击助阵英雄 */
	onClickHelpRole() {
		var level = Number(this.controler.levelCfgData.tryRoleNum[0])
		var starLevel = Number(this.controler.levelCfgData.tryRoleNum[1])
		if (this.controler.helpRoleLeftCd <= 0) {
			this.controler.createMyRole(this.controler.helpRoleId, level, starLevel);
			this.controler.helpRoleLeftCd = this.controler.helpRoleCd;
		}
	}

	/**刷新主线助阵英雄的cd */
	public freshHelpRoleState(leftCd) {
		if (leftCd <= 0) {
			this.helpmaskImg.visible = false;
		} else {
			this.helpmaskImg.visible = true;
			this.helpLeftTxt.changeText(leftCd + "")
		}
	}

	initJumpCall() {
		var itemWidth = 120
		var x = ScreenAdapterTools.width - itemWidth / 2 - 10;
		var y = ScreenAdapterTools.toolBarWidth + itemWidth / 2 + 100;
		var data = [
			{
				x: x,
				y: y,
				width: itemWidth
			}
		]
		JumpManager.addMainJump(this, JumpConst.BATTLE_SIDE, data, false, true, JumpConst.JUMP_KARIQU_BATTLEICON, false, 0, "#ffffff", false, 0, 0, 4, false)
	}

	initTopShow(data) {
		var isShowTalk = 1;
		if (data && data.isShowTalk) {
			isShowTalk = data.isShowTalk;
		}
		this.levelTxt.visible = false;
		this.rewardGroup.visible = false;
		this.autoGroup.visible = false;
		this.roleSignBtn.visible = false;
		this.enemySignBtn.visible = false;
		this.warTipGroup.visible = false;
		this.leftGroup.visible = false;
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
			this.levelTxt.visible = true;
			// this.rewardGroup.visible = true;
			this.autoGroup.visible = true;
			this.smallMapGroup.visible = true;
			this.bottomImg.height = 335;
			//普通战斗
			var nextLevel = data.levelId
			this.levelId = nextLevel;
			this.levelName = data.name;
			this.levelTxt.text = data.name + "  " + TranslateFunc.instance.getTranslate(LevelFunc.instance.getCfgDatasByKey("Level", this.levelId, "name"));
			this.freshNormalRoleList();
			this.freshReward();
			this.setNormalLevelEnergy();
			BattleSceneManager.instance.enterBattle({levelId: nextLevel}, this.battleCtn, this);
			StatisticsManager.ins.onEvent(StatisticsManager.LEVEL_START, {levelId: this.levelId, entrance: "main"});
			this.controler = BattleSceneManager.instance.autoBattleControler;
			if (!this.controler.guideControler.checkGuide_101()) {
				//主线关卡：判断是否打开对话界面
				if (isShowTalk != 2) {
					var levelInfo = LevelFunc.instance.getLevelInfoById(this.levelId);
					if (levelInfo.dialogue) {
						WindowManager.OpenUI(WindowCfgs.FogNpcTalkUI, {
							"viewType": FogConst.VIEW_TYPE_MAIN_LEVEL,
							level: this.levelId
						});
						BattleSceneManager.instance.setGamePlayOrPause(true);
					}
				}
			}
			this.openCameraImg.visible = this.isUseCamera;
		} else if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			//远征
			BattleSceneManager.instance.enterBattle({}, this.battleCtn, this);
			this.controler = BattleSceneManager.instance.autoBattleControler;
			this.setWarEnergy();
			this.freshWarRoleList();
			if (this.controler.guideControler.checkFogGuide_801()) {
				this.pauseBtn.visible = false;
			}
		}
	}

	/**显示剩余战斗时间 */
	showLeftTxt(txt) {
		if (txt == 0) {
			this.leftGroup.visible = false;
			return
		}
		if (!this.leftGroup.visible) {
			this.leftGroup.visible = true;
		}
		txt = Math.ceil(txt / GameConsts.gameFrameRate);
		if (txt <= BattleFunc.leftAniTime) {
			this.leftTxt.color = "#ff0400";
			this.leftDesTxt.color = "#ff0400";
			TweenAniManager.instance.scaleQipaoAni(this.leftGroup, 1.4, null, null, false, 500);
		} else {
			this.leftTxt.color = "#ffffff";
			this.leftDesTxt.color = "#ffffff";
		}
		this.leftTxt.text = txt + ""
	}

	freshWarTipShow() {
		this.warTipGroup.visible = true;
		this.smallMapGroup.visible = false;
		this.readyLineGroup.visible = false;
		this.startWarBtn.visible = false;
		this.revokeLineBtn.visible = false;
		this.bottomImg.height = 265;
		this.autoGroup.visible = false;
		this.isUseCamera = false;
		this.skillGroup.visible = false;
		if (BattleFunc.curGameState == BattleConst.WARSTATE_LINE) {
			//上阵
			this.readyLineGroup.visible = true;
		} else if (BattleFunc.curGameState == BattleConst.WARSTATE_CANFIGHT) {
			this.controler.cameraControler.inControlBg = false;
			this.controler.layerControler.isInTouch = false;
			this.controler.cameraControler.focusPos.x = this.controler.myHome.pos.x
			this.startWarBtn.visible = true;
			this.isUseCamera = true;
			this.freshCameraImg();
			this.roleSignBtn.visible = false;
			this.enemySignBtn.visible = true;
			this.revokeLineBtn.visible = true;
		} else if (BattleFunc.curGameState == BattleConst.WARSTATE_INFIGHT) {
			//4战斗中
			this.readyLineGroup.visible = false;
			this.smallMapGroup.visible = true;
			this.bottomImg.height = 335;
			this.warTipGroup.visible = false;
			this.roleSignBtn.visible = false;
			this.enemySignBtn.visible = false;
			this.revokeLineBtn.visible = false;
			this.autoGroup.visible = true;
			this.skillGroup.visible = true;
			this.isUseCamera = true;
			this.freshCameraImg();
			this.initHomeSkill();
			this.setRoleGray();
		}
	}

	freshCameraImg() {
		this.openCameraImg.visible = this.isUseCamera;
	}

	showArrow() {
		this.guideArrow.visible = true;
		TimerManager.instance.remove(this.arrowCode);
		this.handBaseY = this.guideArrow.y;
		Laya.Tween.clearTween(this.guideArrow)
		if (this.guideArrow.visible) {
			this.addHandTween();
			this.arrowCode = TimerManager.instance.add(this.addHandTween, this, 600);
		}
	}

	addHandTween() {
		Laya.Tween.to(this.guideArrow, {y: this.handBaseY + 10}, 200, null, Laya.Handler.create(this, () => {
			Laya.Tween.to(this.guideArrow, {y: this.handBaseY - 10}, 200, null, Laya.Handler.create(this, () => {
				Laya.Tween.to(this.guideArrow, {y: this.handBaseY}, 200, null, null)
			}))
		}))
	}

	/**初始化基地技能 */
	initHomeSkill() {
		this.skillGroup.removeChildren();
		this.controler.battleSkillnoCd = false;
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
			//主线显示cd开关关闭并且分享和视频不关闭的情况下 免cd
			if (!GameSwitch.checkOnOff(GameSwitchConst.SWITCH_BATTLE_SKILLCD) && ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLE_USESKILL) != ShareOrTvManager.TYPE_QUICKRECEIVE) {
				this.controler.battleSkillnoCd = true;
			}
		}
		var homeLevel = RolesModel.instance.getRoleLevelById(GlobalParamsFunc.instance.getDataNum("bornHomeId"));
		var homeSkill = GlobalParamsFunc.instance.getDataArray("baseSkillList");
		var unlockSkill = [];
		for (var i = 0; i < homeSkill.length; i++) {
			var info = homeSkill[i].split(",");
			if (Number(info[0]) <= homeLevel) {
				unlockSkill.push(info[1]);
			}
		}

		this.controler.skillContent = this.controler.createSkillContent(unlockSkill, this.skillGroup);
	}

	/**设置远征模式能量 */
	setWarEnergy() {
		//初始能量=大巴车等级attribute的第三个字段+道具+心灵鸡汤
		this.maxEnergy = FogFunc.instance.getCfgDatasByKey("BusUpGrade", FogModel.instance.getBusLevel(), "attribute")[2] + FogModel.fogAddEnergy;
		FogPropTrigger.checkPropTriggerOnInstance(FogPropTrigger.Prop_type_AddEnergy, this);
		this.nowEnergy = this.maxEnergy;
		this.freshEnergyShow();
	}

	/**设置普通战斗能量信息 */
	setNormalLevelEnergy() {
		//是否有开场满能量
		this.maxEnergy = GlobalParamsFunc.instance.getDataNum("energyMaxNub");
		if (this.battleAdditionId && this.battleAdditionId == BattleConst.battle_start_full_energy) {
			this.nowEnergy = this.maxEnergy;
		} else {
			this.nowEnergy = GlobalParamsFunc.instance.getDataNum("energyBattleStartNub");
		}

		//判断是否有能量恢复的加成
		var energyRestoreNub = GlobalParamsFunc.instance.getDataNum("energyRestoreNub");
		if (this.battleAdditionId && this.battleAdditionId == BattleConst.battle_start_energy_resume) {
			var battleAddNum = LevelFunc.instance.getBattleAddtionoByTwoId(this.battleAdditionId, "addtionNub") / 10000;
			this.recoverPer = BattleFunc.instance.turnMinisecondToframe(energyRestoreNub * (1 - battleAddNum));
		} else {
			this.recoverPer = BattleFunc.instance.turnMinisecondToframe(energyRestoreNub);
		}
		this.freshEnergyShow();
	}

	/**刷新能量显示 */
	freshEnergyShow() {
		this.energyImg.height = this.nowEnergy * 140 / this.maxEnergy > 140 ? 140 : this.nowEnergy * 140 / this.maxEnergy;
		this.energyTxt.text = this.nowEnergy + "";
		this.roleList.refresh();
	}

	/**加迷雾能量 */
	public addFogEnergy(percent) {
		var count = Math.ceil(this.maxEnergy * percent);
		this.nowEnergy += count;
		this.freshEnergyShow();
	}

	/**自动恢复能量 */
	public autoAddEnergy() {
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) return;
		if (this.nowEnergy >= this.maxEnergy) return;
		this.nowEnergy += 1;
		this.freshEnergyShow();
	}

	freshReward() {
		var rewardList = LevelFunc.instance.getLevelInfoById(this.levelId).victoryReward;
		var coin = 0;
		var gold = 0;
		for (var index in rewardList) {
			var reward = rewardList[index].split(",");
			switch (Number(reward[0])) {
				case DataResourceType.COIN:
					coin += Number(reward[1]);
					break;
				case DataResourceType.GOLD:
					gold += Number(reward[1]);
					break;
			}
		}
		if (gold) {
			this.levelRewardImg.skin = ResourceConst.GOLD_PNG;
			this.levelReward.text = StringUtils.getCoinStr(gold + "");
		} else {
			this.levelRewardImg.skin = ResourceConst.COIN_PNG;
			this.levelReward.text = StringUtils.getCoinStr(coin + "");
		}


	}

	/**设置远征战斗角色的list */
	freshWarRoleList() {
		var data = FogModel.instance.getFogRoleWithRandom();
		this.roleList.array = data;
		this.roleList.renderHandler = new Laya.Handler(this, this.onListRender2);
	}

	/**设置普通战斗角色的list */
	freshNormalRoleList() {
		var data = RolesModel.instance.getInLineRole();
		this.roleList.array = data;
		this.roleList.renderHandler = new Laya.Handler(this, this.onListRender2);
	}

	private onListRender2(cell: Laya.Box, index: number): void {
		var data = this.roleList.array[index];
		cell.offAll();
		var item = cell.getChildByName("item") as Laya.Image;
		var roleUnlockGroup = item.getChildByName("roleUnlockGroup") as Laya.Image;
		var roleLockGroup = item.getChildByName("roleLockGroup") as Laya.Image;

		var bg = roleUnlockGroup.getChildByName("bgImg") as Laya.Image;
		var icon = roleUnlockGroup.getChildByName("iconImg") as Laya.Image;
		var cost = roleUnlockGroup.getChildByName("energyCost") as Laya.Label;
		var maskImg = roleUnlockGroup.getChildByName("maskImg") as Laya.Image;
		var maskImgLock = roleLockGroup.getChildByName("maskImg") as Laya.Image;

		var freeImg = roleLockGroup.getChildByName("freeImg") as Laya.Image;
		roleLockGroup.visible = false;
		roleUnlockGroup.visible = true;
		maskImg.visible = true;


		var energy = this.energyCostTable[data.id];
		var isRandom = data.isRandom || 0;
		if (!this.energyCostTable[data.id]) {
			energy = RolesFunc.instance.setEnergyCost(data.id, data.payEnergyNmb);
			this.energyCostTable[data.id] = energy
		}
		if (energy <= this.nowEnergy) {
			maskImg.visible = false;
			if (!item["__lastButtonUtils"] || (item["__lastButtonUtils"] && item["id"] && item["id"] != data.id)) {
				item["id"] = data.id
				new ButtonUtils(item, this.onClickRoleItem, this, null, null, [data.id, energy, isRandom, roleLockGroup, roleUnlockGroup])
			}
		}

		if (BattleFunc.curGameState == BattleConst.WARSTATE_INFIGHT && !this.controler.inFogReviveBattle) {
			maskImg.visible = true;
		}

		if (!this.isVideoGetRole && isRandom) {
			roleLockGroup.visible = true;
			roleUnlockGroup.visible = false;
			this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_BATTLE_ADDROLE);
			freeImg.skin = ShareTvOrderFunc.instance.getFreeImgSkin(this.freeType);
			if (this.isShowRandomRoleEvent && this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_RANDROLE_SHOW);
				this.isShowRandomRoleEvent = false;
			}

			if (BattleFunc.curGameState == BattleConst.WARSTATE_INFIGHT && !this.controler.inFogReviveBattle) {
				maskImgLock.visible = true;
			} else {
				maskImgLock.visible = false;
			}
		}

		bg.skin = ResourceConst.BATTLE_ICON_DI[data.qualityType];
		icon.skin = RolesFunc.instance.getBattleRoleIcon(data.battleIcon);
		cost.text = energy + "";

		if (index == 0 && !this.firstRole) {
			this.firstRole = item;
		}
	}

	//初始化nowArea拖拽
	initSmallMapTouchEvent() {
		//先初始化区域的宽度
		this.nowArea.visible = true;
		this.nowArea.width = ScreenAdapterTools.width * this.smallMapGroup.width / this.controler.mapControler._maxSceneWidth;
		this.nowArea.x = 0;
		this.nowAreaMaxX = this.smallMapGroup.width - this.nowArea.width;
		this.nowArea.on(Laya.Event.MOUSE_DOWN, this, this.touchBeginMap);
		this.nowArea.on(Laya.Event.MOUSE_MOVE, this, this.touchMoveMap);
		this.nowArea.on(Laya.Event.MOUSE_UP, this, this.touchOverMap);
		this.smallMapBg.on(Laya.Event.CLICK, this, this.clickSmallBg);
		this.smallMapBg.on(Laya.Event.MOUSE_DOWN, this, this.touchBeginMap);
		this.smallMapBg.on(Laya.Event.MOUSE_MOVE, this, this.touchMoveMap);
		this.smallMapBg.on(Laya.Event.MOUSE_UP, this, this.touchOverMap);

	}

	clickSmallBg(event) {
		var point = new Laya.Point(event.stageX, 0);
		var local = this.smallMapGroup.globalToLocal(point)
		this.moveNowArea(local.x - this.nowArea.width / 2 - this.nowArea.x);
		this.touchBeginMap(event);
		this.controler.setCallBack(60 * 5, this.resstCameraFollow, this)
	}

	touchBeginMap(event) {
		this.controler && this.controler.clearCallBack(this, this.resstCameraFollow)
		this.isAllowFollw = false;
		this._sMapStartTouchX = event.stageX;

	}

	touchMoveMap(event) {
		if (!this._sMapStartTouchX) return;
		this.moveNowArea(event.stageX - this._sMapStartTouchX);
		this._sMapStartTouchX = event.stageX;
		if (GuideManager.ins.recentGuideId == GuideConst.GUIDE_1_103) {
			this.controler.guideControler.checkGuide_104_finish();
		}

	}

	touchOverMap(event) {
		this._sMapStartTouchX = null;
		this.controler.setCallBack(60 * 5, this.resstCameraFollow, this)

	}

	resstCameraFollow() {
		this.isAllowFollw = true
	}

	//刷新小地图上指示当前显示区域的位置
	moveNowArea(x) {
		this.nowArea.x += x;
		if (this.nowArea.x < 0) {
			this.nowArea.x = 0;
		}
		if (this.nowArea.x > this.nowAreaMaxX) {
			this.nowArea.x = this.nowAreaMaxX;
		}
		var tempPos = this.controler.cameraControler.focusPos.x + x * this.controler.layerControler.sceneWidthRate
		tempPos = this.controler.layerControler.getTweenEndPos(tempPos);
		this.controler.cameraControler.focusPos.x = tempPos
		this.controler.cameraControler.updateCtnPos(1);
	}

	//刷新小地图
	freshSmallMap(x) {
		this.nowArea.x += x;
		if (this.nowArea.x < 0) {
			this.nowArea.x = 0;
		}
		if (this.nowArea.x > this.nowAreaMaxX) {
			this.nowArea.x = this.nowAreaMaxX;
		}
	}

	private onClickRoleItem(info) {
		//开战后不能出兵
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR && BattleFunc.curGameState == BattleConst.WARSTATE_INFIGHT && !this.controler.inFogReviveBattle) return;
		var id = info[0];
		var cost = info[1];
		var isRandom = info[2];
		var roleLockGroup = info[3];
		var roleUnlockGroup = info[4];
		//是否随机
		if (!this.isVideoGetRole && isRandom) {
			this.controler.setGamePlayOrPause(true);
			if (this.freeType == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_RANDROLE_CLICK);
			}
			ShareOrTvManager.instance.shareOrTv(ShareTvOrderFunc.SHARELINE_FOG_BATTLE_ADDROLE, ShareOrTvManager.TYPE_ADV, {
				id: "1",
				extraData: {}
			}, () => {
				//刷新list显示
				roleLockGroup.visible = false;
				roleUnlockGroup.visible = true;
				this.isVideoGetRole = true;

				if (this.freeType == ShareOrTvManager.TYPE_ADV) {
					StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_RANDROLE_FINISH);
				} else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
					StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_RANDROLE_FINISH);
				}
				this.controler.setGamePlayOrPause(false);
			}, () => {
				this.controler.setGamePlayOrPause(false)
			}, this);
		} else {
			if (cost > this.nowEnergy) return;
			if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR && BattleFunc.curGameState != BattleConst.WARSTATE_CANFIGHT && !this.controler.inFogReviveBattle) {
				BattleFunc.curGameState = BattleConst.WARSTATE_CANFIGHT
				this.freshWarTipShow();
			}
			this.controler.createMyRole(id);
			this.nowEnergy -= cost;
			this.freshEnergyShow();
		}

	}

	private onClickPauseBtn() {
		// if (!this.controler) {
		//     return;
		// }
		this.pauseGroup.visible = true;
		//设置游戏暂停
		BattleSceneManager.instance.setGamePlayOrPause(true);
	}

	onClickCameraFollow() {
		this.isUseCamera = !this.isUseCamera;
		this.openCameraImg.visible = this.isUseCamera;

	}

	//点击回主界面
	private onClickMainBtn() {
		this.close();
		// 头条停止录屏
		if (ShareOrTvManager.instance.canShareVideo()) {
			UserInfo.platform.recordStop();
		}
		BattleSceneManager.instance.exitBattle();
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
			var chapMap = WindowManager.getUIByName(WindowCfgs.ChapterMapUI);
			if (!chapMap) {
				WindowManager.OpenUI(WindowCfgs.ChapterMapUI, {chapterId: this.levelName.split("-")[0]})
			}
		}
	}

	//继续比赛
	private onContinueBtn() {
		BattleSceneManager.instance.setGamePlayOrPause(false);
		this.pauseGroup.visible = false;
	}

	//重玩关卡
	private onReplayGame() {
		// 头条停止录屏
		if (ShareOrTvManager.instance.canShareVideo()) {
			UserInfo.platform.recordStop();
		}
		SoundManager.stopMusicOrSound(MusicConst.SOUND_BATTLE_BG);
		//修改reviveCount的计数
		Message.instance.send(BattleEvent.BATTLEEVENT_REVIEW_RESET_REVIVECOUNT);
		this.pauseGroup.visible = false;
		BattleSceneManager.instance.replayBattle(true);
		StatisticsManager.ins.onEvent(StatisticsManager.LEVEL_START, {levelId: this.levelId, entrance: "replay"});
		this.resetStatus();

	}

	onTouchBegin(event) {
		this.controler.layerControler.onTouchBegin(event)
	}

	onTouchMove(event) {
		this.controler.layerControler.onTouchMove(event)

	}

	onTouchUp(event) {
		this.controler.layerControler.onTouchUp(event)

	}

	/**点击我方标志 */
	onClickRoleSign() {
		this.isUseCamera = false;
		this.controler.cameraControler.focusPos.x = this.controler.myHome.pos.x
		this.controler.cameraControler.inControlBg = true;
		this.roleSignBtn.visible = false;
		this.enemySignBtn.visible = true;
	}

	/**点击撤销 */
	onClickRevokeLine() {
		this.controler.clearAllRole();
		this.revokeLineBtn.visible = false;
		this.setWarEnergy();
		BattleFunc.curGameState = BattleConst.WARSTATE_LINE;
		this.freshWarTipShow();
	}

	/**点击敌方标志 */
	onClickEnemySign() {
		this.isUseCamera = false;
		this.controler.cameraControler.focusPos.x = this.controler.enemyHome.pos.x
		this.controler.cameraControler.inControlBg = true;
		this.roleSignBtn.visible = true;
		this.enemySignBtn.visible = false;
	}

	/**点击开始进攻 */
	onClickStartWar() {
		var isCanLine = false;
		for (var key in this.energyCostTable) {
			var cost = this.energyCostTable[key];
			if (cost <= this.nowEnergy) {
				isCanLine = true;
				break;
			}
		}
		if (!isCanLine) {
			this.startWar();
		} else {
			var data = {
				callBack: this.startWar,
				thisObj: this
			}
			WindowManager.OpenUI(WindowCfgs.FogStartWarUI, data)
		}

	}

	//开始远征进攻
	startWar() {
		BattleFunc.curGameState = BattleConst.WARSTATE_INFIGHT;
		this.freshWarTipShow();
		this.controler.addAllTiggerOnBorn()
	}

	//创建一个x小红点/小蓝点   obj必须包含属性  isPlayer  来区分己方还是敌方
	createOneMapPoint(obj: InstanceLogical) {
		var point: Laya.Image;
		var type = obj.lifeType;
		if (obj.camp == BattleConst.ROLEGROUP_MYSELF) {
			if (type == BattleConst.LIFE_JIDI) {
				point = PoolTools.getItem(PoolCode.SELF_MAP_HOME_POINT_POOL) || new Laya.Image(ResourceConst.SELF_MAP_HOME_POINT);
				point.anchorY = 0.5;
			} else if (type == BattleConst.LIFE_AIRHERO) {
				point = PoolTools.getItem(PoolCode.SELF_MAP_SKY_POINT_POOL) || new Laya.Image(ResourceConst.SELF_MAP_SKY_POINT);

			} else {
				point = PoolTools.getItem(PoolCode.SELF_MAP_POINT_POOL) || new Laya.Image(ResourceConst.SELF_MAP_POINT);

			}
		} else {
			if (type == BattleConst.LIFE_JIDI) {
				point = PoolTools.getItem(PoolCode.ENEMY_MAP_HOME_POINT_POOL) || new Laya.Image(ResourceConst.ENEMY_MAP_HOME_POINT);
				point.anchorY = 0.5;
			} else if (type == BattleConst.LIFE_AIRHERO) {
				point = PoolTools.getItem(PoolCode.ENEMY_MAP_SKY_POINT_POOL) || new Laya.Image(ResourceConst.ENEMY_MAP_SKY_POINT);
			} else {
				point = PoolTools.getItem(PoolCode.ENEMY_MAP_POINT_POOL) || new Laya.Image(ResourceConst.ENEMY_MAP_POINT);

			}
		}
		this.pointGroup.addChild(point);
		this.setSmallMapXByScreen(point, obj.pos);
		return point;
	}

	setRoleGray() {
		this.roleList.refresh();
	}

	//将相对场景的xy转换为小地图里的xy
	setSmallMapXByScreen(point, screenPos) {
		if (this.controler.layerControler) {
			point.x = screenPos.x / this.controler.layerControler.sceneWidthRate;
			point.y = (screenPos.z + screenPos.y) / this.mapHeightRate;
		}

	}

	setGameNormalSpeed() {
		this.setGameSpeed(1);
	}

	/**
	 * 刷新技能瓢字
	 * @param name
	 */
	freshSkillTipGroup(name, continueTime, timeScale) {
		this.continueTime = continueTime;
		this.timeRate = timeScale;
		Laya.Tween.clearTween(this.skillTipGroup)
		TimerManager.instance.clearTimeout(this.tweenCode);
		this.setGameSpeed(this.timeRate);
		TimerManager.instance.clearTimeout(this.recoverCode);
		this.recoverCode = TimerManager.instance.setTimeout(this.setGameNormalSpeed, this, this.continueTime);
		if (this.skillTipGroup.visible) {
			this.skillTipHideTween([this.skillTipShowTween, name, 0.2])
		} else {
			this.skillTipShowTween(name);
		}
	}

	//展示技能飘字
	skillTipShowTween(name = null) {
		if (name) {
			this.skillIcon.skin = "uisource/battle/battle/" + name + ".png";
		}
		this.skillTipGroup.x = 0 - this.skillTipGroup.width;
		this.skillTipGroup.visible = true;
		this.skillTipGroup.alpha = 1;
		Laya.Tween.to(this.skillTipGroup, {x: 0}, 300, null, Laya.Handler.create(this, () => {
			this.tweenCode = TimerManager.instance.setTimeout(this.skillTipHideTween, this, 300, [null, name, 0.5])
		}));
	}

	//隐藏技能飘字
	skillTipHideTween(data) {
		var callBack = data[0];
		var name = data[1];
		var rate = data[2];
		var times = (ScreenAdapterTools.width - this.skillTipGroup.x) * rate;
		Laya.Tween.to(this.skillTipGroup, {
			x: ScreenAdapterTools.width,
			alpha: 0
		}, times, null, Laya.Handler.create(this, () => {
			this.skillTipGroup.visible = false;
			callBack && callBack.call(this, name);
		}))
	}

	setGameSpeed(speed) {
		var arr = this.controler.getAllInstanceArr();
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			if (!item.ignoreTimeScale) {
				item.setUpTimeScale(speed)
			}
		}
	}

	public close() {
		//关掉战斗界面
		WindowManager.CloseUI(WindowCfgs.BattleUI);
	}


	updateBlood(waveLeftHp, waveTotalHp) {

	}

	updateGameTime(leftFrame, batteTotalFrame) {

	}

	resetStatus() {
	}

	recvMsg() {

	}

}
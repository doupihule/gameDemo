import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import LevelFunc from "../../func/LevelFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import ButtonConst from "../../../../framework/consts/ButtonConst";
import ResourceConst from "../../consts/ResourceConst";
import DataResourceFunc, {DataResourceType} from "../../func/DataResourceFunc";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import BattleFunc from "../../func/BattleFunc";
import BattleRoleView from "../../../battle/view/BattleRoleView";
import PoolTools from "../../../../framework/utils/PoolTools";
import PoolCode from "../../consts/PoolCode";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import SubPackageManager from "../../../../framework/manager/SubPackageManager";
import SubPackageConst from "../../consts/SubPackageConst";
import UserModel from "../../model/UserModel";
import RolesModel from "../../model/RolesModel";
import TimerManager from "../../../../framework/manager/TimerManager";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import GameUtils from "../../../../utils/GameUtils";
import RolesFunc from "../../func/RolesFunc";
import UserInfo from "../../../../framework/common/UserInfo";
import FogFunc from "../../func/FogFunc";
import FogConst from "../../consts/FogConst";
import FogModel from "../../model/FogModel";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import FogEventData from "../../../fog/data/FogEventData";
import BattleConst from "../../consts/BattleConst";
import LogsManager from "../../../../framework/manager/LogsManager";
import FogPropTrigger from "../../../fog/trigger/FogPropTrigger";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";
import TableUtils from "../../../../framework/utils/TableUtils";
import DisplayUtils from "../../../../framework/utils/DisplayUtils";
import StatisticsManager from "../../manager/StatisticsManager";
import MainJumpReturnComp from "../../../../framework/platform/comp/MainJumpReturnComp";

export default class BattleDetailUI extends ui.gameui.battle.BattleDetailUI implements IMessage {
	public levelId;
	private timeCode = 0;
	//需要的背景块数
	private _pickNums = 3;
	/**一共有的地图块数 */
	private _allMapCount: number = 5;
	//每块区域的宽度
	private _areaWidth: number = 256;
	/**128小地图的展示次数 */
	private _smallMapCount = 0;
	//英雄列表
	private heroArr = [];
	//敌人列表
	private enemyArr = [];
	private roleTxtArr = [];
	private enemyTxtArr = [];
	private lastLevelId;
	//说话方  1是我方 2是敌方
	private speakLine = 1;
	private roleAniArr = [];
	private extraScale = 1;
	private mapInfo;
	private mapName;
	private equipUnlock = 20;

	private viewType;//页面类型
	private eventInfo;//敌人事件cfg
	private enemyId;//敌人id
	private enemyType;//敌人类型
	public actCost;//敌人事件：需要消耗的行动力
	private cell;  //触发当前事件的格子
	/**奖励增加的比例 */
	public addPercent = 1;
	private levelName
	/**助阵角色 */
	private helpRoleId = null;
	private helpItem;
	private isUseHelpRole = false;

	constructor() {
		super();
		new ButtonUtils(this.startGameBtn, this.onClickStartGame, this);
		new ButtonUtils(this.startGameBtn1, this.onClickStartGame, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
		new ButtonUtils(this.returnBtn, this.onClickReturn, this);
		new ButtonUtils(this.fogFullStartBtn, this.onClickFogFull, this).setBtnType(ButtonConst.BUTTON_TYPE_4);
		new ButtonUtils(this.helpRoleBtn, this.onClickHelpRole, this)

	}

	public setData(data) {
		MainJumpReturnComp.instance.showJumpReturnBtn(this);
		this.eventInfo = {};
		this.actCost = 0;
		this.helpRoleId = null;
		this.helpItem = null;
		this.isUseHelpRole = false;
		this.firstOver.visible = false;
		this.spGroup.visible = false;
		this.helpRoleBtn.visible = false;
		//页面类型：默认为战斗预览界面
		this.viewType = FogConst.VIEW_TYPE_BATTLE_DETAIL;
		BattleFunc.curBattleType = BattleConst.BATTLETYPE_NORMAL;
		//敌人事件需要传入的参数：event
		if (data && data.event) {
			var event: FogEventData = data.event;
			this.viewType = FogConst.VIEW_TYPE_FOG_ENEMY;
			this.eventInfo = event.cfgData;
			this.enemyId = event.enemyId;
			this.enemyType = event.enemyType;
			BattleFunc.curBattleType = BattleConst.BATTLETYPE_WAR;
		}
		FogFunc.enemyCell = data && data.cell;
		var nextLevel = Number(UserModel.instance.getMaxBattleLevel()) + 1;
		if (data && data.level) {
			nextLevel = data.level;
		} else {
			if (nextLevel > LevelFunc.instance.getMaxLevel()) {
				nextLevel = LevelFunc.instance.getMaxLevel();
			}
		}
		this.equipUnlock = GlobalParamsFunc.instance.getDataNum("equipUnlock") || 20;
		this._smallMapCount = 0;
		this.levelId = nextLevel;
		this.helpRoleId = this.setBattleHelpRole();
		if (this.viewType == FogConst.VIEW_TYPE_BATTLE_DETAIL) {
			this.spGroup.visible = true;
			this.levelName = data.name
			this.levelTxt.text = data.name + "  " + TranslateFunc.instance.getTranslate(LevelFunc.instance.getCfgDatasByKey("Level", this.levelId, "name"));
			var levelCfg = BattleFunc.instance.getCfgDatas("Level", this.levelId)
			this.desTxt.text = TranslateFunc.instance.getTranslate(levelCfg.levelLoading);

			this.actCostGroup.visible = false;
			if (this.levelId > UserModel.instance.getMaxBattleLevel()) {
				this.firstOver.visible = true;
				var reward = FogFunc.instance.getResourceShowInfo(levelCfg.firstReward[0].split(","))
				this.firstOverRewardImg.skin = reward["icon"]
				this.firstOverRewardTxt.text = reward["num"]
			}
		} else if (this.viewType == FogConst.VIEW_TYPE_FOG_ENEMY) {
			FogModel.fogAddEnergy = 0;
			//显示敌人名字
			this.levelTxt.text = FogFunc.enemyCell.eventData.enemyName;

			//显示事件配置的描述
			this.desTxt.text = TranslateFunc.instance.getTranslate(this.eventInfo.desc, "TranslateEvent");

			//按钮消耗
			this.actCost = event.mobilityCost ? event.mobilityCost : 0;
			if (this.actCost) {
				this.actCostGroup.visible = true;
				this.costNum.text = "-" + this.actCost;
			}
		}

		this.extraScale = GlobalParamsFunc.instance.getDataNum("roleSizeInPreUi") / 10000;
		this.heroArr = [];
		this.enemyArr = [];
		this.roleTxtArr = [];
		this.enemyTxtArr = [];
		this.roleAniArr = [];
		this.roleCtn.removeChildren();
		this.txtCtn.removeChildren();
		this.showRole();
		this.showMap();
		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			this.setWarReward();
		} else {
			this.setReward();
		}
		//迷雾战斗引导中不可退出
		if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_7_702) {
			this.returnBtn.visible = false
			GuideManager.ins.guideFin(GuideConst.GUIDE_7_702, () => {
				WindowManager.CloseGuideUI(WindowCfgs.GuideUI)
			}, this)
		} else {
			this.returnBtn.visible = true;
		}
		this.setFogFullBtnShow();
		this.showGuide_207()
	}

	s

	/**展示开始战斗引导 */
	showGuide_207() {
		if (GuideManager.ins.recentGuideId == GuideConst.GUIDE_2_206) {
			GuideManager.ins.setGuideData(GuideConst.GUIDE_2_207, GuideManager.GuideType.Static, this.startGameBtn1, this);
			GuideManager.ins.openGuideUI(GuideConst.GUIDE_2_207);
		}
	}

	showGuide_207_finish() {
		if (GuideManager.ins.nowGuideId == GuideConst.GUIDE_2_207) {
			GuideManager.ins.guideFin(GuideConst.GUIDE_2_207, () => {
				WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
			}, this, true)
		}
	}

	/**设置远征结算奖励 */
	setWarReward() {
		this.addPercent = 1;
		//结算货币加成的道具检测
		FogPropTrigger.checkPropTriggerOnInstance(FogPropTrigger.Prop_type_AddMoneyPer, this);
		var enemy: FogEventData = FogFunc.enemyCell.eventData;
		var reward = enemy.enemyData.reward;
		this.levelRewardImg.skin = DataResourceFunc.instance.getDataResourceInfo(reward)["img"];
		this.levelReward.text = Math.floor((reward[1] + reward[2] * FogModel.instance.getCurLayer()) * this.addPercent) + "";
	}

	setReward() {
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

	/**设置心灵鸡汤显示 */
	setFogFullBtnShow() {
		this.fogFullStartBtn.visible = false;

		if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			this.startGameBtn.visible = true;
			this.startGameBtn1.visible = false;
			var info = GlobalParamsFunc.instance.getDataArray("fogBattleAddtion");
			var itemCount = FogModel.instance.getPropNum(info[0]);
			//如果所需道具数量够或者可以看视频 就显示
			if (itemCount > 0 || ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLE_START) != ShareOrTvManager.TYPE_QUICKRECEIVE) {
				this.fogFullStartBtn.visible = true
			}
		} else {
			this.startGameBtn1.visible = true;
			this.startGameBtn.visible = false;
		}
	}

	/**显示地图 */
	showMap() {
		this.bgCtn.removeChildren();
		var mapId;
		//迷雾模式 取敌人表的地图
		if (this.viewType == FogConst.VIEW_TYPE_FOG_ENEMY) {
			if (FogFunc.enemyCell) {
				var event: FogEventData = FogFunc.enemyCell.eventData;
				mapId = FogFunc.instance.getCfgDatasByKey("Enemy", event.params[0], "sceneId")
			} else {
				LogsManager.errorTag("", "没有当前的敌人事件格子")
			}
		} else {
			mapId = BattleFunc.instance.getCfgDatasByKey("Level", this.levelId, "sceneId") || 1;
		}
		var sceneInfo = BattleFunc.instance.getCfgDatas("Scene", mapId);
		var backInfo = sceneInfo.background;
		var mapName = backInfo[0];
		this.mapName = mapName;
		var mapStartIndex = Number(backInfo[1]);
		var startOffest = Number(backInfo[2]);
		this.mapInfo = {
			ctn: this.bgCtn,
			infoArr: []
		}
		this.bgCtn.x = -ScreenAdapterTools.sceneOffsetX - ScreenAdapterTools.UIOffsetX - startOffest;
		for (var i = 1; i <= this._pickNums; i++) {
			//判断当前的图块id是否超了图块数量
			this.createOneView(mapName, i, mapStartIndex);
			mapStartIndex = mapStartIndex + 1 > this._allMapCount ? 1 : mapStartIndex + 1;
		}
	}

	private createOneView(firstName, index, mapId) {
		var imageUrl1: string;

		var name: string;
		var path: string;
		name = firstName + "_0" + mapId
		path = "map/" + firstName + "/" + name;

		var image = new Laya.Image();
		if (UserInfo.isSystemNative()) {
			imageUrl1 = "map/" + firstName + "/" + name + ".png";
		} else {
			imageUrl1 = "map/" + firstName + "/" + firstName + "/" + name + ".png";
			image.scale(2 * (1 + 2 / 256), 2);
		}

		this.bgCtn.addChild(image)
		var posIndex = (index - 1) * 2;
		var xpos = posIndex * this._areaWidth - this._smallMapCount * 256;
		if (mapId == 5) {
			this._smallMapCount += 1;
		}
		image.anchorX = 0;
		image.x = xpos;
		image.y = 0;
		var viewInfo = {view: image};
		this.mapInfo.infoArr.push(viewInfo)
		var onMapComplete = () => {
			image.skin = imageUrl1;
		}
		//必须地图组是分包的就直接走;
		if (SubPackageManager.getPackStyle(SubPackageConst.packName_map) == SubPackageConst.PATH_STYLE_SUBPACK) {
			SubPackageManager.loadDynamics(firstName, path, onMapComplete, this);
		} else {
			onMapComplete();
		}

	}

	/**展示角色 */
	showRole() {
		this.setShowRole();
		for (var i = 0; i < this.enemyArr.length; i++) {
			var x = ScreenAdapterTools.width / 2 + 160 + 120 * Math.floor(i / 3);
			var y = 600 + 150 * (i % 3);
			this.setRoleAni(i, x, y, -1, this.enemyArr, this.enemyTxtArr, true);
		}
		var heroArrlength = this.heroArr.length
		for (var i = 0; i < heroArrlength; i++) {
			var x = 0;
			var y = 0;
			if (heroArrlength > 6 && i > 2) {
				x = ScreenAdapterTools.width / 2 - 50 - 120 * Math.floor(3 / 3);
				y = 550 + 100 * (i % 4)
			} else {
				x = ScreenAdapterTools.width / 2 - 50 - 120 * Math.floor(i / 3);
				y = 600 + 150 * (i % 3);
			}
			this.setRoleAni(i, x, y, 1, this.heroArr, this.roleTxtArr);
		}
		this.freshSpeakInfo();
		this.timeCode = TimerManager.instance.add(this.freshSpeakInfo, this, GlobalParamsFunc.instance.getDataNum("preSpeakInterval"))
	}

	setRoleAni(i, x, y, viewWay, arr, txtArr, isForce = false) {
		var role: Laya.Image = new Laya.Image();
		role.anchorX = 0.5;
		role.anchorY = 1;
		this.roleCtn.addChild(role);
		var item = arr[i];
		var cacheItem: BattleRoleView = PoolTools.getItem(PoolCode.POOL_ROLE + item.id + "_" + viewWay);
		var scale = (BattleFunc.instance.getCfgDatasByKey("Role", item.id, "scale") / 10000 || 1);
		var showScale = scale * BattleFunc.defaultScale * this.extraScale;
		if (!cacheItem) {
			if (BattleFunc.curBattleType == BattleConst.BATTLETYPE_NORMAL) {
				isForce = false;
			}
			cacheItem = BattleFunc.instance.createRoleSpine(item.id, item.level, 2, showScale, true, isForce, "BattleDetaiUI");
		} else {
			cacheItem.setItemViewScale(showScale);
		}
		cacheItem.scaleX = viewWay;
		var size = BattleFunc.instance.getCfgDatasByMultyKey("RoleUpdate", item.id, item.level, "size");
		role.addChild(cacheItem);
		var halfWidth = size[0] * scale * this.extraScale / 2;
		var height = size[1] * scale * this.extraScale
		cacheItem.play("idle", true);
		role.x = x;
		role.y = y;
		var ctn = this.addSpeak(viewWay);
		this.txtCtn.addChild(ctn);
		ctn.x = x + halfWidth * viewWay;
		ctn.y = y - height;
		ctn.visible = false;
		if (item.helpRole) {
			this.helpItem = cacheItem;
			DisplayUtils.setViewDark(cacheItem);
			this.helpRoleBtn.visible = true;
			this.helpRoleBtn.x = x;
			this.helpRoleBtn.y = y + 20;
			var type = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLE_TRYROLE)
			this.helpFreeImg.skin = ShareOrTvManager.instance.getFreeImgSkin(type);
			if (type == ShareOrTvManager.TYPE_ADV) {
				StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_ROLETRY_SHOW, {
					levelId: this.levelId,
					roleId: this.helpRoleId
				})
			}

		}
		txtArr.push({ctn: ctn, speak: BattleFunc.instance.getCfgDatasByKey("Role", item.id, "preSpeak")})
		this.roleAniArr.push({item: cacheItem, id: item.id, viewWay: viewWay})
		if (this.levelId >= this.equipUnlock) {
			var star = new Laya.Image();
			star.width = 100;
			star.anchorX = 0.5;
			star.x = x;
			star.y = y - height - 20;
			this.txtCtn.addChild(star);
			RolesFunc.instance.addStarImg(star, item.id, 20, 20, item.starLevel)
		}

	}

	addSpeak(viewway) {
		var ctn: Laya.Image = new Laya.Image();
		var img: Laya.Image = new Laya.Image();
		var txt: Laya.Label = new Laya.Label();
		img.width = 170;
		img.height = 96;
		if (viewway == -1) {
			img.skin = "uisource/common/common/common_image_difang.png";
			txt.width = 112;
			txt.height = 37;
			txt.rotation = 0;
			img.x = -129;
			img.y = -80;
			txt.x = -92;
			txt.y = -47;
			txt.font = "Microsoft YaHei";
			txt.fontSize = 20;
			txt.color = "#000000";
			txt.overflow = "hidden";
			txt.wordWrap = true;
			txt.name = "txt";
		} else {
			img.skin = "uisource/common/common/common_image_qipao.png";
			img.scaleX = -1;
			img.x = 146;
			img.y = -70;
			txt.width = 112;
			txt.height = 37;
			txt.rotation = 0;
			txt.x = 8;
			txt.y = -44;
			txt.font = "Microsoft YaHei";
			txt.fontSize = 20;
			txt.color = "#000000";
			txt.overflow = "hidden";
			txt.wordWrap = true;
			txt.name = "txt";
		}
		txt.text = ""
		ctn.addChild(img);
		ctn.addChild(txt);
		return ctn;

	}

	/**设置需要显示的角色内容 */
	setShowRole() {
		//战斗预览
		if (this.viewType == FogConst.VIEW_TYPE_BATTLE_DETAIL) {
			this.enemyArr = RolesFunc.instance.getLevelMonsterArr(this.levelId);
			this.heroArr = RolesModel.instance.getInLineRole();
		}
		//敌人事件阵容预览
		else if (this.viewType == FogConst.VIEW_TYPE_FOG_ENEMY) {
			this.enemyArr = FogFunc.instance.getEnemyLine(this.enemyId, this.enemyType);
			this.heroArr = RolesModel.instance.getFogRole();
		}
		this.heroArr.splice(6, this.heroArr.length - 6);
		/**如果有助阵英雄 */
		if (this.helpRoleId) {
			var tryRoleNum = LevelFunc.instance.getCfgDatasByKey("Level", this.levelId, "tryRoleNum")
			var info = TableUtils.copyOneTable(BattleFunc.instance.getCfgDatas("Role", this.helpRoleId));
			info.level = tryRoleNum[0];
			info.starLevel = tryRoleNum[1];
			info.helpRole = 1;
			//把助阵英雄插入第二个位置
			this.heroArr.splice(1, 0, info)
		}
	}

	freshSpeakInfo() {
		if (this.speakLine == 1) {
			for (var i = 0; i < this.enemyTxtArr.length; i++) {
				var item = this.enemyTxtArr[i];
				item.ctn.visible = false;
			}
			var index = GameUtils.getRandomInt(0, this.roleTxtArr.length - 1);
			for (var i = 0; i < this.roleTxtArr.length; i++) {
				var item = this.roleTxtArr[i];
				if (i == index) {
					item.ctn.visible = true;
					var txt = item.ctn.getChildByName("txt");
					txt.text = TranslateFunc.instance.getTranslate(GameUtils.getRandomInArr(item.speak).result);
				} else {
					item.ctn.visible = false;
				}
			}
			this.speakLine = 2;
		} else {
			for (var i = 0; i < this.roleTxtArr.length; i++) {
				var item = this.roleTxtArr[i];
				item.ctn.visible = false;
			}
			var index = GameUtils.getRandomInt(0, this.enemyTxtArr.length - 1);
			for (var i = 0; i < this.enemyTxtArr.length; i++) {
				var item = this.enemyTxtArr[i];
				if (i == index) {
					item.ctn.visible = true;
					var txt = item.ctn.getChildByName("txt");
					txt.text = TranslateFunc.instance.getTranslate(GameUtils.getRandomInArr(item.speak).result);
				} else {
					item.ctn.visible = false;
				}
			}
			this.speakLine = 1;
		}

	}

	cacheRole() {
		for (var i = this.roleAniArr.length - 1; i >= 0; i--) {
			var item = this.roleAniArr[i];
			var role = item.item;
			var id = item.id;
			DisplayUtils.clearViewFilter(role);
			PoolTools.cacheItem(PoolCode.POOL_ROLE + item.id + "_" + item.viewWay, role);
			this.roleAniArr.splice(i, 1);
			var ctn = this.roleCtn.getChildAt(i);
			ctn.removeChild(role);
			this.roleCtn.removeChild(ctn);
		}
	}

	onClickFogFull() {
		WindowManager.OpenUI(WindowCfgs.FogBattleStartAlertUI, {detail: this});
	}

	onClickStartGame() {
		//敌人事件战斗预览
		if (this.viewType == FogConst.VIEW_TYPE_FOG_ENEMY) {
			//todo:行动力扣除位置待确定
			//开始战斗点击后，需要扣除相应的行动力才能挑战。行动力不足则弹视频。
			if (this.actCost > FogModel.instance.getActNum()) {
				FogModel.instance.checkFreeAct();
				return;
			}
			this.enterBattle();
		}
		//战斗预览
		else if (this.viewType == FogConst.VIEW_TYPE_BATTLE_DETAIL) {
			this.showGuide_207_finish();
			this.enterBattle();
		}
	}

	enterBattle() {
		//进战斗界面
		var result = LevelFunc.instance.checkIsBattleAddtionInGame();
		//判断是否进入满能量界面 远征没有满能量
		if (!result[0] || BattleFunc.curBattleType == BattleConst.BATTLETYPE_WAR) {
			this.dispose();
			this.enterBattleUI()
		} else {
			WindowManager.OpenUI(WindowCfgs.BattleFullEnergyUI, {"battleAddtionId": result[1], detail: this});
		}
	}

	enterBattleUI(data = null) {
		if (!data) {
			data = {};
		}
		data["levelId"] = this.levelId;
		data["name"] = this.levelName;
		if (this.isUseHelpRole) {
			data["helpRole"] = this.helpRoleId;
		}
		this.helpRoleId = null;
		this.isUseHelpRole = false;
		WindowManager.SwitchUI(WindowCfgs.BattleUI, WindowCfgs.BattleDetailUI, data);
	}

	onClickReturn() {
		this.dispose();
		WindowManager.CloseUI(WindowCfgs.BattleDetailUI);
	}

	/**设置战斗助阵角色 */
	setBattleHelpRole() {
		if (BattleFunc.curBattleType != BattleConst.BATTLETYPE_NORMAL) return;
		//当前所在关卡小于等于开启关卡，没有助阵角色
		if (Number(this.levelId) <= GlobalParamsFunc.instance.getDataNum("roleTryLevel")) return;
		if (ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLE_TRYROLE) == ShareOrTvManager.TYPE_QUICKRECEIVE) return;
		var allRole = RolesFunc.instance.getHelpRoleTab();
		var list = [];
		for (var i = 0; i < allRole.length; i++) {
			var item = allRole[i].split(",");
			//如果没有解锁这个角色并且试用关卡不大于当前关卡
			if (!RolesModel.instance.getIsHaveRole(item[0]) && Number(item[1]) <= this.levelId) {
				list.push(allRole[i])
			}
		}
		if (list.length == 0) return;
		var result = GameUtils.getWeightItem(list);
		return result[0];
	}

	//销毁地图
	private destoryOneLayer(mapInfo: any) {
		if (!mapInfo) return;
		LogsManager.echo("销毁详情地图-------------------------")
		var infoArr: any[] = mapInfo.infoArr;
		for (var i = 0; i < infoArr.length; i++) {
			var view: Laya.Image = infoArr[i].view;
			view.removeSelf();
			if (UserInfo.isSystemNative()) {
				view.dispose()
			}
		}

		if (!UserInfo.isSystemNative()) {
			Laya.loader.clearRes("res/atlas/map/" + this.mapName + "/" + this.mapName + ".atlas")
			Laya.loader.clearRes("res/atlas/map/" + this.mapName + "/" + this.mapName + ".png")
		}
	}

	onClickHelpRole() {
		WindowManager.OpenUI(WindowCfgs.BattleHelpRoleUI, {
			callBack: this.getHelpRole,
			thisObj: this,
			helpRoleId: this.helpRoleId
		});
	}

	getHelpRole() {
		this.helpRoleBtn.visible = false;
		DisplayUtils.clearViewFilter(this.helpItem);
		this.isUseHelpRole = true;
	}

	dispose() {
		this.cacheRole();
		this.destoryOneLayer(this.mapInfo);
		this.mapInfo = null;

		TimerManager.instance.remove(this.timeCode);
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}
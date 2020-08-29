import BaseFunc from "../../../framework/func/BaseFunc";
import GlobalParamsFunc from "./GlobalParamsFunc";
import UserExtModel from "../model/UserExtModel";
import FogModel from "../model/FogModel";
import ShareOrTvManager from "../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "./ShareTvOrderFunc";
import GameUtils from "../../../utils/GameUtils";
import RolesFunc from "./RolesFunc";
import TranslateFunc from "../../../framework/func/TranslateFunc";
import ResourceConst from "../consts/ResourceConst";
import UserModel from "../model/UserModel";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import LogsManager from "../../../framework/manager/LogsManager";
import FogConst from "../consts/FogConst";
import RolesModel from "../model/RolesModel";
import BattleFunc from "./BattleFunc";
import PoolTools from "../../../framework/utils/PoolTools";
import WindowManager from "../../../framework/manager/WindowManager";
import TimerManager from "../../../framework/manager/TimerManager";
import ScreenAdapterTools from "../../../framework/utils/ScreenAdapterTools";
import StringUtils from "../../../framework/utils/StringUtils";
import FogPropTrigger from "../../fog/trigger/FogPropTrigger";
import Message from "../../../framework/common/Message";
import FogEvent from "../event/FogEvent";
import DataResourceConst from "../consts/DataResourceConst";


/*
* Author: TODO
* Date:2020-05-23
* Description: TODO
*/
export default class FogFunc extends BaseFunc {

	//地图的宽高
	public static mapWidth = 640;
	public static mapHeight = 896;
	//行数
	public static row = 7;
	//列数
	public static line = 5;
	//单个格子的宽高
	public static itemWidth = 128;
	public static itemHeight = 128;
	public static busWidth = 70;
	public static busHeight = 120;

	//当前触发敌人事件的格子
	public static enemyCell;

	//ui中显示数量的数据类型
	public static showNumInUI = [
		DataResourceConst.COIN,
		DataResourceConst.GOLD,
		DataResourceConst.FOGCOIN,
		DataResourceConst.COMP,
		DataResourceConst.ACT,
		DataResourceConst.PIECE
	];

	public static showTweenType = [
		DataResourceConst.COMP,
		DataResourceConst.ACT,
		DataResourceConst.FOGITEM
	];

	//局外奖励类型金币、钻石、装备、碎片。
	public static fogOuterRewardType = [
		DataResourceConst.GOLD,
		DataResourceConst.COIN,
		DataResourceConst.FOGITEM,
		DataResourceConst.PIECE,
	];
	//处理用户配表相关接口.用静态方法
	//初始化 加载配表
	//存储所有配表
	getCfgsPathArr() {
		return [
			{name: "Layer_json"},
			{name: "EventsGroup_json"},
			{name: "GlobalEvents_json"},
			{name: "BusUpGrade_json"},
			{name: "Item_json"},
			{name: "ItemUpGrade_json"},
			{name: "DropGroup_json"},
			{name: "Event_json"},
			{name: "Shop_json"},
			{name: "Box_json"},
			{name: "ShopCell_json"},
			{name: "Goods_json"},
			{name: "Enemy_json"},
			{name: "RandomName_json"},
			{name: "NpcArray_json"},
			{name: "Ai_json"},
			{name: "TranslateEvent_json"},
			{name: "MarkReward_json"},
			{name: "TranslateGoods_json"},
		];

	}

	private static _instance: FogFunc;
	//总层数
	private allLayer;
	private allMarks;

	/**当前层数的终点 1_1 */
	public static fogEndCell;
	public static fogEndCellSign;
	/**当前层数的起点 1_1 */
	public static fogStartCell;

	//大巴车最大等级
	private busMaxLevel;
	//迷雾玩家角色的缩放
	public static fogRoleScale;
	//大巴车速度
	public static fogBusSpeed;
	//远征基地技能
	public static warHomeSkillCd;

	static get instance() {
		if (!this._instance) {
			this._instance = new FogFunc();
			FogFunc.initGlobalParams();
		}
		return this._instance;
	}

	//初始化全局参数. 策划配置的数需要转化.而且为了访问方便.
	public static initGlobalParams() {
		this.fogRoleScale = GlobalParamsFunc.instance.getDataNum("fogRoleScale") / 10000
		this.fogBusSpeed = BattleFunc.instance.turnSpeedToFrame(GlobalParamsFunc.instance.getDataNum("fogBusSpeed"))
		var homeCd = GlobalParamsFunc.instance.getDataArray("warHomeSkillCd");
		FogFunc.warHomeSkillCd = {};
		for (var i = 0; i < homeCd.length; i++) {
			var item = homeCd[i].split(",");
			FogFunc.warHomeSkillCd[item[0]] = Number(item[1])
		}
	}

	//根据坐标获取key
	public getKeyByPos(x, y) {
		return x + "_" + y;
	}

	/**获取总层数 */
	getAllLayer() {
		if (!this.allLayer) {
			this.allLayer = Object.keys(this.getAllCfgData("Layer")).length;
		}
		return this.allLayer;
	}

	//获取迷雾街区开启等级
	getFogOpenLevel() {
		return GlobalParamsFunc.instance.getDataNum("fogStreetUnlock") || 1;
	}

	//判断迷雾街区功能是否开启
	checkFogOpen() {
		var fogStreetUnlock = this.getFogOpenLevel();
		var curLevel = UserExtModel.instance.getMaxLevel();

		if (Number(curLevel) >= fogStreetUnlock) {
			return [true];
		}

		return [false, fogStreetUnlock];
	}

	//获取迷雾街区的进入状态:1 功能未开启 2 可以直接进入 3 可以免费进入 4 可以视频进入  5 不可进入
	getFogEnterStatus() {
		return 2;
	}

	/**获取大巴车最大等级 */
	getBusMaxLevel() {
		if (!this.busMaxLevel) {
			this.busMaxLevel = Object.keys(this.getAllCfgData("BusUpGrade")).length;
		}
		return this.busMaxLevel;
	}

	/**根据id获取大巴车数据*/
	public getBusAttribute(id): any {
		return this.getCfgDatasByKey("BusUpGrade_json", id, "attribute");
	}

	/**根据id获取道具info*/
	public getItemInfo(id: String): any {
		return this.getCfgDatas("Item_json", id);
	}

	/**根据id和level获取道具UPinfo*/
	public getItemUpGradeInfo(id, level): any {
		return this.getCfgDatasByKey("ItemUpGrade_json", id, level);
	}

	/**根据id获取掉落奖励*/
	public getDropGroupReward(id: String): any {
		return this.getCfgDatasByKey("DropGroup_json", id, "reward");
	}

	public getShopInfos(id: String): any {
		return this.getCfgDatasByKey("Shop_json", id, "shopCells");
	}

	public getShopCells(id: String): any {
		return this.getCfgDatasByKey("ShopCell_json", id, "shopCells");
	}

	public getGoodsInfo(id: String): any {
		return this.getCfgDatas("Goods_json", id);
	}

	/**随机商店的商品 */
	genFogShop(shopId) {
		var goods = [];
		var shopInfo = FogFunc.instance.getShopInfos(shopId);

		var shopCells;
		var goodsId;
		for (var i = 0; i < shopInfo.length; i++) {
			var shopCellId = shopInfo[i];
			shopCells = FogFunc.instance.getShopCells(shopCellId);
			goodsId = GameUtils.getWeightItem(shopCells)[0];
			//排重
			if (goods.indexOf(goodsId) == -1) {
				goods.push(goodsId);
			} else {
				i--;
			}

		}

		return goods;
	}

	/**
	 * 判断是否是数组类型
	 */
	isArray(obj) {
		return (typeof obj == 'object') && obj.constructor == Array;
	}

	public getEventInfo(id, id1): any {
		return this.getCfgDatasByKey("Event_json", id, id1);
	}

	public getEventInfoById(id): any {
		return this.getCfgDatas("Event_json", id);
	}

	//获取迷雾币道具得icon
	getFogItemIcon(itemId) {
		var itemInfo = FogFunc.instance.getItemInfo(itemId);
		return "uisource/fogitemicon/fogitemicon/" + itemInfo.icon + ".png";
	}

	//获取碎片icon
	getEquipIcon(pieceId) {
		var pieceInfo = RolesFunc.instance.getCfgDatas("EquipMaterial", pieceId);
		return "uisource/equipicon/equipicon/" + pieceInfo.icon + ".png";
	}

	getResourceShowInfo(reward, isSmall = false, moneyExtPer = 1) {

		return null;

	}

	//根据获得和消耗获取最终的upData数据
	getFogUpdata(reward = [], cost = [], doubleRate = 1, moneyAddPer = 1) {


		return null;
	}

	/**获取地图上的icon显示 */
	getMapIcon(icon) {
		return "fog/fog/" + icon + ".png";
	}

	//根据多组数组获得fog数据变更
	getFogUpDataByMultiArr(rewardArr = [], isAdd = true) {

		return null;
	}

	//获取宝箱info
	public getBoxInfo(id: String): any {
		return this.getCfgDatas("Box_json", id);
	}

	//根据道具id获取能折算的零件
	getExchangeCompByItem(itemArr = []) {
		var compNum = 0;

		var itemInfo;
		var tempCompNum = 0;
		if (itemArr.length > 0) {
			for (var i = 0; i < itemArr.length; i++) {
				itemInfo = this.getItemInfo(itemArr[i]);
				tempCompNum = itemInfo.sellPrice ? itemInfo.sellPrice : 0;
				compNum += tempCompNum;
			}
		}

		return compNum;
	}

	getRandomNameById(id) {
		return this.getCfgDatasByKey("RandomName_json", id, "nameType");
	}

	//获取随机名字
	getRandomName() {
		var randomNames = this.getAllCfgData("RandomName_json");
		var rand = GameUtils.getRandomInt(1, Object.keys(randomNames).length);
		return TranslateFunc.instance.getTranslate(this.getRandomNameById(rand), "TranslateRandomName");
	}

	getEnemyCfg(id) {
		return this.getCfgDatas("Enemy_json", id);
	}

	//获取敌人的名字
	getEnemyName() {
		var enemyName = this.getRandomName();
		return enemyName;
	}

	//获取敌人的阵容
	getEnemyLine(enemyId, type) {
		var enemyArr = [];
		var enemyIdArr = [];
		//玩家敌人
		if (type == FogConst.FOG_EVENT_ENEMY_TYPE_PLAYER) {
			var enemyLine = FogModel.instance.getEnemyInfoById(enemyId).roles;
			for (var id in enemyLine) {
				if (enemyLine.hasOwnProperty(id) && enemyIdArr.indexOf(id) == -1) {
					//去掉敌方基地
					if (!enemyLine[id].inLine) continue;
					if (!BattleFunc.instance.getCfgDatas("Role", id, true)) {
						//旧用户迷雾战斗随到新的角色
						continue;
					}
					var data = {};
					data = {
						id: id,
						level: Number(enemyLine[id].level || 1),
						starLevel: Number(enemyLine[id].starLevel)
					}
					enemyIdArr.push(id);
					enemyArr.push(data);
				}
			}
		}
		//npc敌人
		else if (type == FogConst.FOG_EVENT_ENEMY_TYPE_NPC) {
			var npcArrayInfo = this.getNpcArrayInfo(enemyId);
			var waveMap = npcArrayInfo.waveMap;
			//[id,怪物等级,怪物星级,怪物装备ID,……;
			for (var i = 0; i < waveMap.length; i++) {
				var waveArr = waveMap[i];
				if (enemyIdArr.indexOf(waveArr[0]) == -1) {
					var data = {};
					data = {
						id: waveArr[0],
						level: Number(waveArr[1]),
						starLevel: Number(waveArr[2])
					}
					enemyIdArr.push(id);
					enemyArr.push(data);
				}
			}

		}

		enemyArr.splice(6, enemyArr.length - 6);


		return enemyArr;
	}

	/**
	 * 获取敌人最高等级的角色
	 * @param line  阵容
	 */
	getEnemyHighRole(line) {
		var highId;
		var highLevel;
		for (var id in line) {
			if (line.hasOwnProperty(id)) {
				var info = line[id];
				if (!info.inLine) continue;
				var level = Number(info.level)
				if (!highLevel || highLevel < level) {
					highId = id;
					highLevel = level;
				}
			}
		}
		return highId;
	}

	/**获取和传入战力最接近的敌人NpcId */
	getNpcEnemyIdByForce(force) {
		var cfg = this.getAllCfgData("NpcArray");
		var offest = 0;
		var npcId;
		for (var key in cfg) {
			if (cfg.hasOwnProperty(key)) {
				var element = cfg[key];
				var enemyForce = element.power;
				var nowOffest = Math.abs(force - enemyForce);
				if (!offest || offest > nowOffest) {
					offest = nowOffest;
					npcId = key
				}
			}
		}
		return npcId;
	}

	//获取npc阵容配置
	public getNpcArrayInfo(id: String): any {
		return this.getCfgDatas("NpcArray_json", id);
	}

	/**获取一个玩家角色id */
	getOneRoleId() {
		var result;
		var fogline = FogModel.instance.getLine();
		var roleLine = RolesModel.instance.getRolesList();
		var homeId = GlobalParamsFunc.instance.getDataNum("bornHomeId");
		for (var id in roleLine) {
			if (Number(id) != homeId && !fogline[id]) {
				result = id;
				break;
			}
		}
		return result
	}

	/**根据方向获取车的图片 */
	getBusImgByRotate(rotate) {
		return "fog/fog/fogstreet_bus0" + rotate + ".png"
	}

	/**根据方向获取出口的图片 */
	getExitImgByRotate(rotate) {
		return "fog/fog/fogstreet_box_exit_0" + rotate + ".png"
	}

	/**根据地块获取地图块的图片 */
	getMapImgBySign(name, xIndex, yIndex) {
		var url = "fog/fog/" + name;
		var index = 0;
		if (xIndex % 2 == 0) {
			//偶数列
			if (yIndex % 2 == 0) {
				//偶数行
				index = 4
			} else {
				//奇数行
				index = 2
			}
		} else {
			//奇数列
			if (yIndex % 2 == 0) {
				//偶数行
				index = 3
			} else {
				//奇数行
				index = 1
			}
		}
		url += "_0" + index + ".png";
		return url;
	}

	/**获取雾的前缀 */
	getMaskImgFrontBySign(xIndex, yIndex) {
		var name = "fog/fog/fogstreet_fog";
		var index = 0;
		if (yIndex % 2 == 0) {
			//偶数行
			index = xIndex + FogFunc.line;
		} else {
			index = xIndex;
		}
		if (index < 10) {
			return name + "0" + index

		} else {
			return name + index
		}
	}

	//用于迷雾模式飘奖励
	getResourceIcon(reward) {
		var itemIcon = "";

		switch (Number(reward[0])) {
			//碎片
			case DataResourceConst.PIECE:
				var pieceId = reward[1];
				itemIcon = FogFunc.instance.getEquipIcon(pieceId);
				break;
			//行动力
			case DataResourceConst.ACT:
				itemIcon = ResourceConst.ACT_PNG;
				break;
			//零件
			case DataResourceConst.COMP:
				itemIcon = ResourceConst.COMP_PNG;
				break;
			//迷雾币
			case DataResourceConst.FOGCOIN:
				itemIcon = ResourceConst.FOGCOIN_PNG;
				break;
			//迷雾街区道具
			case DataResourceConst.FOGITEM:
				itemIcon = FogFunc.instance.getFogItemIcon(reward[1]);
				break;
			//钻石
			case DataResourceConst.GOLD:
				itemIcon = "uisource/video/video/video_image_zuanshi.png";
				break;
			//金币   
			case DataResourceConst.COIN:
				itemIcon = "uisource/video/video/video_image_lixianjinbi.png";
				break;
		}

		return itemIcon;

	}

	//飘资源
	flyToMainIcon(resId, value, fromx, fromy, delay: number = 0, fromCtn = null, toPos = null, callBack = null, thisObj = null) {

	}




	//闪烁效果
	resTwinkleTween(resId, count = 3, callBack = null, thisObj = null) {

	}

	//获得道具动画
	getFogItemTween(resId = DataResourceConst.FOGITEM, itemId, fromX = null, fromY = null, delay = 0, fromUI = null) {

	}

	//获得货币动画
	getFogResTween(resId, value, fromX = null, fromY = null, delay = 0, fromUI = null) {

	}


	//飘奖励
	flyResTween(rewardArr, fromX = null, fromY = null, fromUI = null) {

	}



	//将奖励数组转换成table： rewardArr:[[], [], []]
	vertRewardArrToTable(rewardArr) {


		return null;
	}

	//将奖励Table转换成数组
	vertRewardTableToArr(reward) {
		var rewardArr = [];

		for (var resId in reward) {
			if (reward.hasOwnProperty(resId)) {
				if (Number(resId) == DataResourceConst.FOGITEM || Number(resId) == DataResourceConst.PIECE) {
					if (Object.keys(reward[resId]).length != 0) {
						var items = reward[resId];
						for (var id in items) {
							rewardArr.push([resId, id, items[id]]);
						}
					}
				} else {
					rewardArr.push([resId, reward[resId]]);
				}
			}
		}

		return rewardArr;
	}

	//道具总积分
	getItemScore() {
		var score = 0;

		var props = FogModel.instance.getProp();
		var marks = 1;
		if (Object.keys(props).length != 0) {
			for (var propId in props) {
				marks = this.getCfgDatasByKey("Item_json", propId, "marks");
				score += (props[propId] * marks);
			}
		}

		return score;
	}

	//事件总积分
	getEventScore() {
		return FogModel.instance.getCountsById(FogConst.fog_finish_event_score);
	}

	//获得总积分
	getScore() {
		// 总积分 = 本局最大层数 * A + 本局累计获得局内代币数量 * B + 本局道具总积分 + 本局事件总积分
		// 道具总积分 = 最终玩家身上携带的道具积分之和，单个道具的积分单独配置在道具升级表中。
		// 事件总积分 = 局内完成
		var totalScore = 0;
		var maxLayer = FogModel.instance.getCurLayer();
		var compNum = FogModel.instance.getCompNum();
		var layerMark = GlobalParamsFunc.instance.getDataNum("layerMark");
		var componentMark = GlobalParamsFunc.instance.getDataNum("componentMark");

		var itemScore = this.getItemScore();
		var eventScore = this.getEventScore();

		//总计分
		totalScore = maxLayer * layerMark + compNum * componentMark + itemScore + eventScore;

		return totalScore;
	}

	//计算结算获得的金币和迷雾币
	calcuResultReward(score, addPercent = 1) {
		if (!this.allMarks) {
			this.allMarks = this.getAllCfgData("MarkReward");
		}

		var powerRange = [0, 10000];
		var coin = [0, 150];
		var fogCoin = [0, 15];
		for (var id in this.allMarks) {
			powerRange = this.allMarks[id].powerRange;
			if (score >= Number(powerRange[0]) && score < Number(powerRange[1])) {
				coin = this.allMarks[id].coin;
				fogCoin = this.allMarks[id].fogCoin;
				break;
			}
		}

		//奖励数值=本区间基础奖励+（积分-本区间积分下限）*每点积分额外奖励
		var rewardCoin = Math.floor((coin[0] + Math.floor((score - powerRange[0]) * coin[1] / 10000)) * addPercent);
		var rewardFogCoin = Math.floor((fogCoin[0] + Math.floor((score - powerRange[0]) * fogCoin[1] / 10000)) * addPercent);

		return [rewardCoin, rewardFogCoin];
	}

	//判断是否有满级的道具
	hasItemFullLevel() {
		var itemArr = [];
		var props = FogModel.instance.getProp();
		if (Object.keys(props).length != 0) {
			var propInfo;
			for (var propId in props) {
				propInfo = this.getItemInfo(propId);
				//可升级道具
				if (propInfo.type == FogPropTrigger.ITEM_TYPE_CANUP) {
					if (Number(props[propId]) > propInfo.maxLevel) {
						itemArr.push(propId);
					}
				}
			}
		}

		if (itemArr.length != 0) {
			return [true, itemArr];
		}

		return [false];
	}

	getRandomRoleId(index) {
		var roleId = "";
		//从随机池中取前两个角色
		var fogRoleRandom = GlobalParamsFunc.instance.getDataArray("fogRoleRandom");
		var fogRoleRandomFirstStr = fogRoleRandom[index];
		var roleIdArr = fogRoleRandomFirstStr.split(",");

		//排除掉没有解锁的角色
		var roleArr = [];
		var allRole = RolesModel.instance.getRolesList();
		for (var i = 0; i < roleIdArr.length; i++) {
			if (allRole.hasOwnProperty(roleIdArr[i])) {
				roleArr.push(roleIdArr[i]);
			}
		}
		if (roleArr.length != 0) {
			var firstIndex = GameUtils.getRandomInt(0, roleArr.length - 1);
			roleId = roleArr[firstIndex];
		}
		return roleId;

	}

	//初始化迷雾开场用的角色
	initFogRoles() {
		var roleIdResultList = [];
		var firstRoleId = "";
		var secondRoleId = "";

		//从随机池中取前两个角色
		firstRoleId = this.getRandomRoleId(0);
		if (firstRoleId != "") {
			roleIdResultList.push(firstRoleId);
		}
		secondRoleId = this.getRandomRoleId(1);
		if (secondRoleId != "") {
			roleIdResultList.push(secondRoleId);
		}

		//从玩家所有已解锁角色中，随机2个作为初始角色；看视频，可随机获得第3个初始角色
		var roleIdList = [];
		if (firstRoleId == "" && secondRoleId != "") {
			roleIdList = FogModel.instance.randomRoleIdList(2, [secondRoleId]);
			for (var i = 0; i < roleIdList.length; i++) {
				roleIdResultList.push(roleIdList[i]);
			}
		} else if (firstRoleId != "" && secondRoleId == "") {
			roleIdList = FogModel.instance.randomRoleIdList(2, [firstRoleId]);
			if (roleIdList.length > 0) {
				var tempArr = [];
				if (roleIdList.length == 1) {
					tempArr.push(roleIdList[0]);
					tempArr.push(roleIdResultList[0]);
				} else {
					tempArr.push(roleIdList[0]);
					tempArr.push(roleIdResultList[0]);
					tempArr.push(roleIdList[1]);
				}
				roleIdResultList = tempArr;
			}
		} else if (firstRoleId != "" && secondRoleId != "") {
			roleIdResultList.push(FogModel.instance.randomRoleIdList(1, [firstRoleId, secondRoleId])[0]);
		} else {
			roleIdResultList = FogModel.instance.randomRoleIdList(3);
		}

		return roleIdResultList;
	}
}

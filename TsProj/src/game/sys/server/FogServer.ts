import { DataResourceType } from "../func/DataResourceFunc";
import FogModel from "../model/FogModel";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import Client from "../../../framework/common/kakura/Client";
import FogFunc from "../func/FogFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import GameHttpControler from "../../../framework/common/GameHttpControler";
import Method from "../common/kakura/Method";
import FogConst from "../consts/FogConst";
import WindowManager from "../../../framework/manager/WindowManager";
import { WindowCfgs } from "../consts/WindowCfgs";
import StatisticsManager from "../manager/StatisticsManager";
import { isatty } from "tty";
import TaskServer from "./TaskServer";
import TaskConditionTrigger from "../trigger/TaskConditionTrigger";
import FogPropTrigger from "../../fog/trigger/FogPropTrigger";
import UserModel from "../model/UserModel";

/*
* Author: TODO
* Date:2020-05-23
* Description: TODO
*/
export default class FogServer {
	/**添加资源 */
	static addSourceCount(data, callBack = null, thisObj = null) {
		var upData = {};
		var fog = {};
		var type = data.type;
		var count = Number(data.count);
		if (type == DataResourceType.COMP) {
			fog["comp"] = FogModel.instance.getCompNum() + count;
		} else if (type == DataResourceType.ACT) {
			fog["act"] = FogModel.instance.getActNum() + count;
		}

		upData["fog"] = fog;
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();

	}
	/**初始化格子数据 */
	static initCellInfo(data, callBack = null, thisObj = null, isAsyc = false) {
		var upData = {};
		var fog = {};
		var cell = {};
		fog["cell"] = cell;
		var cellItem = {};
		cell[data.id] = cellItem
		if (data.ste) {
			cellItem["ste"] = data.ste;
		}
		if (data.evt) {
			cellItem["evt"] = data.evt;
		}
		if (data.type) {
			cellItem["type"] = data.type;
		}
		upData["fog"] = fog;
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		if (isAsyc) {
			SingleCommonServer.startSaveClientData();
		}
	}
	/**设置全局事件 */
	static setGlobalEvent(data, callBack = null, thisObj = null) {
		var upData = {};
		var fog = {};
		fog["globalEvent"] = data.event;
		upData["fog"] = fog;
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	/**初始化事件 */
	static initCellEvent(data, callBack = null, thisObj = null) {
		var upData = {};
		var fog = {};
		fog["cell"] = data.cell;
		upData["fog"] = fog;
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	/**删除格子上的事件 */
	static delCellEvent(data, callBack = null, thisObj = null, isAsyc = false) {
		var deData = {};
		var fog = {};
		var cell = {};
		fog["cell"] = cell;
		var cellItem = {};
		cellItem["evt"] = 1;
		cell[data.id] = cellItem
		deData["fog"] = fog;
		var backData = Client.instance.doDummyServerBack(null, null, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		if (isAsyc) {
			SingleCommonServer.startSaveClientData();
		}
	}
	/**添加格子上的事件 */
	static addCellEvent(data, callBack = null, thisObj = null, isAsyc = false) {
		var upData = {};
		var fog = {};
		var cell = {};
		fog["cell"] = cell;
		var cellItem = {};
		cellItem["evt"] = {
			id: data.id
		};
		if (data.role) {
			cellItem["evt"]["role"] = data.role
		}
		if (data.name) {
			cellItem["evt"]["name"] = data.name
		}
		if (data.ai) {
			cellItem["evt"]["ai"] = data.ai
		}
		if (data.rewardArr) {
			var reward = FogFunc.instance.vertRewardArrToTable(data.rewardArr);
			cellItem["evt"]["reward"] = reward;
		}
		if (data.wrongIndexArr) {
			var wrongIndex = {};
			for (var i = 0; i < data.wrongIndexArr.length; i++) {
				wrongIndex[i + 1] = data.wrongIndexArr[i];
			}
			cellItem["evt"]["wrongIndex"] = wrongIndex;
		}
		if (data.isVideoGetRight) {
			cellItem["evt"]["isVideoGetRight"] = data.isVideoGetRight;
		}
		if (data.goodsIdArr) {
			var goods = {};
			for (var i = 0; i < data.goodsIdArr.length; i++) {
				var good = {
					"id": data.goodsIdArr[i],
					"status": 0
				};
				goods[i + 1] = good;
			}
			cellItem["evt"]["fogShop"] = goods;
			cellItem["evt"]["counts"] = 0;
		}

		cell[data.cellId] = cellItem
		upData["fog"] = fog;


		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		if (isAsyc) {
			SingleCommonServer.startSaveClientData();
		}
	}
	/**开启格子 */
	static openCell(data, callBack = null, thisObj = null, isAsyc = false) {
		var upData = {};
		var fog = {};
		fog["cell"] = data.cell;
		upData["fog"] = fog;
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		if (isAsyc) {
			SingleCommonServer.startSaveClientData();
		}
	}
	/**删除格子上的数据 */
	static delCellInfo(data, callBack = null, thisObj = null, isAsyc = false) {
		var deData = {};
		var fog = {};
		fog["cell"] = data.cell;
		deData["fog"] = fog;
		var backData = Client.instance.doDummyServerBack(null, null, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		if (isAsyc) {
			SingleCommonServer.startSaveClientData();
		}
	}
	//初始设置阵容
	static setInline(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var fogInline = {};

		var line = data.line;
		if (FogFunc.instance.isArray(line)) {
			for (var i = 0; i < line.length; i++) {
				fogInline[line[i]] = line[i];
			}
		} else {
			fogInline[line] = line;
		}

		upData["fog"] = {
			"line": fogInline
		}


		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	//升级大巴车
	static upgradeBus(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var fog = {};

		var upLevel = 1;
		if (data && data.upLevel) {
			upLevel = data.upLevel;
		}

		fog["bus"] = {
			"level": Math.min(Number(FogModel.instance.getBusLevel()) + upLevel, FogFunc.instance.getBusMaxLevel())
		};
		//升级消耗
		var upCost = data.upCost || 0;
		if (upCost) {
			fog["comp"] = FogModel.instance.getCompNum() - upCost
		}
		upData["fog"] = fog;


		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	/**设置bus的位置 */
	static setBusPos(data, callBack = null, thisObj = null, isAsyc = true) {
		var upData = {};
		var deData = {};
		var fog = {};
		fog["bus"] = {
			"pos": data.pos
		};
		upData["fog"] = fog;
		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		if (isAsyc) {
			SingleCommonServer.startSaveClientData();
		}
	}
	//更新局内商店数据
	static updateShopGoods(data, callBack = null, thisObj = null) {
		var upData = {};

		if (data.goodsIdArr) {
			var goods = {};
			for (var i = 0; i < data.goodsIdArr.length; i++) {
				var good = {
					"id": data.goodsIdArr[i],
					"status": 0
				};
				goods[i + 1] = good;
			}

			var cellItem = {};
			var temp = {};
			var fog = {};
			var cell = {};

			temp["id"] = data.id;
			temp["fogShop"] = goods;
			temp["counts"] = FogModel.instance.getShopCountsById(data.cellId) + 1;
			cellItem["evt"] = temp;
			cell[data.cellId] = cellItem;
			fog["cell"] = cell;
			upData["fog"] = fog;
		}


		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}

	//购买局内商店商品
	static buyGoods(data: any, callBack: any = null, thisObj: any = null) {
		var deData = {};
		var cellItem = {};
		var cell = {};
		var reward = [];
		var cost = [];

		if (data.buyGet) {
			reward = data.buyGet;
		}
		if (data.cost) {
			cost = data.cost;
		}
		var upData = FogFunc.instance.getFogUpdata(reward, cost);

		// 局内商店
		var goods = {};
		var good = {};
		var item = {};
		var fogShopGoods = FogModel.instance.getFogShopGoods(data.cellId);
		if (fogShopGoods.hasOwnProperty(String(data.index))) {
			good["status"] = 1;
			goods[data.index] = good;
			item["fogShop"] = goods;
			cellItem["evt"] = item;
			cell[data.cellId] = cellItem;
		}

		if (!upData["fog"]) {
			upData["fog"] = {};
		}
		upData["fog"]["cell"] = cell;


		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	//黑市商店领取或者购买
	static businessBuy(data, callBack = null, thisObj = null) {
		var deData = {};

		var reward = [];
		var cost = [];
		//获得奖励
		if (data.reward) {
			reward = data.reward;
		}
		//消耗
		if (data.cost) {
			cost = data.cost;
		}
		var upData = FogFunc.instance.getFogUpdata(reward, cost);

		//行动力消耗
		if (data.costAct) {
			if (!upData["fog"]) {
				upData["fog"] = {};
			}

			var act = FogModel.instance.getActNum();
			if (upData["fog"] && upData["fog"]["act"]) {
				act = upData["fog"]["act"];
			}

			upData["fog"]["act"] = act - Number(data.costAct);
		}


		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	//二选一事件选择奖励
	static chooseReward(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};


		var reward = data.reward ? data.reward : [];
		var cost = data.cost ? data.cost : [];

		upData = FogFunc.instance.getFogUpdata(reward, cost);



		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	//消耗行动力继续答题
	static continueAnswer(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var fog = {};

		if (Number(data.cost)) {
			fog["act"] = FogModel.instance.getActNum() - Number(data.cost);
			upData["fog"] = fog;
		}


		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	//上交东西
	static handIn(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};

		if (data.hand && data.hand.length != 0) {
			upData = FogFunc.instance.getFogUpDataByMultiArr(data.hand, false);
		}

		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	//领取奖励
	static getReward(data, callBack = null, thisObj = null, isAsyc = true) {
		var upData = {};
		var deData = {};

		var reward = data.reward ? data.reward : [];
		var cost = data.cost ? data.cost : [];

		upData = FogFunc.instance.getFogUpdata(reward, cost, data.doubleRate || 1);

		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		if (isAsyc) {
			SingleCommonServer.startSaveClientData();
		}
	}
	//扣除行动力
	static costAct(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var fog = {};

		if (data.cost) {
			fog["act"] = FogModel.instance.getActNum() - Number(data.cost);
			upData["fog"] = fog;
		}


		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	//获得免费行动力
	static getFreeAct(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};

		var reward = data.reward;
		upData = FogFunc.instance.getFogUpdata(reward, []);

		if (!upData["fog"]) {
			upData["fog"] = {};
		}

		//更新次数
		var counts = {};
		counts[FogConst.fog_free_act_count] = FogModel.instance.getCountsById(FogConst.fog_free_act_count) + 1;
		upData["fog"]["counts"] = counts;


		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	/**同步战力 */
	static syncForce(data, callBack = null, thisObj = null) {
		var params: any = {
			capability: data.force
		}
		GameHttpControler.instance.sendRequest(Method.Fog_syncForce, params, callBack, thisObj);
	}
	/**获取敌人列表 */
	static getEnemyList(data, callBack = null, thisObj = null) {
		var params: any = {
			uidList: data.uidList,
			randNum: data.randNum
		}
		GameHttpControler.instance.sendRequest(Method.Fog_randomEnemy, params, callBack, thisObj);
	}
	/**退出迷雾 */
	static exitGame() {
		var deData = {};
		var fog = {}
		var data = FogModel.instance.getData();
		var upData = {};
		upData["fog"] = {
			act: 0
		}
		for (var key in data) {
			if (key != "act") {
				fog[key] = 1
			}
		}
		deData["fog"] = fog
		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		SingleCommonServer.startSaveClientData();
		FogFunc.fogEndCellSign = null
	}
	/**设置最高层 */
	static setMaxLayer(){
		var upData = {};
		var layer = FogModel.instance.getCurLayer() + 1;
		var allLayer = FogFunc.instance.getAllLayer();
		if (layer > allLayer) {
			layer = allLayer;
		}
		var maxLayer = UserModel.instance.getMaxFogLayer();
		if (layer > maxLayer) {
			upData["userExt"] = {
				maxFogLayer: layer
			}
		}
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		SingleCommonServer.startSaveClientData();
	}
	/**进入下一层 */
	static enterNextLayer(data, callBack = null, thisObj = null) {
		var deData = {};
		var upData = {};
		var dfog = {}
		dfog["cell"] = 1;
		dfog["bus"] = {
			pos: 1
		};
		var ufog = {}
		var layer = FogModel.instance.getCurLayer() + 1;
		var allLayer = FogFunc.instance.getAllLayer();
		if (layer > allLayer) {
			layer = allLayer;
		}
		var maxLayer = UserModel.instance.getMaxFogLayer();
		if (layer > maxLayer) {
			upData["userExt"] = {
				maxFogLayer: layer
			}
		}
		ufog["layer"] = layer;
		deData["fog"] = dfog
		upData["fog"] = ufog

		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		TaskServer.updateTaskProcess({ logicType: TaskConditionTrigger.taskCondition_fogHighLayer, count: layer }, null, null, false)
		SingleCommonServer.startSaveClientData();
	}
	/**消耗行动力带走角色 */
	static takenRole(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var fog = {};

		if (data.cost) {
			fog["act"] = FogModel.instance.getActNum() - Number(data.cost);
		}
		if (data.roleId) {
			var userRoles = FogModel.instance.getLine();
			if (!userRoles.hasOwnProperty(data.roleId)) {
				var role = {};
				role[data.roleId] = data.roleId;
				fog["line"] = role;
			}
		}
		upData["fog"] = fog;


		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	/**更新敌人状态 */
	static updateEnemyState(data, callBack = null, thisObj = null) {
		var upData = {};
		var fog = {};
		var enemy = {};
		enemy[data.enemyId] = {
			use: 1
		}
		fog["enemy"] = enemy;
		upData["fog"] = fog;
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	//保存玩家类敌人数据
	static savePlayerEnemyData(data = {}, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var fog = {};
		var enemy = {};
		var deFog = {};

		//清除原有数据
		var fogData = FogModel.instance.getData();
		for (var key in fogData) {
			if (key == "enemy") {
				deFog[key] = 1
			}
		}
		deData["fog"] = fog
		if (Object.keys(data).length != 0) {
			var tempEnemyTab;
			for (var id in data) {
				tempEnemyTab = data[id];
				var enemyDetail = {};
				enemyDetail["roles"] = tempEnemyTab.roles;
				enemyDetail["userExt"] = { "force": tempEnemyTab.userExt.force };
				enemyDetail["name"] = FogFunc.instance.getEnemyName();
				enemy[id] = enemyDetail;
			}
		}

		fog["enemy"] = enemy;
		upData["fog"] = fog;

		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	//保存fog奖励数据
	static saveFogReward(data, callBack = null, thisObj = null, isAsyc = true) {
		var upData = {};
		var deData = {};
		var fog = {};
		var reward = {};

		//传参：数组格式
		var rewardArr = data.reward;
		var levelFullItemArr = [];

		var totalCoin = "0";
		var totalGold = "0";
		var totalFogCoin = 0;
		var totalComp = 0;
		var totalAct = 0;
		var pieceTab = {};
		var propTab = {};
		var tempReward;
		for (var i = 0; i < rewardArr.length; i++) {
			tempReward = rewardArr[i];
			switch (Number(tempReward[0])) {
				//钻石
				case DataResourceType.GOLD:
					totalGold = BigNumUtils.sum(totalGold, tempReward[1]);
					break;
				//金币   
				case DataResourceType.COIN:
					totalCoin = BigNumUtils.sum(totalCoin, tempReward[1]);
					break;
				//迷雾币    
				case DataResourceType.FOGCOIN:
					totalFogCoin += Number(tempReward[1]);
					break;
				//零件    
				case DataResourceType.COMP:
					totalComp += Number(tempReward[1]);
					break;
				//行动力   
				case DataResourceType.ACT:
					totalAct += Number(tempReward[1]);
					break;
				//碎片
				case DataResourceType.PIECE:
					var piece = pieceTab[tempReward[1]] ? pieceTab[tempReward[1]] : 0;
					pieceTab[tempReward[1]] = piece + Number(tempReward[2]);
					break;
				//迷雾街区道具
				case DataResourceType.FOGITEM:
					var propNum = propTab[tempReward[1]] ? propTab[tempReward[1]] : 0;
					propTab[tempReward[1]] = propNum + Number(tempReward[2]);
					break;
			}
		}

		if (totalCoin != "0") {
			reward[DataResourceType.COIN] = BigNumUtils.sum(FogModel.instance.getFogRewardNum(DataResourceType.COIN), totalCoin);
		}
		if (totalGold != "0") {
			reward[DataResourceType.GOLD] = BigNumUtils.sum(FogModel.instance.getFogRewardNum(DataResourceType.GOLD), totalGold);
		}
		if (totalFogCoin != 0) {
			reward[DataResourceType.FOGCOIN] = FogModel.instance.getFogRewardNum(DataResourceType.FOGCOIN) + totalFogCoin;
		}
		if (totalComp != 0) {
			reward[DataResourceType.COMP] = FogModel.instance.getFogRewardNum(DataResourceType.COMP) + totalComp;
		}
		if (totalAct != 0) {
			reward[DataResourceType.ACT] = FogModel.instance.getFogRewardNum(DataResourceType.ACT) + totalAct;
		}


		if (Object.keys(pieceTab).length != 0) {
			var pieceData = {};
			for (var pieceId in pieceTab) {
				pieceData[pieceId] = FogModel.instance.getFogRewardNumById(DataResourceType.PIECE, pieceId) + pieceTab[pieceId];
			}
			reward[DataResourceType.PIECE] = pieceData;
		}
		if (Object.keys(propTab).length != 0) {
			var itemData = {};
			var propInfo;
			var num;
			for (var itemId in propTab) {
				propInfo = FogFunc.instance.getItemInfo(itemId);
				num = FogModel.instance.getFogRewardNumById(DataResourceType.FOGITEM, itemId) + propTab[itemId];

				//可升级道具
				if (propInfo.type == FogPropTrigger.ITEM_TYPE_CANUP) {
					if (num > propInfo.maxLevel) {
						levelFullItemArr.push(itemId);
						num = Math.min(num, propInfo.maxLevel);
					}
				}
				itemData[itemId] = num;
				//获得局内道具打点
				StatisticsManager.ins.onEvent(StatisticsManager.FOG_ITEM_GET, { "itemId": itemId });
			}
			reward[DataResourceType.FOGITEM] = itemData;
		}

		fog["reward"] = reward;
		upData["fog"] = fog;


		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		if (isAsyc) {
			SingleCommonServer.startSaveClientData();
		}

		//判断道具是否满级
		if (levelFullItemArr.length != 0) {
			WindowManager.OpenUI(WindowCfgs.FogBagItemFullLevelUI, { "item": levelFullItemArr });
		}
	}
	/**更新次数 */
	static updateFogCount(data, callBack = null, thisObj = null, isAsyc = false) {
		var upData = {};
		var fog = {};
		var counts = {};
		counts[data.type] = FogModel.instance.getCountsById(data.type) + (data.count || 1);
		fog["counts"] = counts;
		upData["fog"] = fog;
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		if (isAsyc) {
			SingleCommonServer.startSaveClientData();
		}
	}
	/**删除某个的次数 */
	static delFogCount(data, callBack = null, thisObj = null, isAsyc = false) {
		var deData = {};
		var fog = {};
		var counts = {};
		counts[data.type] = 1;
		fog["counts"] = counts;
		deData["fog"] = fog;
		var backData = Client.instance.doDummyServerBack(null, null, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		if (isAsyc) {
			SingleCommonServer.startSaveClientData();
		}
	}
	//道具满级兑换
	static exchangeComp(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var fog = {};
		var deFog = {};
		if (data && data.reward) {
			fog["comp"] = FogModel.instance.getCompNum() + Number(data.reward);
		}

		if (data && data.item) {
			var prop = {};
			var itemArr = data.item;
			for (var i = 0; i < itemArr.length; i++) {
				var propInfo = FogFunc.instance.getItemInfo(itemArr[i]);
				prop[itemArr[i]] = propInfo.maxLevel;
			}
			fog["prop"] = prop;
		}

		upData["fog"] = fog;


		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
	/**道具消耗 */
	static itemCost(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var fog = {};
		var deFog = {};
		var id = data.id;
		var prop = {};
		var count = FogModel.instance.getPropNum(id);
		// 剩余数量大于1 则数量减1  数量为1 则删除这个道具
		if (count > 1) {
			prop[id] = count - 1;
			fog["prop"] = prop;
			upData["fog"] = fog;
		} else {
			prop[id] = 1;
			fog["prop"] = prop;
			deData["fog"] = fog;
		}
		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}
}

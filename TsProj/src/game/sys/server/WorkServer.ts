import Client from "../../../framework/common/kakura/Client";
import SingleCommonServer from "../../../framework/server/SingleCommonServer";
import UserModel from "../model/UserModel";
import GameUtils from "../../../utils/GameUtils";
import FogFunc from "../func/FogFunc";
import WorkModel from "../model/WorkModel";
import WorkFunc from "../func/WorkFunc";
import TableUtils from "../../../framework/utils/TableUtils";
import LogsManager from "../../../framework/manager/LogsManager";
import BigNumUtils from "../../../framework/utils/BigNumUtils";
import WindowManager from "../../../framework/manager/WindowManager";
import TranslateFunc from "../../../framework/func/TranslateFunc";


/* 
打工系统
 */
export default class WorkServer {
	//更新打工数据
	static updateWorkInfo(data, callBack = null, thisObj = null) {
		var upData = {};
		var deData = {};
		var deWork = {}
		var work = {}
		var workInfo = WorkModel.instance.getWorkInfo();
		/**删除已完成的工作和未开始的工作 */
		for (var id in workInfo) {
			if (workInfo[id].finish) {
				deWork[id] = 1;
				delete workInfo[id]
			} else {
				if (!workInfo[id].cd) {
					deWork[id] = 1;
					delete workInfo[id]
				}
			}
		}

		var addWork = {};
		var companyLevel = WorkModel.instance.getCompanyLevel();
		var company = WorkFunc.instance.getCfgDatas("CompanyUpdate", companyLevel);
		var count = company.workNum - Object.keys(workInfo).length;
		if (count == 0) {
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_work_nofreshTask"))
		}
		if (count > 0) {
			var sureEvent = company.sureWork;
			//必出工作
			for (var i = 0; i < sureEvent.length; i++) {
				var workRandom = [];
				var workId;
				var isBreak = false;
				for (var key in workInfo) {
					//如果当前任务里有同样下标的必出工作 则这次不从当前下标中随
					if (workInfo[key].index && workInfo[key].index == (i + 1)) {
						isBreak = true;
						break;
					}
				}
				if (isBreak) continue;
				TableUtils.deepCopy(WorkFunc.instance.getCfgDatasByKey("WorkGroup", sureEvent[i], "workList"), workRandom)
				for (var j = workRandom.length - 1; j >= 0; j--) {
					workId = workRandom[j][0];
					if (addWork[workId] || workInfo[workId]) {
						workRandom.splice(j, 1);
					}
				}
				if (workRandom.length > 0) {
					workId = GameUtils.getWeightItem(workRandom)[0];
					addWork[workId] = {
						id: workId,
						index: i + 1
					}
					count -= 1;
					if (count <= 0) break;
				}
			}

		}
		if (count > 0) {
			var randomEvent = [];
			TableUtils.deepCopy(company.randomWork, randomEvent);
			this.getRandomWorkId(addWork, deWork, workInfo, randomEvent, count)
		}
		//获取下次刷新时间
		var freshTime = WorkFunc.instance.getNextFreshTime();
		work["expireTime"] = freshTime;
		work["workInfo"] = addWork;
		upData["work"] = work;
		deData["work"] = {
			workInfo: deWork
		}
		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}

	static getRandomWorkId(addWork, deWork, workInfo, randomEvent, count) {
		var randomInfo = GameUtils.getWeightItem(randomEvent);
		var workRandom = [];
		var randomWorkId;

		TableUtils.deepCopy(WorkFunc.instance.getCfgDatasByKey("WorkGroup", randomInfo[0], "workList"), workRandom)
		for (var i = workRandom.length - 1; i >= 0; i--) {
			randomWorkId = workRandom[i][0];
			//是本次已经随机出来的 或者在当前的工作任务 不参与随机
			if (addWork[randomWorkId] || workInfo[randomWorkId]) {
				workRandom.splice(i, 1);
			}
		}
		//如果没有可随机的了，就把整个随机组删掉
		if (workRandom.length == 0) {
			var index = randomEvent.indexOf(randomInfo[0] + "," + randomInfo[1])
			randomEvent.splice(index, 1);
		} else {
			randomWorkId = GameUtils.getWeightItem(workRandom)[0];
			addWork[randomWorkId] = {
				id: randomWorkId
			}
			count -= 1;
		}
		if (count > 0) {
			if (randomEvent.length == 0) {
				LogsManager.errorTag("work", "可随机的工作数量不足")
				return
			}
			this.getRandomWorkId(addWork, deWork, workInfo, randomEvent, count)
		}
	}

	/**开始工作 */
	static startDoWork(data: any, callBack: any = null, thisObj: any = null) {
		var id = data.id;
		var cfg = WorkFunc.instance.getCfgDatas("Work", id);
		var upData = {};
		var work = {};
		var workRole = {};
		var workInfo = {};
		for (var i = 0; i < cfg.roleNeed.length; i++) {
			workRole[cfg.roleNeed[i]] = id;
		}
		var cd = data.cd;
		workInfo[id] = {
			cd: Client.instance.serverTime + cd,
			allTime: cd
		}
		work["workRole"] = workRole;
		work["workInfo"] = workInfo;
		upData["work"] = work
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}

	/**完成工作 */
	static finishWork(data: any, callBack: any = null, thisObj: any = null) {
		var upData = {};
		var deData = {};
		var work = {};
		var workInfo = {};
		var deRole = {}
		var goldCost = data.goldCost;
		if (goldCost) {
			upData["giftGold"] = BigNumUtils.substract(UserModel.instance.getGold(), goldCost);
		}
		var cfg = WorkFunc.instance.getCfgDatas("Work", data.id);
		for (var i = 0; i < cfg.roleNeed.length; i++) {
			var id = WorkModel.instance.getIsHaveWorkRole(cfg.roleNeed[i])
			if (Number(id) == Number(data.id)) {
				deRole[cfg.roleNeed[i]] = 1
			}
		}
		deData["work"] = {
			workRole: deRole
		}
		workInfo[data.id] = {
			cd: Client.instance.serverTime
		}
		work["workInfo"] = workInfo;
		upData["work"] = work
		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();
	}

	/**领取工作奖励 */
	static receiveReward(data: any, callBack: any = null, thisObj: any = null) {
		var deData = {};
		var work = {};
		var workInfo = {};
		var deRole = {}
		workInfo[data.id] = {
			finish: 1
		}
		var upData = FogFunc.instance.getFogUpdata(data.reward, [], 1, data.extraAdPer);
		var cfg = WorkFunc.instance.getCfgDatas("Work", data.id);
		for (var i = 0; i < cfg.roleNeed.length; i++) {
			var id = WorkModel.instance.getIsHaveWorkRole(cfg.roleNeed[i])
			if (Number(id) == Number(data.id)) {
				deRole[cfg.roleNeed[i]] = 1
			}
		}
		deData["work"] = {
			workRole: deRole
		}
		if (upData["work"]) {
			upData["work"]["workInfo"] = workInfo
		} else {
			work["workInfo"] = workInfo;
			upData["work"] = work
		}

		var backData = Client.instance.doDummyServerBack(null, upData, deData);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();

	}

	/**升级公司 */
	static upWorkCompany(data: any, callBack: any = null, thisObj: any = null) {
		var cost = [];
		if (data.cost) {
			cost = data.cost;
		}
		var upData = FogFunc.instance.getFogUpdata([], cost);
		var work = {};
		work = {
			companyLevel: WorkModel.instance.getCompanyLevel() + 1
		}
		upData["work"] = work
		var backData = Client.instance.doDummyServerBack(null, upData, null);
		if (callBack) {
			callBack.call(thisObj, backData);
		}
		SingleCommonServer.startSaveClientData();

	}

}
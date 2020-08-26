import BaseModel from "./BaseModel";
import Client from "../../../framework/common/kakura/Client";
import RolesModel from "./RolesModel";
import WorkConst from "../consts/WorkConst";
import WorkFunc from "../func/WorkFunc";
import UserModel from "./UserModel";
import ShareOrTvManager from "../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../func/ShareTvOrderFunc";
import FogFunc from "../func/FogFunc";
import Message from "../../../framework/common/Message";
import WorkEvent from "../event/WorkEvent";

/**打工模块 */
export default class WorkModel extends BaseModel {
	public constructor() {
		super();
	}

	//单例
	private static _instance: WorkModel;
	static get instance() {
		if (!this._instance) {
			this._instance = new WorkModel();
		}
		return this._instance;
	}

	//初始化数据
	initData(d: any) {
		super.initData(d);
	}

	//更新数据
	updateData(d: any) {
		super.updateData(d);
		if (d.repute) {
			Message.instance.send(WorkEvent.WORK_REPUTE_UPDATE)
		}
	}

	//删除数据
	deleteData(d: any) {
		super.deleteData(d);

	}

	getData(): SCWorkData {
		return this._data || {};
	}

	/**获取是否过期 */
	getIsExpire() {
		var data = this.getData();
		if (data.expireTime) {
			if (Client.instance.serverTime > data.expireTime) {
				return true
			} else {
				return false
			}
		}
		return true;
	}

	getExpireTime() {
		var data = this.getData();
		return data.expireTime || 0;
	}

	getReputeNum() {
		var data = this.getData();
		return data.repute || 0;
	}

	getWorkItemInfo(id) {
		var info = this.getWorkInfo();
		return info[id];
	}

	/**获取工作信息 */
	getWorkInfo() {
		var data = this.getData();
		return data.workInfo || {};
	}

	/**获取某角色是否在任务中 */
	getIsInWorkById(roleId) {
		var data = this.getData();
		var id = data.workRole && data.workRole[roleId]
		if (id) {
			var info = this.getWorkItemInfo(id);
			if (!info || info.finish || !info.cd) return false;
			if (this.getIsCanReceive(id)) {
				return false
			} else {
				return true
			}
		}
		return false;
	}

	/**获取角色状态 */
	getRoleState(id) {
		if (RolesModel.instance.getIsHaveRole(id)) {
			if (this.getIsInWorkById(id)) {
				return WorkConst.WorkRole_work;
			} else {
				return WorkConst.WorkRole_none;
			}
		} else {
			return WorkConst.WorkRole_lock;
		}
	}

	getIsHaveWorkRole(id) {
		var data = this.getData();
		return data.workRole && data.workRole[id]
	}

	/**获取奖励是否可领取 */
	getIsCanReceive(id) {
		var info = this.getWorkItemInfo(id);
		if (info) {
			if (info.finish) return false;
			var cd = info.cd;
			var time = Client.instance.serverTime;
			if (cd <= time) {
				return true;
			}
		}
		return false;
	}

	/**获取公司等级 */
	getCompanyLevel() {
		var data = this.getData();
		return data.companyLevel || 1;
	}

	/**是否可以升级公司 */
	getIsCanUpCompany() {
		var level = this.getCompanyLevel();
		if (level >= WorkFunc.instance.getMaxCompanyLevel()) return false;
		var cfg = WorkFunc.instance.getCfgDatas("CompanyUpdate", level + 1);
		var unlockCondition = cfg.unlockCondition;
		var isCan = true;
		for (var i = 0; i < unlockCondition.length; i++) {
			var info = unlockCondition[i];
			if (Number(info[0]) == WorkConst.CompanyUnlock_level) {
				if (UserModel.instance.getMaxBattleLevel() < Number(info[1])) {
					isCan = false;
				}
			} else if (Number(info[0]) == WorkConst.CompanyUnlock_fogLevel) {
				if (UserModel.instance.getMaxFogLayer() < Number(info[1])) {
					isCan = false;
				}
			}
		}
		if (!isCan) return false;
		var hasNum = WorkModel.instance.getReputeNum();
		var costNum = cfg.renownNeed
		if (hasNum < costNum) {
			isCan = false
			return false;
		}
		var cost = cfg.cost;
		if (cost[0][0] == -1) {
			var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_WORK_COMPANYUP);
			if (freeType != ShareOrTvManager.TYPE_QUICKRECEIVE) {
				return true;
			} else {
				return this.setCostInfo(cost[1])

			}
		} else {
			return this.setCostInfo(cost[0])
		}
	}

	setCostInfo(cost) {
		var info = FogFunc.instance.getResourceShowInfo(cost);
		if (info.num > info.userNum) {
			return false
		} else {
			return true;
		}
	}

}

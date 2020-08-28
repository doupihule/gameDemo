"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = require("./BaseModel");
const Client_1 = require("../../../framework/common/kakura/Client");
const RolesModel_1 = require("./RolesModel");
const WorkConst_1 = require("../consts/WorkConst");
const WorkFunc_1 = require("../func/WorkFunc");
const UserModel_1 = require("./UserModel");
const ShareOrTvManager_1 = require("../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../func/ShareTvOrderFunc");
const FogFunc_1 = require("../func/FogFunc");
const Message_1 = require("../../../framework/common/Message");
const WorkEvent_1 = require("../event/WorkEvent");
/**打工模块 */
class WorkModel extends BaseModel_1.default {
    constructor() {
        super();
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new WorkModel();
        }
        return this._instance;
    }
    //初始化数据
    initData(d) {
        super.initData(d);
    }
    //更新数据
    updateData(d) {
        super.updateData(d);
        if (d.repute) {
            Message_1.default.instance.send(WorkEvent_1.default.WORK_REPUTE_UPDATE);
        }
    }
    //删除数据
    deleteData(d) {
        super.deleteData(d);
    }
    getData() {
        return this._data || {};
    }
    /**获取是否过期 */
    getIsExpire() {
        var data = this.getData();
        if (data.expireTime) {
            if (Client_1.default.instance.serverTime > data.expireTime) {
                return true;
            }
            else {
                return false;
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
        var id = data.workRole && data.workRole[roleId];
        if (id) {
            var info = this.getWorkItemInfo(id);
            if (!info || info.finish || !info.cd)
                return false;
            if (this.getIsCanReceive(id)) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    }
    /**获取角色状态 */
    getRoleState(id) {
        if (RolesModel_1.default.instance.getIsHaveRole(id)) {
            if (this.getIsInWorkById(id)) {
                return WorkConst_1.default.WorkRole_work;
            }
            else {
                return WorkConst_1.default.WorkRole_none;
            }
        }
        else {
            return WorkConst_1.default.WorkRole_lock;
        }
    }
    getIsHaveWorkRole(id) {
        var data = this.getData();
        return data.workRole && data.workRole[id];
    }
    /**获取奖励是否可领取 */
    getIsCanReceive(id) {
        var info = this.getWorkItemInfo(id);
        if (info) {
            if (info.finish)
                return false;
            var cd = info.cd;
            var time = Client_1.default.instance.serverTime;
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
        if (level >= WorkFunc_1.default.instance.getMaxCompanyLevel())
            return false;
        var cfg = WorkFunc_1.default.instance.getCfgDatas("CompanyUpdate", level + 1);
        var unlockCondition = cfg.unlockCondition;
        var isCan = true;
        for (var i = 0; i < unlockCondition.length; i++) {
            var info = unlockCondition[i];
            if (Number(info[0]) == WorkConst_1.default.CompanyUnlock_level) {
                if (UserModel_1.default.instance.getMaxBattleLevel() < Number(info[1])) {
                    isCan = false;
                }
            }
            else if (Number(info[0]) == WorkConst_1.default.CompanyUnlock_fogLevel) {
                if (UserModel_1.default.instance.getMaxFogLayer() < Number(info[1])) {
                    isCan = false;
                }
            }
        }
        if (!isCan)
            return false;
        var hasNum = WorkModel.instance.getReputeNum();
        var costNum = cfg.renownNeed;
        if (hasNum < costNum) {
            isCan = false;
            return false;
        }
        var cost = cfg.cost;
        if (cost[0][0] == -1) {
            var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_WORK_COMPANYUP);
            if (freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                return true;
            }
            else {
                return this.setCostInfo(cost[1]);
            }
        }
        else {
            return this.setCostInfo(cost[0]);
        }
    }
    setCostInfo(cost) {
        var info = FogFunc_1.default.instance.getResourceShowInfo(cost);
        if (info.num > info.userNum) {
            return false;
        }
        else {
            return true;
        }
    }
}
exports.default = WorkModel;
//# sourceMappingURL=WorkModel.js.map
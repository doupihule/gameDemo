"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogsManager_1 = require("../../../framework/manager/LogsManager");
class BattleLogsManager {
    static get instance() {
        if (!this._instance) {
            this._instance = new BattleLogsManager();
        }
        return this._instance;
    }
    //战斗中的输出管理
    static battleEcho(message, ...optionalParams) {
        if (!this.isShowBattleLog) {
            return;
        }
        LogsManager_1.default.echo(message, ...optionalParams);
    }
    static battleWarn(message, ...optionalParams) {
        if (!this.isShowBattleLog) {
            return;
        }
        LogsManager_1.default.warn(message, ...optionalParams);
    }
    //调试某个角色相关的日志
    static debugByRole(roleId, message, ...optionalParams) {
        if (!this.debugRoleIDs) {
            return;
        }
        //0表示调试所有角色
        if (this.debugRoleIDs.length > 0) {
            //如果不在调试列表里.不执行
            if (this.debugRoleIDs.indexOf(roleId) == -1) {
                return;
            }
        }
        this.battleEcho(message, ...optionalParams);
    }
    static battleError(...optionalParams) {
        LogsManager_1.default.errorTag(...optionalParams);
    }
}
exports.default = BattleLogsManager;
//是否显示战斗日志
BattleLogsManager.isShowBattleLog = true;
//# sourceMappingURL=BattleLogsManager.js.map
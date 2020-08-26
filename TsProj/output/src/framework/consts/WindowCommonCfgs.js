"use strict";
/**
 * @author: NightmareRevisited
 * @project: hifive_zombiewar
 * @file: WindowCommonCfgs
 * @time: 2019/12/17 11:47
 * @Software: WebStorm
 */
Object.defineProperty(exports, "__esModule", { value: true });
class WindowCommonCfgs {
    static get windowcfgs() {
        if (!this._windowcfgs) {
            this._windowcfgs = {};
        }
        return this._windowcfgs;
    }
}
exports.default = WindowCommonCfgs;
// 插屏互推
WindowCommonCfgs.INTERJUMPVIEW = "InterJumpUI";
// 互推抽屉
WindowCommonCfgs.JUMPEXITVIEW = "JumpExitUI";
// 指色互推
WindowCommonCfgs.MAINJUMPZHISEVIEW = "MainJumpZhiseUI";
// 指色互推列表
WindowCommonCfgs.JUMPLISTZHISEVIEW = "JumpListZhiseUI";
// 插屏原生广告
WindowCommonCfgs.ORIGINALVIEW = "OriginalAdvUI";
// 卡日曲互推
WindowCommonCfgs.MainJumpKariquView = "MainJumpKariquUI";
// 双排互推栏
WindowCommonCfgs.ResultJumpDoubleView = "ResultJumpDoubleUI";
// 单排互推栏
WindowCommonCfgs.ResultJumpView = "ResultJumpUI";
//修改用户数据
WindowCommonCfgs.ChangeDataView = "ChangeDataUI";
//# sourceMappingURL=WindowCommonCfgs.js.map
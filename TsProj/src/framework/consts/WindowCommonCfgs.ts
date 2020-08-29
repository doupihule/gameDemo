/**
 * @author: NightmareRevisited
 * @project: hifive_zombiewar
 * @file: WindowCommonCfgs
 * @time: 2019/12/17 11:47
 * @Software: WebStorm
 */


export default class WindowCommonCfgs {
	// 插屏互推
	static INTERJUMPVIEW: string = "InterJumpUI";

	// 互推抽屉
	static JUMPEXITVIEW: string = "JumpExitUI";

	// 指色互推
	static MAINJUMPZHISEVIEW: string = "MainJumpZhiseUI";

	// 指色互推列表
	static JUMPLISTZHISEVIEW: string = "JumpListZhiseUI";

	// 插屏原生广告
	static ORIGINALVIEW: string = "OriginalAdvUI"

	// 卡日曲互推
	static MainJumpKariquView: string = "MainJumpKariquUI"

	// 双排互推栏
	static ResultJumpDoubleView: string = "ResultJumpDoubleUI";

	// 单排互推栏
	static ResultJumpView: string = "ResultJumpUI";

	//修改用户数据
	static ChangeDataView: string = "ChangeDataUI";
	static _windowcfgs: any;
	static get windowcfgs() {
		if (!this._windowcfgs) {
			this._windowcfgs = {}
		}
		return this._windowcfgs;
	}
}


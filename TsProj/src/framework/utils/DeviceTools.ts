import GlobalData from "./GlobalData";

import GameSwitch from "../common/GameSwitch";

export default class DeviceTools {
	constructor() {
	}

	//ios的低端设备因为考虑有很多不同的制式, 型号名称可能还不一样.所以低端设备判断的时候 只需要判断前面几个字符是否相等即可, 特别注意  iphone 6 和iphone 6s的区分
	static lowDeviceGroup = []

	private static _isLowDevice = false;
	private static _hasCheckDevice: boolean = false;
	public static network: string = "none";

	//判断是否是低端设备
	static checkIsLowDevice() {
		if (this._hasCheckDevice) {
			return this._isLowDevice;
		}
		//标记已经检查过了不用重复检查
		this._hasCheckDevice = true;
		var deviceModel = GlobalData.deviceModel;
		//测试设备
		// deviceModel = "iPhone 6("
		if (this.lowDeviceGroup.indexOf(deviceModel) != -1) {
			this._isLowDevice = true;
			LogsManager.echo("this is lowDevice ");
		} else {
			this._isLowDevice = false;
		}


		return this._isLowDevice;

	}

	/**根据开关值屏蔽低端机 */
	static checkBySwitch() {
		if (GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_LOWDEVICE)) {
			this._hasCheckDevice = true;
			this._isLowDevice = false;
		}
	}
}
import Client from "../common/kakura/Client";
import UserInfo from "../common/UserInfo";

export default class SensorUtils {
	static maxX = 0;
	static maxTime = 0;
	static minX = 0;
	static minTime = 0;
	static timeDelta;
	static timeCD;
	static addSpeed;

	static shakeCheck(data, callback, thisObj) {
		if (!SensorUtils.timeDelta) {
			SensorUtils.timeDelta = 1000;
			SensorUtils.timeCD = 3000;
			SensorUtils.addSpeed = 12;
		}
		var x = data.x.toFixed(3);
		var time = Client.instance.serverTimeMicro;
		if (time > SensorUtils.maxTime + SensorUtils.timeDelta) {
			SensorUtils.maxX = x;
			SensorUtils.maxTime = time;
			SensorUtils.minX = x;
			SensorUtils.minTime = time;
			UserInfo.platform.accelerometerClear({x: x});
		} else if (time > SensorUtils.minTime + SensorUtils.timeDelta) {
			SensorUtils.maxX = x;
			SensorUtils.maxTime = time;
			SensorUtils.minX = x;
			SensorUtils.minTime = time;
			UserInfo.platform.accelerometerClear({x: x});
		} else if (x > SensorUtils.maxX && time > SensorUtils.maxTime) {
			SensorUtils.maxX = x;
			SensorUtils.maxTime = time;
		} else if (x < SensorUtils.minX && time > SensorUtils.minTime) {
			SensorUtils.minX = x;
			SensorUtils.minTime = time;
		} else {
			SensorUtils.maxX = x;
			SensorUtils.minX = x;
			UserInfo.platform.accelerometerClear({x: x});
		}

		if (SensorUtils.maxX - SensorUtils.minX > SensorUtils.addSpeed) {
			SensorUtils.maxX = x;
			SensorUtils.maxTime = time + SensorUtils.timeCD;
			SensorUtils.minX = x;
			SensorUtils.minTime = time + SensorUtils.timeCD;
			UserInfo.platform.accelerometerClear({x: x});
			callback.call(thisObj);
		}
	}
}
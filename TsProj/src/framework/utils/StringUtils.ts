import GlobalParamsFunc from "../../game/sys/func/GlobalParamsFunc";
import BigNumUtils from "./BigNumUtils";

export default class StringUtils {
	public static ScoreRange(score: number) {
		if (score > 99999999) {
			return 99999999;
		} else {
			return score;
		}
	}

	//时间格式化，个位数前面加0
	public static formatTime(time) {
		if (time < 10) {
			time = "0" + time;
		}
		return time;
	}

	//把一个秒级时间初始化成  HH:MM:SS的格式，用于倒计时
	public static reprTime(time) {
		var h = Math.floor(time / 3600);
		var m = Math.floor((time - 3600 * h) / 60);
		var s = time - 3600 * h - 60 * m;
		var sh = h >= 10 ? h : "0" + h;
		var sm = m >= 10 ? m : "0" + m;
		var ss = s >= 10 ? s : "0" + s;
		return sh + ":" + sm + ":" + ss;
	}

	private static _reducedUnitArr: string[];

	/*
	钱币数格式:千进制显示
	*/
	public static getCoinStr(coin: string): string {
		//金币显示支持千进值，即当金币数>=10000时，以K,M,B,T等系列千进值显示，保留1位小数（最后1位四舍五入），例如1160000显示为1.2M；
		var coinStr = "";
		var tempCoin = coin;
		if (BigNumUtils.compare(coin, 10000)) {
			var index = 1;
			while (BigNumUtils.compare(BigNumUtils.devide(tempCoin, 1000), 1000)) {
				index++;
				tempCoin = BigNumUtils.devide(tempCoin, 1000) + "";
			}
			if (!this._reducedUnitArr) {
				var reducedUnit = GlobalParamsFunc.instance.getGlobalCfgDatas("reducedUnit").string;
				this._reducedUnitArr = reducedUnit.split(",");
			}
			var reducedUnitArr = this._reducedUnitArr;

			if (reducedUnitArr.length < index - 1) {
				coinStr = BigNumUtils.devide(coin, BigNumUtils.pow(1000, reducedUnitArr.length)) + reducedUnitArr[reducedUnitArr.length - 1];
			} else {
				var unit = reducedUnitArr[index - 1];
				coinStr = BigNumUtils.devide(coin, BigNumUtils.pow(1000, index), 1) + unit;
			}

		} else {
			coinStr = coin;
		}

		return coinStr;
	}

	public static getRGBbyHex(hex) {
		var index = "0123456789abcdef";
		if (hex.substr(0, 1) == "#") {
			hex = hex.substring(1);
		}
		hex = hex.toLowerCase();
		var rgb = [];
		for (var i = 0; i < 3; i++) {
			var colorHex = hex.substr(i * 2, 2);
			var colorHigh = colorHex.substr(0, 1);
			var colorLow = colorHex.substr(1, 1);
			var color = (index.indexOf(colorHigh) * 16 + index.indexOf(colorLow)) / 255;
			rgb.push(color);
		}
		return rgb;
	}

	/**
	 * 重复拼接字符串
	 * @param target
	 * @param n
	 */
	public static repeatStr(target, n) {
		var s = "";
		for (var i = 0; i < n; i++) {
			s += target;
		}
		return s;
	}

	/**
	 * 字符串填充
	 * @param str 原字符串
	 * @param len 目标字符串长度
	 * @param padding 填充
	 * @param pos true为左填充，false为右填充
	 */
	public static getPaddingStr(str: string, len: number, padding: string, pos = true) {
		str = String(str);
		if (str.length >= len) {
			return str;
		}
		if (pos) {
			return this.repeatStr(padding, len - str.length) + str;
		} else {
			return str + this.repeatStr(padding, len - str.length);
		}
	}

	//判断字符是否包含中文
	public static chekHasChinese(str: string) {
		var req = /.*[\u4e00-\u9fa5]+.*$/;
		if (req.test(str)) {
			return true;
		}
		return false;
	}


	private static _signKey: string = "0123456789:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

	private static _signOffset: number = 13;

	//解密sha1串
	public static decodeSign(targetSign: string) {
		var rtStr: string = "";
		var len = targetSign.length;
		var singKeyLen = this._signKey.length
		var offNum = this._signOffset % singKeyLen;
		for (var i = 0; i < len; i++) {

			var tempStr: string = targetSign.charAt(i);
			if (tempStr == "|") {
				rtStr += "|"
			} else {
				var code: number = this._signKey.indexOf(tempStr);
				if (code == -1) {
					rtStr += tempStr;
				} else {
					code -= offNum;
					if (code < 0) {
						code += singKeyLen;
					}
					rtStr += this._signKey.charAt(code);
				}
			}

		}
		return rtStr;

	}


	//混淆sha1串后的值, 每个游戏不一样.
	/**
	 * 每个游戏 在Main.ts里面单独调用下面这段测试代码就可以生成混淆后的sha1串 然后配置到 GameConst.ts->static ENCODE_SHA1
        var defaultSha1 = "C5:19:61:2D:35:23:34:B5:27:EB:A5:37:B5:CA:27:30:75:65:2C:A4|8D:BC:FB:84:97:06:04:72:21:27:BE:A7:A8:23:20:76:81:D4:63:26"
		console.log( StringUtils.encodeSign(defaultSha1)) ;
	 *
	 *
	 */
	public static encodeSign(nativeSign: string) {
		var rtStr: string = "";
		var len = nativeSign.length;
		var singKeyLen = this._signKey.length
		var offNum = this._signOffset % singKeyLen;
		for (var i = 0; i < len; i++) {

			var tempStr: string = nativeSign.charAt(i);
			if (tempStr == "|") {
				rtStr += "|"
			} else {
				var code: number = this._signKey.indexOf(tempStr);
				if (code == -1) {
					rtStr += tempStr;
				} else {
					code += offNum;
					if (code >= singKeyLen) {
						code -= singKeyLen;
					}
					rtStr += this._signKey.charAt(code);
				}
			}

		}
		return rtStr;
	}


}
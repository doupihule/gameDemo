

export default class BigNumUtils {

	//大数加法：供外部接口调用
	public static sum(a, b) {

		//转换成字符串，兼容int类型
		a = a + "";
		b = b + "";

		//出现小数的处理：打error，并强制取整
		var indexa = a.indexOf(".");
		var indexb = b.indexOf(".");
		if (indexa != -1) {
			LogsManager.errorTag("BigNumUtils", "大数运算加法a出现小数", a);
			a = a.substr(0, indexa);
		}
		if (indexb != -1) {
			LogsManager.errorTag("BigNumUtils", "大数运算加法b出现小数", b);
			b = b.substr(0, indexb);
		}

		//结果
		var result = "";

		//判断符号
		var waya = a.slice(0, 1) == "-";
		var wayb = b.slice(0, 1) == "-";

		//都是负数
		if (waya && wayb) {
			var symbol = "-";
			result = symbol + this.sumIn(a, b);
		}
		//a为正数，b为负数
		else if (!waya && wayb) {
			result = this.substractIn(a, b);
		}
		//a为负数，b为正数
		else if (waya && !wayb) {
			result = this.substractIn(b, a);
		}
		//都为正数
		else {
			result = this.sumIn(a, b);
		}

		return result;
	}

	//纯正数加法,内部使用
	public static sumIn(a, b) {
		//计算结果
		var result = "";
		//进位标志
		var flag = 0;

		if (a.slice(0, 1) == "-") {
			a = a.substr(1);
		}
		if (b.slice(0, 1) == "-") {
			b = b.substr(1);
		}


		//转换成数组
		a = a.split("");
		b = b.split("");

		while (a.length || b.length || flag) {
			flag = ~~a.pop() + ~~b.pop() + flag;
			result = (flag % 10) + result;
			flag = flag > 9 ? 1 : 0;
		}
		result = result.replace(/^0+/, '');

		if (!result) {
			result = 0 + "";
		}
		return result;
	}

	//大数减法：供外部接口调用
	public static substract(a, b) {
		//转换成字符串，兼容int类型
		a = a + "";
		b = b + "";

		//出现小数的处理：打error，并强制取整
		var indexa = a.indexOf(".");
		var indexb = b.indexOf(".");
		if (indexa != -1) {
			LogsManager.errorTag("BigNumUtils", "大数运算减法a出现小数", a);
			a = a.substr(0, indexa);
		}
		if (indexb != -1) {
			LogsManager.errorTag("BigNumUtils", "大数运算减法b出现小数", b);
			b = b.substr(0, indexb);
		}

		//结果
		var result = "";

		//判断符号
		var waya = a.slice(0, 1) == "-";
		var wayb = b.slice(0, 1) == "-";

		//都是负数
		if (waya && wayb) {
			result = this.substractIn(b, a);
		}
		//a为正数，b为负数
		else if (!waya && wayb) {
			result = this.sumIn(a, b);
		}
		//a为负数，b为正数
		else if (waya && !wayb) {
			var symbol = "-";
			result = symbol + this.sumIn(b, a);
		}
		//都为正数
		else {
			result = this.substractIn(a, b);
		}

		return result;

	}

	//纯正数减法
	public static substractIn(a, b) {
		//计算结果
		var result = "";


		if (a.slice(0, 1) == "-") {
			a = a.substr(1);
		}
		if (b.slice(0, 1) == "-") {
			b = b.substr(1);
		}

		if (!this.compare(a, b)) {
			var symbol = "-";
			var temp = a;
			a = b;
			b = temp;
		}
		//转换成数组
		a = a.split("");
		b = b.split("");
		//借位标志
		var flag = 0;
		var cha = 0;
		while (a.length || b.length) {
			cha = ~~a.pop() - ~~b.pop() - flag;
			flag = 0;
			if (cha < 0) {
				cha = cha + 10;
				flag = 1;
			}
			result = (cha % 10) + result;
		}
		result = result.replace(/^0+/, '');

		if (result) {
			if (symbol && symbol == "-") {
				result = symbol + result;
			}
		} else {
			result = 0 + "";
		}

		return result;

	}

	//大数乘法
	public static muitlfy(a, b) {
		//转换成字符串，兼容int类型
		a = a + "";
		b = b + "";

		//出现小数的处理：打error，并强制取整
		var indexa = a.indexOf(".");
		var indexb = b.indexOf(".");
		if (indexa != -1) {
			LogsManager.errorTag("BigNumUtils", "大数运算乘法a出现小数", a);
			a = a.substr(0, indexa);
		}
		if (indexb != -1) {
			LogsManager.errorTag("BigNumUtils", "大数运算乘法b出现小数", b);
			b = b.substr(0, indexb);
		}

		//判断符号
		var waya = a.slice(0, 1) == "-";
		var wayb = b.slice(0, 1) == "-";

		//都是负数
		if ((!waya && wayb) || (waya && !wayb)) {
			var symbol = "-";
		}

		//去掉符号
		if (a.slice(0, 1) == "-") {
			a = a.substr(1);
		}
		if (b.slice(0, 1) == "-") {
			b = b.substr(1);
		}

		//计算结果
		var result = "";

		if (!this.compare(a, b)) {
			var temp = a;
			a = b;
			b = temp;
		}
		//转换成数组
		a = a.split("");
		b = b.split("");

		var fenRes = [];
		for (var j = (b.length - 1); j >= 0; j--) {
			var ji = 0;
			var flag = 0;
			var res = "";
			var jialing = "";
			for (var i = (a.length - 1); i >= 0; i--) {
				ji = Number(a[i]) * Number(b[j]) + flag;
				res = ji % 10 + res;
				flag = Math.floor(ji / 10);
				if (i == 0 && !(flag == 0)) {
					res = flag + res;
				}
			}
			//后面添加0
			var index = b.length - 1 - j;
			if (index > 0) {
				while (index) {
					res = res + "0";
					index--;
				}
			}
			fenRes[j] = res;
		}

		//处理乘法后的求和
		for (var k = 0; k < fenRes.length; k++) {
			result = this.sum(result, fenRes[k]);
		}

		result = result.replace(/^0+/, '');

		if (!result) {
			result = 0 + "";
		}
		if (symbol && result != "0") {
			result = symbol + result;
		}

		return result;
	}

	//大数乘方:a,b均为正数
	public static pow(a, b) {
		//转换成字符串，兼容int类型
		a = a + "";
		var result = "1";

		if (b == 0) {
			result = "1";
		} else if (b == 1) {
			result = a;
		} else if (b > 1) {
			var tempResult = "";
			for (var j = 0; j < b; j++) {
				result = BigNumUtils.muitlfy(result, a);
			}
		}

		return result;
	}

	//大数取整
	public static round(a) {
		a = a + "";
		var indexa = a.indexOf(".");
		if (indexa != -1) {
			a = a.substr(0, indexa);
		}
		return a;
	}

	//大数除法:a>b,round表示保留的小数位
	public static devide(a, b, round = 0): any {
		//转换成字符串，兼容int类型
		a = a + "";
		b = b + "";

		//判零
		if (b == "0") {
			LogsManager.errorTag("BigNumUtils", "大数运算除法除数为0", b);
			return 0;
		}
		//出现小数的处理：打error，并强制取整
		var indexa = a.indexOf(".");
		var indexb = b.indexOf(".");
		if (indexa != -1) {
			LogsManager.errorTag("BigNumUtils", "大数运算除法a出现小数", a);
			a = a.substr(0, indexa);
		}
		if (indexb != -1) {
			LogsManager.errorTag("BigNumUtils", "大数运算除法b出现小数", b);
			b = b.substr(0, indexb);
			if (b == "0") {
				return 0;
			}
		}

		//判断符号
		var waya = a.slice(0, 1) == "-";
		var wayb = b.slice(0, 1) == "-";

		//都是负数
		if ((!waya && wayb) || (waya && !wayb)) {
			var symbol = "-";
		}

		//去掉符号
		if (a.slice(0, 1) == "-") {
			a = a.substr(1);
		}
		if (b.slice(0, 1) == "-") {
			b = b.substr(1);
		}

		//转换成数组
		a = a.split("");

		var result = "";
		var q = 0; //商
		var r = 0;//余数
		var temp = 0;

		for (var i = 0; i < a.length; i++) {
			temp = r * 10 + Number(a[i]);

			if (this.compare(b, temp)) {
				r = temp;
				result = result + "0";
			} else {
				q = parseInt(String(temp / Number(b)));
				r = temp % Number(b);
				result = result + q;
			}
		}

		result = result.replace(/^0+/, '');

		if (!result) {
			result = 0 + "";
		}


		if (round) {
			if (r) {
				var pow = Math.pow(10, round);
				r = Math.round(r / Number(b) * pow) / pow;
			}
			result = Number(result) + r + "";
		}


		if (symbol && result != "0") {
			result = symbol + result;
		}

		return result;
	}

	//大数：获取最大值
	public static getMax(a, b) {
		if (this.compare(a, b)) {
			return a;
		} else {
			return b;
		}
	}

	//大数：获取最大小值
	public static getMin(a, b) {
		if (this.compare(a, b)) {
			return b;
		} else {
			return a;
		}
	}

	//比较函数，供外部使用, 默认返回a > b, equal = true时返回a >= b
	public static compare(a, b, equal = false) {
		//转换成字符串，兼容int类型
		a = a + "";
		b = b + "";

		if (equal && a == b) {
			return true;
		}
		//判断符号
		var waya = a.slice(0, 1) == "-";
		var wayb = b.slice(0, 1) == "-";

		//同为负数
		if (waya && wayb) {
			return this.compareIn(b, a);
		}
		//同为正数
		else if (!waya && !wayb) {
			return this.compareIn(a, b);
		}
		//a为正数，b为负数
		else if (!waya && wayb) {
			return true;
		}
		//a为负数，b为正数
		else if (waya && !wayb) {
			return false;
		}
	}

	//纯正数比较函数
	public static compareIn(a, b) {
		//转换成数组
		a = a.split("");
		b = b.split("");

		if (a.length > b.length) {
			return true;
		} else if (a.length < b.length) {
			return false;
		} else {
			for (var i = 0; i <= a.length - 1; i++) {
				if (Number(a[i]) > Number(b[i])) {
					return true;
				} else if (Number(a[i]) < Number(b[i])) {
					return false;
				}
				if (i == a.length - 1) {
					return false;
				}
			}
		}
	}

	//浮点数乘方，b为正整数
	public static floatPow(a, b) {
		//转换成字符串，兼容int类型
		a = a + "";
		var result = "1";

		if (b == 0) {
			result = "1";
		} else if (b == 1) {
			result = a;
		} else if (b > 1) {
			var tempResult = "";
			for (var j = 0; j < b; j++) {
				result = BigNumUtils.floatMuitlfy(result, a);
			}
		}

		return result;
	}

	//大数乘法float
	public static floatMuitlfy(a, b) {
		//转换成字符串，兼容int类型
		a = a + "";
		b = b + "";

		//出现小数的处理：打error，并强制取整
		var indexa = a.indexOf(".");
		var indexb = b.indexOf(".");
		var index0 = 0;//小数的总共位数

		if (indexa != -1) {
			index0 += a.length - 1 - indexa;
			a = a.replace('.', '');
		}
		if (indexb != -1) {
			index0 += b.length - 1 - indexb;
			b = b.replace('.', '');
		}

		//判断符号
		var waya = a.slice(0, 1) == "-";
		var wayb = b.slice(0, 1) == "-";

		//都是负数
		if ((!waya && wayb) || (waya && !wayb)) {
			var symbol = "-";
		}

		//去掉符号
		if (a.slice(0, 1) == "-") {
			a = a.substr(1);
		}
		if (b.slice(0, 1) == "-") {
			b = b.substr(1);
		}

		//计算结果
		var result = "";

		if (!this.compare(a, b)) {
			var temp = a;
			a = b;
			b = temp;
		}
		//转换成数组
		a = a.split("");
		b = b.split("");

		var fenRes = [];
		for (var j = (b.length - 1); j >= 0; j--) {
			var ji = 0;
			var flag = 0;
			var res = "";
			var jialing = "";
			for (var i = (a.length - 1); i >= 0; i--) {
				ji = Number(a[i]) * Number(b[j]) + flag;
				res = ji % 10 + res;
				flag = Math.floor(ji / 10);
				if (i == 0 && !(flag == 0)) {
					res = flag + res;
				}
			}
			//后面添加0
			var index = b.length - 1 - j;
			if (index > 0) {
				while (index) {
					res = res + "0";
					index--;
				}
			}
			fenRes[j] = res;
		}

		//处理乘法后的求和
		for (var k = 0; k < fenRes.length; k++) {
			result = this.sum(result, fenRes[k]);
		}

		result = result.replace(/^0+/, '');

		//有小数位存在
		if (index0) {
			//比较result位数与小数位数
			if (result.length > index0) {
				result = BigNumUtils.insertStr(result, result.length - index0, '.');
			} else {
				var tempStr = "";
				for (var i = 1; i <= (index0 - result.length + 1); i++) {
					if (i == 1) {
						tempStr += "0.";
					} else {
						tempStr += "0";
					}
				}
				result = tempStr + result;
			}
		}


		if (!result) {
			result = 0 + "";
		}
		if (symbol && result != "0") {
			result = symbol + result;
		}

		return result;
	}

	public static insertStr(soure, start, newStr) {
		return soure.slice(0, start) + newStr + soure.slice(start);
	}

}
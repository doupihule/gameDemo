/**
 * 一些json对象工具
 */

//import LogsManager from "../manager/LogsManager";

export default class TableUtils {
	public constructor() {
	}

	//深度合并
	static deepMerge(receiveObj: any, fromObj: any) {
		if (!fromObj) {
			return;
		}
		if (!receiveObj) {
			receiveObj = {};
		}
		for (var i in fromObj) {
			var value: any = fromObj[i];
			if (typeof (value) == "object") {
				if (!receiveObj[i]) {
					receiveObj[i] = {}
				}
				//如果是纯数组
				if (Array.isArray(value)) {
					if (value.length > 0) {
						receiveObj[i] = TableUtils.deepCopy(value, []);
					}

				} else {
					this.deepMerge(receiveObj[i], value);
				}
			} else {
				receiveObj[i] = value;
			}
		}
	}

	//深度删除
	//deltitle 删除标识符 当 keyData的 某个key的值为1的时候 表示删除这个值
	static deepDelete(t, keyData, deltitle = 1) {
		if (!keyData) {
			return;
		}
		for (var i in keyData) {
			var value: any = keyData[i];
			if (i != "_id") {
				if (value == deltitle) {
					delete t[i];
				} else if (typeof (value) == "object") {
					if (t[i] != null) {
						this.deepDelete(t[i], value, deltitle);
					}
				} else {
					window["LogsManager"].warn("错误的删除码,key: " + i + "_value: " + value)
				}
			}
		}
	}

	//浅度拷贝一个数组
	static copyOneTable(tb: any) {
		var newTb: any = {};
		for (var i in tb) {
			newTb[i] = tb[i]
		}
		return newTb;

	}

	//深度拷贝 把fromTb 拷贝到totb
	static deepCopy(fromTb: any, toTb: any) {
		for (var i in fromTb) {
			var tempT = fromTb[i];
			if (tempT != null) {
				if (typeof (tempT) == "object") {
					if (!Array.isArray(tempT) || tempT.length == 0) {
						toTb[i] = {}
					} else {
						toTb[i] = [];
					}

					this.deepCopy(tempT, toTb[i]);
				} else {
					toTb[i] = tempT;
				}
			}

		}
		return toTb;
	}


	//浅拷贝一个数组
	static copyOneArr(arr: any[], outArr: any[] = null) {
		if (!outArr) {
			outArr = []
		} else {
			outArr.length = 0;
		}
		if (arr) {
			var len: number = arr.length;

			for (var i = 0; i < len; i++) {
				outArr[i] = arr[i];
			}
		}

		return outArr;
	}

	//获取deleteKey
	//t1 是原始数据 t2 是新数据
	//ignoreFristTb是否忽略第一层的table 默认是true 就是忽略第一层dieletekey
	static findDelKey(t1, t2, resulTb, ignoreFristTb = true) {
		for (var i in t1) {
			var v = t1[i];
			if (v != null) {
				if (typeof (v) == "object") {
					if (t2[i] == null) {
						resulTb[i] = 1
					} else {
						if (this.isEmptyTable(t2[i]) && !ignoreFristTb) {
							resulTb[i] = 1;
						} else {
							var tempT = resulTb[i];
							if (!tempT) {
								tempT = {};
								resulTb[i] = tempT;
							}
							this.findDelKey(v, t2[i], tempT, false);
							if (this.isEmptyTable(tempT)) {
								delete resulTb[i];
							}
						}

					}
				} else {
					if (t2[i] == null) {
						if (i != "id" && i != "_id") {
							resulTb[i] = 1;
						}
					}

				}

			}

		}
	}


	//找一个表里面的空字段
	static findNullKey(fromTb: any, toTb: any) {
		if (!fromTb) {
			return toTb;
		}
		for (var i in fromTb) {
			var value = fromTb[i];
			//必须强制匹配null 或者undefind
			if (value === null || value === undefined) {
				toTb[i] = 1;
			} else if (typeof (value) == "object") {
				var tempTb = {}
				this.findNullKey(value, tempTb);
				if (!TableUtils.isEmptyTable(tempTb)) {
					toTb[i] = tempTb;
				}

			}
		}
		return toTb;

	}


	//比较2个table 返回更新值 变化的值也就是udata
	//t1 是原始数据,t2是新数据
	static compareTable(t1, t2, resulTb) {
		for (var k in t2) {
			var v = t2[k];
			if (v != null) {
				if (typeof (v) != "object") {
					if (!t1 || !t2) {
						window["LogsManager"].echo("_____emyrt data");
					}
					//如果这2个值相等 那么删除这个key
					if (t1[k] == t2[k]) {
						// delete t1[k];
					} else {
						resulTb[k] = v;
					}
				} else {
					//如果是object
					if (!Array.isArray(v) || v.length == 0) {
						resulTb[k] = {}
						//如果t1没有这个数据,那么表示是新增的数据
						if (!t1[k]) {
							//这个地方要用深度复制,否则 拿的是引用会导致后面数据异常
							resulTb[k] = TableUtils.deepCopy(v, {});
							// resulTb[k] = v;
						} else {
							this.compareTable(t1[k], v, resulTb[k]);
						}

					} else {
						//目前有数组深度比较, 那么发送一个错误日志 查看数据
						window["LogsManager"].errorTag("compareTableWarn", "has array Data,k:" + k + ",v:" + TableUtils.safelyJsonStringfy(v).slice(0, 100));
						//如果是数组, 那么必须全量更新
						resulTb[k] = this.deepCopy(v, []);
					}
					//如果是空表后 那么删除这个值
					if (this.isEmptyTable(resulTb[k])) {
						delete resulTb[k];
					}
				}
			}
		}

	}

	//比较2个table 返回删除数据
	//t1 是旧数据,t2是新数据
	static getDelData(t1, t2, resulTb) {
		for (var k in t1) {
			var v = t1[k];
			if (v != null) {
				if (typeof (v) != "object") {
					if (!t1 || !t2) {
						window["LogsManager"].echo("_____emyrt data");
					}
					if (t1[k] && !t2[k]) {
						resulTb[k] = 1
					}
				} else {
					//如果是object
					if (!Array.isArray(v)) {
						resulTb[k] = {}
						//如果t1没有这个数据,那么表示是新增的数据
						if (!t2[k]) {
							resulTb[k] = 1
						} else {
							this.getDelData(v, t2[k], resulTb[k]);
						}

					}
					//如果是空表后 那么删除这个值
					if (resulTb[k] != 1 && this.isEmptyTable(resulTb[k])) {
						delete resulTb[k];
					}
				}
			}
		}

	}

	//修正空数组为table 
	static adjustEmptyArr(tb: any) {
		if (!tb) {
			return;
		}
		for (var i in tb) {
			var v = tb[i];
			if (typeof (v) == "object") {
				if (Array.isArray(v)) {
					if (v.length == 0) {
						window["LogsManager"].warn("_____adjustEmptyArr,k:", i);
						tb[i] = {}
					}
				} else {
					this.adjustEmptyArr(v);
				}
			}
		}
	}


	//是否是一张空表
	static isEmptyTable(tb: any) {
		for (var i in tb) {
			if (tb[i] != null) {
				return false;
			}
		}
		return true;
	}

	//移除一个元素
	static removeValue(arr: any[], value: any) {
		var index: number = arr.indexOf(value);
		if (index != -1) {
			arr.splice(index, 1);
		}
	}

	//将一个 类似 ['a,b,c','d,e,f'] 的一维数组转化成二维数组 
	// transtoNumber 是否需要把 数值形的字符串 转成数字, 慎用, 有可能会把 id数值形 也转化成数字 导致读取数据错误
	static turnCsvArrToGameArr(fromArr: any[], transtoNumber: boolean = false) {
		var toArr = []
		if (fromArr) {
			for (var i = 0; i < fromArr.length; i++) {
				var str: string = fromArr[i]
				toArr[i] = str.split(",");
				if (transtoNumber) {
					var tempArr = toArr[i]
					for (var ii = 0; ii < tempArr.length; ii++) {
						var value = tempArr[ii];
						var turnValue = Number(value);
						if (turnValue || turnValue == 0) {
							tempArr[ii] = turnValue;
						}
					}
				}
			}
		}

		return toArr;
	}

	//改一个类似  a,b,c;d,e,f;g,d,m; 字符串转化成 二维数组 
	static turnCsvStrTogGameArr(fromStr: string, transtoNumber: boolean = false) {
		//如果是以分号结尾 那么移出最后一个字符
		var strLen: number = fromStr.length;
		if (fromStr.slice(strLen - 1, strLen) == ";") {
			fromStr = fromStr.slice(0, strLen - 1);
		}
		var arr = fromStr.split(";")
		return this.turnCsvArrToGameArr(arr);

	}

	//清空一个table表
	static clearOneTable(targetTb: any) {
		for (var i in targetTb) {
			delete targetTb[i];
		}
	}

	//安全json解析
	static safelyJsonStringfy(obj: any) {
		var rt: string = ''
		try {
			rt = JSON.stringify(obj)
		} catch (e) {
			window["LogsManager"].echo("jsonStringFyError");
			rt = this.safelyToString(obj);
		}
		return rt;
	}

	//安全json parse
	static safelyJsonParse(str: string) {
		var rt: any;
		try {
			rt = JSON.parse(str)
		} catch (e) {
			window["LogsManager"].echo("safelyJsonParseError");
			rt = {}
		}
		return rt;
	}

	//安全toString
	static safelyToString(obj: any) {
		if (obj == null) {
			return obj;
		}
		var rt: string = ''
		try {
			rt = obj.toString();
		} catch (e) {
			window["LogsManager"].errorTag("safelyToStringError", "safelyToStringError");
			rt = ""
		}
		return rt;
	}


}
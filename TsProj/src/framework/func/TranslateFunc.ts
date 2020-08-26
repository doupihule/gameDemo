import LogsErrorCode from "../consts/LogsErrorCode";
import TranslateConst from "../../game/sys/consts/TranslateConst";
import TranslateCommonConst from "../consts/TranslateCommonConst";
import BaseFunc from "./BaseFunc";

export default class TranslateFunc {

	getCfgsPathArr() {
		return [];
	}

	//本地errorCode json没加载时用的
	private static localErrorCodeMap: any = {
		"#error110": {"state": 1, "hid": "#error110", "en_US": "Network connection failed", "zh_CN": "当前网络不稳定，稍后尝试"},
		"#error99999999": {"state": 1, "hid": "#error99999999", "en_US": "System error", "zh_CN": "系统错误"},
		"#error34903": {"state": 1, "hid": "#error34903", "en_US": "Data error", "zh_CN": "账号数据异常"},
		"#versionUpdateReady": {
			"state": 1,
			"hid": "#versionUpdateReady",
			"en_US": "New version ready",
			"zh_CN": "你没玩过的全新版本出现了！请退出后重新进入游戏"
		},
		"#beforeVersionUpdate": {
			"state": 1,
			"hid": "#versionUpdateReady",
			"en_US": "New version is loading",
			"zh_CN": "全新版本即将到来，请稍后再试"
		},
		"#versionForceUpdate": {
			"state": 1,
			"hid": "#versionUpdateReady",
			"en_US": "New version is loading",
			"zh_CN": "发现新版本，正在更新"
		},
		"#loadResError": {"state": 1, "hid": "#loadResError", "en_US": "load Res Error", "zh_CN": "网络异常"},
		"#error99999998": {"state": 1, "hid": "#loadResError", "en_US": "System error", "zh_CN": "数据异常错误"},
		"#subPackageError": {"state": 1, "en_US": "System error", "zh_CN": "分包资源下载异常,点击重试"}
	}

	//wx分享失败弹wx框时
	public static shareTranslateArr: string[] = ["操作失败，换个群试试", "操作失败，需分享到30人以上群", "请勿分享到相同群，换个群试试"];
	//wx分享失败弹wx框时的确认按钮文本
	public static shareLabTranslate: string = "去分享";
	//wx看视频中途退出弹wx框时
	public static videoTranslateArr: string[] = ["观看完视频即可领取奖励"];
	//wx看视频中途退出弹wx框时的确认按钮文本
	public static videoLabTranslate: string = "好的";
	protected _allCfgs: any;

	public constructor() {
		this._allCfgs = {};
		this._allCfgs["localErrorCodeMap"] = TranslateFunc.localErrorCodeMap
		this._allCfgs["localTranslate"] = TranslateConst.localTranslate
		this._allCfgs["localTranslateCommon"] = TranslateCommonConst.localTranslate
	}

	private static _instance: TranslateFunc;
	public static get instance() {
		if (!this._instance) {
			this._instance = new TranslateFunc();
		}
		return this._instance;
	}

	//插入一条表数据, 目前主要是考虑到 translate需要分系统自己插入.
	insertOneCfgs(path: string) {
		path = BaseFunc.turnPath(path);
		this._allCfgs[path] = BaseFunc.getGlobalCfg(path);

	}

	getAllCfgData(cfgsName, ignoreError: boolean = false) {
		cfgsName = BaseFunc.turnPath(cfgsName);
		var cfgs = this._allCfgs[cfgsName];
		if (!cfgs) {
			if (!ignoreError) {
				window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "对应的配表没找到,请检查配置:" + cfgsName);
			}
			return {};
		}
		if (BaseFunc.exportType == BaseFunc.exportType_New) {
			var itemData = cfgs.d;
			if (!itemData) {
				BaseFunc._changeCfgs[cfgsName] = {};
				if (BaseFunc.hotCfg && BaseFunc.hotCfg[cfgsName]) {
					//热更的是个新表的情况下，直接取热更内容
					cfgs = BaseFunc.hotCfg && BaseFunc.hotCfg[cfgsName];
					if (cfgs) {
						BaseFunc._changeCfgs[cfgsName] = cfgs;
						return cfgs;
					}
				}
				return {};
			}
			for (var key in itemData) {
				this.setOneChangeData(cfgsName, key);
			}
			cfgs = BaseFunc._changeCfgs[cfgsName];
		}
		return cfgs;
	}

	/**转换数据结构 */
	changeDataById(cfgsName, id, ignoreError: boolean = false) {
		return BaseFunc.prototype.changeDataById.call(this, cfgsName, id, ignoreError);
	}

	/**转换一个id的数据 */
	setOneChangeData(cfgsName, id, ignoreError: boolean = false) {
		BaseFunc.prototype.setOneChangeData.call(this, cfgsName, id, ignoreError);
	}


	//根据配置名称,对应的id 获取对应的数据
	// ignoreError 是否忽略错误.默认false当获取不到某个表的时候会提示报错
	getCfgDatas(cfgsName, id, ignoreError: boolean = false) {
		cfgsName = BaseFunc.turnPath(cfgsName);
		var cfgs = this._allCfgs[cfgsName];
		if (!cfgs) {
			if (!ignoreError) {
				//
				window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "配表还没有加载成功:" + cfgsName);
			}
			return {}
		}
		var data = this.changeDataById(cfgsName, id, ignoreError);
		if (!data) {
			if (!ignoreError) {
				window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "请找策划,配表名字:" + cfgsName + "对应的id找不到" + id);
			}
			return {};
		}
		return data;
	}

	//多语言的配表格式不一样
	// tid兼容传递 带#号和不带#号
	//cfgsName
	// 如果不传模块名 那么就从所有的模块遍历查找
	//如果指定模块名 那么就从指定的模块里面查找
	//replaceArr需要替换的通配符 依次根据顺序替换 #v1#,#v2#,...
	getTranslate(tid: string, cfgsName: string = null, ...replaceArr: any[]) {

		var language: string = "zh_CN";

		var key2: string = "#" + tid;
		var resultStr: any;
		if (cfgsName) {
			var data: any = this._allCfgs[cfgsName];
			if (!data) {
				window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "多语言配置缺失1:", tid, "cfgsName:", cfgsName);
				return ""
			}
			if (data[tid] || data[key2]) {
				resultStr = data[tid] || data[key2];
			} else if (BaseFunc.exportType == BaseFunc.exportType_New) {
				if (Object.keys(BaseFunc.hotCfg).length > 0) {
					if (BaseFunc.hotCfg[cfgsName]) {
						if (BaseFunc.hotCfg[cfgsName][tid] || BaseFunc.hotCfg[cfgsName][key2]) {
							resultStr = BaseFunc.hotCfg[cfgsName][tid] || BaseFunc.hotCfg[cfgsName][key2];
						}
					}
				}
				if (!resultStr && data.d) {
					var info = data.d;
					var temp = info[tid] || info[key2];
					var key = data.m;
					if (temp && key) {
						resultStr = {}
						for (var j = 1; j < key.length; j++) {
							resultStr[key[j]] = temp[j - 1]
						}
					}
				}
			}
		} else {
			for (var i in this._allCfgs) {
				var data: any = this._allCfgs[i];
				resultStr = data[tid] || data[key2];
				if (resultStr) {
					break;
				} else if (BaseFunc.exportType == BaseFunc.exportType_New) {
					if (Object.keys(BaseFunc.hotCfg).length > 0) {
						if (BaseFunc.hotCfg[i]) {
							if (BaseFunc.hotCfg[i][tid] || BaseFunc.hotCfg[i][key2]) {
								resultStr = BaseFunc.hotCfg[i][tid] || BaseFunc.hotCfg[i][key2];
								break;
							}
						}
					}
					//tranlate采用第一种去表头导出方式
					if (data.d) {
						var info = data.d;
						var temp = info[tid] || info[key2];
						var key = data.m;
						if (temp && key) {
							resultStr = {}
							for (var j = 1; j < key.length; j++) {
								resultStr[key[j]] = temp[j - 1]
							}
							break;
						}
					}
				}
			}
		}
		//如果是object 说明有多个多语言版本
		if (typeof (resultStr) == "object") {
			resultStr = resultStr[language];
		}
		if (!resultStr) {
			window["LogsManager"].errorTag(LogsErrorCode.CONFIG_ERROR, "多语言配置缺失:", tid, "cfgsName:", cfgsName);
			return tid;
		}


		//如果有替换符
		if (replaceArr.length > 0) {
			for (var m = 0; m < replaceArr.length; m++) {
				resultStr = resultStr.replace("#" + (m + 1), replaceArr[m]);
			}
		}

		return resultStr;
	}

}
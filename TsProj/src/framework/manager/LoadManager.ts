import LogsManager from "./LogsManager";
import TimerManager from "./TimerManager";
import Message from "../common/Message";
import MsgCMD from "../../game/sys/common/MsgCMD";
import {WindowCfgs} from "../../game/sys/consts/WindowCfgs";
import TranslateFunc from "../func/TranslateFunc";
import WindowManager from "./WindowManager";
import TableUtils from "../utils/TableUtils";
import VersionManager from "./VersionManager";
import {LoadZipManager} from "./LoadZipManager";
import SubPackageManager from "./SubPackageManager";
import UserInfo from "../common/UserInfo";

export class LoadManager {
	private static _instance: LoadManager;


	//当前加载的组信息
	private currentLoadinfo: any;

	//重新加载的次数
	private _reloadCount: number = 0;
	//最多重新加载的次数 ,超过之后 就等待.
	private _maxReloadcount: number = 1;

	//测试加载失败开关
	private _isTestError: boolean = false;

	//当前加载组的缓存队列
	/**
	 * name:string
	 * callBack:Function,
	 * thisObject:any,
	 * loading:boolean ,是否显示loading
	 */
	private _loadCacheArr: any[];

	private _timeCode: number = 0;
	private _timeCount: number = 0;

	//加载缓存组的列表
	private _hasCacheMap: any;

	private _startLoadTime: number = 0;


	constructor() {
	}

	static get instance(): LoadManager {
		if (!this._instance) {
			this._instance = new LoadManager();
		}
		return this._instance;
	}

	loadPacgeAndRes(subPackageGroup, url: any, complete?: any, progress?: any, type?: string, isInsert?: boolean, isLoading?: boolean, priority?: number, cache?: boolean, group?: string, ignoreCache?: boolean, useWorkerLoader?: boolean) {

	}

	load(url: any, complete?: any, progress?: any, type?: string, isInsert?: boolean, isLoading?: boolean, priority?: number, cache?: boolean, group?: string, ignoreCache?: boolean, useWorkerLoader?: boolean) {

	}

	create(url: any, complete?: any, progress?: any, type?: string, isInsert?: boolean, isLoading?: boolean, constructParams?: Array<any>, propertyParams?: any, priority?: number) {

	}

	//创建3d对象. 先加载对应的分包
	createPackAndRes(subPackageGroup: any, url: any, complete?: any, progress?: any, type?: string, isInsert?: boolean, isLoading?: boolean, constructParams?: Array<any>, propertyParams?: any, priority?: number) {

	}





	//判断是否有缓存
	public checkHasCache(url) {
		var key = url
		if (typeof key != "string") {
			key = JSON.stringify(url);
		}
		var result = this._hasCacheMap[key];
		// if(result){
		//     LogsManager.echo("这组已经已经加载过了",url.slice(0,100));
		// }
		return result;
	}

	//预编译shader
	private compileShader(model: any): void {

	}


}

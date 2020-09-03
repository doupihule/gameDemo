

export class LoadZipManager {
	private static _instance: LoadZipManager;


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
		this._loadCacheArr = [];
		this._hasCacheMap = {};

	}


	static get instance(): LoadZipManager {
		if (!this._instance) {
			this._instance = new LoadZipManager();
		}
		return this._instance;
	}


	//加载一个模块对应的zip

	//加载一个zip
	loadZip(url: any, modelName: string, completeFunc: any, errorFunc: any, isInsert: boolean = false) {


	}

	//判断是否有缓存
	public checkHasCache(url) {
		var key = url
		if (typeof key != "string") {
			key = JSON.stringify(url);
		}
		var result = this._hasCacheMap[key];
		return result;
	}


}

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
	private _onLoadHandle: Laya.Handler;
	private _onProgressHandle: Laya.Handler;

	//加载缓存组的列表
	private _hasCacheMap: any;

	private _startLoadTime: number = 0;


	constructor() {
		this._loadCacheArr = [];
		this._hasCacheMap = {};
		// Laya.loader.on(Laya.Event.COMPLETE,this,this.onGroupComplete);
		Laya.loader.on(Laya.Event.ERROR, this, this.onLoadedError);
		// RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComplete, this);
		// RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
		// RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onGroupProgress, this);
		this._onLoadHandle = Laya.Handler.create(this, this.onLoadBack, null, false);
		this._onProgressHandle = Laya.Handler.create(this, this.onGroupProgress, null, false);

	}

	static get instance(): LoadManager {
		if (!this._instance) {
			this._instance = new LoadManager();
		}
		return this._instance;
	}

	loadPacgeAndRes(subPackageGroup, url: any, complete?: Laya.Handler, progress?: Laya.Handler, type?: string, isInsert?: boolean, isLoading?: boolean, priority?: number, cache?: boolean, group?: string, ignoreCache?: boolean, useWorkerLoader?: boolean) {
		if (!subPackageGroup || subPackageGroup.length == 0 || UserInfo.isWeb()) {
			this.load(url, complete, progress, type, isInsert, isLoading, priority, cache, group, ignoreCache, useWorkerLoader)
		} else {
			var thisObj = this;
			var onSubBack = () => {
				thisObj.load(url, complete, progress, type, isInsert, isLoading, priority, cache, group, ignoreCache, useWorkerLoader);
			}
			SubPackageManager.load(subPackageGroup, onSubBack, this, isInsert);
		}
	}

	load(url: any, complete?: Laya.Handler, progress?: Laya.Handler, type?: string, isInsert?: boolean, isLoading?: boolean, priority?: number, cache?: boolean, group?: string, ignoreCache?: boolean, useWorkerLoader?: boolean) {
		if (typeof url != "string") {
			if (!url.length) {
				if (complete) {
					complete.run();
				}
				return;
			}
		}
		var params = {
			url: url,
			complete: complete,
			progress: progress,
			type: type,
			priority: priority,
			cache: true,
			group: group,
			ignoreCache: ignoreCache,
			useWorkerLoader: useWorkerLoader,
			isInsert: isInsert,
			isLoading: isLoading,
			style: "load",
			name: url,
			originUrl: url,
		}
		var arr: any[];
		if (typeof url != "string") {
			params.name = JSON.stringify(url);
			params.originUrl = TableUtils.copyOneArr(url);
		}
		//如果已经缓存过了
		if (this.checkHasCache(params.name)) {
			if (complete) {
				complete.run();
			}
			return
		}

		if (isInsert) {
			this._loadCacheArr.splice(0, 0, params);
		} else {
			this._loadCacheArr.push(params);
		}
		this.checkLoad();
	}

	create(url: any, complete?: Laya.Handler, progress?: Laya.Handler, type?: string, isInsert?: boolean, isLoading?: boolean, constructParams?: Array<any>, propertyParams?: any, priority?: number) {
		if (typeof url != "string") {
			if (!url.length) {
				if (complete) {
					complete.run();
				}
				return;
			}
		} else {
			//如果url是字符串 那么就强制转为数组, 是为了统一格式
			url = [url]
		}
		var params = {
			url: url,
			complete: complete,
			progress: progress,
			type: type,
			constructParams: constructParams,
			propertyParams: propertyParams,
			priority: priority,
			cache: true,
			isInsert: isInsert,
			isLoading: isLoading,
			style: "create",
			name: url,
			originUrl: url,
		}

		if (typeof url != "string") {
			params.name = JSON.stringify(url);
			params.originUrl = TableUtils.copyOneArr(url);
		}

		//如果已经缓存过了
		if (this.checkHasCache(params.name)) {
			if (complete) {
				complete.run();
			}
			return
		}


		if (isInsert) {
			this._loadCacheArr.splice(0, 0, params);
		} else {
			this._loadCacheArr.push(params);
		}
		this.checkLoad();
	}

	//创建3d对象. 先加载对应的分包
	createPackAndRes(subPackageGroup: any, url: any, complete?: Laya.Handler, progress?: Laya.Handler, type?: string, isInsert?: boolean, isLoading?: boolean, constructParams?: Array<any>, propertyParams?: any, priority?: number) {
		if (!subPackageGroup || subPackageGroup.length == 0 || UserInfo.isWeb()) {
			this.create(url, complete, progress, type, isInsert, isLoading, constructParams, propertyParams, priority)
		} else {
			var thisObj = this;
			var onSubBack = () => {
				thisObj.create(url, complete, progress, type, isInsert, isLoading, constructParams, propertyParams, priority)
			}
			SubPackageManager.load(subPackageGroup, onSubBack, this);
		}

	}


	//判断开始加载
	checkLoad() {
		//如果当前正在加载
		if (this.currentLoadinfo) {
			return;
		}
		if (this._loadCacheArr.length == 0) {
			return;
		}
		var info: any = this._loadCacheArr[0];
		this._loadCacheArr.splice(0, 1);

		this.sureLoad(info);

	}

	private sureLoad(info: any) {
		this.currentLoadinfo = info;

		if (info.isLoading) {
			Message.instance.send(MsgCMD.MODULE_SHOW, WindowCfgs.LoadingUI);
		}
		// LogsManager.echo("xd_开始加载组:", info.name.slice(0, 100));

		//添加超时判断 暂定20秒超时
		this._timeCode = TimerManager.instance.add(this.timerHandler, this, 20000, 1);

		this._startLoadTime = Laya.Browser.now();
		if (this.currentLoadinfo.style == "load") {
			Laya.loader.load(info.url, this._onLoadHandle, this._onProgressHandle, info.type, info.priority, info.cache, info.group, info.ignoreCache, info.useWorkerLoader);
		} else {
			//如果是使用zip 而且是没有下载zip失败的
			// if(FileUtils.checkIsUseZip() && !this.currentLoadinfo.zipError){
			//     this.startLoadZips();
			//     return;
			// }
			Laya.loader.create(info.url, this._onLoadHandle, this._onProgressHandle, info.type, info.constructParams, info.propertyParams, info.priority, info.cache);
		}
	}

	//开始加载zip;
	private startLoadZips() {
		var urls = this.currentLoadinfo.url;

		for (var i = 0; i < urls.length; i++) {
			var url = urls[i];
			if (typeof url != "string") {
				url = url.url;
			}
			var model = VersionManager.instance.get3dZipModelName(url);
			var zipFileUurl = VersionManager.instance.get3dModelZipFileName(model);
			LoadZipManager.instance.loadZip(zipFileUurl, model, new Laya.Handler(this, this.oneZipComplete, [i, model]), new Laya.Handler(this, this.oneZipError, [i, model]));
		}
	}

	//zip下载完成
	private oneZipComplete(index: number, model: string) {
		if (this.currentLoadinfo.zipError) {
			return;
		}

		TimerManager.instance.add(this.delayCheckZipFile, this, 10, 1, false, [model]);

	}

	private delayCheckZipFile(model) {
		if (this.currentLoadinfo.loadNums == null) {
			this.currentLoadinfo.loadNums = 0;
		}
		this.currentLoadinfo.loadNums++;
		LogsManager.echo("zipModel:", model, "loadcomplete");
		var info = this.currentLoadinfo;

		//如果全部下载完成了
		if (this.currentLoadinfo.loadNums == this.currentLoadinfo.url.length) {
			Laya.loader.create(info.url, this._onLoadHandle, this._onProgressHandle, info.type, info.constructParams, info.propertyParams, info.priority, info.cache);
		}
	}


	//一个zip下载失败
	private oneZipError(index: number, model: string) {
		this.currentLoadinfo.zipError = true;
		var info = this.currentLoadinfo;
		LogsManager.echo("_下载zip文件失败-,转用普通方式下载");
		//下载zip文件失败 通知版本管理器 删掉对应的model数据. 然后走正常的web版资源下载
		VersionManager.instance.deleteOneModel(model);
		Laya.loader.create(info.url, this._onLoadHandle, this._onProgressHandle, info.type, info.constructParams, info.propertyParams, info.priority, info.cache);
	}


	//加载回来
	onLoadBack(info: any) {
		if (this.currentLoadinfo && this.currentLoadinfo.isLoading) {
			Message.instance.send(MsgCMD.MODULE_CLOSE, WindowCfgs.LoadingUI);
		}


		TimerManager.instance.remove(this._timeCode);
		if (this.currentLoadinfo.style == "create") {
			if (this.currentLoadinfo.loadError) {
				this.onGroupLoadError();
			} else {
				this.onGroupComplete(info);
			}
		} else {

			if (!info) {
				this.onGroupLoadError();
			} else {
				//单个的3D资源加载完成会返回对应的3D scene 可以节省创建次数
				this.onGroupComplete(info);
			}
		}
	}

	//超时了直接
	private timerHandler() {
		LogsManager.echo("xd_loadres 超时");
		// this.onGroupLoadError();

	}

	/**
	 * 资源组加载完成
	 */
	private onGroupComplete(info) {
		//记录加载组耗时
		// LogsManager.echo("xd >>>>>>>>>>onGroupComple", this.currentLoadinfo.name, "load group costTime:", Laya.Browser.now() - this._startLoadTime);

		if (this._isTestError) {
			LogsManager.echo("__强制测试加载失败重新加载--")
			// this._isTestError =false;
			this.onGroupLoadError();
			return
		}
		this.loadFinish(info);
	}

	//判断本次的loading是否是第一个组
	private checkIsFirstGroup(info: any) {
		// if (!info.startIndex) {
		//     return true
		// }
		// if (info.startIndex == 0) {
		//     return true;
		// }
	}

	//判断是否是本次loading的最后一个组
	private checkIsFinalGroup(info: any) {
		// //如果是单组, 那么 就是最后一个组
		// if (!info.groupItems) {
		//     return true
		// }
		// //如果起始值+ 组长度= 总长度,那么是最后一个组
		// if (info.startIndex + info.groupItems == info.totalItems) {
		//     return true;
		// }
		// return false;
	}

	//加载完成
	private loadFinish(info) {
		if (this.currentLoadinfo) {
			this.setOneCache(this.currentLoadinfo.name);
			var info = this.currentLoadinfo
			this.currentLoadinfo = null;
			if (info.style == "create") {
				var url = info.url;
				if (typeof (url) == "string") {
					var effect: Laya.Sprite3D = Laya.loader.getRes(url);
					this.compileShader(effect);
				} else if (url.length) {
					for (var index in url) {
						var effect: Laya.Sprite3D = Laya.loader.getRes(url[index].url);
						this.compileShader(effect);
					}
				}
			}
			if (info.isLoading) {
				Message.instance.send(MsgCMD.MODULE_CLOSE, WindowCfgs.LoadingUI);
			}
			if (info.complete) {
				info.complete.runWith(info);
			}
		}
		this._reloadCount = 0;
		//判断是否 还有缓存队列的加载
		this.checkLoad();
	}

	/**
	 * 资源组加载进度
	 */
	private onGroupProgress(value: number) {
		var progressInfo = {
			itemsLoaded: Math.floor(value * 100),
			itemsTotal: 100
		}

	}

	//接受到加载失败的消息
	private onLoadedError(info) {
		//设置当前加载资源加载失败

		var compStr = "comp/"
		//必须不是通用资源
		if (typeof info == "string" && info.slice(0, compStr.length) != compStr) {
			LogsManager.warn("---onLoadedError:", info);
			if (this.currentLoadinfo) {
				this.currentLoadinfo.loadError = true;
			}
		} else {
			console.log("_系统资源加载失败", info)
		}


		// this.onGroupLoadError();
	}

	/**
	 * 资源组加载错误
	 */
	private onGroupLoadError() {
		TimerManager.instance.remove(this._timeCode);
		if (this.currentLoadinfo) {
			LogsManager.warn("资源加载失败 , " + "当前组:" + this.currentLoadinfo.name);
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#loadResError"));
			this.currentLoadinfo.loadError = false;
			//重载次数++;
			this._reloadCount++;
			if (this._reloadCount == this._maxReloadcount) {
				LogsManager.errorTag("resError", "loadErrorGroupName:" + this.currentLoadinfo.name);
			}
			if (this._reloadCount <= this._maxReloadcount) {
				//10帧以后自动重新加载
				TimerManager.instance.setTimeout(this.reloadGroup, this, 10)
			} else {
				WindowManager.setPopupTip(1, TranslateFunc.instance.getTranslate("#error110"), this.reloadGroup, this)
			}
		}
	}

	//重新加载
	private reloadGroup() {
		if (this.currentLoadinfo) {
			if (this._reloadCount >= 3) {
				this._isTestError = false;
			}
			if (this.currentLoadinfo.originUrl) {
				this.currentLoadinfo.url = this.currentLoadinfo.originUrl;
			}
			this.sureLoad(this.currentLoadinfo);
		}
	}


	//设置缓存
	private setOneCache(url) {
		var key = url
		if (typeof key != "string") {
			key = JSON.stringify(url);
		}
		this._hasCacheMap[key] = true;
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

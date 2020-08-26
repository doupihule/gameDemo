import LogsManager from "./LogsManager";
import TimerManager from "./TimerManager";
import Message from "../common/Message";
import MsgCMD from "../../game/sys/common/MsgCMD";
import {WindowCfgs} from "../../game/sys/consts/WindowCfgs";
import TranslateFunc from "../func/TranslateFunc";
import WindowManager from "./WindowManager";
import FileUtils from "../utils/FileUtils";
import VersionManager from "./VersionManager";
import LogsErrorCode from "../consts/LogsErrorCode";

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
	private _onLoadHandle: Laya.Handler;
	private _onProgressHandle: Laya.Handler;

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
	loadZip(url: any, modelName: string, completeFunc: Laya.Handler, errorFunc: Laya.Handler, isInsert: boolean = false) {

		//如果这个模块已经是完整的了  不处理
		if (VersionManager.instance.checkModelFilesIsRight(modelName, true)) {
			LogsManager.echo("xd zip url ", url, " 本地已经有缓存了无需重复下载")
			if (completeFunc) {
				completeFunc.run();
			}
			return;
		}

		var params = {
			url: url,
			model: modelName,
			name: url,
			completeFunc: completeFunc,
			errorFunc: completeFunc,
		}

		if (isInsert) {
			this._loadCacheArr.splice(0, 0, params);
		} else {
			this._loadCacheArr.push(params);
		}
		this.checkLoad();
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
		var t1 = Laya.Browser.now();
		LogsManager.echo("xd_开始zip:", info.name.slice(0, 100));

		//添加超时判断 暂定20秒超时
		this._timeCode = TimerManager.instance.add(this.timerHandler, this, 20000, 1);

		this._startLoadTime = Laya.Browser.now();
		//这里需要转成远端路径
		var virtualUrl = VersionManager.getVirtualUrl(info.url);

		var remoteUrl = Laya.URL.basePath + virtualUrl

		var saveUrl = FileUtils.getLocalZipCacheFullPath() + virtualUrl;
		var dirName = FileUtils.getFilePathByUrl(saveUrl);
		FileUtils.mkdirsSync(dirName);
		var targetUnZipFolder = VersionManager.instance.getUnZipFilePath(info.model)
		this.loadZipFoldler(targetUnZipFolder);
		var thisObj = this;

		var onDownLoadSuccess = (r) => {
			if (r.statusCode == 200) {
				LogsManager.echo("xd donwLoadZip", info.url, "_costTime:", Laya.Browser.now() - t1);
				thisObj.currentLoadinfo = null;
				//这里延迟一帧解压
				// TimerManager.instance.add(FileUtils.unZipFile,FileUtils,10,1,false,[saveUrl,targetUnZipFolder,info.completeFunc,info.errorFunc])
				VersionManager.instance.initUnZipFilePath(info.model);
				FileUtils.unZipFile(saveUrl, targetUnZipFolder, info.completeFunc, info.errorFunc)
				thisObj.checkLoad();
			} else {
				//那么做加载失败处理
				LogsManager.echo("_加载失败,statusCode:", r.statusCode)
				thisObj.onLoadError();
			}

		}

		//下载失败
		var onDownLoadError = (e) => {
			LogsManager.echo("xd wx.downLoadFileError", e.toString());
			thisObj.onLoadError();
		}

		wx.downloadFile({
			url: remoteUrl,
			success: onDownLoadSuccess,
			fail: onDownLoadError,
			filePath: saveUrl,
			complete: null
		})
	}

	//创建文件夹
	loadZipFoldler(targetUnZipFolder) {
		if (FileUtils.existsLocalFile(targetUnZipFolder)) {
			// LogsManager.errorTag(LogsErrorCode.FILE_ERROR, "zm当前创建的文件夹已存在", targetUnZipFolder);
			wx.getFileSystemManager().rmdir({
				dirPath: targetUnZipFolder,
				success: () => {
					LogsManager.echo("zm删除文件夹成功:", targetUnZipFolder);
					FileUtils.fs_cache[targetUnZipFolder] = 0;
					FileUtils.mkdirsSync(targetUnZipFolder);
				},
				fail: (ee) => {
					//尝试再次删除
					var errorStr;
					try {
						errorStr = JSON.stringify(ee);
					} catch (e) {
						errorStr = ee.toString();
					}
					LogsManager.errorTag(LogsErrorCode.FILE_ERROR, "zm_删除目录失败", targetUnZipFolder, errorStr);
				},
				recursive: true
			}, true);
		} else {
			FileUtils.mkdirsSync(targetUnZipFolder);
		}
	}

	//加载失败 做重连
	private onLoadError() {
		var errorMessage = TranslateFunc.instance.getTranslate("#error110");
		//弹窗重连
		WindowManager.setPopupTip(1, errorMessage, this.reloadGroup, this);
	}

	//超时了直接
	private timerHandler() {
		LogsManager.echo("xd_loadres 超时");

	}

	//重新加载
	private reloadGroup() {
		this.sureLoad(this.currentLoadinfo);
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

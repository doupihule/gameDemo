import UserInfo from "../common/UserInfo";
import CacheManager from "./CacheManager";
import StorageCode from "../../game/sys/consts/StorageCode";
import FileUtils from "../utils/FileUtils";
import SubPackageManager from "./SubPackageManager";
import SubPackageConst from "../../game/sys/consts/SubPackageConst";
import GameSwitch from "../common/GameSwitch";
import ResourceManager from "./ResourceManager";

export default class VersionManager {
	// 版本状态
	static versionStatus: number;

	static VERSION_STATUS_NO_UPDATE: number = 0;
	static VERSION_STATUS_NEED_UPDATE: number = 1;
	static VERSION_STATUS_FORCE_UPDATE: number = 2;
	static VERSION_STATUS_SERVER_MAINTAIN: number = 3;
	static VERSION_STATUS_VERSION_ROLLBACK: number = 4;
	static VERSION_STATUS_VERSION_NOT_EXIST: number = 5;
	static VERSION_STATUS_VERSION_DEFAULT_ERROR: number = 999;


	static ZIP_3DMODEL_NAME: string = "3dmodels"

	static ZIP_MODEL_KEY_VERSION: string = "version";
	static ZIP_MODEL_KEY_CONFIG: string = "json";
	static ZIP_MODEL_KEY_UICFGS: string = "uiCfgs";
	static ZIP_MODEL_KEY_MERGEFILES: string = "mergefiles"

	//线上版本号
	static vmsVersion: number;


	//对应版本的名称
	public versionName: string = "version.json"
	private static _instance: VersionManager;
	//本地缓存的版本号
	private _cacheVersion: string;

	// 目标文件路径->到本地unzip文件路径
	/**
	 * 3dmodels/LayaScene_eff_dailyTask/Conventional/eff_dailyTask.lh: wxlocal://usr/unzipcache/....lh
	 */

	public cacheUnZipFilePathMap: any = {}

	//version版本管理数据
	public versionJsonObj: any;

	//本地缓存的 每种zip方式 对应的文件信息 modelName  分 3Dmodel对应的模型名, version(版本管理),globalCfgs(全局配表),uiCfgs(ui配置)
	/**
	 * modelName:{
	 *  zipFile: 3dmodels/LayaScene_zuqiuchang.zip
	 *  fileList:[ 3dmodels/LayaScene_zuqiuchang/Conventional/renqiang.lh ,3dmodels/LayaScene_zuqiuchang/Conventional/Assets/*.* ]
	 *  zipPath: 3dmodels/
	 *  zipName: LayaScene_zuqiuchang_md5,
	 *  unZipFolderName: LayaScene_zuqiuchang_md5_files
	 *
	 *  zipFile: json.zip
	 *  fileList:[ json/globalCfgs.json ]
	 *  zipPath:'',对应的zip存储文件夹相对路径
	 *
	 * }
	 *
	 */
	private _modelZipInfo: any = {}


	//忽略检查的数组 带上路径,不能带crc32以及后缀.  比如 common/loading_bg23861234.png,
	private ingoreCheckGroup = [];

	public static get instance() {
		if (!this._instance) {
			this._instance = new VersionManager();
		}
		return this._instance;
	}

	constructor() {
		this._cacheVersion = CacheManager.instance.getGlobalCache(StorageCode.storage_vmsversion) || "";
	}

	//初始化版本文件
	public initVersionData() {
		// if(GameSwitch.checkOnOff(GameSwitch.SWITCH_LOCAL_RES)){
		//     return;
		// }
		this.versionJsonObj = ResourceManager.getResTxt(this.versionName);
		var subPackData = SubPackageConst.subPackData;
		for (var i in subPackData) {
			var info = subPackData[i];
			//配表和 合并文件 走单独的判断. 因为还涉及到zip压缩功能
			if (i != SubPackageConst.packName_json && i != SubPackageConst.packName_mergefiles) {
				FileUtils.insertOneNativeFile(info.path)
			}
		}

		//这里动态生成_modelZipInfo
		if (!FileUtils.checkIsUseZip()) {
			//如果json是native的 需要删除本地的版本控制
			if (SubPackageManager.checkSubModelIsNative(SubPackageConst.packName_json)) {
				var subCfgs = SubPackageManager.getSubData(SubPackageConst.packName_json);
				FileUtils.insertOneNativeFile(subCfgs.path)
				//需要把这个配置对应的目录设置为本地路径
				if (subCfgs) {
					FileUtils.insertOneNativeFile(subCfgs.path)
				}
			}
			if (SubPackageManager.checkSubModelIsNative(SubPackageConst.packName_mergefiles)) {
				var subCfgs = SubPackageManager.getSubData(SubPackageConst.packName_mergefiles);
				if (subCfgs) {
					FileUtils.insertOneNativeFile(subCfgs.path)
				}
			}

			return;
		}
		var model;
		var cfgModelName = VersionManager.ZIP_MODEL_KEY_CONFIG
		//初始化
		this.initOneZipModel(VersionManager.ZIP_MODEL_KEY_CONFIG, "", [VersionManager.ZIP_MODEL_KEY_CONFIG + "/globalCfgs.json"]);
		var fileList = [
			VersionManager.ZIP_MODEL_KEY_MERGEFILES + "/mergeJson.bin",
			VersionManager.ZIP_MODEL_KEY_MERGEFILES + "/mergeBin.bin"
		]
		this.initOneZipModel(VersionManager.ZIP_MODEL_KEY_MERGEFILES, "", fileList);
		//是否清除缓存的zip文件
		this.checkClearCacheZip();

		//如果有本地的文件 需要把本地本地文件映射的key删掉


	}

	//删除对应的分包版本管理文件
	public deleteOneSubPackVer(path: string) {
		var len = path.length;
		var obj = this.versionJsonObj;
		if (!obj) {
			return;
		}
		var temparr = []
		for (var i in obj) {
			//如果包含这个key 那么销毁掉这个key对应的版本文件
			if (i.slice(0, len) == path) {
				temparr.push(i);
			}
		}
		//这里把要删的key放到临时数组
		for (var ii = 0; ii < temparr.length; ii++) {
			delete obj[temparr[ii]];
		}

	}

	//判断是否清除缓存zip
	private checkClearCacheZip() {
		var str = CacheManager.instance.getGlobalCache(StorageCode.storage_zip_file);
		var cacheObj;
		if (!str || str == "0") {
			cacheObj = {}
		} else {
			cacheObj = JSON.parse(str);
		}
		var newCacheObj = {};
		var hasVersionChange: boolean = false
		var thisObj = this;
		for (var model in this._modelZipInfo) {
			var cacheZipName = cacheObj[model];
			var modelInfo = this.getZipModel(model)
			var currenyZipName = modelInfo.zipName;
			newCacheObj[model] = currenyZipName
			if (!cacheZipName) {
				hasVersionChange = true;
			}
			//如果版本号不一致 那么就删除对应的zip目录
			if (cacheZipName && cacheZipName != currenyZipName) {
				hasVersionChange = true;
				var targetZipFolder = FileUtils.getLocalZipCacheFullPath() + cacheZipName + "/"
				this.tryDeleteTargetFile(targetZipFolder);
			}
		}
		//如果有版本变化 那么就需要本地存储zip的信息
		if (hasVersionChange) {
			str = JSON.stringify(newCacheObj);
			CacheManager.instance.setGlobalCache(StorageCode.storage_zip_file, str);
		} else {
			LogsManager.echo("_zip文件没有发生变化不需要清理")
		}

	}

	//尝试删除目标文件
	private tryDeleteTargetFile(targetZipFolder, index = 0) {

	}


	//获取一个model zip 的解压后路径
	public getUnZipFilePath(model: string) {
		var modelInfo = this.getZipModel(model);
		return FileUtils.getLocalZipCacheFullPath() + modelInfo.zipPath + modelInfo.unZipFolderName
	}

	//初始化一个zipmodel相关
	public initOneZipModel(model, path, fileList) {
		var info = this._modelZipInfo[model]
		if (!info) {
			this._modelZipInfo[model] = {}
			info = this._modelZipInfo[model]
		}
		info.model = model;
		var fullPath = path + model + ".zip"
		info.zipFile = this.versionJsonObj[fullPath] || fullPath;
		info.zipPath = path;
		info.zipName = FileUtils.getFileNameByUrl(info.zipFile);
		info.unZipFolderName = FileUtils.getFileNameByUrl(info.zipFile);
		if (fileList) {
			info.fileList = fileList
		}

	}

	//获取model数据
	private getZipModel(model) {
		if (!this._modelZipInfo[model]) {
			this._modelZipInfo[model] = {
				fileList: []
			};
		}
		return this._modelZipInfo[model];
	}


	//版本对比检查
	public versionFileCheck() {


	}

	/**
	 * 判断是否需要强更
	 */
	public static checkIsForceUpdate() {
		if (UserInfo.isWX()) {
			var switchState = GameSwitch.getSwitchState(GameSwitch.SWITCH_FORCE_UPDATE);
			if (!switchState || switchState == "0") {
				if (UserInfo.isOnIosDevice()) {
					LogsManager.echo("ForceUpdate 0 wxios设备关闭了强更")
					return false;
				}
				//如果ios和android设备都关闭强更
			} else if (switchState == "2") {
				LogsManager.echo("ForceUpdate 2 wxios和android设备关闭了强更")
				return false;
			} else if (switchState == "1") {
				if (UserInfo.isOnAndroidDevice()) {
					LogsManager.echo("ForceUpdate 1 wxandroid设备关闭了强更")
					return false;
				}
			}

		}
		LogsManager.echo("ForceUpdate 3  走正常更新流程")
		return VersionManager.versionStatus == VersionManager.VERSION_STATUS_FORCE_UPDATE;
	}

	/**
	 * 获取3dmodel 对应的zip文件 ,targetModelPath 是对应的ls 或者lh文件.
	 * 因为3dmodel 对应缓存的key 是动态的. 其他的3种类型是写死的所以封装2个接口去获取对应的zip文件
	 */
	public get3dModelZipFileName(model: string) {
		return this._modelZipInfo[model].zipFile
	}

	/*获取一个3dmodel对应的zip缓存model
	* 传入格式 3dmodels/LayaScene_eff_upStar/Conventional/eff_upStar.lh
	*/
	public get3dZipModelName(targetModelPath: string) {
		var keyArr = targetModelPath.split("/");
		return keyArr[1];
	}


	/**
	 * 传入modelName 获取对应的zip路径
	 */
	public getModelZipFileName(modelName: string) {
		return this._modelZipInfo[modelName].zipFile;
	}


	/*校验一个model的完成性
		stopByNoFile 是否当检测到不存在的问题时停止,
	*/
	public checkModelFilesIsRight(modelName: string, stopByNoFile: boolean = false) {


	}


	//删除一个model映射, 当对应的zip加压或者创建失败时,需要删除这个model数据.然后走正常的版本管理
	public deleteOneModel(model: string) {
		delete this._modelZipInfo[model];
	}

	//把zip里面的文件路径转化成 本地的绝对路径
	public turnFilePathByModel(filePath: string, modelName: string) {
		var modelInfo = this._modelZipInfo[modelName];
		var zipFilePath = modelInfo.zipFile;
		//如果 不包含modelname, 比如 version.json, 那么给filePath 再包一层 unZipFolderName 解压后的路径
		if (filePath.indexOf(modelName) == -1) {
			filePath = modelInfo.unZipFolderName + "/" + modelName + "/" + filePath;
		} else {
			filePath = filePath.replace(modelName, modelInfo.unZipFolderName + "/" + modelName);
		}
		return FileUtils.getLocalZipCacheFullPath() + filePath;
	}

	/*
	* 获取真实的url路径 .
	* 这里做成静态函数. 原因是 这个函数会直接覆盖底层获取映射文件接口函数
	*/

	public static getVirtualUrl(path: string) {
		return path;
	}


}
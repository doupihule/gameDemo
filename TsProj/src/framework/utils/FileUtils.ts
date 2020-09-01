import LogsManager from "../manager/LogsManager";
import UserInfo from "../common/UserInfo";
import GameSwitch from "../common/GameSwitch";
import LogsErrorCode from "../consts/LogsErrorCode";

export default class FileUtils {
	public constructor() {
	}

	static localFileMap: any = {
		'http[s]*://.*/resource/assets': 'cache_crc32/assets',
	}
	//本地zip文件存储路径
	static localZipPath: string = "zipCache";
	static tryUnZipTimes: number = 2;

	//是否是使用zip压缩文件. 
	static isUseZipFiles: boolean = true;

	//记录已经存在的文件路径 防止重复判断
	static fs_cache: any = {}

	//是否需要缓存
	static needCache(url) {
		return null;
	}

	//是否是远端路径
	static isRemotePath(p) {
		return null;

		// return p.indexOf("http://") == 0 || p.indexOf("https://") == 0;
	}

	//把完整的远程url路径转化成本地的全路径 主要是针对微信或者头条
	static turnFileUrlToLocalFulllPath(p) {
		return null;
	}


	//获取本地路径
	static getLocalFilePath(p) {
		return null;

	}

	//获取本地绝对路径
	static getLocalFullPath(p) {
		return null;
	}

	//


	private static normailze(p) {
		return null;

		// var arr = p.split("/");
		// var original = p.split("/");
		// for (var a of arr) {
		// 	if (a == '' || a == null) {
		// 		var index = original.indexOf(a);
		// 		original.splice(index, 1);
		// 	}
		// }
		// if (original.length > 0) {
		// 	return original.join('/');
		// }
	}

	//获取远端的文件路径
	static getRemoteResUrl() {
		return null;

		// if (UserInfo.isWX()()) {
		// 	return GlobalData.resource_url + "/wxgame/"
		// } else if (UserInfo.isTT()()) {
		// 	return GlobalData.resource_url + "/tt/"
		// } else if (UserInfo.isQQGame()()) {
		// 	return "GameRes://"
		// }
		// return ""
	}

	//获取本地缓存文件路径
	static getCacheFilePath() {
		return null;
		// if (UserInfo.isWX()()) {
		// 	return `${wx.env.USER_DATA_PATH}/${VersionController.cacheCrcPath}/`;
		// } else if (UserInfo.isQQGame()()) {
		// 	return "GameRes://"
		// } else {
		// 	return "/resource/";
		// }
	}

	//把一个相对于assets/的路径转化为全局路径
	static getFullFilePath(shortPath: string) {
		return null;
		// var cacheFilePath: string = this.getCacheFilePath();
		// return cacheFilePath + "assets/" + VersionController.getVirtualUrl(shortPath);
	}


	//获取真实的版本控制文件
	static turnVirtualUrl(targetUrl: string) {
		return null;
		// if (!VersionController.instance) {
		// 	return targetUrl;
		// }
		// return VersionController.getVirtualUrl(targetUrl);
	}


	//判断本地文件是否存在 ,相对于USER_DATA_PATH 这个路径 或者绝对路径
	static existsLocalFile(path) {
		return false;
	}

	//这个是针对微信或者头条的判断是否有缓存,其他平台不给缓存
	static checkFileHasCache(url) {
		return null;
	}


	//保存缓存数据 传递为空 表示为 默认的 wx["env"].USER_DATA_PATH; 传入的path必须 带/结尾.
	static saveFileData(fileName: string, path: string = "", content: any, encoding: string = "utf8") {


	}


	//创建目标路径
	static makeTargetFilePath(fullPath: string) {
		var dirName = this.getFilePathByUrl(fullPath);
		this.mkdirsSync(dirName);
	}


	/**
	 * 创建文件夹 返回是否创建成功
	 */
	static mkdirsSync(p: string) {

	}

	//格式化路径
	static normailzePath(p) {
		var arr = p.split("/");
		var original = p.split("/");
		for (var a of arr) {
			if (a == '' || a == null) {
				var index = original.indexOf(a);
				original.splice(index, 1);
			}
		}
		if (original.length > 0) {
			return original.join('/');
		}
	}


	//根据本地的绝对路径删除
	static deleteFileByLocalFullPath(url) {
	}


	//获取缓存文件数据 filePath: 可以传绝对路径或者相wx["env"].USER_DATA_PATH路径
	static getLocalFileData(filePath, encoding: string = "utf8") {

		return null
	}

	/**判断是否为wx源码，逻辑相同 */
	static isUserWXSource() {
		return UserInfo.isWX() || UserInfo.isQQGame() || UserInfo.isTT() || UserInfo.isOppo() || UserInfo.isBaidu() || UserInfo.isVivo();
	}

	/*获取本地缓存的根路径带斜杠*/
	static getLocalCacheRootPath() {
		return this.getEnvCacheRoot() + "/";
	}

	//获取本地缓存路径不带斜杠
	static getEnvCacheRoot() {
		return ""
	}


	/*获取本地zip缓存路径 所有获取文件夹路径的地方 结尾统一带\/ */
	static getLocalZipCacheFullPath() {
		if (this.isUserWXSource()) {
			return this.getLocalCacheRootPath() + this.localZipPath + "/";
		}
		return '';
	}

	/**解压zip
	 *
	 * @zipName 本地绝对路径 比如  wxlocal://user/ json/globalCfgs.zip
	 * @tryTimes 尝试重新解压次数. 外部调用时 禁止传这个参数. 底层解压失败会尝试
	 */
	static unZipFile(zipName: string, zipurl: string, sucessCallBack: any, errorBack: any, tryTimes: number = 0) {

	}

	/**获取一个文件所在的路径 */
	static getFilePathByUrl(fileUrl: string, isJoin = true) {
		if (fileUrl.slice(fileUrl.length - 1, fileUrl.length) == "/") {
			LogsManager.echo("_传入的已经是文件夹了", fileUrl)
			if (isJoin) {
				return fileUrl;
			}
			return fileUrl.slice(0, fileUrl.length - 1);
		}
		var arr = fileUrl.split("/");
		arr.splice(arr.length - 1, 1);
		if (arr.length == 0) {
			return "";
		}
		var rt = arr.join("/");
		rt += "/"
		return rt
	}

	/**获取一个文件不带后缀的名字 */
	static getFileNameByUrl(fileUrl: string) {
		var arr = fileUrl.split("/");
		var fileName = arr[arr.length - 1];
		return fileName.split(".")[0];
	}

	/**判断是否使用zip压缩文件 */
	static checkIsUseZip() {
		if (UserInfo.isWeb()) {
			return false;
		}
		return !GameSwitch.checkOnOff(GameSwitch.SWITCH_DISABLE_ZIP);
	}

	private static hasInitCacheRoot: boolean = false;

	/**初始化判断cachefile是否存在 */
	static initRootCachePath() {
	}


	//插入一个本地文件
	static insertOneNativeFile(path: string) {
	}

	/**解析二进制文件 */
	public static decodeBinAssets(byte) {

	}


}

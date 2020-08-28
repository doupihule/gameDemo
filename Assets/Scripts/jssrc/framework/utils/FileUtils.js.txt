"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogsManager_1 = require("../manager/LogsManager");
const UserInfo_1 = require("../common/UserInfo");
const GameSwitch_1 = require("../common/GameSwitch");
const LogsErrorCode_1 = require("../consts/LogsErrorCode");
class FileUtils {
    constructor() {
    }
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
    static normailze(p) {
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
        // 	return Global.resource_url + "/wxgame/"
        // } else if (UserInfo.isTT()()) {
        // 	return Global.resource_url + "/tt/"
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
    static getFullFilePath(shortPath) {
        return null;
        // var cacheFilePath: string = this.getCacheFilePath();
        // return cacheFilePath + "assets/" + VersionController.getVirtualUrl(shortPath);
    }
    //获取真实的版本控制文件
    static turnVirtualUrl(targetUrl) {
        return null;
        // if (!VersionController.instance) {
        // 	return targetUrl;
        // }
        // return VersionController.getVirtualUrl(targetUrl);
    }
    //判断本地文件是否存在 ,相对于USER_DATA_PATH 这个路径 或者绝对路径
    static existsLocalFile(path) {
        //如果是web版 直接返回true
        if (!this.isUserWXSource()) {
            return false;
        }
        var cache = this.fs_cache[path];
        if (cache == 0) {
            return false;
        }
        else if (cache == 1) {
            return true;
        }
        var cachePath = this.getLocalCacheRootPath();
        if (path.indexOf(cachePath) == -1) {
            path = cachePath + path;
        }
        var fs = wx.getFileSystemManager();
        var hasPath = false;
        try {
            fs.accessSync(path);
            hasPath = true;
            this.fs_cache[path] = 1;
        }
        catch (e) {
            this.fs_cache[path] = 0;
        }
        return hasPath;
        // //微信或者头条才有
        // if (UserInfo.isWX()() || UserInfo.isTT()()) {
        // 	var result = wxFileUtils.fs.existsSync(localPath);
        // 	return result
        // }
        // //其他平台直接返回true
        // return true
    }
    //这个是针对微信或者头条的判断是否有缓存,其他平台不给缓存
    static checkFileHasCache(url) {
        return null;
        // var localPath = this.getLocalFilePath(url);
        // return this.existsLocalFile(localPath);
    }
    //保存缓存数据 传递为空 表示为 默认的 wx["env"].USER_DATA_PATH; 传入的path必须 带/结尾.
    static saveFileData(fileName, path = "", content, encoding = "utf8") {
        var fs = wx.getFileSystemManager();
        var cachePath = this.getLocalCacheRootPath();
        if (path.indexOf(cachePath) == -1) {
            path = cachePath + path;
        }
        var hasPath = false;
        //先判断文件路径是否存在
        // if(!this.existsLocalFile(path)){
        // 	try {
        // 		fs.mkdirSync(path);
        // 	} catch(e){
        // 		LogsManager.error("_创建缓存文件夹失败",e.toString(),path);
        // 		return;
        // 	}
        // }
        var makeResult = this.mkdirsSync(path);
        if (!makeResult) {
            LogsManager_1.default.errorTag(LogsErrorCode_1.default.FILE_ERROR, "_saveFileData error");
        }
        var fullPath = path + fileName;
        LogsManager_1.default.echo("_saveFileData,fullPath:", fullPath, content);
        fs.writeFile({
            filePath: fullPath, encoding: 'utf8', data: content,
            success: function (data) {
            }, fail: function (errormsg) {
                LogsManager_1.default.echo("saveFileError:", fullPath, errormsg);
            }
        });
    }
    //创建目标路径
    static makeTargetFilePath(fullPath) {
        var dirName = this.getFilePathByUrl(fullPath);
        this.mkdirsSync(dirName);
    }
    /**
     * 创建文件夹 返回是否创建成功
     */
    static mkdirsSync(p) {
        LogsManager_1.default.echo("mkdirsSync-----", p);
        // console.log(`mkdir: ${p}`)
        var path = p;
        var fs = wx.getFileSystemManager();
        var rootPath = this.getLocalCacheRootPath();
        var index = p.indexOf(rootPath);
        if (index != -1) {
            p = p.slice(rootPath.length, p.length);
        }
        if (!GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_MAKEDIR)) {
            if (!this.existsLocalFile(path)) {
                try {
                    LogsManager_1.default.echo("使用非递归方式创建文件夹", path);
                    fs.mkdirSync(path);
                    this.fs_cache[path] = 1;
                    LogsManager_1.default.echo("使用非递归方式创建文件夹成功", path);
                    return true;
                }
                catch (e) {
                    LogsManager_1.default.errorTag(LogsErrorCode_1.default.FILE_ERROR, "xd 创建文件夹失败:", path, e.toString());
                    return false;
                }
            }
        }
        else {
            if (!this.existsLocalFile(p)) {
                var dirs = p.split('/');
                var current = "";
                try {
                    LogsManager_1.default.echo("使用递归方式创建文件夹", p);
                    for (var i = 0; i < dirs.length; i++) {
                        const dir = dirs[i];
                        current += dir + "/";
                        if (!this.existsLocalFile(current)) {
                            var temp = this.normailzePath(current);
                            this.fs_cache[temp] = 1;
                            fs.mkdirSync(rootPath + current);
                        }
                    }
                    LogsManager_1.default.echo("使用递归方式创建文件夹成功", p);
                    return true;
                }
                catch (e) {
                    LogsManager_1.default.errorTag(LogsErrorCode_1.default.FILE_ERROR, "xd 创建文件夹失败:", p, e.toString());
                    return false;
                }
            }
        }
        return true;
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
        //必须是微信或者头条 才做版本管理
        if (!this.isUserWXSource()) {
            return;
        }
        const fs = wx.getFileSystemManager();
        var hasPath = false;
        try {
            //如果文件路径不存在，这个接口会抛一个错误。
            fs.accessSync(url);
            hasPath = true;
        }
        catch (e) {
            LogsManager_1.default.echo(">>>>没有此文件>>>>", url);
        }
        if (hasPath) {
            fs.unlinkSync(url);
            LogsManager_1.default.echo("xd_删除文件成功", url);
        }
    }
    //获取缓存文件数据 filePath: 可以传绝对路径或者相wx["env"].USER_DATA_PATH路径
    static getLocalFileData(filePath, encoding = "utf8") {
        var fs = wx.getFileSystemManager();
        var cachePath = this.getLocalCacheRootPath();
        if (filePath.indexOf(cachePath) == -1) {
            filePath = cachePath + filePath;
        }
        if (this.existsLocalFile(filePath)) {
            try {
                var resultStr = fs.readFileSync(filePath, encoding);
                if (!resultStr) {
                    //这里尝试在读取一次
                    LogsManager_1.default.echo("__尝试重新读取一次缓存");
                    resultStr = fs.readFileSync(filePath, encoding);
                    //如果又读取到了
                    if (resultStr) {
                        LogsManager_1.default.errorTag(LogsErrorCode_1.default.FILE_ERROR, "第二次重复读取文件成功", resultStr);
                    }
                }
                return resultStr;
            }
            catch (e) {
                LogsManager_1.default.errorTag(LogsErrorCode_1.default.FILE_ERROR, "getLocalFileData error,path:", filePath, e.toString());
            }
            return null;
        }
        LogsManager_1.default.echo("xd not existsLocalFile:", filePath);
        return null;
    }
    /**判断是否为wx源码，逻辑相同 */
    static isUserWXSource() {
        return UserInfo_1.default.isWX() || UserInfo_1.default.isQQGame() || UserInfo_1.default.isTT() || UserInfo_1.default.isOppo() || UserInfo_1.default.isBaidu() || UserInfo_1.default.isVivo();
    }
    /*获取本地缓存的根路径带斜杠*/
    static getLocalCacheRootPath() {
        return this.getEnvCacheRoot() + "/";
    }
    //获取本地缓存路径不带斜杠
    static getEnvCacheRoot() {
        return wx["env"].USER_DATA_PATH;
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
    static unZipFile(zipName, zipurl, sucessCallBack, errorBack, tryTimes = 0) {
        var fileManager = wx.getFileSystemManager();
        var saveFilePath = this.getFilePathByUrl(zipName);
        var t1 = Laya.Browser.now();
        LogsManager_1.default.echo("xd _start unZipFile:", zipName);
        var unzipFail = (e) => {
            var str;
            try {
                str = JSON.stringify(e);
            }
            catch (eee) {
                str = e.toString();
            }
            LogsManager_1.default.errorTag(LogsErrorCode_1.default.FILE_ERROR, "zipName,", zipName, "解压失败", str);
            tryTimes += 1;
            //这里最多尝试解压2次
            if (tryTimes <= FileUtils.tryUnZipTimes) {
                FileUtils.unZipFile(zipName, zipurl, sucessCallBack, errorBack, tryTimes);
            }
            else {
                //失败回调里面就去自己判断 加载原始文件, 做兼容
                if (errorBack) {
                    errorBack.run();
                }
            }
        };
        //解压成功回调
        var unZipSucess = () => {
            LogsManager_1.default.echo("xd unzipFile,name:", zipName, "  CostTime:", Laya.Browser.now() - t1);
            //删除对应的zip资源
            FileUtils.deleteFileByLocalFullPath(zipName);
            // 在执行成功回调
            if (sucessCallBack) {
                sucessCallBack.run();
            }
        };
        fileManager.unzip({
            zipFilePath: zipName,
            targetPath: zipurl,
            success: unZipSucess,
            fail: unzipFail
        });
    }
    /**获取一个文件所在的路径 */
    static getFilePathByUrl(fileUrl, isJoin = true) {
        if (fileUrl.slice(fileUrl.length - 1, fileUrl.length) == "/") {
            LogsManager_1.default.echo("_传入的已经是文件夹了", fileUrl);
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
        rt += "/";
        return rt;
    }
    /**获取一个文件不带后缀的名字 */
    static getFileNameByUrl(fileUrl) {
        var arr = fileUrl.split("/");
        var fileName = arr[arr.length - 1];
        return fileName.split(".")[0];
    }
    /**判断是否使用zip压缩文件 */
    static checkIsUseZip() {
        if (UserInfo_1.default.isWeb()) {
            return false;
        }
        return !GameSwitch_1.default.checkOnOff(GameSwitch_1.default.SWITCH_DISABLE_ZIP);
    }
    /**初始化判断cachefile是否存在 */
    static initRootCachePath() {
        if (this.hasInitCacheRoot) {
            return;
        }
        if (!this.isUserWXSource()) {
            return;
        }
        this.hasInitCacheRoot = true;
        var rootPath = this.getLocalCacheRootPath();
        if (!this.existsLocalFile(rootPath)) {
            LogsManager_1.default.warn("xd 本地没有缓存路径-");
            var fs = wx.getFileSystemManager();
            try {
                fs.mkdirSync(rootPath);
            }
            catch (e) {
                LogsManager_1.default.errorTag(LogsErrorCode_1.default.FILE_ERROR, "xd 缓存路径创建失败:", e.toString(), rootPath);
            }
        }
    }
    //插入一个本地文件
    static insertOneNativeFile(path) {
        if (Laya.MiniAdpter) {
            var nativefiles = Laya.MiniAdpter.nativefiles;
            if (nativefiles.indexOf(path) == -1) {
                nativefiles.push(path);
            }
            //删除对应版本管理器
            // VersionManager.instance.deleteOneSubPackVer(path);
        }
    }
    /**解析二进制文件 */
    static decodeBinAssets(byte) {
        const FILE_TYPE_BIN = 1;
        const FILE_TYPE_JSON = 2;
        const FILE_TYPE_TEXT = 3;
        //LogsManager.echo("TensorFlowUtils  ``````   byte.length: ", byte.length,"byte: ", byte);
        var fileMap = {};
        byte.endian = Laya.Byte.LITTLE_ENDIAN;
        var fileNum = byte.readUint32();
        for (var i = 0; i < fileNum; i++) {
            var fileNameLen = 0;
            var fileName = "";
            var type = byte.readUint8();
            fileNameLen = byte.readUint8();
            fileName = byte.readUTFBytes(fileNameLen);
            var fileContentLen = byte.readUint32();
            var fileContent = "";
            if (type == FILE_TYPE_BIN) {
                fileContent = byte.readArrayBuffer(fileContentLen);
            }
            else if (type == FILE_TYPE_JSON) {
                fileContent = JSON.parse(byte.readUTFBytes(fileContentLen));
            }
            else {
                fileContent = byte.readUTFBytes(fileContentLen);
            }
            if (fileMap[type]) {
                fileMap[type][fileName] = fileContent;
            }
            else {
                fileMap[type] = {
                    fileName: fileContent
                };
            }
            Laya.Loader.preLoadedMap[Laya.URL.formatURL(fileName)] = fileContent;
            Laya.Loader.preLoadedMap[fileName] = fileContent;
        }
        return fileMap;
    }
}
exports.default = FileUtils;
FileUtils.localFileMap = {
    'http[s]*://.*/resource/assets': 'cache_crc32/assets',
};
//本地zip文件存储路径
FileUtils.localZipPath = "zipCache";
FileUtils.tryUnZipTimes = 2;
//是否是使用zip压缩文件. 
FileUtils.isUseZipFiles = true;
//记录已经存在的文件路径 防止重复判断
FileUtils.fs_cache = {};
FileUtils.hasInitCacheRoot = false;
//# sourceMappingURL=FileUtils.js.map
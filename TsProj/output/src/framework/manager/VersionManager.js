"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserInfo_1 = require("../common/UserInfo");
const LogsManager_1 = require("./LogsManager");
const Global_1 = require("../../utils/Global");
const CacheManager_1 = require("./CacheManager");
const StorageCode_1 = require("../../game/sys/consts/StorageCode");
const FileUtils_1 = require("../utils/FileUtils");
const TimerManager_1 = require("./TimerManager");
const LogsErrorCode_1 = require("../consts/LogsErrorCode");
const SubPackageManager_1 = require("./SubPackageManager");
const SubPackageConst_1 = require("../../game/sys/consts/SubPackageConst");
const GameSwitch_1 = require("../common/GameSwitch");
class VersionManager {
    constructor() {
        //对应版本的名称
        this.versionName = "version.json";
        // 目标文件路径->到本地unzip文件路径
        /**
         * 3dmodels/LayaScene_eff_dailyTask/Conventional/eff_dailyTask.lh: wxlocal://usr/unzipcache/....lh
         */
        this.cacheUnZipFilePathMap = {};
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
        this._modelZipInfo = {};
        //忽略检查的数组 带上路径,不能带crc32以及后缀.  比如 common/loading_bg23861234.png, 
        this.ingoreCheckGroup = [];
        this._cacheVersion = CacheManager_1.default.instance.getGlobalCache(StorageCode_1.default.storage_vmsversion) || "";
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new VersionManager();
        }
        return this._instance;
    }
    //初始化版本文件
    initVersionData() {
        // if(GameSwitch.checkOnOff(GameSwitch.SWITCH_LOCAL_RES)){
        //     return;
        // }
        this.versionJsonObj = Laya.Loader.getRes(this.versionName);
        var subPackData = SubPackageConst_1.default.subPackData;
        for (var i in subPackData) {
            var info = subPackData[i];
            //配表和 合并文件 走单独的判断. 因为还涉及到zip压缩功能
            if (i != SubPackageConst_1.default.packName_json && i != SubPackageConst_1.default.packName_mergefiles) {
                FileUtils_1.default.insertOneNativeFile(info.path);
            }
        }
        //这里动态生成_modelZipInfo
        if (!FileUtils_1.default.checkIsUseZip()) {
            //如果json是native的 需要删除本地的版本控制
            if (SubPackageManager_1.default.checkSubModelIsNative(SubPackageConst_1.default.packName_json)) {
                var subCfgs = SubPackageManager_1.default.getSubData(SubPackageConst_1.default.packName_json);
                FileUtils_1.default.insertOneNativeFile(subCfgs.path);
                //需要把这个配置对应的目录设置为本地路径
                if (subCfgs) {
                    FileUtils_1.default.insertOneNativeFile(subCfgs.path);
                }
            }
            if (SubPackageManager_1.default.checkSubModelIsNative(SubPackageConst_1.default.packName_mergefiles)) {
                var subCfgs = SubPackageManager_1.default.getSubData(SubPackageConst_1.default.packName_mergefiles);
                if (subCfgs) {
                    FileUtils_1.default.insertOneNativeFile(subCfgs.path);
                }
            }
            return;
        }
        var t1 = Laya.Browser.now();
        var model;
        LogsManager_1.default.echo("initVersionCost:", Laya.Browser.now() - t1);
        var cfgModelName = VersionManager.ZIP_MODEL_KEY_CONFIG;
        //初始化
        this.initOneZipModel(VersionManager.ZIP_MODEL_KEY_CONFIG, "", [VersionManager.ZIP_MODEL_KEY_CONFIG + "/globalCfgs.json"]);
        var fileList = [
            VersionManager.ZIP_MODEL_KEY_MERGEFILES + "/mergeJson.bin",
            VersionManager.ZIP_MODEL_KEY_MERGEFILES + "/mergeBin.bin"
        ];
        this.initOneZipModel(VersionManager.ZIP_MODEL_KEY_MERGEFILES, "", fileList);
        //是否清除缓存的zip文件
        this.checkClearCacheZip();
        //如果有本地的文件 需要把本地本地文件映射的key删掉  
    }
    //删除对应的分包版本管理文件
    deleteOneSubPackVer(path) {
        var len = path.length;
        var obj = this.versionJsonObj;
        if (!obj) {
            return;
        }
        var temparr = [];
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
    checkClearCacheZip() {
        var str = CacheManager_1.default.instance.getGlobalCache(StorageCode_1.default.storage_zip_file);
        var cacheObj;
        if (!str || str == "0") {
            cacheObj = {};
        }
        else {
            cacheObj = JSON.parse(str);
        }
        var newCacheObj = {};
        var hasVersionChange = false;
        var thisObj = this;
        for (var model in this._modelZipInfo) {
            var cacheZipName = cacheObj[model];
            var modelInfo = this.getZipModel(model);
            var currenyZipName = modelInfo.zipName;
            newCacheObj[model] = currenyZipName;
            if (!cacheZipName) {
                hasVersionChange = true;
            }
            //如果版本号不一致 那么就删除对应的zip目录
            if (cacheZipName && cacheZipName != currenyZipName) {
                hasVersionChange = true;
                var targetZipFolder = FileUtils_1.default.getLocalZipCacheFullPath() + cacheZipName + "/";
                this.tryDeleteTargetFile(targetZipFolder);
            }
        }
        //如果有版本变化 那么就需要本地存储zip的信息
        if (hasVersionChange) {
            str = JSON.stringify(newCacheObj);
            CacheManager_1.default.instance.setGlobalCache(StorageCode_1.default.storage_zip_file, str);
        }
        else {
            LogsManager_1.default.echo("_zip文件没有发生变化不需要清理");
        }
    }
    //尝试删除目标文件
    tryDeleteTargetFile(targetZipFolder, index = 0) {
        var thisObj = this;
        //删除对应的zip文件夹
        if (FileUtils_1.default.existsLocalFile(targetZipFolder)) {
            try {
                wx.getFileSystemManager().rmdir({
                    dirPath: targetZipFolder,
                    success: () => {
                        LogsManager_1.default.echo("删除zip文件夹成功:", targetZipFolder);
                    },
                    fail: (ee) => {
                        //尝试再次删除
                        var errorStr;
                        try {
                            errorStr = JSON.stringify(ee);
                        }
                        catch (e) {
                            errorStr = ee.toString();
                        }
                        LogsManager_1.default.errorTag(LogsErrorCode_1.default.FILE_ERROR, "_删除目录失败,", targetZipFolder, errorStr, "次数:", index);
                        if (index == 0) {
                            LogsManager_1.default.echo("_再次尝试删除目标文件");
                            TimerManager_1.default.instance.add(thisObj.tryDeleteTargetFile, thisObj, 20, 1, false, [targetZipFolder, 1]);
                        }
                    },
                    recursive: true
                }, true);
            }
            catch (e) {
                LogsManager_1.default.errorTag(LogsErrorCode_1.default.FILE_ERROR, "_尝试移除文件夹失败", e.toString());
            }
        }
    }
    //获取一个model zip 的解压后路径
    getUnZipFilePath(model) {
        var modelInfo = this.getZipModel(model);
        return FileUtils_1.default.getLocalZipCacheFullPath() + modelInfo.zipPath + modelInfo.unZipFolderName;
    }
    //初始化一个zipmodel相关
    initOneZipModel(model, path, fileList) {
        var info = this._modelZipInfo[model];
        if (!info) {
            this._modelZipInfo[model] = {};
            info = this._modelZipInfo[model];
        }
        info.model = model;
        var fullPath = path + model + ".zip";
        info.zipFile = this.versionJsonObj[fullPath] || fullPath;
        info.zipPath = path;
        info.zipName = FileUtils_1.default.getFileNameByUrl(info.zipFile);
        info.unZipFolderName = FileUtils_1.default.getFileNameByUrl(info.zipFile);
        if (fileList) {
            info.fileList = fileList;
        }
    }
    //获取model数据
    getZipModel(model) {
        if (!this._modelZipInfo[model]) {
            this._modelZipInfo[model] = {
                fileList: []
            };
        }
        return this._modelZipInfo[model];
    }
    //版本对比检查
    versionFileCheck() {
        //目前只有微信、头条、QQ做类似的版本检查
        if (!FileUtils_1.default.isUserWXSource()) {
            return;
        }
        //动态插入 version.json
        this.ingoreCheckGroup.push([
            "version_" + Global_1.default.version + ".json"
        ]);
        var jsonObj = Laya.Loader.getRes(this.versionName);
        var fileInfoObj = Laya.MiniFileMgr.filesListObj;
        //缓存文件大于25M时，会将文件大小和文件名上传
        var isSendMaxLog = false;
        var fileSize = fileInfoObj.fileUsedSize;
        if (fileSize > 25 * 1024 * 1024) {
            isSendMaxLog = true;
        }
        var basePath = Laya.URL.basePath;
        var newFileKeyMap = {};
        for (var i in jsonObj) {
            var newKey = basePath + jsonObj[i];
            newFileKeyMap[newKey] = true;
        }
        var onDeleBack = (fileName) => {
            LogsManager_1.default.echo("删除资源成功", fileName);
        };
        var fileNum = 0;
        var fileNameStr = "";
        //删除版本管理器里面不存在的资源
        var platformPath = "/" + UserInfo_1.default.platformId + "/";
        for (var ii in fileInfoObj) {
            //目前第一版只清理  cdn上面的资源
            if (!newFileKeyMap[ii]) {
                if (ii.indexOf(basePath) != -1 || ii.indexOf(platformPath) != -1 || ii.indexOf("172.16.1") != -1) {
                    var isIngoreKey = false;
                    //判断是否是忽略列表里面的文件
                    for (var iii = 0; iii < this.ingoreCheckGroup.length; iii++) {
                        var ingoreKey = this.ingoreCheckGroup[iii];
                        if (ii.indexOf(basePath + ingoreKey) != -1) {
                            isIngoreKey = true;
                        }
                    }
                    if (!isIngoreKey) {
                        var info = fileInfoObj[ii];
                        if (typeof info == "object") {
                            LogsManager_1.default.echo("删除旧版本资源:", ii);
                            Laya.MiniFileMgr.deleteFile("", info.readyUrl, new Laya.Handler(null, onDeleBack, [ii]), info.encoding, info.size);
                        }
                    }
                    else {
                        LogsManager_1.default.echo("忽略删除文件:", ii);
                    }
                }
            }
            fileNum++;
            if (isSendMaxLog) {
                fileNameStr += "," + FileUtils_1.default.getFileNameByUrl(ii);
            }
        }
        if (isSendMaxLog) {
            LogsManager_1.default.echo("allFileName:", fileNameStr);
            LogsManager_1.default.echo("Laya.MiniFileMgr.filesListObj.fileUsedSize:", fileSize, ">fileNum", fileNum);
            LogsManager_1.default.errorTag("LayaFileOverSize");
        }
    }
    /**
     * 判断是否需要强更
     */
    static checkIsForceUpdate() {
        if (UserInfo_1.default.isWX()) {
            var switchState = GameSwitch_1.default.getSwitchState(GameSwitch_1.default.SWITCH_FORCE_UPDATE);
            if (!switchState || switchState == "0") {
                if (UserInfo_1.default.isOnIosDevice()) {
                    LogsManager_1.default.echo("ForceUpdate 0 wxios设备关闭了强更");
                    return false;
                }
                //如果ios和android设备都关闭强更
            }
            else if (switchState == "2") {
                LogsManager_1.default.echo("ForceUpdate 2 wxios和android设备关闭了强更");
                return false;
            }
            else if (switchState == "1") {
                if (UserInfo_1.default.isOnAndroidDevice()) {
                    LogsManager_1.default.echo("ForceUpdate 1 wxandroid设备关闭了强更");
                    return false;
                }
            }
        }
        LogsManager_1.default.echo("ForceUpdate 3  走正常更新流程");
        return VersionManager.versionStatus == VersionManager.VERSION_STATUS_FORCE_UPDATE;
    }
    /**
     * 获取3dmodel 对应的zip文件 ,targetModelPath 是对应的ls 或者lh文件.
     * 因为3dmodel 对应缓存的key 是动态的. 其他的3种类型是写死的所以封装2个接口去获取对应的zip文件
     */
    get3dModelZipFileName(model) {
        return this._modelZipInfo[model].zipFile;
    }
    /*获取一个3dmodel对应的zip缓存model
    * 传入格式 3dmodels/LayaScene_eff_upStar/Conventional/eff_upStar.lh
    */
    get3dZipModelName(targetModelPath) {
        var keyArr = targetModelPath.split("/");
        return keyArr[1];
    }
    /**
     * 传入modelName 获取对应的zip路径
     */
    getModelZipFileName(modelName) {
        return this._modelZipInfo[modelName].zipFile;
    }
    /*校验一个model的完成性
        stopByNoFile 是否当检测到不存在的问题时停止,
    */
    checkModelFilesIsRight(modelName, stopByNoFile = false) {
        var modelInfo = this._modelZipInfo[modelName];
        if (!modelInfo) {
            return false;
        }
        var fileList = modelInfo.fileList;
        //需要判断是否每个文件都存在
        var isRight = true;
        var t1 = Laya.Browser.now();
        for (var i = 0; i < fileList.length; i++) {
            var sourceName = fileList[i];
            //这里防止重复判断文件是否存在会造成重复io
            var fileName = this.cacheUnZipFilePathMap[sourceName];
            if (!fileName) {
                fileName = this.turnFilePathByModel(sourceName, modelName);
                //如果不存在这个文件
                if (!FileUtils_1.default.existsLocalFile(fileName)) {
                    LogsManager_1.default.echo("xd 本地不存在这个文件,", sourceName);
                    if (!FileUtils_1.default.existsLocalFile(fileName)) {
                        //这里在尝试多处理一次
                        isRight = false;
                    }
                    else {
                        LogsManager_1.default.echo("xd 二次判断后本地文件有了,", sourceName);
                    }
                    if (stopByNoFile) {
                        return false;
                    }
                    // return false;
                }
                else {
                    //缓存这个文件的本地绝对路径
                    this.cacheUnZipFilePathMap[sourceName] = fileName;
                }
            }
        }
        LogsManager_1.default.echo("xd zip完整性校验,model:", modelName, "文件数量:", fileList.length, ",_耗时:", Laya.Browser.now() - t1);
        return isRight;
    }
    /**zip文件加压后 把文件名映射添加到缓存列表里面 */
    initUnZipFilePath(model) {
        var modelInfo = this.getZipModel(model);
        var fileList = modelInfo.fileList;
        //需要判断是否每个文件都存在
        var isRight = true;
        var t1 = Laya.Browser.now();
        for (var i = 0; i < fileList.length; i++) {
            var sourceName = fileList[i];
            if (!this.cacheUnZipFilePathMap[sourceName]) {
                var fileName = this.turnFilePathByModel(sourceName, model);
                this.cacheUnZipFilePathMap[sourceName] = fileName;
            }
        }
    }
    //删除一个model映射, 当对应的zip加压或者创建失败时,需要删除这个model数据.然后走正常的版本管理
    deleteOneModel(model) {
        delete this._modelZipInfo[model];
    }
    //把zip里面的文件路径转化成 本地的绝对路径
    turnFilePathByModel(filePath, modelName) {
        var modelInfo = this._modelZipInfo[modelName];
        var zipFilePath = modelInfo.zipFile;
        //如果 不包含modelname, 比如 version.json, 那么给filePath 再包一层 unZipFolderName 解压后的路径
        if (filePath.indexOf(modelName) == -1) {
            filePath = modelInfo.unZipFolderName + "/" + modelName + "/" + filePath;
        }
        else {
            filePath = filePath.replace(modelName, modelInfo.unZipFolderName + "/" + modelName);
        }
        return FileUtils_1.default.getLocalZipCacheFullPath() + filePath;
    }
    /*
    * 获取真实的url路径 .
    * 这里做成静态函数. 原因是 这个函数会直接覆盖底层获取映射文件接口函数
    */
    static getVirtualUrl(path) {
        //如果是走本地路径的  那么直接返回path
        // if(GameSwitch.checkOnOff(GameSwitch.SWITCH_LOCAL_RES)){
        //     return Laya.URL.getAdptedFilePath(path);
        // }
        //需要先把path做一下转化
        path = Laya.URL.getAdptedFilePath(path);
        var obj = VersionManager.instance.versionJsonObj;
        var cacheUnZipFilePathMap = VersionManager.instance.cacheUnZipFilePathMap;
        var cachePath = cacheUnZipFilePathMap[path];
        //如果是zip文件 那么直接读取unzip后的文件路径
        if (cachePath) {
            return cachePath;
        }
        if (obj) {
            var turnPath = obj[path];
            if (turnPath) {
                return turnPath;
            }
        }
        return path;
    }
}
exports.default = VersionManager;
VersionManager.VERSION_STATUS_NO_UPDATE = 0;
VersionManager.VERSION_STATUS_NEED_UPDATE = 1;
VersionManager.VERSION_STATUS_FORCE_UPDATE = 2;
VersionManager.VERSION_STATUS_SERVER_MAINTAIN = 3;
VersionManager.VERSION_STATUS_VERSION_ROLLBACK = 4;
VersionManager.VERSION_STATUS_VERSION_NOT_EXIST = 5;
VersionManager.VERSION_STATUS_VERSION_DEFAULT_ERROR = 999;
VersionManager.ZIP_3DMODEL_NAME = "3dmodels";
VersionManager.ZIP_MODEL_KEY_VERSION = "version";
VersionManager.ZIP_MODEL_KEY_CONFIG = "json";
VersionManager.ZIP_MODEL_KEY_UICFGS = "uiCfgs";
VersionManager.ZIP_MODEL_KEY_MERGEFILES = "mergefiles";
//# sourceMappingURL=VersionManager.js.map
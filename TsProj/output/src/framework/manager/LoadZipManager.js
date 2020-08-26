"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadZipManager = void 0;
const LogsManager_1 = require("./LogsManager");
const TimerManager_1 = require("./TimerManager");
const Message_1 = require("../common/Message");
const MsgCMD_1 = require("../../game/sys/common/MsgCMD");
const WindowCfgs_1 = require("../../game/sys/consts/WindowCfgs");
const TranslateFunc_1 = require("../func/TranslateFunc");
const WindowManager_1 = require("./WindowManager");
const FileUtils_1 = require("../utils/FileUtils");
const VersionManager_1 = require("./VersionManager");
const LogsErrorCode_1 = require("../consts/LogsErrorCode");
class LoadZipManager {
    constructor() {
        //重新加载的次数 
        this._reloadCount = 0;
        //最多重新加载的次数 ,超过之后 就等待.
        this._maxReloadcount = 1;
        //测试加载失败开关
        this._isTestError = false;
        this._timeCode = 0;
        this._timeCount = 0;
        this._startLoadTime = 0;
        this._loadCacheArr = [];
        this._hasCacheMap = {};
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new LoadZipManager();
        }
        return this._instance;
    }
    //加载一个模块对应的zip
    //加载一个zip
    loadZip(url, modelName, completeFunc, errorFunc, isInsert = false) {
        //如果这个模块已经是完整的了  不处理
        if (VersionManager_1.default.instance.checkModelFilesIsRight(modelName, true)) {
            LogsManager_1.default.echo("xd zip url ", url, " 本地已经有缓存了无需重复下载");
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
        };
        if (isInsert) {
            this._loadCacheArr.splice(0, 0, params);
        }
        else {
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
        var info = this._loadCacheArr[0];
        this._loadCacheArr.splice(0, 1);
        this.sureLoad(info);
    }
    sureLoad(info) {
        this.currentLoadinfo = info;
        if (info.isLoading) {
            Message_1.default.instance.send(MsgCMD_1.default.MODULE_SHOW, WindowCfgs_1.WindowCfgs.LoadingUI);
        }
        var t1 = Laya.Browser.now();
        LogsManager_1.default.echo("xd_开始zip:", info.name.slice(0, 100));
        //添加超时判断 暂定20秒超时
        this._timeCode = TimerManager_1.default.instance.add(this.timerHandler, this, 20000, 1);
        this._startLoadTime = Laya.Browser.now();
        //这里需要转成远端路径
        var virtualUrl = VersionManager_1.default.getVirtualUrl(info.url);
        var remoteUrl = Laya.URL.basePath + virtualUrl;
        var saveUrl = FileUtils_1.default.getLocalZipCacheFullPath() + virtualUrl;
        var dirName = FileUtils_1.default.getFilePathByUrl(saveUrl);
        FileUtils_1.default.mkdirsSync(dirName);
        var targetUnZipFolder = VersionManager_1.default.instance.getUnZipFilePath(info.model);
        this.loadZipFoldler(targetUnZipFolder);
        var thisObj = this;
        var onDownLoadSuccess = (r) => {
            if (r.statusCode == 200) {
                LogsManager_1.default.echo("xd donwLoadZip", info.url, "_costTime:", Laya.Browser.now() - t1);
                thisObj.currentLoadinfo = null;
                //这里延迟一帧解压
                // TimerManager.instance.add(FileUtils.unZipFile,FileUtils,10,1,false,[saveUrl,targetUnZipFolder,info.completeFunc,info.errorFunc])
                VersionManager_1.default.instance.initUnZipFilePath(info.model);
                FileUtils_1.default.unZipFile(saveUrl, targetUnZipFolder, info.completeFunc, info.errorFunc);
                thisObj.checkLoad();
            }
            else {
                //那么做加载失败处理
                LogsManager_1.default.echo("_加载失败,statusCode:", r.statusCode);
                thisObj.onLoadError();
            }
        };
        //下载失败 
        var onDownLoadError = (e) => {
            LogsManager_1.default.echo("xd wx.downLoadFileError", e.toString());
            thisObj.onLoadError();
        };
        wx.downloadFile({
            url: remoteUrl,
            success: onDownLoadSuccess,
            fail: onDownLoadError,
            filePath: saveUrl,
            complete: null
        });
    }
    //创建文件夹
    loadZipFoldler(targetUnZipFolder) {
        if (FileUtils_1.default.existsLocalFile(targetUnZipFolder)) {
            // LogsManager.errorTag(LogsErrorCode.FILE_ERROR, "zm当前创建的文件夹已存在", targetUnZipFolder);
            wx.getFileSystemManager().rmdir({
                dirPath: targetUnZipFolder,
                success: () => {
                    LogsManager_1.default.echo("zm删除文件夹成功:", targetUnZipFolder);
                    FileUtils_1.default.fs_cache[targetUnZipFolder] = 0;
                    FileUtils_1.default.mkdirsSync(targetUnZipFolder);
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
                    LogsManager_1.default.errorTag(LogsErrorCode_1.default.FILE_ERROR, "zm_删除目录失败", targetUnZipFolder, errorStr);
                },
                recursive: true
            }, true);
        }
        else {
            FileUtils_1.default.mkdirsSync(targetUnZipFolder);
        }
    }
    //加载失败 做重连
    onLoadError() {
        var errorMessage = TranslateFunc_1.default.instance.getTranslate("#error110");
        //弹窗重连
        WindowManager_1.default.setPopupTip(1, errorMessage, this.reloadGroup, this);
    }
    //超时了直接
    timerHandler() {
        LogsManager_1.default.echo("xd_loadres 超时");
    }
    //重新加载
    reloadGroup() {
        this.sureLoad(this.currentLoadinfo);
    }
    //判断是否有缓存
    checkHasCache(url) {
        var key = url;
        if (typeof key != "string") {
            key = JSON.stringify(url);
        }
        var result = this._hasCacheMap[key];
        return result;
    }
}
exports.LoadZipManager = LoadZipManager;
//# sourceMappingURL=LoadZipManager.js.map
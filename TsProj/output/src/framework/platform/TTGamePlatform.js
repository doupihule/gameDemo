"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WXGamePlatform_1 = require("./WXGamePlatform");
const LogsManager_1 = require("../manager/LogsManager");
const UserInfo_1 = require("../common/UserInfo");
const Message_1 = require("../common/Message");
const UserModel_1 = require("../../game/sys/model/UserModel");
const WindowManager_1 = require("../manager/WindowManager");
const TranslateFunc_1 = require("../func/TranslateFunc");
const ShareConst_1 = require("../consts/ShareConst");
const GameConsts_1 = require("../../game/sys/consts/GameConsts");
const ControlConst_1 = require("../consts/ControlConst");
const StatisticsManager_1 = require("../../game/sys/manager/StatisticsManager");
const StatisticsCommonConst_1 = require("../consts/StatisticsCommonConst");
const JumpFunc_1 = require("../func/JumpFunc");
const ShareFunc_1 = require("../../game/sys/func/ShareFunc");
const GlobalParamsFunc_1 = require("../../game/sys/func/GlobalParamsFunc");
const RecordEvent_1 = require("../event/RecordEvent");
const KariqiShareManager_1 = require("../manager/KariqiShareManager");
class TTGamePlatform extends WXGamePlatform_1.default {
    constructor() {
        super();
        this._recordType = this.RECORD_TYPE_AUTO; //录屏类型
        this._hasInitMoreGame = false;
        TTGamePlatform.instance = this;
    }
    getWX() {
        return window['tt'];
    }
    /**调取对应平台的分享 */
    shareAldAppMsg(data) {
        this.getWX().shareAppMessage(data);
    }
    myOnShare(callback) {
        this.getWX().onShareAppMessage(callback);
    }
    //模拟生成授权按钮
    createSpeLoginBtn(posX, posY, btnW, btnH, callBack, thisObject) {
        this.createLoginButton(callBack, thisObject);
    }
    createLoginButton(callBack, thisObject) {
        var myThis = this;
        this.getWX().authorize({
            scope: "scope.userInfo",
            success(res) {
                LogsManager_1.default.echo("yrc authorize success", JSON.stringify(res));
                if (res && res.userInfo) {
                    LogsManager_1.default.echo('>>loginbutton onTap 成功回调>>', JSON.stringify(res));
                    callBack && callBack.call(thisObject, res);
                }
                else {
                    myThis.getWX().getSetting({
                        success(res) {
                            LogsManager_1.default.echo("yrc getSetting success", JSON.stringify(res));
                            if (res.authSetting['scope.userInfo']) {
                                LogsManager_1.default.echo("yrc start getUserInfo");
                                myThis.getWX().getUserInfo({
                                    withCredentials: true, lang: "",
                                    success(res) {
                                        LogsManager_1.default.echo("yrc getUserInfo success", JSON.stringify(res));
                                        callBack && callBack.call(thisObject, res);
                                    }, fail(err) {
                                        LogsManager_1.default.echo("yrc getUserInfo fail", JSON.stringify(err));
                                        callBack && callBack.call(thisObject, -1);
                                    }, complete(res) {
                                        LogsManager_1.default.echo("yrc getUserInfo complete", JSON.stringify(res));
                                    }
                                });
                            }
                        }, fail(err) {
                            LogsManager_1.default.echo("==fail===", err);
                        }, complete() {
                            LogsManager_1.default.echo("==complete===");
                        }
                    });
                }
            }, fail(res) {
                LogsManager_1.default.echo("yrc authorize fail", res);
                callBack && callBack.call(thisObject, -1);
            }, complete(res) {
                LogsManager_1.default.echo("yrc authorize complete", res);
            }
        });
    }
    /**注册录屏相关事件 */
    registerRecord() {
        if (UserInfo_1.default.isTT()) {
            this.recorder = this.getWX().getGameRecorderManager();
        }
        else if (UserInfo_1.default.isBaidu()) {
            this.recorder = this.getWX().getVideoRecorderManager();
        }
        LogsManager_1.default.echo("yrc registerRecord ", this.recorder);
        this.recorder.onStart(res => {
            this.onStartRecord(res);
        });
        this.recorder.onStop(res => {
            this.onStopRecord(res);
        });
        this.recorder.onError(res => {
            LogsManager_1.default.echo("yrc 录屏 onError", JSON.stringify(res));
        });
    }
    /**对开始录屏注册事件 */
    onStartRecord(res) {
        LogsManager_1.default.echo("yrc 开始录屏");
        LogsManager_1.default.echo(res);
        this._startCallback && this._startCallback.call(this._startThisObj);
        this._startCallback = null;
        this._recordStartT = Laya.Browser.now();
        //发送录屏开始事件
        Message_1.default.instance.send(RecordEvent_1.default.TT_RECORD_EVENT_START, this._recordType);
    }
    /**对结束录屏注册事件 */
    onStopRecord(res) {
        LogsManager_1.default.echo("yrc 结束录屏");
        LogsManager_1.default.echo(res);
        var curT = Laya.Browser.now();
        if (curT - this._recordStartT < 4000) {
            WindowManager_1.default.ShowTip("录屏时间不足，请重新录屏");
            this._recordStartT = 0;
            this._endCallback && this._endCallback.call(this._startThisObj, false);
            //发送录屏结束事件
            Message_1.default.instance.send(RecordEvent_1.default.TT_RECORD_EVENT_STOP, [false, this._recordType]);
            return;
        }
        this._videoPath = res.videoPath;
        this._endCallback && this._endCallback.call(this._startThisObj, true);
        if (UserInfo_1.default.isTT()) {
            // 头条渠道裁剪视频截取最后N秒内容。百度由于clipVideo耗时过慢不进行裁剪
            this.clipVideo();
        }
        //发送录屏结束事件
        Message_1.default.instance.send(RecordEvent_1.default.TT_RECORD_EVENT_STOP, [true, this._recordType]);
        //修改开始录屏时间
        this._recordStartT = 0;
    }
    /**开始录屏 */
    recordStart(callback = null, thisObj = null, endCallback = null, durT = 300, recordTimeRange = null, recordType = this.RECORD_TYPE_AUTO) {
        // 录屏时长最大120秒
        if (UserInfo_1.default.isTT()) {
            durT = Math.min(durT, 300);
        }
        else if (UserInfo_1.default.isBaidu()) {
            durT = Math.min(durT, 120);
        }
        LogsManager_1.default.echo("yrc tt recordStart", durT, recordType);
        //判断是否已经开始录屏
        if (this.checkRecordStart()) {
            LogsManager_1.default.echo("yrc tt record 已经开始---------------");
            return;
        }
        //录屏类型记录
        this._recordType = recordType;
        //没有正在进行的录屏
        this._startCallback = callback;
        this._startThisObj = thisObj;
        if (endCallback) {
            this._endCallback = endCallback;
        }
        if (recordTimeRange) {
            this._recordTimeRange = recordTimeRange;
        }
        else {
            var cutTime = GlobalParamsFunc_1.default.instance.getGlobalCfgDatas("cameraTvPublishCutTime").num;
            if (!cutTime) {
                cutTime = 15;
            }
            this._recordTimeRange = [cutTime, 0];
            LogsManager_1.default.echo("clipObj_timeRange", cutTime);
        }
        this.recorder.start({
            duration: durT,
        });
    }
    /**结束录屏 */
    recordStop(recordType = this.RECORD_TYPE_AUTO) {
        if (this.recorder) {
            if (!this.checkRecordStart()) {
                LogsManager_1.default.echo("whn tt record 已经结束----------------");
                return;
            }
            LogsManager_1.default.echo("whn tt record------------------", this._recordType, recordType);
            //暂时去掉此限制：避免手动开始的录屏无法结束录屏、视频path没有准备好，分享录屏掉起摄像机
            // // 自动开始的录屏可通过手动去结束，手动开始的录屏不可以自动结束，必须手动去结束
            // if (this._recordType == this.RECORD_TYPE_MANUAL && recordType == this.RECORD_TYPE_AUTO) {
            //     return;
            // }
            LogsManager_1.default.echo("yrc tt recordStop");
            this.recorder.stop();
        }
    }
    //判断录屏是否已经开始
    checkRecordStart() {
        if (!this._recordStartT) {
            return false;
        }
        return true;
    }
    //暂停录屏
    recordPause() {
        this.recorder.pause();
    }
    //继续录屏
    recordResume() {
        this.recorder.resume();
    }
    /**对视频进行剪辑 */
    clipVideo() {
        if (!this.recorder)
            return;
        if (!this._videoPath)
            return;
        var videoPath = this._videoPath;
        LogsManager_1.default.echo("yrc clipVideo path:", videoPath);
        var thisObj = this;
        var clipObj = {
            path: videoPath,
            success(res) {
                LogsManager_1.default.echo("yrc clipvideo succ", JSON.stringify(res));
                thisObj._videoPath = res.videoPath;
                UserInfo_1.default.platform.isHaveRecord = true;
            }, fail(err) {
                LogsManager_1.default.echo('yrc clipvideo fail', JSON.stringify(err));
            }
        };
        if (this._recordTimeRange) {
            clipObj['timeRange'] = this._recordTimeRange;
        }
        this.recorder.clipVideo(clipObj);
    }
    /**对剪辑的视频进行分享 */
    shareVideo(callBack = null, thisObj = null) {
        StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.SHARE_VIDEO_CLICK, { videoPath: this._videoPath, type: this._recordType });
        LogsManager_1.default.echo(`shareVideo 开始！`, this._videoPath);
        var myThis = this;
        var title_num = Math.random() > 0.5 ? '1' : '2';
        var title = TranslateFunc_1.default.instance.getTranslate("#tid_shareVideoTitle_" + title_num, 'TranslateGlobal');
        var kariqutitle = KariqiShareManager_1.default.getShareTileStr();
        if (kariqutitle) {
            title = kariqutitle;
        }
        if (UserInfo_1.default.isBaidu()) {
            this.getWX().shareVideo({
                videoPath: this._videoPath,
                title: title,
                success() {
                    StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.SHARE_VIDEO_SUCCESS, { videoPath: myThis._videoPath, type: myThis._recordType });
                    LogsManager_1.default.echo('shareVideo 分享成功！');
                    UserInfo_1.default.platform.isHaveRecord = false;
                    myThis._videoPath = null;
                    //分享成功
                    callBack && callBack.call(thisObj, true);
                },
                fail(e) {
                    LogsManager_1.default.echo(`shareVideo 分享失败！`, JSON.stringify(e));
                    callBack && callBack.call(thisObj, false);
                    // myThis._videoPath = null;
                },
                complete(e) {
                    LogsManager_1.default.echo("shareVideo complete", e);
                    // myThis._videoPath = null;
                }
            });
        }
        else if (UserInfo_1.default.isTT()) {
            var extra = {
                videoPath: this._videoPath,
            };
            if (UserInfo_1.default.platform.getSystemInfo().appName == "Douyin") {
                // 话题
                extra['videoTopics'] = ShareConst_1.default.DOUYIN_VIDEO_TOPICS;
                if (GameConsts_1.default.gameName) {
                    extra['videoTopics'].unshift(GameConsts_1.default.gameName);
                }
            }
            else if (UserInfo_1.default.platform.getSystemInfo().appName == "Toutiao") {
                // 挑战视频
                extra['createChallenge'] = true;
            }
            //随机一条分享序列
            KariqiShareManager_1.default.getOneRandomShareInfo();
            this.getWX().shareAppMessage({
                channel: "video",
                title: title,
                extra: extra,
                success() {
                    StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.SHARE_VIDEO_SUCCESS, { videoPath: myThis._videoPath, type: myThis._recordType });
                    LogsManager_1.default.echo('shareVideo 分享成功！');
                    UserInfo_1.default.platform.isHaveRecord = false;
                    // myThis._videoPath = null;
                    //分享成功
                    callBack && callBack.call(thisObj, true);
                    // 兼容大刀 发送回调
                    Message_1.default.instance.send(ControlConst_1.default.TT_SHARE_SUCC, this);
                    //发送卡日曲分享成功事件
                    KariqiShareManager_1.default.saveShareRecord();
                },
                fail(e) {
                    LogsManager_1.default.echo('shareVideo 分享失败！', JSON.stringify(e));
                    callBack && callBack.call(thisObj, false);
                    // 兼容大刀 发送回调
                    Message_1.default.instance.send(ControlConst_1.default.TT_SHARE_FAIL, this);
                    // myThis._videoPath = null;
                }
            });
        }
    }
    /**是否有可分享的录屏 */
    isCanShareVideo() {
        LogsManager_1.default.echo("yrc111 isCanShareVideo _videoPath:", this._videoPath);
        if (this._videoPath) {
            return true;
        }
    }
    /**获取用户保存到相册权限 */
    getPhotoAuthorize(callBack, thisObject) {
        this.getWX().getSetting({
            success(res) {
                LogsManager_1.default.echo("yrc tt getPhotoAuthorize setting", res);
                TTGamePlatform.instance.getWX().authorize({
                    scope: 'scope.writePhotosAlbum',
                    success(res) {
                        //授权成功
                        LogsManager_1.default.echo("yrc tt authorize writePhotosAlbum suc", res);
                        callBack && callBack.call(thisObject, true);
                    },
                    fail(err) {
                        //拒绝授权
                        LogsManager_1.default.echo("yrc tt authorize writePhotosAlbum fail", err);
                        callBack && callBack.call(thisObject, false);
                    }
                });
            }
        });
    }
    /**保存图片到相册 */
    saveImg(filePath, callBack, thisObject) {
        var saveFunc = () => {
            this.getWX().saveImageToPhotosAlbum({
                filePath: filePath,
                success(res) {
                    //保存成功
                    LogsManager_1.default.echo("yrc tt saveImgToAlbum suc", res);
                    callBack && callBack.call(thisObject, true);
                },
                fail(err) {
                    //保存失败
                    LogsManager_1.default.echo("yrc tt saveImgToAlbum err", err);
                    callBack && callBack.call(thisObject, false);
                }
            });
        };
        if (this._isPhotosAlbum) {
            saveFunc();
        }
        else {
            this.getPhotoAuthorize((isSuc) => {
                if (isSuc) {
                    saveFunc();
                }
                else {
                    //拒绝授权
                    callBack && callBack.call(thisObject, false);
                }
            }, this);
        }
    }
    //重写登出函数
    loginOut() {
        super.loginOut();
        // wx.getUpdateManager().applyUpdate();
        var obj = {
            success: () => {
                LogsManager_1.default.echo("_loginOut success__");
            },
            fail: () => {
                LogsManager_1.default.echo("_loginOut fail__");
            },
            complete: () => {
                LogsManager_1.default.echo("_loginOut complete__");
            }
        };
        this.getWX().exitMiniProgram(obj);
    }
    /**
     * 头条没有跳转小程序。调用showMoreGamesModal
     */
    jumpToMiniProgram(data) {
        this.showMoreGamesModal(data);
    }
    /**
     * 头条更多游戏
     */
    showMoreGamesModal(data) {
        if (!this.canUseJump()) {
            return;
        }
        // 监听弹窗关闭
        var tt = this.getWX();
        if (!this._hasInitMoreGame) {
            tt.onMoreGamesModalClose(function (res) {
                LogsManager_1.default.echo("hlx 头条互推 onMoreGamesModalClose ", res);
            });
            // 监听小游戏跳转
            tt.onNavigateToMiniProgram(function (res) {
                if (data) {
                    StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.JUMP_TO_OTHER_GAME_SUCCESS, { gameName: data.jumpData && data.jumpData.GameName, from: data.extraData && data.extraData.from, toAppId: data && data.appId, position: data.jumpData.Position });
                }
                else {
                    StatisticsManager_1.default.ins.onEvent(StatisticsCommonConst_1.default.JUMP_TO_OTHER_GAME_SUCCESS);
                }
                LogsManager_1.default.echo("hlx 头条互推 onNavigateToMiniProgram errCode:", res.errCode, "errMsg:", res.errMsg);
            });
        }
        var appLaunchOptions = [];
        // 跳转信息
        var jumpList = JumpFunc_1.JumpFunc.instance.getJumpList();
        for (var i = 0; i < jumpList.length; i++) {
            appLaunchOptions.push({
                appId: jumpList[i].GameAppId,
                query: 'op=jump&from=' + GameConsts_1.default.gameCode,
                extraData: {}
            });
        }
        // 打开互跳弹窗
        tt.showMoreGamesModal({
            appLaunchOptions: appLaunchOptions,
            success(res) {
                LogsManager_1.default.echo("hlx 头条互推 showMoreGamesModal success", res.errMsg);
            },
            fail(res) {
                LogsManager_1.default.echo("hlx 头条互推 showMoreGamesModal fail", res.errMsg);
            }
        });
    }
    /**右上角三点分享相关 */
    sharePage() {
        LogsManager_1.default.echo("hlx 初始默认分享配置");
        this.getWX().showShareMenu({
            withShareTicket: true,
            success() {
                console.log("hlx 初始默认分享配置成功");
            },
            fail(e) {
                console.log("hlx 初始默认分享配置失败", e);
            },
            complete(e) {
                console.log("hlx 初始默认分享配置complete", e);
            }
        });
        var myThis = this;
        var callback;
        if (UserInfo_1.default.isTT()) {
            callback = function (res) {
                var shareData = ShareFunc_1.default.instance.getShareData("1", "wxgame");
                var rid = UserModel_1.default.instance.getUserRid() == 'nologin' ? '' : UserModel_1.default.instance.getUserRid();
                var obj;
                if (res.channel == 'video') {
                    var extra = {
                        videoPath: myThis._videoPath,
                    };
                    if (UserInfo_1.default.platform.getSystemInfo().appName == "Douyin") {
                        // 话题
                        extra['videoTopics'] = ShareConst_1.default.DOUYIN_VIDEO_TOPICS;
                        if (GameConsts_1.default.gameName) {
                            extra['videoTopics'].unshift(GameConsts_1.default.gameName);
                        }
                    }
                    else if (UserInfo_1.default.platform.getSystemInfo().appName == "Toutiao") {
                        // 挑战视频
                        extra['createChallenge'] = true;
                    }
                    obj = {
                        channel: "video",
                        title: "测试标题",
                        extra: extra,
                        success() {
                            console.log("hlx 录屏分享成功");
                        },
                        fail(e) {
                            console.log("hlx 录屏分享失败", e);
                        }
                    };
                }
                else {
                    obj = {
                        title: shareData.des,
                        imageUrl: shareData.imgUrl,
                        query: "inviterRid=" + rid + "&imgId=" + shareData.imgId,
                    };
                }
                LogsManager_1.default.echo(">>>>>>>>sharePage>>>>>>>", obj);
                myThis._lastShareImg = shareData.imgId;
                return obj;
            };
        }
        else {
            callback = function () {
                var shareData = ShareFunc_1.default.instance.getShareData("1", "wxgame");
                var rid = UserModel_1.default.instance.getUserRid() == 'nologin' ? '' : UserModel_1.default.instance.getUserRid();
                var obj = {
                    title: shareData.des,
                    imageUrl: shareData.imgUrl,
                    query: "inviterRid=" + rid + "&imgId=" + shareData.imgId,
                };
                LogsManager_1.default.echo(">>>>>>>>sharePage>>>>>>>", obj);
                myThis._lastShareImg = shareData.imgId;
                return obj;
            };
        }
        this.myOnShare(callback);
    }
}
exports.default = TTGamePlatform;
//# sourceMappingURL=TTGamePlatform.js.map
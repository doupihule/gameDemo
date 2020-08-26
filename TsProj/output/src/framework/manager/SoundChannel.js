"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VersionManager_1 = require("./VersionManager");
class SoundChannel {
    constructor() {
        this._loops = 1;
        this._audio = wx.createInnerAudioContext();
    }
    /**播放音乐 */
    play() {
        this._audio.play();
        this._audio.offEnded(null);
        this._audio.onEnded(function () { this.onEnd(); }.bind(this));
    }
    //
    offAll() {
        this._audio.offEnded(null);
        this._audio.stop();
        this._audio.onEnded(SoundChannel._emptyFunc);
    }
    /**设置播放数据，src和次数 */
    setData(url, loops, complete, soundClass, startTime) {
        if (this._url == url) {
            return;
        }
        // var formatPath = Laya.URL.formatURL(url);
        // var fileInfo = Laya.MiniFileMgr.getFileInfo(formatPath);
        // if (fileInfo && fileInfo.md5) {
        //     this._nativePath = Laya.MiniFileMgr.getFileNativePath(fileInfo.md5);
        //     this._audio.src = this._nativePath || fileInfo.readyUrl;
        // } else{
        //     this._audio.src = url;
        // }
        var formatPath = VersionManager_1.default.getVirtualUrl(url);
        this._audio.src = formatPath;
        this._url = url;
        this._loops = loops;
        this._audio.loop = this._loops == 0;
        if (!startTime) {
            startTime = 0;
        }
        this._audio.startTime = startTime;
    }
    /**设置音量 */
    set volume(v) {
        if (!this._audio)
            return;
        this._audio.volume = v;
    }
    /**暂停 */
    stop() {
        if (this._audio) {
            this._audio.stop();
        }
    }
    /**结束的回调函数 */
    onEnd() {
        if (this._loops == 1) {
            this.stop();
            return;
        }
        if (this._loops > 0) {
            this._loops--;
        }
        this.play();
    }
}
exports.default = SoundChannel;
SoundChannel._emptyFunc = function () { };
//# sourceMappingURL=SoundChannel.js.map
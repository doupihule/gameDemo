"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogsManager_1 = require("./LogsManager");
const FileUtils_1 = require("../utils/FileUtils");
const UserInfo_1 = require("../common/UserInfo");
const SoundChannel_1 = require("./SoundChannel");
const SubPackageManager_1 = require("./SubPackageManager");
const SubPackageConst_1 = require("../../game/sys/consts/SubPackageConst");
const TimerManager_1 = require("./TimerManager");
const MusicConst_1 = require("../../game/sys/consts/MusicConst");
const PoolTools_1 = require("../utils/PoolTools");
const PoolCode_1 = require("../../game/sys/consts/PoolCode");
const Message_1 = require("../common/Message");
const MsgCMD_1 = require("../../game/sys/common/MsgCMD");
const SwitchModel_1 = require("../../game/sys/model/SwitchModel");
class SoundManager {
    static init() {
        // SoundManager.initSwitch();
        SoundManager.BGM = "";
        SoundManager.BGS = [];
        SoundManager.ME = "";
        Laya.SoundManager.autoReleaseSound = false;
        var thisObj = this;
        Laya.SoundManager.autoStopMusic = true;
        Message_1.default.instance.add(MsgCMD_1.default.GAME_ONSHOW, thisObj);
        Message_1.default.instance.add(MsgCMD_1.default.GAME_ONHIDE, thisObj);
    }
    static initSwitch() {
        SoundManager.musicSwitch = SwitchModel_1.default.instance.getMusicSwitch();
        SoundManager.soundSwitch = SwitchModel_1.default.instance.getSoundSwitch();
    }
    /**
     * 播放循环的背景音乐。背景音乐同时只能播放一个，如果在播放背景音乐时再次调用本方法，会先停止之前的背景音乐，再播放当前的背景音乐。
     * @param url		声音文件地址。
     * @param startTime	声音播放起始时间。
     */
    static playBGM(url, startTime) {
        LogsManager_1.default.echo("playmusic:", url);
        if (!url) {
            return;
        }
        if (!url && SoundManager.BGM && SoundManager.BGM != "") {
            url = SoundManager.BGM;
        }
        url = this.getSoundUrl(url);
        //如果是同一个背景音乐 return
        if (SoundManager.BGM == url) {
            return;
        }
        SoundManager.BGM = url;
        if (SoundManager.musicSwitch) {
            if (FileUtils_1.default.isUserWXSource()) {
                this.loadSound(url, SoundManager.playNewBGM, SoundManager, [url, 0, null, startTime]);
            }
            else {
                this.loadSound(url, Laya.SoundManager.playMusic, Laya.SoundManager, [url, 0, null, startTime]);
            }
        }
    }
    /**
       * 播放循环的背景音效。音效可以同时播放多个。
       * @param url			声音文件地址,不包含任何路径
       * @param soundClass	使用哪个声音类进行播放，null表示自动选择。
       * @param startTime		声音播放起始时间。
       */
    static playBGS(url, soundClass, startTime) {
        if (SoundManager.soundSwitch) {
            url = this.getSoundUrl(url);
            // LogsManager.echo("krma. playBGS " + url);
            this.loadSound(url, SoundManager.playNewSound, SoundManager, [url, 0, null, soundClass, startTime]);
        }
        else { //TODO 开关关闭时要存起来吗?
            // SoundManager.BGS.push(url);
        }
    }
    //获取声音的url
    static getSoundUrl(sound) {
        //如果已经是sound了
        if (sound.slice(0, 5) == "sound" || sound.indexOf("groupSound") != -1) {
            return sound;
        }
        var soundPath = this.getSoundPath(sound);
        return soundPath + "/" + sound + this.getSoundExpandName(sound);
    }
    static getSoundExpandName(sound) {
        if (UserInfo_1.default.isSystemMini()) {
            return ".mp3";
        }
        else if (UserInfo_1.default.isSystemNative()) {
            //背景音乐还是走mp3
            if (this.checkIsMusic(sound)) {
                return ".mp3";
            }
            if (UserInfo_1.default.isSystemAndroid()) {
                return ".ogg";
            }
            return ".wav";
        }
        else if (UserInfo_1.default.isSystemIos()) {
            return ".mp3";
        }
    }
    //判断是否是音乐
    static checkIsMusic(url) {
        var musicArr = this.musicArr;
        for (var i = 0; i < musicArr.length; i++) {
            var targetStr = musicArr[i];
            if (url.indexOf(targetStr) != -1) {
                return true;
            }
        }
        return false;
    }
    /**
     * 播放插入曲。只能存在一个，同时与背景音乐冲突，如果在播放背景音乐或插入曲时调用本方法，会先停止之前的背景音乐和插入曲，再播放该插入曲。
     * @param url		声音文件地址。
     * @param complete	声音播放完成回调。
     * @param startTime	声音播放起始时间。
     */
    static playME(url, complete, startTime) {
        SoundManager.ME = url;
        url = this.getSoundUrl(url);
        if (SoundManager.musicSwitch) {
            // LogsManager.echo("krma. playME " + url);
            if (FileUtils_1.default.isUserWXSource()) {
                this.loadSound(url, SoundManager.playNewBGM, SoundManager, [url, 1, null, startTime]);
            }
            else {
                this.loadSound(url, Laya.SoundManager.playMusic, Laya.SoundManager, [url, 1, complete, startTime]);
            }
        }
    }
    /**
     * 播放音效，默认单次。音效可以同时播放多个。
     * @param url			声音文件地址。
     * @param loops			循环次数,0表示无限循环。
     * @param complete		声音播放完成回调  Handler对象。
     * @param soundClass	使用哪个声音类进行播放，null表示自动选择。
     * @param startTime		声音播放起始时间。
     */
    static playSE(url, loops = 1, complete, soundClass, startTime) {
        if (SoundManager.soundSwitch) {
            url = this.getSoundUrl(url);
            // LogsManager.echo("krma. playSE " + url);
            // startTime = 0.1;
            this.loadSound(url, SoundManager.playNewSound, SoundManager, [url, loops, complete, soundClass, startTime]);
        }
    }
    //加载声音
    static loadSound(url, callBack, thisObj, callParams = null) {
        if (!FileUtils_1.default.isUserWXSource()) {
            if (callBack) {
                callBack.apply(thisObj, callParams);
            }
            return;
        }
        var formatPath = Laya.URL.formatURL(url);
        var fileInfo = Laya.MiniFileMgr.getFileInfo(formatPath);
        if (fileInfo) {
            // LogsManager.echo("__这个声音是缓存:",url)
            if (callBack) {
                callBack.apply(thisObj, callParams);
            }
            return;
        }
        //如果声音加载异常 暂时不做播放了 0是正常
        var onSoundLoadBack = (issucess) => {
            // LogsManager.echo("___声音加载完成-",url)
            if (callBack) {
                callBack.apply(thisObj, callParams);
            }
        };
        var shortName = this.getSoundShortName(url);
        var soundStyle = SubPackageManager_1.default.getModelFileStyle(SubPackageConst_1.default.packName_sound);
        if (soundStyle == SubPackageConst_1.default.PATH_STYLE_SUBPACK) {
            //如果是baidu. 那么声音作为整包一起下载
            if (UserInfo_1.default.isBaidu()) {
                SubPackageManager_1.default.load(SubPackageConst_1.default.packName_sound, onSoundLoadBack, this);
            }
            else {
                SubPackageManager_1.default.loadDynamics(this.getSoundSubPack(shortName), this.getSoundPath(shortName), onSoundLoadBack, this);
            }
        }
        else if (soundStyle == SubPackageConst_1.default.PATH_STYLE_NATIVE) {
            onSoundLoadBack(false);
        }
        else {
            Laya.MiniFileMgr.downOtherFiles(formatPath, new Laya.Handler(null, onSoundLoadBack), formatPath, true);
        }
    }
    //获取声音的分包 有可能是打组的
    static getSoundSubPack(shortName) {
        var groupInfo = SubPackageManager_1.default.getSoundGroupInfo(shortName);
        if (!groupInfo) {
            //如果声音是走整包的
            if (SubPackageConst_1.default.subPackData.sound && SubPackageConst_1.default.subPackData.sound.isWhole) {
                return SubPackageConst_1.default.packName_sound;
            }
            return shortName;
        }
        if (SubPackageConst_1.default.subPackData.groupSound) {
            //如果声音组是走整包
            if (SubPackageConst_1.default.subPackData.groupSound.isWhole) {
                return "groupSound";
            }
        }
        return groupInfo.name;
    }
    //获取声音路径
    static getSoundPath(shortName) {
        var groupInfo = SubPackageManager_1.default.getSoundGroupInfo(shortName);
        if (!groupInfo) {
            return "sound/" + shortName;
        }
        return groupInfo.path + "/" + groupInfo.name + "/" + shortName;
    }
    static stopMusic() {
        SoundManager.BGM = "";
        SoundManager.ME = "";
        LogsManager_1.default.echo("=============ycn stop music");
        if (FileUtils_1.default.isUserWXSource()) {
            SoundManager.stopNewBGM();
        }
        else {
            Laya.SoundManager.stopMusic();
        }
    }
    static stopAllSound() {
        SoundManager.BGS = "";
        //销毁计时器
        for (var i in this._soundDelayCode) {
            this.clearSoundTimeOut(i);
        }
        if (FileUtils_1.default.isUserWXSource()) {
            SoundManager.stopAllNewSound();
        }
        else {
            Laya.SoundManager.stopAllSound();
        }
    }
    static stopMusicOrSound(url) {
        this.clearSoundTimeOut(url);
        url = this.getSoundUrl(url);
        if (FileUtils_1.default.isUserWXSource()) {
            SoundManager.stopNewSound(url);
        }
        else {
            Laya.SoundManager.stopSound(url);
        }
    }
    /**
        * 设置声音音量。根据参数不同，可以分别设置指定声音（背景音乐或音效）音量或者所有音效（不包括背景音乐）音量。
        * @param volume	音量。初始值为1。音量范围从 0（静音）至 1（最大音量）。
        * @param url		(default = null)声音播放地址。默认为null。为空表示设置所有音效（不包括背景音乐）的音量，不为空表示设置指定声音（背景音乐或音效）的音量。
        */
    static setSoundVol(volume, url) {
        url = this.getSoundUrl(url);
        if (FileUtils_1.default.isUserWXSource()) {
            SoundManager.setSoundVolume(volume);
        }
        else {
            Laya.SoundManager.setSoundVolume(volume, url);
        }
    }
    /**
     * 设置背景音乐音量。音量范围从 0（静音）至 1（最大音量）。
     * @param volume	音量。初始值为1。音量范围从 0（静音）至 1（最大音量）。
     */
    static setMusicVol(volume) {
        if (FileUtils_1.default.isUserWXSource()) {
            SoundManager._bgvolume = volume;
            if (this._bgmSoundChannel) {
                this._bgmSoundChannel.volume = volume;
            }
        }
        else {
            Laya.SoundManager.setMusicVolume(volume);
        }
    }
    /**播放背景音乐 */
    static playNewBGM(url, loops, complete, startTime) {
        if (!this._bgmSoundChannel) {
            this._bgmSoundChannel = new SoundChannel_1.default();
        }
        if (this._bgmSoundChannel._url != url) {
            this._bgmSoundChannel.offAll();
            this._bgmSoundChannel.setData(url, loops);
        }
        this._bgmSoundChannel.play();
        this._bgmSoundChannel.volume = SoundManager._bgvolume;
    }
    /**暂停背景音乐 */
    static stopNewBGM() {
        if (this._bgmSoundChannel) {
            this._bgmSoundChannel.offAll();
        }
    }
    /**播放新管理下的音乐 */
    static playNewSound(url, loops, complete, soundClass, startTime) {
        var shortName = this.getSoundShortName(url);
        this.clearSoundTimeOut(shortName);
        var soundLength = this.getSoundLength(shortName);
        //循环的音效 因为会有衔接问题 所以暂时改为 通过长度延迟重复播放
        var targetLoops = loops;
        if (loops == 0) {
            // loops = 1;
            // this._soundDelayCode[shortName] = TimerManager.instance.setTimeout(this.playNewSound,this,soundLength,url,loops,complete,soundClass,startTime);
            // //强制改成只播放一次
            // targetLoops =1;
        }
        else {
            //指定声音时长后手动停止音效.
            this._soundDelayCode[shortName] = TimerManager_1.default.instance.setTimeout(this.stopNewSound, this, soundLength, url);
        }
        if (FileUtils_1.default.isUserWXSource()) {
            var soundChannel = SoundManager.getChannelIns(url);
            soundChannel.offAll();
            soundChannel.setData(url, targetLoops, complete, soundClass, startTime);
            var volume = this._volume;
            if (this._volumes[url]) {
                volume = this._volumes[url];
            }
            soundChannel.volume = volume;
            soundChannel.play();
        }
        else {
            if (this._soundCountMap[url] == null) {
                this._soundCountMap[url] = 0;
            }
            //10帧之内最多只能有2个同名音效
            var count = this._soundCountMap[url];
            if (count >= 2) {
                return;
            }
            // LogsManager.echo("soundurl:"+url,count);
            this._soundCountMap[url]++;
            TimerManager_1.default.instance.add(this.delayResumeSoundCount, this, 350, 1, false, [url]);
            var sound = Laya.SoundManager.playSound(url, targetLoops, complete, soundClass, startTime);
            if (sound && sound.volume) {
                sound.volume = this._volume;
            }
        }
    }
    static delayResumeSoundCount(url) {
        this._soundCountMap[url]--;
    }
    //清除一个声音回调
    static clearSoundTimeOut(url) {
        var code = this._soundDelayCode[url];
        if (code) {
            TimerManager_1.default.instance.remove(code);
        }
        this._soundDelayCode[url] = null;
    }
    //获取声音的简短名字 比如 sound/battle.mp3  返回battle
    static getSoundShortName(url) {
        if (url.indexOf(".mp3") != -1) {
            var lastIndex = url.lastIndexOf("/");
            return url.slice(lastIndex + 1, -4);
        }
        return url;
    }
    //获取音效长度
    static getSoundLength(name) {
        var info = MusicConst_1.MusicConst.soundCfgs[name];
        //默认给5秒
        if (!info) {
            return 5000;
        }
        return info.length;
    }
    /**设置音量 */
    static setSoundVolume(volume) {
        this._volume = volume;
    }
    /**
     * 设置指定声音的音量。
     * @param url		声音文件url
     * @param volume	音量。初始值为1。0~1
     */
    static _setVolume(url, volume) {
        if (url == this.getSoundUrl(SoundManager.BGM)) {
            if (this._bgmSoundChannel) {
                this._bgmSoundChannel.volume = volume;
                return;
            }
        }
        // var i:number;
        var channel;
        for (var i in this._soundChannelCache) {
            channel = this._soundChannelCache[i];
            if (channel && channel._url == url) {
                channel.volume = volume;
            }
        }
    }
    /**停止播放所有音效（不包括背景音乐） */
    static stopAllNewSound() {
        // var i:number;
        var channel;
        for (var i in this._soundChannelCache) {
            channel = this._soundChannelCache[i];
            if (channel && channel._url != SoundManager.BGM) {
                this.stopNewSound(i);
                // channel.stop();
            }
        }
    }
    /**停止声音播放。此方法能够停止任意声音的播放（包括背景音乐和音效），只需传入对应的声音播放地址 */
    static stopNewSound(url) {
        if (url == this.getSoundUrl(SoundManager.BGM)) {
            if (this._bgmSoundChannel) {
                this._bgmSoundChannel.stop();
                return;
            }
        }
        var shortName = this.getSoundShortName(url);
        this.clearSoundTimeOut(shortName);
        var i;
        var channel = this._soundChannelCache[url];
        if (channel) {
            channel.offAll();
            if (channel._loops != 0) {
                this._soundChannelCache[url] = null;
                delete this._soundChannelCache[url];
                PoolTools_1.default.cacheItem("soundChannel", channel, PoolCode_1.default.pool_model_sys);
            }
        }
    }
    /**获取音频实例对象 */
    static getChannelIns(url) {
        var soundChannel;
        if (!this._soundChannelCache[url]) {
            var sc = PoolTools_1.default.getItem("soundChannel", PoolCode_1.default.pool_model_sys);
            if (!sc) {
                sc = new SoundChannel_1.default();
            }
            this._soundChannelCache[url] = sc;
        }
        soundChannel = this._soundChannelCache[url];
        return soundChannel;
    }
    static recvMsg(cmd, data) {
        if (cmd == MsgCMD_1.default.GAME_ONSHOW) {
            if (this._bgmSoundChannel) {
                this._bgmSoundChannel.play();
            }
        }
        else if (cmd == MsgCMD_1.default.GAME_ONHIDE) {
            if (this._bgmSoundChannel) {
                this._bgmSoundChannel.stop();
            }
        }
    }
}
exports.default = SoundManager;
SoundManager.music = "musicStorage";
SoundManager.sound = "soundStorage";
SoundManager.isQQMusic = false;
SoundManager._soundDelayCode = {};
//当前播放音效的数量 {url:count}
SoundManager._soundCountMap = {};
//背景音乐数组  和其他音效区分开
SoundManager.musicArr = [
    "main_bg"
];
//对QQ的音乐特殊处理
SoundManager._soundChannelCache = {}; //未使用的音频对象，暂存在数组中
SoundManager._volumes = {}; //设置了部分音乐的音量
SoundManager._volume = 1; //总音量
SoundManager._bgvolume = 1; //背景音乐总音量
SoundManager._channelNum = 0; //创建对象数量
//# sourceMappingURL=SoundManager.js.map
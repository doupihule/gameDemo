import LogsManager from "./LogsManager";
import FileUtils from "../utils/FileUtils";
import UserInfo from "../common/UserInfo";
import SoundChannel from "./SoundChannel";
import SubPackageManager from "./SubPackageManager";
import SubPackageConst from "../../game/sys/consts/SubPackageConst";
import TimerManager from "./TimerManager";
import {MusicConst} from "../../game/sys/consts/MusicConst";
import PoolTools from "../utils/PoolTools";
import PoolCode from "../../game/sys/consts/PoolCode";
import Message from "../common/Message";
import MsgCMD from "../../game/sys/common/MsgCMD";
import SwitchModel from "../../game/sys/model/SwitchModel";

export default class SoundManager {
	public static musicSwitch;
	public static soundSwitch;
	public static BGM;
	public static BGS;
	public static ME;
	public static music = "musicStorage";
	public static sound = "soundStorage";


	public static isQQMusic: boolean = false;

	private static _soundDelayCode: any = {}

	//当前播放音效的数量 {url:count}
	private static _soundCountMap: any = {}

	//背景音乐数组  和其他音效区分开
	public static musicArr = [
		"main_bg"
	]

	public static init(): void {
		// SoundManager.initSwitch();
		SoundManager.BGM = "";
		SoundManager.BGS = [];
		SoundManager.ME = "";
		Laya.SoundManager.autoReleaseSound = false;
		var thisObj: any = this
		Laya.SoundManager.autoStopMusic = true;
		Message.instance.add(MsgCMD.GAME_ONSHOW, thisObj)
		Message.instance.add(MsgCMD.GAME_ONHIDE, thisObj);
	}

	public static initSwitch() {
		SoundManager.musicSwitch = SwitchModel.instance.getMusicSwitch();
		SoundManager.soundSwitch = SwitchModel.instance.getSoundSwitch();

	}


	/**
	 * 播放循环的背景音乐。背景音乐同时只能播放一个，如果在播放背景音乐时再次调用本方法，会先停止之前的背景音乐，再播放当前的背景音乐。
	 * @param url		声音文件地址。
	 * @param startTime	声音播放起始时间。
	 */
	public static playBGM(url?: string, startTime?: number) {
		LogsManager.echo("playmusic:", url)
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
			if (FileUtils.isUserWXSource()) {
				this.loadSound(url, SoundManager.playNewBGM, SoundManager, [url, 0, null, startTime]);
			} else {
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
	public static playBGS(url: string, soundClass?: any, startTime?: number) {
		if (SoundManager.soundSwitch) {
			url = this.getSoundUrl(url);
			// LogsManager.echo("krma. playBGS " + url);
			this.loadSound(url, SoundManager.playNewSound, SoundManager, [url, 0, null, soundClass, startTime]);
		} else {//TODO 开关关闭时要存起来吗?
			// SoundManager.BGS.push(url);
		}
	}


	//获取声音的url
	public static getSoundUrl(sound) {
		//如果已经是sound了
		if (sound.slice(0, 5) == "sound" || sound.indexOf("groupSound") != -1) {
			return sound;
		}
		var soundPath = this.getSoundPath(sound);
		return soundPath + "/" + sound + this.getSoundExpandName(sound);
	}

	private static getSoundExpandName(sound: string) {
		if (UserInfo.isSystemMini()) {
			return ".mp3"
		} else if (UserInfo.isSystemNative()) {
			//背景音乐还是走mp3

			if (this.checkIsMusic(sound)) {
				return ".mp3";
			}
			if (UserInfo.isSystemAndroid()) {
				return ".ogg"
			}
			return ".wav"
		} else if (UserInfo.isSystemIos()) {
			return ".mp3";
		}
	}

	//判断是否是音乐
	private static checkIsMusic(url: string) {
		var musicArr = this.musicArr
		for (var i = 0; i < musicArr.length; i++) {
			var targetStr: string = musicArr[i];
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
	public static playME(url: string, complete?: Laya.Handler, startTime?: number) {
		SoundManager.ME = url;
		url = this.getSoundUrl(url);
		if (SoundManager.musicSwitch) {
			// LogsManager.echo("krma. playME " + url);
			if (FileUtils.isUserWXSource()) {
				this.loadSound(url, SoundManager.playNewBGM, SoundManager, [url, 1, null, startTime]);
			} else {
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
	public static playSE(url: string, loops = 1, complete?: Laya.Handler, soundClass?: any, startTime?: number) {
		if (SoundManager.soundSwitch) {
			url = this.getSoundUrl(url);
			// LogsManager.echo("krma. playSE " + url);
			// startTime = 0.1;
			this.loadSound(url, SoundManager.playNewSound, SoundManager, [url, loops, complete, soundClass, startTime]);
		}
	}

	//加载声音
	public static loadSound(url, callBack, thisObj, callParams = null) {

		if (!FileUtils.isUserWXSource()) {
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
			return
		}
		//如果声音加载异常 暂时不做播放了 0是正常
		var onSoundLoadBack = (issucess) => {
			// LogsManager.echo("___声音加载完成-",url)
			if (callBack) {
				callBack.apply(thisObj, callParams);
			}
		}

		var shortName = this.getSoundShortName(url);
		var soundStyle = SubPackageManager.getModelFileStyle(SubPackageConst.packName_sound)
		if (soundStyle == SubPackageConst.PATH_STYLE_SUBPACK) {
			//如果是baidu. 那么声音作为整包一起下载
			if (UserInfo.isBaidu()) {
				SubPackageManager.load(SubPackageConst.packName_sound, onSoundLoadBack, this)
			} else {
				SubPackageManager.loadDynamics(this.getSoundSubPack(shortName), this.getSoundPath(shortName), onSoundLoadBack, this)
			}
		} else if (soundStyle == SubPackageConst.PATH_STYLE_NATIVE) {
			onSoundLoadBack(false);
		} else {
			Laya.MiniFileMgr.downOtherFiles(formatPath, new Laya.Handler(null, onSoundLoadBack), formatPath, true);
		}

	}

	//获取声音的分包 有可能是打组的
	private static getSoundSubPack(shortName: string) {
		var groupInfo = SubPackageManager.getSoundGroupInfo(shortName);
		if (!groupInfo) {
			//如果声音是走整包的
			if (SubPackageConst.subPackData.sound && SubPackageConst.subPackData.sound.isWhole) {
				return SubPackageConst.packName_sound;
			}
			return shortName
		}
		if (SubPackageConst.subPackData.groupSound) {
			//如果声音组是走整包
			if (SubPackageConst.subPackData.groupSound.isWhole) {
				return "groupSound";
			}
		}

		return groupInfo.name;
	}

	//获取声音路径
	private static getSoundPath(shortName: string) {
		var groupInfo = SubPackageManager.getSoundGroupInfo(shortName);
		if (!groupInfo) {
			return "sound/" + shortName
		}
		return groupInfo.path + "/" + groupInfo.name + "/" + shortName;
	}


	public static stopMusic() {
		SoundManager.BGM = "";
		SoundManager.ME = "";
		LogsManager.echo("=============ycn stop music");
		if (FileUtils.isUserWXSource()) {
			SoundManager.stopNewBGM();
		} else {
			Laya.SoundManager.stopMusic();
		}
	}

	public static stopAllSound() {
		SoundManager.BGS = "";
		//销毁计时器
		for (var i in this._soundDelayCode) {
			this.clearSoundTimeOut(i);
		}

		if (FileUtils.isUserWXSource()) {
			SoundManager.stopAllNewSound();
		} else {
			Laya.SoundManager.stopAllSound();
		}
	}

	public static stopMusicOrSound(url: string) {
		this.clearSoundTimeOut(url);
		url = this.getSoundUrl(url);
		if (FileUtils.isUserWXSource()) {
			SoundManager.stopNewSound(url);
		} else {
			Laya.SoundManager.stopSound(url);
		}
	}

	/**
	 * 设置声音音量。根据参数不同，可以分别设置指定声音（背景音乐或音效）音量或者所有音效（不包括背景音乐）音量。
	 * @param volume	音量。初始值为1。音量范围从 0（静音）至 1（最大音量）。
	 * @param url		(default = null)声音播放地址。默认为null。为空表示设置所有音效（不包括背景音乐）的音量，不为空表示设置指定声音（背景音乐或音效）的音量。
	 */
	public static setSoundVol(volume: number, url?: string) {
		url = this.getSoundUrl(url)
		if (FileUtils.isUserWXSource()) {
			SoundManager.setSoundVolume(volume);
		} else {
			Laya.SoundManager.setSoundVolume(volume, url);
		}
	}


	/**
	 * 设置背景音乐音量。音量范围从 0（静音）至 1（最大音量）。
	 * @param volume	音量。初始值为1。音量范围从 0（静音）至 1（最大音量）。
	 */
	public static setMusicVol(volume: number) {
		if (FileUtils.isUserWXSource()) {
			SoundManager._bgvolume = volume;
			if (this._bgmSoundChannel) {
				this._bgmSoundChannel.volume = volume;
			}
		} else {
			Laya.SoundManager.setMusicVolume(volume);
		}
	}


	//对QQ的音乐特殊处理
	public static _soundChannelCache: any = {};//未使用的音频对象，暂存在数组中
	public static _bgmSoundChannel: SoundChannel;
	public static _volumes: any = {};//设置了部分音乐的音量
	public static _volume: number = 1;//总音量
	public static _bgvolume: number = 1;//背景音乐总音量
	public static _channelNum: number = 0;//创建对象数量


	/**播放背景音乐 */
	public static playNewBGM(url: string, loops?: number, complete?: Laya.Handler, startTime?: number) {
		if (!this._bgmSoundChannel) {
			this._bgmSoundChannel = new SoundChannel();
		}
		if (this._bgmSoundChannel._url != url) {
			this._bgmSoundChannel.offAll();
			this._bgmSoundChannel.setData(url, loops);
		}

		this._bgmSoundChannel.play();
		this._bgmSoundChannel.volume = SoundManager._bgvolume;
	}

	/**暂停背景音乐 */
	public static stopNewBGM() {
		if (this._bgmSoundChannel) {
			this._bgmSoundChannel.offAll();
		}
	}

	/**播放新管理下的音乐 */
	public static playNewSound(url: string, loops?: number, complete?: Laya.Handler, soundClass?: any, startTime?: number) {
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
		} else {
			//指定声音时长后手动停止音效.
			this._soundDelayCode[shortName] = TimerManager.instance.setTimeout(this.stopNewSound, this, soundLength, url);
		}

		if (FileUtils.isUserWXSource()) {
			var soundChannel: SoundChannel = SoundManager.getChannelIns(url);
			soundChannel.offAll();
			soundChannel.setData(url, targetLoops, complete, soundClass, startTime);
			var volume = this._volume;
			if (this._volumes[url]) {
				volume = this._volumes[url];
			}
			soundChannel.volume = volume;
			soundChannel.play();
		} else {

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
			TimerManager.instance.add(this.delayResumeSoundCount, this, 350, 1, false, [url]);
			var sound = Laya.SoundManager.playSound(url, targetLoops, complete, soundClass, startTime);
			if (sound && sound.volume) {
				sound.volume = this._volume;
			}
		}

	}

	private static delayResumeSoundCount(url) {
		this._soundCountMap[url]--;
	}

	//清除一个声音回调
	private static clearSoundTimeOut(url) {
		var code = this._soundDelayCode[url];
		if (code) {
			TimerManager.instance.remove(code);
		}
		this._soundDelayCode[url] = null;
	}


	//获取声音的简短名字 比如 sound/battle.mp3  返回battle
	private static getSoundShortName(url: string) {
		if (url.indexOf(".mp3") != -1) {
			var lastIndex = url.lastIndexOf("/");
			return url.slice(lastIndex + 1, -4);
		}
		return url;
	}


	//获取音效长度
	public static getSoundLength(name) {
		var info = MusicConst.soundCfgs[name];
		//默认给5秒
		if (!info) {
			return 5000;
		}
		return info.length;
	}


	/**设置音量 */
	public static setSoundVolume(volume) {
		this._volume = volume;
	}

	/**
	 * 设置指定声音的音量。
	 * @param url		声音文件url
	 * @param volume	音量。初始值为1。0~1
	 */
	private static _setVolume(url: String, volume: Number): void {
		if (url == this.getSoundUrl(SoundManager.BGM)) {
			if (this._bgmSoundChannel) {
				this._bgmSoundChannel.volume = volume;
				return;
			}
		}
		// var i:number;
		var channel: SoundChannel;
		for (var i in this._soundChannelCache) {
			channel = this._soundChannelCache[i];
			if (channel && channel._url == url) {
				channel.volume = volume;
			}
		}
	}

	/**停止播放所有音效（不包括背景音乐） */
	private static stopAllNewSound() {
		// var i:number;
		var channel: SoundChannel;
		for (var i in this._soundChannelCache) {
			channel = this._soundChannelCache[i];
			if (channel && channel._url != SoundManager.BGM) {
				this.stopNewSound(i);
				// channel.stop();
			}
		}
	}

	/**停止声音播放。此方法能够停止任意声音的播放（包括背景音乐和音效），只需传入对应的声音播放地址 */
	private static stopNewSound(url: string) {
		if (url == this.getSoundUrl(SoundManager.BGM)) {
			if (this._bgmSoundChannel) {
				this._bgmSoundChannel.stop();
				return;
			}
		}
		var shortName = this.getSoundShortName(url);
		this.clearSoundTimeOut(shortName);
		var i: number;
		var channel: SoundChannel = this._soundChannelCache[url];
		if (channel) {
			channel.offAll();
			if (channel._loops != 0) {
				this._soundChannelCache[url] = null;
				delete this._soundChannelCache[url];
				PoolTools.cacheItem("soundChannel", channel, PoolCode.pool_model_sys);
			}

		}

	}

	/**获取音频实例对象 */
	public static getChannelIns(url) {
		var soundChannel: SoundChannel;
		if (!this._soundChannelCache[url]) {

			var sc = PoolTools.getItem("soundChannel", PoolCode.pool_model_sys);
			if (!sc) {
				sc = new SoundChannel();
			}
			this._soundChannelCache[url] = sc
		}
		soundChannel = this._soundChannelCache[url];
		return soundChannel;
	}

	public static recvMsg(cmd: string, data: any): void {
		if (cmd == MsgCMD.GAME_ONSHOW) {
			if (this._bgmSoundChannel) {
				this._bgmSoundChannel.play();
			}
		} else if (cmd == MsgCMD.GAME_ONHIDE) {
			if (this._bgmSoundChannel) {
				this._bgmSoundChannel.stop();
			}
		}
	}


}
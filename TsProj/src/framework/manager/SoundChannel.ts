import VersionManager from "./VersionManager";

export default class SoundChannel {
	public _url: string;//此处为原始路径，即sound/xxx.mp3
	public _nativePath: string;//本地路径，缓存后的
	public _loops: number = 1;
	public _audio: any;

	private static _emptyFunc = function () {
	}

	public constructor() {
		this._audio = wx.createInnerAudioContext();
	}

	/**播放音乐 */
	public play() {
		this._audio.play();
		this._audio.offEnded(null);
		this._audio.onEnded(function () {
			this.onEnd()
		}.bind(this));
	}


	//
	public offAll() {
		this._audio.offEnded(null);
		this._audio.stop();
		this._audio.onEnded(SoundChannel._emptyFunc);
	}

	/**设置播放数据，src和次数 */
	public setData(url: string, loops?: number, complete?: Laya.Handler, soundClass?: any, startTime?: number) {
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

		var formatPath = VersionManager.getVirtualUrl(url);
		this._audio.src = formatPath;
		this._url = url;
		this._loops = loops;
		this._audio.loop = this._loops == 0;
		if (!startTime) {
			startTime = 0;
		}
		this._audio.startTime = startTime
	}

	/**设置音量 */
	public set volume(v: Number) {
		if (!this._audio) return;
		this._audio.volume = v;
	}

	/**暂停 */
	public stop() {
		if (this._audio) {
			this._audio.stop();
		}
	}

	/**结束的回调函数 */
	public onEnd() {
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
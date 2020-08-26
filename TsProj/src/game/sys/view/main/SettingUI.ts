import {ui} from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import {WindowCfgs} from "../../consts/WindowCfgs";
import WindowManager from "../../../../framework/manager/WindowManager";
import SwitchModel from "../../model/SwitchModel";
import SoundManager from "../../../../framework/manager/SoundManager";
import SwitchServer from "../../server/SwitchServer";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";


export default class SettingUI extends ui.gameui.main.SettingUI implements IMessage {

	private lastmusic;
	private lastsound;
	private lastshake;
	private firstmusic;
	private firstsound;
	private firstshake;

	constructor() {
		super();
		new ButtonUtils(this.closeBtn, this.onClickCLose, this);
		this.bgMusicScroll.changeHandler = new Laya.Handler(this, this.onMusicChange);
		this.soundScroll.changeHandler = new Laya.Handler(this, this.onSoundChange);
		new ButtonUtils(this.shakeBtn, this.onClickShake, this)
	}

	public setData(data): void {
		BannerAdManager.addBannerQuick(this);
		BannerAdManager.addTopBannerStyleJump(this);
		//界面初始化
		this.initView();
	}

	initView() {
		var music = SwitchModel.instance.getSwitchByType(SwitchModel.music_switch);
		this.bgMusicScroll.value = music;
		var sound = SwitchModel.instance.getSwitchByType(SwitchModel.sound_switch);
		this.soundScroll.value = sound;
		var shake = SwitchModel.instance.getSwitchByType(SwitchModel.shake_switch);
		if (!shake) {
			shake = 0;
		}
		this.openImg.visible = !shake;
		this.closeImg.visible = Boolean(shake);
		this.lastshake = shake;
		this.firstmusic = music;
		this.firstsound = sound;
		this.firstshake = shake;
	}

	private onMusicChange(value): void {
		this.lastmusic = Number(value.toFixed(1))
		SoundManager.setMusicVol(this.lastmusic)
	}

	private onSoundChange(value): void {
		this.lastsound = Number(value.toFixed(1))
		SoundManager.setSoundVolume(this.lastsound)

	}

	onClickCLose() {
		WindowManager.CloseUI(WindowCfgs.SettingUI);
		var tab = {};
		if (Number(this.firstmusic) != Number(this.lastmusic)) {
			tab[SwitchModel.music_switch] = Number(this.lastmusic)
		}
		if (Number(this.firstsound) != Number(this.lastsound)) {
			tab[SwitchModel.sound_switch] = Number(this.lastsound)
		}
		if (Number(this.firstshake) != Number(this.lastshake)) {
			tab[SwitchModel.shake_switch] = Number(this.lastshake)
		}
		if (Object.keys(tab).length > 0) {
			SwitchServer.updateSwitch({switch: tab});
		}
	}

	onClickShake() {
		this.lastshake = !this.lastshake;
		this.openImg.visible = !this.lastshake;
		this.closeImg.visible = this.lastshake;
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}
}



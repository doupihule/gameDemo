"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const SwitchModel_1 = require("../../model/SwitchModel");
const SoundManager_1 = require("../../../../framework/manager/SoundManager");
const SwitchServer_1 = require("../../server/SwitchServer");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
class SettingUI extends layaMaxUI_1.ui.gameui.main.SettingUI {
    constructor() {
        super();
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.onClickCLose, this);
        this.bgMusicScroll.changeHandler = new Laya.Handler(this, this.onMusicChange);
        this.soundScroll.changeHandler = new Laya.Handler(this, this.onSoundChange);
        new ButtonUtils_1.ButtonUtils(this.shakeBtn, this.onClickShake, this);
    }
    setData(data) {
        BannerAdManager_1.default.addBannerQuick(this);
        BannerAdManager_1.default.addTopBannerStyleJump(this);
        //界面初始化
        this.initView();
    }
    initView() {
        var music = SwitchModel_1.default.instance.getSwitchByType(SwitchModel_1.default.music_switch);
        this.bgMusicScroll.value = music;
        var sound = SwitchModel_1.default.instance.getSwitchByType(SwitchModel_1.default.sound_switch);
        this.soundScroll.value = sound;
        var shake = SwitchModel_1.default.instance.getSwitchByType(SwitchModel_1.default.shake_switch);
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
    onMusicChange(value) {
        this.lastmusic = Number(value.toFixed(1));
        SoundManager_1.default.setMusicVol(this.lastmusic);
    }
    onSoundChange(value) {
        this.lastsound = Number(value.toFixed(1));
        SoundManager_1.default.setSoundVolume(this.lastsound);
    }
    onClickCLose() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.SettingUI);
        var tab = {};
        if (Number(this.firstmusic) != Number(this.lastmusic)) {
            tab[SwitchModel_1.default.music_switch] = Number(this.lastmusic);
        }
        if (Number(this.firstsound) != Number(this.lastsound)) {
            tab[SwitchModel_1.default.sound_switch] = Number(this.lastsound);
        }
        if (Number(this.firstshake) != Number(this.lastshake)) {
            tab[SwitchModel_1.default.shake_switch] = Number(this.lastshake);
        }
        if (Object.keys(tab).length > 0) {
            SwitchServer_1.default.updateSwitch({ switch: tab });
        }
    }
    onClickShake() {
        this.lastshake = !this.lastshake;
        this.openImg.visible = !this.lastshake;
        this.closeImg.visible = this.lastshake;
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = SettingUI;
//# sourceMappingURL=SettingUI.js.map
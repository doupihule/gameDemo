import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";

export default class TipsUI extends Laya.Sprite {
    private showList;
    private tipsbg: Laya.Sprite;
    private tips: Laya.Label;

    public static res = [];
    constructor() {
        super();
        this.tipsbg = new Laya.Sprite();
        this.tipsbg.alpha = 0.5;
        this.tipsbg.mouseEnabled = true;
        this.tipsbg.mouseThrough = false;
        this.tipsbg.size(543, 97);
        this.tipsbg.y = 1207;
        this.addChild(this.tipsbg);
        this.tips = new Laya.Label();
        this.tips.color = "#ffffff";
        this.tips.font = "Microsoft YaHei";
        this.tips.fontSize = 30;
        this.tips.align = "center";
        this.tips.anchorX = 0.5;
        this.tips.pos(this.tipsbg.width / 2, 30);
        this.tipsbg.addChild(this.tips);
    }

    // private ignoreSound = ["购买成功"];

    public setData(data): void {
        // if (this.ignoreSound.indexOf(data) == -1)
        //     SoundManager.playSE(MusicConst.SOUND_ERROR_TIPS);
        //TODO 适配
        this.tipsbg.y = ScreenAdapterTools.designHeight * 0.5;
        this.tipsbg.alpha = 0;
        Laya.Tween.to(this.tipsbg, { alpha: 1, y: ScreenAdapterTools.designHeight * 0.5 - 100 }, 500);
        this.tips.text = data;
        this.tipsbg.width = (this.tips.width + 100) > 455 ? (this.tips.width + 100) : 455;
        this.tipsbg.graphics.clear();
        this.tipsbg.graphics.drawRect(0, 0, this.tipsbg.width, 97, "#000000");
        this.tipsbg.x = ScreenAdapterTools.width / 2 - this.tipsbg.width / 2;
        this.tips.x = this.tipsbg.width * 0.5;
        Laya.timer.once(1000, this, () => {
            Laya.Tween.to(this.tipsbg, { alpha: 0 }, 500);
        })
    }
}


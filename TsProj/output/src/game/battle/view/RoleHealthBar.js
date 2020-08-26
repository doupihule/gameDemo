"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResourceConst_1 = require("../../sys/consts/ResourceConst");
class RoleHealthBar extends Laya.Sprite {
    constructor() {
        super();
        this._initWidth = 80;
        this._initHeight = 8;
        this._offsetY = 0;
    }
    setData(owner, ctn) {
        this.owner = owner;
        this._offsetY = -this.owner.realSize[0] - 10;
        //判断是否缓存
        if (!this.srollImage) {
            this.backImage = this.createImage(ResourceConst_1.default.BATTLE_HEALTH_BACK, this._initWidth + 2, this._initHeight + 2);
            if (this.owner.camp == 1) {
                this.srollImage = this.createImage(ResourceConst_1.default.BATTLE_HEALTH_PROGRESS, this._initWidth, this._initHeight);
            }
            else {
                this.srollImage = this.createImage(ResourceConst_1.default.BATTLE_HEALTH_PROGRESS2, this._initWidth, this._initHeight);
            }
            this.shieldImage = this.createImage(ResourceConst_1.default.BATTLE_HEALTH_HUDUN, this._initWidth, this._initHeight);
            this.nameText = new Laya.Label();
            var nameText = this.nameText;
            this.addChild(nameText);
            nameText.bold = true;
            nameText.font = "Microsoft YaHei";
            nameText.fontSize = 18;
            nameText.anchorX = 0.5;
            nameText.anchorY = 0.5;
            nameText.x = this.width / 2;
            nameText.y = -20;
            nameText.stroke = 2;
            nameText.strokeColor = "#000000";
            this.srollImage.sizeGrid = "3,3,3,3";
            this.addChild(this.backImage);
            this.addChild(this.srollImage);
            this.addChild(this.shieldImage);
        }
        this.shieldImage.visible = false;
        ctn.addChild(this);
        this.onHpChange();
        this.visible = false;
    }
    //创建图片  
    createImage(url, wid, hei) {
        var image = new Laya.Image(url);
        image.sizeGrid = "1,3,1,3";
        image.width = wid;
        image.height = hei;
        image.anchorX = 0;
        image.anchorY = 0.5;
        image.x = -wid / 2;
        return image;
    }
    //延迟隐藏
    delayHide() {
        this.visible = false;
    }
    //当血条变化.为了性能.直接改图片宽度
    onHpChange() {
        this.nameText.text = "";
        var hp = this.owner.hp;
        var shieldValue = this.owner.getSheildValue();
        var percent = (this.owner.hp / this.owner.maxHp);
        this.owner.hpPercent = percent;
        var width = this._initWidth * percent;
        if (width < 0) {
            width = 0;
        }
        if (width > this._initWidth) {
            width = this._initWidth;
        }
        this.srollImage.width = width;
        if (shieldValue > 0) {
            this.shieldImage.visible = true;
            var percent2 = shieldValue / this.owner.maxHp;
            //护盾的血量最高不能超过70%;
            if (percent2 > 0.7) {
                percent2 = 0.7;
            }
            ;
            var wid2 = Math.round(this._initWidth * percent2);
            this.shieldImage.width = wid2;
            if (percent + percent2 > 1) {
                this.shieldImage.x = this._initWidth / 2 - wid2;
            }
            else {
                this.shieldImage.x = this.srollImage.width - this._initWidth / 2;
            }
        }
        else {
            this.shieldImage.visible = false;
        }
        this.visible = true;
        // this.owner.controler.clearCallBack(this, this.delayHide);
        // this.owner.controler.setCallBack(120, this.delayHide, this);
    }
    //跟随目标
    followTarget() {
        this.x = this.owner._myView.x;
        this.y = this.owner._myView.y + this._offsetY;
    }
    //销毁函数. 这个一般都是需要缓存的 而且单独缓存. 因为全局总共就不会创建超过20个
    dispose() {
        this.owner = null;
        this.backImage = null;
        this.srollImage;
        this.removeSelf();
    }
    //从舞台移除
    onSetToCache() {
        this.removeSelf();
    }
}
exports.default = RoleHealthBar;
//# sourceMappingURL=RoleHealthBar.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const UserModel_1 = require("../../model/UserModel");
const ShopModel_1 = require("../../model/ShopModel");
const ShopServer_1 = require("../../server/ShopServer");
const FogFunc_1 = require("../../func/FogFunc");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const BigNumUtils_1 = require("../../../../framework/utils/BigNumUtils");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
class MainShopItemUI extends layaMaxUI_1.ui.gameui.shop.MainShopItemUI {
    constructor(index, info, shop) {
        super();
        this.itemWeight = 178;
        this.itemHeight = 260;
        this.index = index;
        this.info = info;
        this.shop = shop;
        this.initBtn();
        this.setData();
    }
    addEvent() {
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.goldCostBtn, this.onClickBuy, this);
        new ButtonUtils_1.ButtonUtils(this.coinBtn, this.onClickBuy, this);
        new ButtonUtils_1.ButtonUtils(this.videoGetBtn, this.onClickVideo, this);
        this.bgImg.on(Laya.Event.MOUSE_UP, this, this.onClickItem);
    }
    setData() {
        var goodInfo = FogFunc_1.default.instance.getGoodsInfo(this.info.id);
        this.cfg = goodInfo;
        var content = goodInfo.content[0].split(",");
        var result = FogFunc_1.default.instance.getResourceShowInfo(content);
        var itemName = result.name;
        var itemIcon = result.icon;
        var iconNum = result.num;
        //如果是碎片，显示
        if (Number(content[0]) == DataResourceFunc_1.DataResourceType.PIECE) {
            this.smallImg.visible = true;
        }
        else {
            this.smallImg.visible = false;
        }
        //icon
        this.itemImg.skin = itemIcon;
        //数量
        this.itemNum.text = StringUtils_1.default.getCoinStr(iconNum);
        //name
        this.goodNameTxt.text = itemName;
        this.discountTxt.text = TranslateFunc_1.default.instance.getTranslate(goodInfo.discount);
        this.freshCount();
    }
    freshCount() {
        var times = this.cfg.times;
        var type = this.cfg.priceType;
        var price = Number(this.cfg.price);
        var count = ShopModel_1.default.instance.getGoodsCountByIndex(this.index);
        this.leftGrouup.visible = true;
        if (count >= times) {
            this.bgImg.gray = true;
            this.noCountTxt.visible = true;
            this.videoGetBtn.visible = false;
            this.coinBtn.visible = false;
            this.goldCostBtn.visible = false;
            this.leftGrouup.visible = false;
        }
        else {
            this.noCountTxt.visible = false;
            this.bgImg.gray = false;
            if (!type) {
                this.videoGetBtn.visible = true;
                this.coinBtn.visible = false;
                this.goldCostBtn.visible = false;
                this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_SHOP_BUY);
                if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
                    StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_SHOPVIDEOBUY_SHOW, { goodsId: this.cfg.goodsId });
                }
                if (this.freeType != ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                    this.freeImg.skin = ShareOrTvManager_1.default.instance.getFreeImgSkin(this.freeType);
                }
            }
            else {
                this.videoGetBtn.visible = false;
                this.coinBtn.visible = false;
                this.goldCostBtn.visible = false;
                if (type == DataResourceFunc_1.DataResourceType.COIN) {
                    this.coinBtn.visible = true;
                    this.coinTxt.text = StringUtils_1.default.getCoinStr(price + "");
                }
                else {
                    this.goldCostBtn.visible = true;
                    this.goldTxt.text = StringUtils_1.default.getCoinStr(price + "");
                }
            }
        }
        this.leftCountTxt.text = (times - count) + "/" + times;
    }
    onClickVideo() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_SHOPVIDEOBUY_CLICK, { goodsId: this.cfg.goodsId });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(ShareTvOrderFunc_1.default.SHARELINE_SHOP_BUY, ShareOrTvManager_1.default.TYPE_ADV, { id: 1, extraData: {} }, this.succCall, null, this);
    }
    succCall() {
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_SHOPVIDEOBUY_FINISH, { goodsId: this.cfg.goodsId });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_SHOPVIDEOBUY_FINISH, { goodsId: this.cfg.goodsId });
        }
        //购买
        var data = {
            reward: this.cfg.content,
            index: this.index,
            id: this.info.id
        };
        ShopServer_1.default.buyGoods(data, this.buySuccCall, this);
    }
    onClickBuy() {
        var type = this.cfg.priceType;
        var price = Number(this.cfg.price);
        switch (Number(type)) {
            case DataResourceFunc_1.DataResourceType.GOLD:
                var gold = UserModel_1.default.instance.getGold();
                if (Number(price) > Number(gold)) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughgold"));
                    return;
                }
                break;
            case DataResourceFunc_1.DataResourceType.COIN:
                if (BigNumUtils_1.default.compare(Number(price), UserModel_1.default.instance.getCoin())) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughcoin"));
                    return;
                }
                break;
        }
        //购买
        var data = {
            reward: this.cfg.content,
            cost: [type, price],
            index: this.index,
            id: this.info.id
        };
        ShopServer_1.default.buyGoods(data, this.buySuccCall, this);
    }
    buySuccCall() {
        StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOP_BUY, { goodsId: this.cfg.goodsId });
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogComRewardUI, { reward: this.cfg.content });
        this.shop.freshAllItem();
    }
    onClickItem() {
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogShopItemDetailUI, { "goods": this.info.id });
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = MainShopItemUI;
//# sourceMappingURL=MainShopItemUI.js.map
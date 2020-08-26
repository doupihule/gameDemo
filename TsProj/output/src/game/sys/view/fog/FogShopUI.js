"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const FogModel_1 = require("../../model/FogModel");
const FogFunc_1 = require("../../func/FogFunc");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const UserInfo_1 = require("../../../../framework/common/UserInfo");
const ResourceConst_1 = require("../../consts/ResourceConst");
const FogServer_1 = require("../../server/FogServer");
const UserModel_1 = require("../../model/UserModel");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const GameUtils_1 = require("../../../../utils/GameUtils");
const DataResourceFunc_1 = require("../../func/DataResourceFunc");
const StringUtils_1 = require("../../../../framework/utils/StringUtils");
const TranslateFunc_1 = require("../../../../framework/func/TranslateFunc");
const Client_1 = require("../../../../framework/common/kakura/Client");
const BigNumUtils_1 = require("../../../../framework/utils/BigNumUtils");
const FogConst_1 = require("../../consts/FogConst");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const StatisticsManager_1 = require("../../manager/StatisticsManager");
const ScreenAdapterTools_1 = require("../../../../framework/utils/ScreenAdapterTools");
const Message_1 = require("../../../../framework/common/Message");
const FogEvent_1 = require("../../event/FogEvent");
const FogPropTrigger_1 = require("../../../fog/trigger/FogPropTrigger");
const BattleFunc_1 = require("../../func/BattleFunc");
const AdVideoManager_1 = require("../../../../framework/platform/AdVideoManager");
const PlaqueConst_1 = require("../../consts/PlaqueConst");
const FogShopServer_1 = require("../../server/FogShopServer");
class FogShopUI extends layaMaxUI_1.ui.gameui.fog.FogShopUI {
    constructor() {
        super();
        this.timerCode = 0;
        this.eventId = null;
        this.goods = []; //商品数组
        this.buyCostArr = []; //购买消耗数组
        this.buyGetArr = []; //购买能获得数据
        //折扣比例
        this.reducePer = 1;
        new ButtonUtils_1.ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils_1.ButtonUtils(this.freshBtn, this.onClickRefresh, this);
        for (var i = 0; i < 6; i++) {
            new ButtonUtils_1.ButtonUtils(this["buyBtn" + i], this.onClickBuy, this, null, null, i + 1);
            new ButtonUtils_1.ButtonUtils(this["item" + i], this.onClickItem, this, null, null, i + 1);
        }
        Message_1.default.instance.add(FogEvent_1.default.FOGEVENT_REFRESH_FOGCOIN, this);
        ScreenAdapterTools_1.default.alignNotch(this.topGroup, ScreenAdapterTools_1.default.Align_MiddleTop);
    }
    setData(data) {
        this.type = null;
        this.id = null;
        this.eventId = null;
        this.refreshCount = 0;
        this.timerCode = 0;
        this.buyCostArr = [];
        this.buyGetArr = [];
        this.goods = [];
        this.reducePer = 1;
        //局内商店传参：type,eventId
        this.type = data.type;
        if (this.type == FogConst_1.default.FOG_SHOP_TYPE_OUTER) {
            //局外商店打开打点
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_SHOP_OPEN);
        }
        else if (this.type == FogConst_1.default.FOG_SHOP_TYPE_INNER) {
            FogPropTrigger_1.default.checkPropTriggerOnInstance(FogPropTrigger_1.default.Prop_type_ReduceBuyCost, this);
        }
        if (data.event) {
            this.events = data.event;
            this.cell = data.cell;
            this.eventId = this.events.eventId;
            this.eventInfo = this.events.cfgData;
            var params = this.eventInfo.params;
            this.refreshCount = params[1];
            this.id = params[0];
        }
        if (data.id) {
            this.id = data.id;
        }
        this.initTop();
        this.initGoods();
        this.refreshBtn();
        this.refreshTimer();
        BannerAdManager_1.default.addBannerQuick(this);
    }
    initTop() {
        //局外商店
        if (this.type == FogConst_1.default.FOG_SHOP_TYPE_OUTER) {
            this.titleLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_shop");
            this.topGroup.visible = true;
            this.initFogCoin();
            AdVideoManager_1.default.instance.showInterstitialAdById(PlaqueConst_1.default.Plaque_FogShop, this);
        }
        //局内商店
        else if (this.type == FogConst_1.default.FOG_SHOP_TYPE_INNER) {
            this.titleLab.text = TranslateFunc_1.default.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
            this.topGroup.visible = false;
        }
    }
    initFogCoin() {
        this.fogCoinNum.text = StringUtils_1.default.getCoinStr(UserModel_1.default.instance.getFogCoinNum() + "");
    }
    refreshTimer() {
        //局外商店
        if (this.type == FogConst_1.default.FOG_SHOP_TYPE_OUTER) {
            this.freeLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_shop_refresh_lab");
            this.freshTxt.visible = true;
            //倒计时刷新
            if (!this.timerCode) {
                this.timerCode = TimerManager_1.default.instance.add(this.refreshCountLab, this, 1000, Number.MAX_VALUE, true);
            }
        }
        //局内商店
        else if (this.type == FogConst_1.default.FOG_SHOP_TYPE_INNER) {
            this.freshTxt.visible = false;
            if (this.timerCode) {
                TimerManager_1.default.instance.remove(this.timerCode);
                this.timerCode = 0;
            }
            var counts = FogModel_1.default.instance.getShopCountsById(this.cell.mySign);
            this.freeLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_shop_refresh_lab") + counts + "/" + this.refreshCount;
        }
    }
    refreshBtn() {
        //局外商店
        if (this.type == FogConst_1.default.FOG_SHOP_TYPE_OUTER) {
            this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_OUTER_SHOP_REFRESH);
        }
        //局内商店
        else if (this.type == FogConst_1.default.FOG_SHOP_TYPE_INNER) {
            this.freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_EVENT_INNERSHOP_REFRESH);
        }
        if (this.freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
            this.freshTxt.visible = false;
            this.freshBtn.visible = false;
            if (this.timerCode) {
                TimerManager_1.default.instance.remove(this.timerCode);
                this.timerCode = 0;
            }
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            this.freshBtn.visible = true;
            if (UserInfo_1.default.isWX()) {
                this.freeImg.skin = ResourceConst_1.default.ADV_PNG;
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_SHOPREFRESH_SHOW, { "goodsId": this.id });
            }
            else {
                this.freeImg.skin = ResourceConst_1.default.SHARE_PNG;
            }
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            this.freshBtn.visible = true;
            this.freeImg.skin = ResourceConst_1.default.ADV_PNG;
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_SHOPREFRESH_SHOW, { "goodsId": this.id });
        }
    }
    refreshCountLab() {
        var leftFreshTime = UserModel_1.default.instance.getFogShopExpireTime() - Client_1.default.instance.serverTime;
        this.freshTxt.changeText(GameUtils_1.default.convertTime(leftFreshTime, 1) + TranslateFunc_1.default.instance.getTranslate("#tid_fog_shop_refresh_later_lab"));
    }
    initGoods() {
        this.goods = [];
        var goodsList = [];
        //局外商店
        if (this.type == FogConst_1.default.FOG_SHOP_TYPE_OUTER) {
            goodsList = UserModel_1.default.instance.getFogShopGoodsList();
            if (goodsList.length == 0) {
                //随机出指定个数
                goodsList = FogFunc_1.default.instance.genFogShop(this.id);
                //更新玩家数据
                FogShopServer_1.default.updateShopGoods({ "goods": goodsList });
            }
        }
        //局内商店
        else if (this.type == FogConst_1.default.FOG_SHOP_TYPE_INNER) {
            if (this.events.eventData && this.events.eventData.fogShop && Object.keys(this.events.eventData.fogShop).length != 0) {
                for (var i = 0; i < Object.keys(this.events.eventData.fogShop).length; i++) {
                    goodsList.push(this.events.eventData.fogShop[i + 1]["id"]);
                }
            }
            else {
                goodsList = FogFunc_1.default.instance.genFogShop(this.id);
                //保存事件随机出的商店列表
                FogServer_1.default.addCellEvent({ cellId: this.cell.mySign, goodsIdArr: goodsList, id: this.events.eventId }, null, null);
            }
        }
        this.goods = goodsList;
        this.initItem();
    }
    initItem() {
        this.buyCostArr = [];
        this.buyGetArr = [];
        var goodsId;
        var goodInfo;
        var content;
        var costArr;
        var costResult;
        var itemName;
        var itemIcon;
        var iconNum;
        var price;
        for (var i = 0; i < 6; i++) {
            goodsId = this.goods[i];
            goodInfo = FogFunc_1.default.instance.getGoodsInfo(goodsId);
            content = goodInfo.content[0].split(",");
            price = Math.ceil(Number(goodInfo.price) * this.reducePer);
            costArr = [goodInfo.priceType, price];
            var result = FogFunc_1.default.instance.getResourceShowInfo(content);
            itemName = result["name"];
            itemIcon = result["icon"];
            iconNum = result["num"];
            this["smallImg" + i].visible = false;
            //如果是碎片，显示
            if (Number(content[0]) == DataResourceFunc_1.DataResourceType.PIECE) {
                this["smallImg" + i].visible = true;
                this["itemImg" + i].y = 61;
            }
            else {
                this["itemImg" + i].y = 56;
            }
            //icon
            this["itemImg" + i].skin = itemIcon;
            this["itemImg" + i].scale(result["scale"], result["scale"]);
            //数量
            this["itemNum" + i].text = StringUtils_1.default.getCoinStr(iconNum);
            //name
            this["itemName" + i].text = itemName;
            //购买消耗
            costResult = DataResourceFunc_1.default.instance.getDataResourceInfo(costArr);
            this["costNum" + i].text = StringUtils_1.default.getCoinStr(costResult["num"]);
            this["costImg" + i].skin = costResult["img"];
            //判断是否已经购买过
            this.refreshBuyStatus(i);
            this.buyCostArr.push(costArr);
            this.buyGetArr.push(content);
        }
    }
    refreshBuyStatus(index) {
        var goodStatus;
        if (this.type == FogConst_1.default.FOG_SHOP_TYPE_OUTER) {
            goodStatus = UserModel_1.default.instance.getFogShopStatus(index + 1);
        }
        //局内商店
        else if (this.type == FogConst_1.default.FOG_SHOP_TYPE_INNER) {
            goodStatus = FogModel_1.default.instance.getFogShopStatus(this.cell.mySign, index + 1);
        }
        if (goodStatus) {
            this["buyBtn" + index].gray = true;
        }
        else {
            this["buyBtn" + index].gray = false;
        }
    }
    onClickRefresh() {
        var shareTvId;
        //局外商店
        if (this.type == FogConst_1.default.FOG_SHOP_TYPE_OUTER) {
            shareTvId = ShareTvOrderFunc_1.default.SHARELINE_FOG_OUTER_SHOP_REFRESH;
        }
        //局内商店
        else if (this.type == FogConst_1.default.FOG_SHOP_TYPE_INNER) {
            var counts = FogModel_1.default.instance.getShopCountsById(this.cell.mySign);
            //判断还能否刷新
            if (this.type == FogConst_1.default.FOG_SHOP_TYPE_INNER) {
                if (counts >= this.refreshCount) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_shop_refresh_countlimit"));
                    return;
                }
            }
            shareTvId = ShareTvOrderFunc_1.default.SHARELINE_FOG_EVENT_INNERSHOP_REFRESH;
        }
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_SHOPREFRESH_CLICK, { "goodsId": this.id });
        }
        ShareOrTvManager_1.default.instance.shareOrTv(shareTvId, ShareOrTvManager_1.default.TYPE_ADV, {
            id: "1",
            extraData: {}
        }, this.successfull, this.closefull, this);
    }
    successfull() {
        this.goods = [];
        var goodsList;
        //局外商店
        if (this.type == FogConst_1.default.FOG_SHOP_TYPE_OUTER) {
            //随机出指定个数
            goodsList = FogFunc_1.default.instance.genFogShop(this.id);
            //更新玩家数据
            FogShopServer_1.default.updateShopGoods({ "goods": goodsList });
        }
        //局内商店
        else if (this.type == FogConst_1.default.FOG_SHOP_TYPE_INNER) {
            //随机出指定个数
            goodsList = FogFunc_1.default.instance.genFogShop(this.id);
            //更新玩家数据
            FogServer_1.default.updateShopGoods({ cellId: this.cell.mySign, goodsIdArr: goodsList, id: this.events.eventId });
            //更新次数
            var counts = FogModel_1.default.instance.getShopCountsById(this.cell.mySign);
            this.freeLab.text = TranslateFunc_1.default.instance.getTranslate("#tid_fog_shop_refresh_lab") + counts + "/" + this.refreshCount;
        }
        this.goods = goodsList;
        //重新刷新面板数据
        this.initItem();
        this.refreshBtn();
        if (this.freeType == ShareOrTvManager_1.default.TYPE_ADV) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHOWTV_FOG_SHOPREFRESH_FINISH, { "goodsId": this.id });
        }
        else if (this.freeType == ShareOrTvManager_1.default.TYPE_SHARE) {
            StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.SHARE_FOG_SHOPREFRESH_FINISH, { "goodsId": this.id });
        }
    }
    closefull() {
    }
    onClickBuy(index) {
        //判断能否购买
        var goodStatus;
        if (this.type == FogConst_1.default.FOG_SHOP_TYPE_OUTER) {
            goodStatus = UserModel_1.default.instance.getFogShopStatus(index);
        }
        //局内商店
        else if (this.type == FogConst_1.default.FOG_SHOP_TYPE_INNER) {
            goodStatus = FogModel_1.default.instance.getFogShopStatus(this.cell.mySign, index);
        }
        if (goodStatus) {
            WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_shop_already_buy"));
            return;
        }
        //判断货币是否充足
        var costArr = this.buyCostArr[index - 1];
        switch (Number(costArr[0])) {
            case DataResourceFunc_1.DataResourceType.GOLD:
                var gold = UserModel_1.default.instance.getGold();
                if (Number(costArr[1]) > Number(gold)) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughgold"));
                    return;
                }
                break;
            case DataResourceFunc_1.DataResourceType.COIN:
                if (BigNumUtils_1.default.compare(Number(costArr[1]), UserModel_1.default.instance.getCoin())) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughcoin"));
                    return;
                }
                break;
            //零件    
            case DataResourceFunc_1.DataResourceType.COMP:
                if (Number(costArr[1]) > FogModel_1.default.instance.getCompNum()) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughcomp"));
                    return;
                }
                break;
            //迷雾币    
            case DataResourceFunc_1.DataResourceType.FOGCOIN:
                if (Number(costArr[1]) > UserModel_1.default.instance.getFogCoinNum()) {
                    WindowManager_1.default.ShowTip(TranslateFunc_1.default.instance.getTranslate("#tid_fog_noenoughfogcoin"));
                    return;
                }
                break;
        }
        //购买
        //局外商店
        if (this.type == FogConst_1.default.FOG_SHOP_TYPE_OUTER) {
            FogShopServer_1.default.buyGoods({ "index": index, "cost": this.buyCostArr[index - 1], "buyGet": [this.buyGetArr[index - 1]] }, () => {
                this.refreshBuyStatus(index - 1);
                //局外商店购买打点
                StatisticsManager_1.default.ins.onEvent(StatisticsManager_1.default.FOG_SHOP_BUY, { "goodsId": this.goods[index - 1] });
            }, this);
        }
        //局内商店
        else if (this.type == FogConst_1.default.FOG_SHOP_TYPE_INNER) {
            FogServer_1.default.buyGoods({ "cellId": this.cell.mySign, "index": index, "cost": this.buyCostArr[index - 1], "buyGet": [this.buyGetArr[index - 1]] }, () => {
                this.refreshBuyStatus(index - 1);
            }, this);
            //保存FogReward数据
            FogServer_1.default.saveFogReward({ "reward": [this.buyGetArr[index - 1]] });
        }
        //飘奖励
        var tempPos = BattleFunc_1.default.tempClickPoint;
        tempPos.x = this["buyBtn" + (index - 1)].x;
        tempPos.y = this["buyBtn" + (index - 1)].y;
        var fromPos = this["buyBtn" + (index - 1)].localToGlobal(tempPos, false, this);
        FogFunc_1.default.instance.flyResTween([this.buyGetArr[index - 1]], fromPos.x, fromPos.y, this);
    }
    onClickItem(index) {
        var goods = this.goods[index - 1];
        WindowManager_1.default.OpenUI(WindowCfgs_1.WindowCfgs.FogShopItemDetailUI, { "goods": goods });
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogShopUI);
        TimerManager_1.default.instance.remove(this.timerCode);
        this.timerCode = 0;
    }
    recvMsg(cmd, data) {
        switch (cmd) {
            case FogEvent_1.default.FOGEVENT_REFRESH_FOGCOIN:
                if (this['windowName'] == WindowManager_1.default.getCurrentWindowName() && this.type == FogConst_1.default.FOG_SHOP_TYPE_OUTER) {
                    this.initFogCoin();
                }
                break;
        }
    }
}
exports.default = FogShopUI;
//# sourceMappingURL=FogShopUI.js.map
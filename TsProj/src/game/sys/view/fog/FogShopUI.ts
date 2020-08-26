import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import FogModel from "../../model/FogModel";
import FogFunc from "../../func/FogFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import UserInfo from "../../../../framework/common/UserInfo";
import ResourceConst from "../../consts/ResourceConst";
import LogsManager from "../../../../framework/manager/LogsManager";
import FogServer from "../../server/FogServer";
import UserModel from "../../model/UserModel";
import TimerManager from "../../../../framework/manager/TimerManager";
import GameUtils from "../../../../utils/GameUtils";
import DataResourceFunc, { DataResourceType } from "../../func/DataResourceFunc";
import StringUtils from "../../../../framework/utils/StringUtils";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import Client from "../../../../framework/common/kakura/Client";
import BigNumUtils from "../../../../framework/utils/BigNumUtils";
import FogConst from "../../consts/FogConst";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import FogEventData from "../../../fog/data/FogEventData";
import FogInstanceCell from "../../../fog/instance/FogInstanceCell";
import StatisticsManager from "../../manager/StatisticsManager";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import Message from "../../../../framework/common/Message";
import FogEvent from "../../event/FogEvent";
import FogPropTrigger from "../../../fog/trigger/FogPropTrigger";
import BattleFunc from "../../func/BattleFunc";
import AdVideoManager from "../../../../framework/platform/AdVideoManager";
import PlaqueConst from "../../consts/PlaqueConst";
import FogShopServer from "../../server/FogShopServer";


export default class FogShopUI extends ui.gameui.fog.FogShopUI implements IMessage {

    private type;//商店类型
    private id;//商店id
    private refreshCount;//局内商店刷新次数
    private freeType;
    private timerCode = 0;
    private eventId = null;


    private goods = [];//商品数组
    private buyCostArr = [];//购买消耗数组
    private buyGetArr = [];//购买能获得数据
    private eventInfo;
    //折扣比例
    public reducePer = 1;

    //格子事件
    private events: FogEventData
    //格子
    private cell: FogInstanceCell;

    constructor() {
        super();
        new ButtonUtils(this.closeBtn, this.close, this);
        new ButtonUtils(this.freshBtn, this.onClickRefresh, this);

        for (var i = 0; i < 6; i++) {
            new ButtonUtils(this["buyBtn" + i], this.onClickBuy, this, null, null, i + 1);
            new ButtonUtils(this["item" + i], this.onClickItem, this,  null, null, i + 1);
        }

        Message.instance.add(FogEvent.FOGEVENT_REFRESH_FOGCOIN, this);
        ScreenAdapterTools.alignNotch(this.topGroup, ScreenAdapterTools.Align_MiddleTop);
    }

    public setData(data) {
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

        if (this.type == FogConst.FOG_SHOP_TYPE_OUTER) {
            //局外商店打开打点
            StatisticsManager.ins.onEvent(StatisticsManager.FOG_SHOP_OPEN);
        } else if (this.type == FogConst.FOG_SHOP_TYPE_INNER) {
            FogPropTrigger.checkPropTriggerOnInstance(FogPropTrigger.Prop_type_ReduceBuyCost, this);
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

        BannerAdManager.addBannerQuick(this);

    }
    initTop() {
        //局外商店
        if (this.type == FogConst.FOG_SHOP_TYPE_OUTER) {
            this.titleLab.text = TranslateFunc.instance.getTranslate("#tid_fog_shop");
            this.topGroup.visible = true;
            this.initFogCoin();
            AdVideoManager.instance.showInterstitialAdById(PlaqueConst.Plaque_FogShop, this);
        }
        //局内商店
        else if (this.type == FogConst.FOG_SHOP_TYPE_INNER) {
            this.titleLab.text = TranslateFunc.instance.getTranslate(this.eventInfo.name, "TranslateEvent");
            this.topGroup.visible = false;
        }
    }
    initFogCoin() {
        this.fogCoinNum.text = StringUtils.getCoinStr(UserModel.instance.getFogCoinNum() + "");
    }
    refreshTimer() {
        //局外商店
        if (this.type == FogConst.FOG_SHOP_TYPE_OUTER) {
            this.freeLab.text = TranslateFunc.instance.getTranslate("#tid_fog_shop_refresh_lab");
            this.freshTxt.visible = true;
            //倒计时刷新
            if (!this.timerCode) {
                this.timerCode = TimerManager.instance.add(this.refreshCountLab, this, 1000, Number.MAX_VALUE, true);
            }
        }
        //局内商店
        else if (this.type == FogConst.FOG_SHOP_TYPE_INNER) {
            this.freshTxt.visible = false;
            if (this.timerCode) {
                TimerManager.instance.remove(this.timerCode);
                this.timerCode = 0;
            }
            var counts = FogModel.instance.getShopCountsById(this.cell.mySign);
            this.freeLab.text = TranslateFunc.instance.getTranslate("#tid_fog_shop_refresh_lab") + counts + "/" + this.refreshCount;
        }

    }
    refreshBtn() {
        //局外商店
        if (this.type == FogConst.FOG_SHOP_TYPE_OUTER) {
            this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_OUTER_SHOP_REFRESH);
        }
        //局内商店
        else if (this.type == FogConst.FOG_SHOP_TYPE_INNER) {
            this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_EVENT_INNERSHOP_REFRESH);
        }

        if (this.freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
            this.freshTxt.visible = false;
            this.freshBtn.visible = false;
            if (this.timerCode) {
                TimerManager.instance.remove(this.timerCode);
                this.timerCode = 0;
            }
        } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
            this.freshBtn.visible = true;
            if (UserInfo.isWX()) {
                this.freeImg.skin = ResourceConst.ADV_PNG;
                StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_SHOPREFRESH_SHOW, { "goodsId": this.id });
            } else {
                this.freeImg.skin = ResourceConst.SHARE_PNG;
            }
        } else if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            this.freshBtn.visible = true;
            this.freeImg.skin = ResourceConst.ADV_PNG;
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_SHOPREFRESH_SHOW, { "goodsId": this.id });
        }
    }
    refreshCountLab() {
        var leftFreshTime = UserModel.instance.getFogShopExpireTime() - Client.instance.serverTime;
        this.freshTxt.changeText(GameUtils.convertTime(leftFreshTime, 1) + TranslateFunc.instance.getTranslate("#tid_fog_shop_refresh_later_lab"));
    }
    initGoods() {
        this.goods = [];
        var goodsList = [];
        //局外商店
        if (this.type == FogConst.FOG_SHOP_TYPE_OUTER) {
            goodsList = UserModel.instance.getFogShopGoodsList();
            if (goodsList.length == 0) {
                //随机出指定个数
                goodsList = FogFunc.instance.genFogShop(this.id);
                //更新玩家数据
                FogShopServer.updateShopGoods({ "goods": goodsList });
            }

        }
        //局内商店
        else if (this.type == FogConst.FOG_SHOP_TYPE_INNER) {
            if (this.events.eventData && this.events.eventData.fogShop && Object.keys(this.events.eventData.fogShop).length != 0) {
                for (var i = 0; i < Object.keys(this.events.eventData.fogShop).length; i++) {
                    goodsList.push(this.events.eventData.fogShop[i + 1]["id"]);
                }

            } else {
                goodsList = FogFunc.instance.genFogShop(this.id);
                //保存事件随机出的商店列表
                FogServer.addCellEvent({ cellId: this.cell.mySign, goodsIdArr: goodsList, id: this.events.eventId }, null, null);
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
            goodInfo = FogFunc.instance.getGoodsInfo(goodsId);
            content = goodInfo.content[0].split(",");
            price = Math.ceil(Number(goodInfo.price) * this.reducePer);
            costArr = [goodInfo.priceType, price];

            var result = FogFunc.instance.getResourceShowInfo(content);
            itemName = result["name"];
            itemIcon = result["icon"];
            iconNum = result["num"];

            this["smallImg" + i].visible = false;

            //如果是碎片，显示
            if (Number(content[0]) == DataResourceType.PIECE) {
                this["smallImg" + i].visible = true;
                this["itemImg" + i].y = 61;
            }else{
                this["itemImg" + i].y = 56;
            }

            //icon
            this["itemImg" + i].skin = itemIcon;
            this["itemImg" + i].scale(result["scale"], result["scale"]);

            //数量
            this["itemNum" + i].text = StringUtils.getCoinStr(iconNum);
            //name
            this["itemName" + i].text = itemName;
            //购买消耗
            costResult = DataResourceFunc.instance.getDataResourceInfo(costArr);
            this["costNum" + i].text = StringUtils.getCoinStr(costResult["num"]);
            this["costImg" + i].skin = costResult["img"];


            //判断是否已经购买过
            this.refreshBuyStatus(i);
            this.buyCostArr.push(costArr);

            this.buyGetArr.push(content);
        }
    }
    refreshBuyStatus(index) {
        var goodStatus;
        if (this.type == FogConst.FOG_SHOP_TYPE_OUTER) {
            goodStatus = UserModel.instance.getFogShopStatus(index + 1);
        }
        //局内商店
        else if (this.type == FogConst.FOG_SHOP_TYPE_INNER) {
            goodStatus = FogModel.instance.getFogShopStatus(this.cell.mySign, index + 1);
        }

        if (goodStatus) {
            this["buyBtn" + index].gray = true;
        } else {
            this["buyBtn" + index].gray = false;
        }
    }
    onClickRefresh() {
        var shareTvId;
        //局外商店
        if (this.type == FogConst.FOG_SHOP_TYPE_OUTER) {
            shareTvId = ShareTvOrderFunc.SHARELINE_FOG_OUTER_SHOP_REFRESH;
        }
        //局内商店
        else if (this.type == FogConst.FOG_SHOP_TYPE_INNER) {
            var counts = FogModel.instance.getShopCountsById(this.cell.mySign);
            //判断还能否刷新
            if (this.type == FogConst.FOG_SHOP_TYPE_INNER) {
                if (counts >= this.refreshCount) {
                    WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_shop_refresh_countlimit"));
                    return;
                }
            }
            shareTvId = ShareTvOrderFunc.SHARELINE_FOG_EVENT_INNERSHOP_REFRESH;
        }

        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_SHOPREFRESH_CLICK, { "goodsId": this.id });
        }
        ShareOrTvManager.instance.shareOrTv(shareTvId, ShareOrTvManager.TYPE_ADV,
            {
                id: "1",
                extraData: {}
            },
            this.successfull, this.closefull, this);
    }
    successfull() {
        this.goods = [];
        var goodsList;
        //局外商店
        if (this.type == FogConst.FOG_SHOP_TYPE_OUTER) {
            //随机出指定个数
            goodsList = FogFunc.instance.genFogShop(this.id);
            //更新玩家数据
            FogShopServer.updateShopGoods({ "goods": goodsList });
        }
        //局内商店
        else if (this.type == FogConst.FOG_SHOP_TYPE_INNER) {
            //随机出指定个数
            goodsList = FogFunc.instance.genFogShop(this.id);
            //更新玩家数据
            FogServer.updateShopGoods({ cellId: this.cell.mySign, goodsIdArr: goodsList, id: this.events.eventId });
            //更新次数
            var counts = FogModel.instance.getShopCountsById(this.cell.mySign);
            this.freeLab.text = TranslateFunc.instance.getTranslate("#tid_fog_shop_refresh_lab") + counts + "/" + this.refreshCount;
        }
        this.goods = goodsList;

        //重新刷新面板数据
        this.initItem();
        this.refreshBtn();

        if (this.freeType == ShareOrTvManager.TYPE_ADV) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHOWTV_FOG_SHOPREFRESH_FINISH, { "goodsId": this.id });
        } else if (this.freeType == ShareOrTvManager.TYPE_SHARE) {
            StatisticsManager.ins.onEvent(StatisticsManager.SHARE_FOG_SHOPREFRESH_FINISH, { "goodsId": this.id });
        }


    }
    closefull() {

    }
    onClickBuy(index) {
        //判断能否购买
        var goodStatus;
        if (this.type == FogConst.FOG_SHOP_TYPE_OUTER) {
            goodStatus = UserModel.instance.getFogShopStatus(index);
        }
        //局内商店
        else if (this.type == FogConst.FOG_SHOP_TYPE_INNER) {
            goodStatus = FogModel.instance.getFogShopStatus(this.cell.mySign, index);
        }

        if (goodStatus) {
            WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_shop_already_buy"));
            return;
        }

        //判断货币是否充足
        var costArr = this.buyCostArr[index - 1];
        switch (Number(costArr[0])) {
            case DataResourceType.GOLD:
                var gold = UserModel.instance.getGold();
                if (Number(costArr[1]) > Number(gold)) {
                    WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughgold"));
                    return;
                }
                break;
            case DataResourceType.COIN:
                if (BigNumUtils.compare(Number(costArr[1]), UserModel.instance.getCoin())) {
                    WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughcoin"));
                    return;
                }
                break;
            //零件    
            case DataResourceType.COMP:
                if (Number(costArr[1]) > FogModel.instance.getCompNum()) {
                    WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughcomp"));
                    return;
                }
                break;
            //迷雾币    
            case DataResourceType.FOGCOIN:
                if (Number(costArr[1]) > UserModel.instance.getFogCoinNum()) {
                    WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_noenoughfogcoin"));
                    return;
                }
                break;
        }
        //购买
        //局外商店
        if (this.type == FogConst.FOG_SHOP_TYPE_OUTER) {
            FogShopServer.buyGoods({ "index": index, "cost": this.buyCostArr[index - 1], "buyGet": [this.buyGetArr[index - 1]] }, () => {
                this.refreshBuyStatus(index - 1);
                //局外商店购买打点
                StatisticsManager.ins.onEvent(StatisticsManager.FOG_SHOP_BUY, { "goodsId": this.goods[index - 1] });
            }, this);
        }
        //局内商店
        else if (this.type == FogConst.FOG_SHOP_TYPE_INNER) {
            FogServer.buyGoods({ "cellId": this.cell.mySign, "index": index, "cost": this.buyCostArr[index - 1], "buyGet": [this.buyGetArr[index - 1]] }, () => {
                this.refreshBuyStatus(index - 1);
            }, this);
            //保存FogReward数据
            FogServer.saveFogReward({ "reward": [this.buyGetArr[index - 1]] });
        }
        //飘奖励
        var tempPos = BattleFunc.tempClickPoint;
        tempPos.x = this["buyBtn" + (index - 1)].x;
        tempPos.y = this["buyBtn" + (index - 1)].y;
        var fromPos = this["buyBtn" + (index - 1)].localToGlobal(tempPos, false, this);
        FogFunc.instance.flyResTween([this.buyGetArr[index - 1]], fromPos.x, fromPos.y, this);

    }
    onClickItem(index){
        var goods = this.goods[index - 1];
        WindowManager.OpenUI(WindowCfgs.FogShopItemDetailUI, {"goods":  goods});
    }
    close() {
        WindowManager.CloseUI(WindowCfgs.FogShopUI);
        TimerManager.instance.remove(this.timerCode);
        this.timerCode = 0;
    }

    recvMsg(cmd: string, data: any): void {
        switch (cmd) {
            case FogEvent.FOGEVENT_REFRESH_FOGCOIN:
                if (this['windowName'] == WindowManager.getCurrentWindowName() && this.type == FogConst.FOG_SHOP_TYPE_OUTER) {
                    this.initFogCoin();
                }
                break;
        }
    }
}
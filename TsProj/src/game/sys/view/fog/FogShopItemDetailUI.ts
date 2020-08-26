import { ui } from "../../../../ui/layaMaxUI";
import IMessage from "../../interfaces/IMessage";
import { ButtonUtils } from "../../../../framework/utils/ButtonUtils";
import WindowManager from "../../../../framework/manager/WindowManager";
import { WindowCfgs } from "../../consts/WindowCfgs";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import FogFunc from "../../func/FogFunc";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import FogPropTrigger from "../../../fog/trigger/FogPropTrigger";


export default class FogShopItemDetailUI extends ui.gameui.fog.FogShopItemDetailUI implements IMessage {

    private goods;
  
    constructor() {
        super();
        new ButtonUtils(this.closeBtn, this.onClickClose, this);
    }

    setData(data) {
        this.goods = data.goods;

        var goodsInfo = FogFunc.instance.getGoodsInfo(this.goods);
        var desc = goodsInfo.desc;

        var content = goodsInfo.content[0].split(",");
        var result = FogFunc.instance.getResourceShowInfo(content);
       

        //道具名字、数量
        this.itemName.text = result["name"] + "   X" + result["num"];

        //道具描述
        this.itemDesc.text = TranslateFunc.instance.getTranslate(desc, "TranslateGoods");

    }

    onClickClose() {
        WindowManager.CloseUI(WindowCfgs.FogShopItemDetailUI);
    }
    
    
    recvMsg(cmd: string, data: any): void {
        switch (cmd) {

        }
    }
}
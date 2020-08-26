import BaseModel from "./BaseModel";
import GlobalParamsFunc from "../func/GlobalParamsFunc";

import CountsModel from "./CountsModel";
import ShareOrTvManager from "../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../func/ShareTvOrderFunc";

export default class TurnableModel extends BaseModel {

    public constructor() {
        super();
    }

    //单例
    private static _instance: TurnableModel;
    static get instance() {
        if (!this._instance) {
            this._instance = new TurnableModel();
        }
        return this._instance;
    }
    //初始化数据
    initData(d: any) {
        super.initData(d);
    }
    //更新数据
    updateData(d: any) {
        super.updateData(d);
    }
    //删除数据
    deleteData(d: any) {
        super.deleteData(d);
    }

    //判断是否弹出转盘界面
    checkTurnable() {
        //判断是否有免费次数
        var maxFreeCount = GlobalParamsFunc.instance.getDataNum("luckyPlateFreeNub");
        var nowCount = CountsModel.instance.getCountsById(CountsModel.freeTurnableCount);
        if (nowCount < maxFreeCount) {
            return true;
        }

        //判断是否有视频或者分享
        var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_TURNABLE);
        if (freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
            return false;
        }

        return true;
    }
}

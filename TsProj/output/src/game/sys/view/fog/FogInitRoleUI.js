"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layaMaxUI_1 = require("../../../../ui/layaMaxUI");
const ButtonUtils_1 = require("../../../../framework/utils/ButtonUtils");
const WindowManager_1 = require("../../../../framework/manager/WindowManager");
const WindowCfgs_1 = require("../../consts/WindowCfgs");
const RolesModel_1 = require("../../model/RolesModel");
const GameUtils_1 = require("../../../../utils/GameUtils");
const BattleFunc_1 = require("../../func/BattleFunc");
const LoadManager_1 = require("../../../../framework/manager/LoadManager");
const GlobalParamsFunc_1 = require("../../func/GlobalParamsFunc");
const FogRoleItemUI_1 = require("./FogRoleItemUI");
const TimerManager_1 = require("../../../../framework/manager/TimerManager");
const FogServer_1 = require("../../server/FogServer");
const ShareTvOrderFunc_1 = require("../../func/ShareTvOrderFunc");
const ShareOrTvManager_1 = require("../../../../framework/manager/ShareOrTvManager");
const BannerAdManager_1 = require("../../../../framework/manager/BannerAdManager");
const FogFunc_1 = require("../../func/FogFunc");
const Message_1 = require("../../../../framework/common/Message");
const FogEvent_1 = require("../../event/FogEvent");
const GuideConst_1 = require("../../consts/GuideConst");
/**迷雾街区初始化角色界面 */
class FogInitRoleUI extends layaMaxUI_1.ui.gameui.fog.FogInitRoleUI {
    constructor() {
        super();
        this.roleList = [];
        this.roleIdList = [];
        this.timeCode = 0;
        this.isVideoGet = false;
        this.initBtn();
    }
    initBtn() {
        new ButtonUtils_1.ButtonUtils(this.confirmBtn, this.onClickConfirm, this);
    }
    //初始化
    setData() {
        this.roleList = [];
        this.roleIdList = [];
        this.isVideoGet = false;
        this.initRoleList();
        BannerAdManager_1.default.addBannerQuick(this);
    }
    initRoleList() {
        //从玩家所有已解锁角色中，随机2个作为初始角色；看视频，可随机获得第3个初始角色
        var allRole = RolesModel_1.default.instance.getRolesList();
        var roleList = FogFunc_1.default.instance.initFogRoles();
        for (var i = 0; i < roleList.length; i++) {
            if (allRole.hasOwnProperty(roleList[i])) {
                var cfg = BattleFunc_1.default.instance.getCfgDatas("Role", roleList[i]);
                this.roleList.push(cfg);
                this.roleIdList.push(roleList[i]);
            }
        }
        var res = WindowManager_1.default.getUILoadGroup(WindowCfgs_1.WindowCfgs.FogRoleItemUI) || [];
        var resAll = [];
        for (var url of res) {
            resAll.push(url);
        }
        LoadManager_1.LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initRoleBack));
    }
    initRoleBack() {
        this.lineGroup.removeChildren();
        var isShowVideo;
        var isShowItem = true;
        for (var i = 0; i < this.roleList.length; i++) {
            var item = null;
            if (this.roleList[i]) {
                item = this.roleList[i];
            }
            var freeType = ShareOrTvManager_1.default.instance.getShareOrTvType(ShareTvOrderFunc_1.default.SHARELINE_FOG_START_ADDROLE);
            if (i <= 1) {
                isShowVideo = false;
            }
            else {
                if (freeType == ShareOrTvManager_1.default.TYPE_QUICKRECEIVE) {
                    isShowItem = false;
                }
                else {
                    isShowVideo = true;
                }
            }
            var roleItem = new FogRoleItemUI_1.default(item, this, isShowVideo, isShowItem);
            this.lineGroup.addChild(roleItem);
            roleItem.x = i % 3 * roleItem.itemWidth;
            roleItem.y = Math.floor(i / 3) * roleItem.itemHeight;
        }
        this.timeCode = TimerManager_1.default.instance.add(this.freshSpeak, this, GlobalParamsFunc_1.default.instance.getDataNum("arraySpeakInterval"));
        this.freshSpeak();
        //保存初始角色数据
        var roleIdList = this.roleIdList;
        if (this.roleIdList.length > 2) {
            roleIdList = this.roleIdList.slice(0, this.roleIdList.length - 1);
        }
        //保存初始阵容数据
        FogServer_1.default.setInline({ "line": roleIdList });
    }
    freshSpeak() {
        var index = this.lineGroup.numChildren > 2 ? 2 : 1;
        if (this.lineGroup.numChildren > 0) {
            this.leftSpeak.visible = false;
            this.rightSpeak.visible = false;
            for (var i = 0; i < this.lineGroup.numChildren - 1; i++) {
                var cur = this.lineGroup.getChildAt(i);
                cur.insSpeak = false;
            }
            var randomIndex = GameUtils_1.default.getRandomInt(0, this.roleList.length - index);
            var item = this.lineGroup.getChildAt(randomIndex);
            item.freshSpeak(randomIndex, this.leftSpeak, this.rightSpeak, this.leftTxt, this.rightTxt);
        }
    }
    //点击确定，则关闭界面，进入玩法主界面
    onClickConfirm() {
        //保存视频上阵的角色
        var roleIdList = this.roleIdList;
        if (!this.isVideoGet && this.roleIdList.length > 2) {
            roleIdList = this.roleIdList.slice(0, this.roleIdList.length - 1);
        }
        if (this.isVideoGet && this.roleIdList.length > 2) {
            roleIdList = this.roleIdList[this.roleIdList.length - 1];
            FogServer_1.default.setInline({ "line": roleIdList }, () => { }, this);
        }
        this.close();
    }
    close() {
        WindowManager_1.default.CloseUI(WindowCfgs_1.WindowCfgs.FogInitRoleUI);
        Message_1.default.instance.send(FogEvent_1.default.FOGEVENT_REFRESH_GUIDE, GuideConst_1.default.GUIDE_6_601);
    }
    clear() {
    }
    dispose() {
    }
    recvMsg(cmd, data) {
        switch (cmd) {
        }
    }
}
exports.default = FogInitRoleUI;
//# sourceMappingURL=FogInitRoleUI.js.map
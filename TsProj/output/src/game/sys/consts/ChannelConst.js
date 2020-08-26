"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogsManager_1 = require("../../../framework/manager/LogsManager");
/**
 * 渠道参数类
 *
 * 新渠道接入需要填写对应参数
 */
class ChannelConst {
    static getChannelConst(platformId) {
        if (!this[platformId]) {
            LogsManager_1.default.errorTag('errorChannelId', 'errorChannelId:' + platformId);
            return {};
        }
        return this[platformId];
    }
}
exports.default = ChannelConst;
ChannelConst.web = {};
ChannelConst.wxgame = {
    adVideoId: 'adunit-8d1631776e7b6007',
    adBannerId: 'adunit-95eefbc9b5fec03d',
    adInterstitialId: 'adunit-200fe04ceb951ff6',
    recommendBannerId: 'PBgAAc_gXjntOKNM',
    recommendPortalId: 'PBgAAc_gXjngbFsw',
};
ChannelConst.tt = {
    adVideoId: 'e2ksbm0389ikg6eeaj',
    adBannerId: '1d50c111ikkb8545am',
    adInterstitialId: "127d9d79397af288r6",
};
ChannelConst.qqgame = {
    adVideoId: '',
    adBannerId: '',
    adInterstitialId: '',
};
ChannelConst.oppogame = {
    appId: '',
    adVideoId: '',
    adBannerId: '',
    adInterstitialId: '',
    adOriginalId: '',
};
ChannelConst.baidugame = {
    appSid: 'bd493d8b',
    adVideoId: '6758440',
    adBannerId: '6758441',
};
//安卓官网
ChannelConst.android_master = {
    appSid: '5077647',
    adVideoId: "945240746",
    adBannerId: "945240734",
    adFullVideoId: "945240737",
};
// 穿山甲配置  如果要改回穿山甲 把_tt去掉即可
ChannelConst.ios_master_tt = {
    appSid: '5068269',
    adVideoId: "945194626",
    adBannerId: "945194640",
    adFullVideoId: "945240444",
};
//广点通配置
ChannelConst.ios_master = {
    appSid: '1110681268',
    adVideoId: "5041113969865480",
    adBannerId: "",
    adFullVideoId: "7061715989785483",
    actionId: "1110605017",
    actionSecret: "5af02f596deff76e6859354f5ad792c2",
};
//# sourceMappingURL=ChannelConst.js.map
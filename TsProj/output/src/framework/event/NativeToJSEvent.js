"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NativeToJSEvent {
}
exports.default = NativeToJSEvent;
NativeToJSEvent.CALL_JSLOGS = "CALL_JSLOGS";
//穿山甲sdk   参数 {status:1成功 ,2取消, 3加载失败  4,onAdShow  5,关闭广告 , 6.获取广告cpm和level   ,11广告包安装完成, 12广告包下载完成,13 广告包下载失败 ,14用户点击了广告 }
NativeToJSEvent.TTSDK_AD_EVENT = "TTSDK_AD_EVENT";
//穿山甲 banner 事件   参数: status: 1banner加载成功 2banner加载失败,   3banner渲染失败   4banner显示成功   11.点击banner 
NativeToJSEvent.TTSDK_BANNER_EVENT = "TTSDK_BANNER_EVENT";
//系统信息 {model:"mi10",toolBarHeight:0(非0表示刘海设备),...}
NativeToJSEvent.SYSTEM_INFO_EVENT = "SYSTEM_INFO_EVENT";
//内购返回  参数 {status:1成功 ,2取消, 3验证失败 ,data}
NativeToJSEvent.NATIVE_INAPP_PURCHASE_BACK = "NATIVE_INAPP_PURCHASE_BACK";
//# sourceMappingURL=NativeToJSEvent.js.map
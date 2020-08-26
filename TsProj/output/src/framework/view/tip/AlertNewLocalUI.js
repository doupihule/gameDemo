"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScreenAdapterTools_1 = require("../../utils/ScreenAdapterTools");
const TableUtils_1 = require("../../utils/TableUtils");
const Global_1 = require("../../../utils/Global");
const WindowManager_1 = require("../../manager/WindowManager");
const LogsManager_1 = require("../../manager/LogsManager");
const PoolTools_1 = require("../../utils/PoolTools");
class AlertNewLocalUI extends Laya.View {
    constructor() {
        super();
        this._callback = null;
        this._thisObj = null;
        this.bgCover = null; //底板透明黑遮罩
        this.contentBg = null; //弹窗底
        this.titleLab = null; //弹窗标题
        this.msgLab = null; //内容
        this.sureBtn = null; //确认按钮底
        this.sureLab = null; //确认按钮文本
        this.cancleBtn = null; //取消按钮
        this.cancleLab = null; //取消按钮文本
        //按钮中心位置
        this.btncenterX = 0;
        //按钮偏移
        this.btnOffset = 120;
        this._sureRt = { confirm: true };
        this._cancleRt = { cancel: true };
        this._cacheDataArr = [];
        this.mouseEnabled = true;
        this.checkInit();
        this.width = ScreenAdapterTools_1.default.width;
        this.height = ScreenAdapterTools_1.default.height;
        // new ButtonUtils(this.sureBtn,this.touchHandler,this,"common/common_btn_btn1.png","common/common_btn_btn1_1.png");
        // new ButtonUtils(this.reConnectBtn,this.reConnect,this,"common/common_btn_btn2.png","common/common_btn_btn2_1.png");
    }
    static get instance() {
        if (!this._instance) {
            this._instance = new AlertNewLocalUI();
        }
        return this._instance;
    }
    ;
    checkInit() {
        var stageWidth = ScreenAdapterTools_1.default.width;
        var stageHeight = ScreenAdapterTools_1.default.height;
        var contentBgWidth = 566;
        var contentBgHeight = 286;
        var contentBgX = (stageWidth - contentBgWidth) / 2;
        var contentBgY = (stageHeight - contentBgHeight) / 2;
        if (this.bgCover == null) {
            this.bgCover = new Laya.Sprite();
            var path = [
                ["moveTo", 0, 0],
                ["lineTo", stageWidth, 0],
                ["lineTo", stageWidth, stageHeight],
                ["lineTo", 0, stageHeight],
                ["closePath"] //闭合路径
            ];
            //绘制矩形
            this.bgCover.graphics.drawPath(0, 0, path, { fillStyle: "#000000" });
            this.bgCover.alpha = 0.5;
            this.addChild(this.bgCover);
            // this.bgCover.on(Laya.Event.CLICK, this, (e: Laya.Event) => {
            //     e.stopPropagation();
            // })
        }
        if (this.contentBg == null) {
            var splitY = 70;
            this.contentBg = new Laya.Sprite();
            var path = [
                ["moveTo", 0, 0],
                ["lineTo", contentBgWidth, 0],
                ["lineTo", contentBgWidth, 70],
                ["lineTo", 0, 70],
                ["closePath"],
                ["moveTo", 0, 70],
                ["lineTo", contentBgWidth, 70],
                ["lineTo", contentBgWidth, contentBgHeight],
                ["lineTo", 0, contentBgHeight],
                ["closePath"]
            ];
            //绘制矩形
            this.contentBg.graphics.drawPath(contentBgX, contentBgY, path, { fillStyle: "#111a1b" }, { "strokeStyle": "#202f30", "lineWidth": "3" });
            this.addChild(this.contentBg);
        }
        if (this.titleLab == null) {
            this.titleLab = new Laya.Text();
            this.titleLab.x = contentBgX;
            this.titleLab.y = contentBgY + 15;
            this.titleLab.width = contentBgWidth;
            this.titleLab.height = 45;
            this.titleLab.fontSize = 45;
            this.titleLab.color = "#b8fff7";
            this.titleLab.align = "center";
            this.titleLab.text = "提示";
            this.addChild(this.titleLab);
        }
        if (this.msgLab == null) {
            this.msgLab = new Laya.Text();
            this.msgLab.x = contentBgX + 50;
            this.msgLab.y = contentBgY + 75;
            this.msgLab.width = contentBgWidth - 100;
            this.msgLab.height = 130;
            this.msgLab.fontSize = 24;
            this.msgLab.color = "#ffffff";
            this.msgLab.align = "center";
            this.msgLab.valign = "middle";
            this.msgLab.wordWrap = true;
            this.msgLab.leading = 10;
            this.addChild(this.msgLab);
        }
        this.btncenterX = contentBgX + 200;
        if (this.sureBtn == null) {
            this.sureBtn = this.createBtn("确定", this.onSureBtn, this, this.btncenterX, contentBgY + 206);
        }
        if (this.cancleBtn == null) {
            this.cancleBtn = this.createBtn("取消", this.onCancleBtn, this, this.btncenterX + this.btnOffset, contentBgY + 206);
        }
    }
    //点击确认按钮
    onSureBtn() {
        this.touchHandler(1);
    }
    onCancleBtn() {
        LogsManager_1.default.echo("____onCancleBtn");
        this.touchHandler(2);
        // this.close();
    }
    createBtn(str, func, thisObj, x, y) {
        var sp = new Laya.Sprite();
        sp = new Laya.Sprite();
        sp.width = 166;
        sp.height = 50;
        var path = [
            ["moveTo", 0, 0],
            ["lineTo", 166, 0],
            ["lineTo", 166, 50],
            ["lineTo", 0, 50],
            ["closePath"]
        ];
        //绘制矩形
        sp.graphics.drawPath(0, 0, path, { fillStyle: "#111a1b" }, { "strokeStyle": "#202f30", "lineWidth": "2" });
        sp.x = x;
        sp.y = y;
        this.addChild(sp);
        if (func) {
            sp.on(Laya.Event.CLICK, thisObj, func);
        }
        var label;
        label = new Laya.Text();
        label.x = 0;
        label.y = 10;
        label.width = 166;
        label.height = 30;
        label.fontSize = 30;
        label.color = "#e1fcf5";
        label.align = "center";
        label.valign = "middle";
        label.text = str;
        sp.addChild(label);
        return sp;
    }
    setData(data) {
        WindowManager_1.default.highLayer.mouseEnabled = true;
        //把数据插入缓存
        this._cacheDataArr.push(data);
        this._callback = data.callBack;
        this._thisObj = data.thisObj;
        if (data.msg) {
            this.msgLab.text = data.msg;
        }
        //如果是有取消的
        if (data.type == 2) {
            this.sureBtn.visible = true;
            this.cancleBtn.visible = true;
            this.sureBtn.x = this.btncenterX - this.btnOffset;
            this.cancleBtn.x = this.btncenterX + this.btnOffset;
        }
        else {
            this.sureBtn.visible = true;
            this.cancleBtn.visible = false;
            this.sureBtn.x = this.btncenterX;
        }
        this.visible = true;
    }
    //type 1是确认 2是取消
    touchHandler(type = 1) {
        this.close();
        LogsManager_1.default.echo("____ontouchHandler,", this._cacheDataArr);
        var copyArr = TableUtils_1.default.copyOneArr(this._cacheDataArr);
        this._cacheDataArr = [];
        for (var i = 0; i < copyArr.length; i++) {
            var data = copyArr[i];
            if (data) {
                if (Global_1.default.isGameDestory) {
                    return;
                }
                var callBack;
                var rt;
                if (type == 2) {
                    callBack = data.closeBack;
                    rt = this._cancleRt;
                }
                else {
                    callBack = data.callBack;
                    rt = this._sureRt;
                }
                var thisObj = data.thisObj;
                if (callBack) {
                    callBack.call(thisObj, rt);
                }
            }
        }
    }
    close() {
        // this.mouseEnabled =false;
        this.removeSelf();
        if (WindowManager_1.default.highLayer.numChildren == 0) {
            WindowManager_1.default.highLayer.mouseEnabled = false;
        }
        PoolTools_1.default.cacheItem("AlertNewLocalUI", this, "sys");
    }
    reConnect() {
        if (this._callback)
            this._callback.call(this._thisObj);
        // this.close();
        this.close();
    }
}
exports.default = AlertNewLocalUI;
AlertNewLocalUI.res = null;
AlertNewLocalUI._instance = null;
//# sourceMappingURL=AlertNewLocalUI.js.map
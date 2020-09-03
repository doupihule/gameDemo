import UIBaseView from "../../components/UIBaseView";
import BaseContainer from "../../components/BaseContainer";
import LabelExpand from "../../components/LabelExpand";
import ScreenAdapterTools from "../../utils/ScreenAdapterTools";
import ViewTools from "../../components/ViewTools";
import WindowManager from "../../manager/WindowManager";
import {WindowCfgs} from "../../../game/sys/consts/WindowCfgs";
import TableUtils from "../../utils/TableUtils";
import GlobalData from "../../utils/GlobalData";


export default class AlertNewLocalUI extends UIBaseView {
	public static res: string = null;

	static instance: AlertNewLocalUI = null;

	private _callback: any = null;
	private _thisObj: any = null;
	private _cacheDataArr: any[];

	private bgCover: BaseContainer = null;        //底板透明黑遮罩
	private contentBg: BaseContainer = null;      //弹窗底
	private titleLab: LabelExpand = null;     //弹窗标题
	private msgLab: LabelExpand = null;       //内容
	private sureBtn: BaseContainer = null;        //确认按钮底
	private sureLab: LabelExpand = null;      //确认按钮文本
	private cancleBtn: BaseContainer = null;       //取消按钮
	private cancleLab: LabelExpand = null;      //取消按钮文本
	//按钮中心位置
	private btncenterX: number = 0;
	//按钮偏移
	private btnOffset: number = 120;

	constructor() {
		super();
		AlertNewLocalUI.instance = this;
		this._cacheDataArr = [];
		this.checkInit();
		// new ButtonUtils(this.sureBtn,this.touchHandler,this,"common/common_btn_btn1.png","common/common_btn_btn1_1.png");
		// new ButtonUtils(this.reConnectBtn,this.reConnect,this,"common/common_btn_btn2.png","common/common_btn_btn2_1.png");
	}

	private checkInit() {
		var stageWidth = ScreenAdapterTools.width;
		var stageHeight = ScreenAdapterTools.height;
		var contentBgWidth = 566;
		var contentBgHeight = 286;
		var contentBgX = (stageWidth - contentBgWidth) / 2;
		var contentBgY = (stageHeight - contentBgHeight) / 2;
		if (this.bgCover == null) {
			this.bgCover = ViewTools.createContainer("alertBg");
			var path = [
				["moveTo", 0, 0], //起点左上角
				["lineTo", stageWidth, 0],//画到右上角
				["lineTo", stageWidth, stageHeight],//再画到右下角
				["lineTo", 0, stageHeight], //继续画到左下角
				["closePath"] //闭合路径
			];
			//绘制矩形
			// this.bgCover.graphics.drawPath(0, 0, path, {fillStyle: "#000000"});
			// this.bgCover.alpha = 0.5;
			// this.addChild(this.bgCover);
		}
		if (this.contentBg == null) {
			var splitY = 70;
			this.contentBg = ViewTools.createContainer("alertBGContent");
			//绘制矩形
			// this.contentBg.graphics.drawPath(contentBgX, contentBgY, path, {fillStyle: "#111a1b"}, {
			// 	"strokeStyle": "#202f30",
			// 	"lineWidth": "3"
			// });
			// this.addChild(this.contentBg);
		}
		if (this.titleLab == null) {
			this.titleLab = ViewTools.createLabel("提示",contentBgWidth,45,45);
			this.titleLab.set2dPos(contentBgX,contentBgY + 15);
			this.titleLab.setColor(0xb8,0xff,0xf7,0xff);
			this.addChild(this.titleLab);
		}
		if (this.msgLab == null) {
			this.msgLab = ViewTools.createLabel("",contentBgWidth - 100,130,24);
			this.msgLab.x = contentBgX + 50;
			this.msgLab.y = contentBgY + 75;
			this.msgLab.set2dPos(contentBgX + 50,contentBgY + 75);
			this.msgLab.setColor(0xff,0xff,0xff,0xff)
			this.msgLab.setWrapStyle();
			this.addChild(this.msgLab);
		}
		this.btncenterX = contentBgX + 200;
		if (this.sureBtn == null) {
			this.sureBtn = this.createBtn("确定", this.touchHandler, this, this.btncenterX, contentBgY + 206);
		}

		if (this.cancleBtn == null) {
			this.cancleBtn = this.createBtn("取消", this.onCancleBtn, this, this.btncenterX + this.btnOffset, contentBgY + 206);
		}

	}

	private onCancleBtn() {
		WindowManager.CloseUI(WindowCfgs.AlertUILocal);
	}

	private createBtn(str: string, func: any, thisObj: any, x, y) {
		var sp = ViewTools.createContainer("btn");
		sp.setSize(166,50);
		var path = [
			["moveTo", 0, 0],
			["lineTo", 166, 0],
			["lineTo", 166, 50],
			["lineTo", 0, 50],
			["closePath"]
		];
		//绘制矩形
		// sp.graphics.drawPath(0, 0, path, {fillStyle: "#111a1b"}, {"strokeStyle": "#202f30", "lineWidth": "2"});
		sp.set2dPos(x,y);
		this.addChild(sp);

		var label=  ViewTools.createLabel(str,166,30,30);
		this.titleLab.set2dPos(0,10);
		label.setColor(0xe1,0xfc,0xf5,0xff);
		sp.addChild(label);
		return sp;
	}

	public setData(data): void {
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
		} else {
			this.sureBtn.visible = true;
			this.cancleBtn.visible = false;
			this.sureBtn.x = this.btncenterX
		}

	}

	private touchHandler(target: any): void {
		// this.close();
		WindowManager.CloseUI(WindowCfgs.AlertUILocal);
		var copyArr = TableUtils.copyOneArr(this._cacheDataArr);
		this._cacheDataArr = []
		for (var i = 0; i < copyArr.length; i++) {
			var data = copyArr[i];
			if (data) {
				if (GlobalData.isGameDestory) {
					return;
				}
				var callBack = data.callBack;
				var thisObj = data.thisObj;
				if (callBack) {
					callBack.call(thisObj)
				}
			}
		}
	}

	private reConnect() {
		if (this._callback) this._callback.call(this._thisObj);
		// this.close();
		WindowManager.CloseUI(WindowCfgs.AlertUILocal);
	}
}
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import Global from "../../../../utils/Global";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import TableUtils from "../../../../framework/utils/TableUtils";

;

export default class AlertUILocal extends Laya.View {
	public static res: string = null;

	static instance: AlertUILocal = null;

	private _callback: any = null;
	private _thisObj: any = null;
	private _cacheDataArr: any[];

	private bgCover: Laya.Sprite = null;        //底板透明黑遮罩
	private contentBg: Laya.Sprite = null;      //弹窗底
	private titleLab: Laya.Text = null;     //弹窗标题
	private msgLab: Laya.Text = null;       //内容
	private sureBtn: Laya.Sprite = null;        //确认按钮底
	private sureLab: Laya.Text = null;      //确认按钮文本
	private cancleBtn: Laya.Sprite = null;       //取消按钮
	private cancleLab: Laya.Text = null;      //取消按钮文本
	//按钮中心位置
	private btncenterX: number = 0;
	//按钮偏移
	private btnOffset: number = 120;

	constructor() {
		super();
		AlertUILocal.instance = this;
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
			this.bgCover = new Laya.Sprite();
			var path = [
				["moveTo", 0, 0], //起点左上角
				["lineTo", stageWidth, 0],//画到右上角
				["lineTo", stageWidth, stageHeight],//再画到右下角
				["lineTo", 0, stageHeight], //继续画到左下角
				["closePath"] //闭合路径
			];
			//绘制矩形
			this.bgCover.graphics.drawPath(0, 0, path, {fillStyle: "#000000"});
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
			this.contentBg.graphics.drawPath(contentBgX, contentBgY, path, {fillStyle: "#111a1b"}, {
				"strokeStyle": "#202f30",
				"lineWidth": "3"
			});
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
		sp.graphics.drawPath(0, 0, path, {fillStyle: "#111a1b"}, {"strokeStyle": "#202f30", "lineWidth": "2"});
		sp.x = x;
		sp.y = y;
		this.addChild(sp);
		if (func) {
			sp.on(Laya.Event.CLICK, thisObj, func);
		}

		var label: Laya.Text;
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
				if (Global.isGameDestory) {
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
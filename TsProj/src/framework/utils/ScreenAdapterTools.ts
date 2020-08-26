import LogsManager from "../manager/LogsManager";
import Global from "../../utils/Global";

export default class ScreenAdapterTools {

	static Align_Left: number = 1;
	static Align_LeftTop: number = 2;
	static Align_MiddleTop: number = 3;
	static Align_RightTop: number = 4;
	static Align_Right: number = 5;
	static Align_RightBottom: number = 6;
	static Align_MiddleBottom: number = 7;
	static Align_LeftBottom: number = 8;
	static Align_Middle: number = 9;
	static Align_ScaleWidth: number = 10;

	//设计分辨率
	static designWidth: number = 640
	static designHeight: number = 1136;
	//横竖屏 初始化的时候 会自动判断
	static isLandSpace: boolean = false;

	//最大宽度
	static maxWidth: number = 768;
	static maxHeight: number = 1400

	//经过放缩后游戏逻辑需要用到的宽高 也就是舞台的宽高
	static width: number = 0
	static height: number = 0

	static UIOffsetX: number = 0;
	static UIOffsetY: number = 0;

	//场景偏移, 这个针对无法全屏适配的设备 .主要是 ipad 太宽的设备
	static sceneOffsetX: number = 0;
	static sceneOffsetY: number = 0
	//刘海高度
	static toolBarWidth: number = 0;
	static phoneSys: string = "";
	static PHONE_BANGS: any = ["iPhone X", "PACM00", "ANE-AL00", "COL-AL10", "JSN-AL00a", "V1813BA", "PBEM00", "vivo Z3x", "MI 9", "PBAM00", "PAAT00", "PBCM10", "vivo X21A", "ONEPLUS A6000"];

	static windowWidth: number = 640;
	static windowHeight: number = 1136;
	static stageWidth: number;
	static stageHeight: number;

	//刘海的位置 -1 对应左边或者 竖屏上面, 竖屏游戏一定是上边
	static toolBarWay: number = -1;

	//是否是刘海设备
	static isNotchDevice() {
		return this.toolBarWidth != 0
	}

	static getStageScaleX() {
		return this.width / this.windowWidth;
	}

	static getStageScaleY() {
		return this.height / this.windowHeight;
	}

	//判断屏幕模式
	static checkScreenFixMode(browWidth, browHeight) {
		this.stageWidth = browWidth;
		this.stageHeight = browHeight;
		if (this.designWidth > this.designHeight) {
			this.isLandSpace = true;
		}
		var minScale: number = this.designWidth / this.designHeight
		var borderScale: number = this.designWidth / this.designHeight
		var targetScale: number = browWidth / browHeight
		var scaleMode: string;

		//横屏状态
		if (this.isLandSpace) {
			minScale = this.designHeight / this.maxWidth;
			//如果是 比较高的屏幕ipad 那么采用fix width.
			if (targetScale < borderScale) {
				this.width = this.designWidth;
				var targetHei: number = Math.round(this.width / targetScale);
				if (targetHei > this.maxHeight) {
					this.sceneOffsetY = (targetHei - this.maxHeight) / 2
					this.height = this.maxHeight;
				} else {
					this.height = targetHei;
				}

				//那么需要做场景偏移

				scaleMode = "fixedwidth"
			} else {
				this.height = this.designHeight;
				this.width = Math.round(this.designHeight * targetScale)
				scaleMode = "fixedheight"
			}
		} else {
			//如果是 比较宽的屏幕ipad 那么采用fix height.
			if (targetScale > borderScale) {
				this.height = this.designHeight;
				var targetWid: number = Math.round(this.designHeight * targetScale);
				if (targetWid > this.maxWidth) {
					this.sceneOffsetX = (targetWid - this.maxWidth) / 2;
					this.width = this.maxWidth;
				} else {
					this.width = targetWid;
				}
				scaleMode = "fixedheight"
			} else {
				this.width = this.designWidth;
				this.height = Math.round(this.designWidth / targetScale);
				scaleMode = "fixedwidth"
			}
		}
		this.UIOffsetX = (this.width - this.designWidth) / 2;
		this.UIOffsetY = (this.height - this.designHeight) / 2
		LogsManager.echo("适配结果:this.isLandSpace", scaleMode, this.isLandSpace, this.sceneOffsetX, this.sceneOffsetY)
		LogsManager.echo("stageW:", browWidth, "stageH:", browHeight, "wd:", this.width, "hei:", this.height, "ofx:", this.UIOffsetX, "ofy:", this.UIOffsetY);

		return scaleMode
	}

	//判断是否填充黑边
	static checkFillBorder() {
		if (this.sceneOffsetX == 0) {
			return;
		}
		//创建黑边
		var image = new Laya.Image("static/global_image_heibian.png");
		image.anchorX = 1;
		image.anchorY = 0.5;
		image.x = this.sceneOffsetX
		image.y = this.height / 2 + this.UIOffsetY;
		Laya.stage.addChild(image);
		image.zOrder = 10000000;

		image = new Laya.Image("static/global_image_heibian.png");
		image.anchorX = 0;
		image.anchorY = 0.5;
		image.x = this.sceneOffsetX + this.width
		image.y = this.height / 2 + this.UIOffsetY;
		Laya.stage.addChild(image);
		image.zOrder = 10000000;

	}

	static setPhoneSys(sysInfo: any): void {
		this.windowWidth = sysInfo.windowWidth;
		this.windowHeight = sysInfo.windowHeight;
		if (this.phoneSys != "") return
		var phoneModel = sysInfo.model;
		Global.deviceModel = phoneModel;
		if (phoneModel.indexOf("iPhone") > -1 || phoneModel.indexOf("iPad") > -1) {
			this.phoneSys = "iphone";
		} else if (phoneModel.indexOf("Android")) {
			this.phoneSys = "android";
		}
		// 根据安全区域置刘海屏高度
		this.checkBarBySafeArea(sysInfo);
		// 根据状态栏设置刘海屏高度
		this.checkBarByStatusBarHeight(sysInfo);
		// 根据白名单设置刘海屏高度
		this.checkBarByBangs(phoneModel);
	}

	/**
	 * 根据白名单判断刘海屏高度
	 */
	static checkBarByBangs(phoneModel) {
		if (ScreenAdapterTools.toolBarWidth > 0) {
			//如果已经判断是刘海设备，则不需要
			return;
		}
		var keys = this.PHONE_BANGS;
		var len: number = keys.length;
		for (var i: number = 0; i < len; i++) {
			var key: string = keys[i];
			if (phoneModel.indexOf(key) > -1) {
				ScreenAdapterTools.toolBarWidth = 60;
				Global.isPhoneBangs = true;
				LogsManager.echo("hlx 刘海屏高度修改:根据白名单", phoneModel, key);
			}
		}
	}

	/**
	 * 根据安全区域判断刘海屏高度
	 */
	static checkBarBySafeArea(sysInfo: any) {
		if (ScreenAdapterTools.toolBarWidth > 0) {
			//如果已经判断是刘海设备，则不需要
			return;
		}
		if (!sysInfo.safeArea) {
			return;
		}
		var top = sysInfo.safeArea.top || 0;
		if (top > 20) {
			ScreenAdapterTools.toolBarWidth = top * this.getStageScaleY();
			if (ScreenAdapterTools.toolBarWidth > 60) {
				ScreenAdapterTools.toolBarWidth = 60;
			}
			Global.isPhoneBangs = true;
			LogsManager.echo("hlx 刘海屏高度修改:根据安全区域 top:", top, "    this.height:", this.height, "    this.windowHeight:", this.windowHeight, "    toolBarWidth:", ScreenAdapterTools.toolBarWidth)
		}
	}

	/**
	 * 根据状态栏高度判断刘海屏
	 */
	static checkBarByStatusBarHeight(sysInfo) {
		if (ScreenAdapterTools.toolBarWidth > 0) {
			//如果已经判断是刘海设备，则不需要
			return;
		}
		var barH: number = sysInfo.statusBarHeight;
		if (ScreenAdapterTools.toolBarWidth == 0 && barH > 44) {
			LogsManager.echo("hlx 刘海屏高度修改:根据状态拦高度 statusBarHeight:", barH);
			ScreenAdapterTools.toolBarWidth = 60;
			Global.isPhoneBangs = true;
		}
	}

	/**
	 * 根据胶囊个信息重新计算刘海屏高度
	 * @param menuInfo 胶囊信息
	 */
	static reCheckBar(menuInfo: any) {
		if (ScreenAdapterTools.toolBarWidth > 0) {
			//如果已经判断是刘海设备，则不需要
			return;
		}
		if (!menuInfo) {
			return;
		}
		var top = menuInfo.top || 0;
		LogsManager.echo("ycn reCheckBar top: ", top);
		if (top > 20) {
			ScreenAdapterTools.toolBarWidth = top * this.getStageScaleY();
			if (ScreenAdapterTools.toolBarWidth > 60) {
				ScreenAdapterTools.toolBarWidth = 60;
			}
			Global.isPhoneBangs = true;
			LogsManager.echo("hlx 刘海屏高度修改:根据胶囊位置 reCheckBar top:", top, "    this.height:", this.height, "    this.windowHeight:", this.windowHeight, "    toolBarWidth:", ScreenAdapterTools.toolBarWidth)
		}
	}

	// 设置view对其
	// moveScale 表示移动的系数 默认是1 ,也就是说 1136机器 靠左对其 只移动 (1136-960)/2 * moveScale这个多像素
	// widthScreenOffset  每个系统调用这个方法时 必须传递 对应ui的 widthScreenOffset 参数
	// withNotch false表示在刘海区域外面, 默认为false, true 表示深入刘海区域 ,这个针对新手引导适配场景的点击区域, 特殊组件也可以使用

	static setViewAlign(view: any, alignType: number, moveScaleX: number = 1, moveScaleY: number = 1, withNotch: boolean = false) {

		var offsetX: number = 0;
		var offsetY: number = 0;
		if (alignType == this.Align_Left) {
			offsetX = -this.UIOffsetX
		} else if (alignType == this.Align_LeftTop) {
			offsetX = -this.UIOffsetX
			offsetY = -this.UIOffsetY;
		} else if (alignType == this.Align_MiddleTop) {
			offsetY = -this.UIOffsetY;
		} else if (alignType == this.Align_RightTop) {
			offsetX = this.UIOffsetX
			offsetY = -this.UIOffsetY;
		} else if (alignType == this.Align_Right) {
			offsetX = this.UIOffsetX
		} else if (alignType == this.Align_RightBottom) {
			offsetX = this.UIOffsetX
			offsetY = this.UIOffsetY;
		} else if (alignType == this.Align_MiddleBottom) {
			offsetY = this.UIOffsetY;
		} else if (alignType == this.Align_LeftBottom) {
			offsetX = -this.UIOffsetX
			offsetY = this.UIOffsetY;
		}
		var offsetNotchX: number = 0;
		var offsetNotchY: number = 0;


		this.offsetView(view, offsetX + offsetNotchX, offsetY + offsetNotchY)
		if (!withNotch) {
			this.alignNotch(view, alignType);
		}
	}

	/**
	 * 把某个view移出刘海区域,就是把他的坐标根据适配方向 挪动一些
	 * @param view 显示对象
	 * @param alignType 对齐方式
	 */
	static alignNotch(view: any, alignType: number = ScreenAdapterTools.Align_LeftTop) {
		if (!Global.isPhoneBangs) {
			return;
		}
		if (this.isLandSpace) {
			if (alignType == this.Align_Left || alignType == this.Align_LeftBottom || this.Align_LeftTop) {
				this.offsetView(view, this.toolBarWidth, 0);
			} else if (alignType == this.Align_Right || alignType == this.Align_RightBottom || alignType == this.Align_RightTop) {
				this.offsetView(view, -this.toolBarWidth, 0);
			}
		} else {
			if (alignType == this.Align_LeftTop || alignType == this.Align_MiddleTop || this.Align_RightTop) {
				this.offsetView(view, 0, this.toolBarWidth);
			}
		}
	}

	/**
	 *
	 * @param info
	 *     model:手机型号
	 *     toolBarHeight:刘海高度
	 */
	static checkNativeSystemInfo(info: any) {
		Global.deviceModel = info.model;
		if (info.toolBarHeight > 0) {
			this.toolBarWidth = 60;
			Global.isPhoneBangs = true;
		} else {
			Global.isPhoneBangs = false;
		}
	}

	/**
	 * 判断是否是朝上的适配
	 * @param alignType 适配类型
	 */
	static checkIsAlignUp(alignType: number) {
		return alignType == this.Align_LeftTop || alignType == this.Align_MiddleTop || alignType == this.Align_RightTop;
	}


	/**
	 * 移动View的位置
	 * @param view 移动对象
	 * @param offsetX X偏移
	 * @param offsetY Y偏移
	 */
	static offsetView(view: any, offsetX: number, offsetY: number) {
		if (view.left || view.left == 0) {
			view.left += offsetX;
		} else if (view.right || view.right == 0) {
			view.right -= offsetX;
		} else if (view.centerX || view.centerX == 0) {
			view.centerX += offsetX;
		} else if (view.horizontalCenter || view.horizontalCenter == 0) {
			view.horizontalCenter += offsetX
		} else {
			view.x += offsetX;
		}

		if (view.top || view.top == 0) {
			view.top += offsetY;
		} else if (view.bottom || view.bottom == 0) {
			view.bottom -= offsetY;
		} else if (view.centerY || view.centerY == 0) {
			view.centerY += offsetY;
		} else if (view.verticalCenter || view.verticalCenter == 0) {
			view.verticalCenter += offsetY
		} else {
			view.y += offsetY;
		}
	}

}
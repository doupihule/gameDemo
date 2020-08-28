import FogInstanceBasic from "./FogInstanceBasic";
import FogModel from "../../sys/model/FogModel";
import FogFunc from "../../sys/func/FogFunc";
import LogsManager from "../../../framework/manager/LogsManager";
import FogEventData from "../data/FogEventData";
import FogEventTrigger from "../trigger/FogEventTrigger";
import FogServer from "../../sys/server/FogServer";
import FogConst from "../../sys/consts/FogConst";
import GuideManager from "../../sys/manager/GuideManager";
import GuideConst from "../../sys/consts/GuideConst";
import WindowManager from "../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../sys/consts/WindowCfgs";
import UserModel from "../../sys/model/UserModel";
import TranslateFunc from "../../../framework/func/TranslateFunc";

/**迷雾格子 */
export default class FogInstanceCell extends FogInstanceBasic {

	//被锁住的遮罩
	private maskImg: ImageExpand;
	//上一次的image.用来做过渡动画
	private lastMaskImg: ImageExpand;
	private maskCtn: ImageExpand;
	//事件ctn，用来展示事件icon
	public eventCtn: ImageExpand;
	private signCtn: ImageExpand;
	//这个item x方向位置
	public xIndex = 1;
	//这个item y方向位置
	public yIndex = 1;
	//格子的唯一标识 1_1
	public mySign;
	public myData: SCFogCellData;
	public eventData: FogEventData;
	//我的旋转
	public myRotate;
	//G是当前点到起始点的值
	public G = 0;
	//H是本点到目标的横纵坐标差的和
	public H;
	//F=G+H
	public F;
	public tmpCell
	private fogName;
	public normalIndex;

	constructor(fogControler) {
		super(fogControler);
		this.width = FogFunc.itemWidth;
		this.height = FogFunc.itemHeight;

		this.classModel = FogConst.model_Cell;

	}

	addCtn() {
		this.eventCtn = ViewTools.createImage("");
		this.eventCtn.anchorX = 0.5;
		this.eventCtn.anchorY = 0.5;
		this.fogControler.fogLayerControler.a23.addChild(this.eventCtn);
		this.maskCtn = ViewTools.createImage("");
		this.maskCtn.anchorX = 0.5;
		this.maskCtn.anchorY = 0.5;
		this.fogControler.fogLayerControler.a24.addChild(this.maskCtn);
		this.maskImg = this.createImage();
		this.lastMaskImg = this.createImage();
		this.maskCtn.addChild(this.maskImg);
		this.maskCtn.addChild(this.lastMaskImg);
		this.signCtn = ViewTools.createImage("uisource/expedition/expedition/expedition_image_chahao.png");
		this.signCtn.anchorX = 0.5;
		this.signCtn.anchorY = 0.5;
		this.maskCtn.addChild(this.signCtn);
		this.normalIndex = this.fogControler.fogLayerControler.a23.getChildIndex(this.eventCtn);
	}

	private createImage(url = null) {
		var img = ViewTools.createImage(url);
		img.anchorX = 0.5;
		img.anchorY = 0.5;
		img.scale(130 / 128, 130 / 128, true);
		return img;
	}

	public setData(data) {
		this.addCtn();
		this.resetPathData();
		// this.maskImg.visible = true;
		this.signCtn.visible = false;
		this.xIndex = data.xIndex;
		this.yIndex = data.yIndex;
		this.fogName = FogFunc.instance.getMaskImgFrontBySign(this.xIndex, this.yIndex);
		// this.maskImg.skin = this.fogName + "_01.png";
		this.mySign = this.xIndex + "_" + this.yIndex;
		this.x = this.xIndex * FogFunc.itemWidth - FogFunc.itemWidth / 2;
		this.y = FogFunc.mapHeight - (this.yIndex * FogFunc.itemHeight) + FogFunc.itemHeight / 2;
		this.eventCtn.x = this.x;
		this.eventCtn.y = this.y;
		this.maskCtn.x = this.x;
		this.maskCtn.y = this.y;

		this.fogControler.saveCellData(this.mySign, this);
		this.skin = FogFunc.instance.getMapImgBySign(this.fogControler.layerCfg.scene, this.xIndex, this.yIndex)
		this.refreshFogMist(true);
	}

	//重置寻路信息
	resetPathData() {
		this.G = 0;
		this.tmpCell = null
	}

	//初始化
	initCellData() {
		this.myRotate = null;
		this.myData = null;
		this.myData = FogModel.instance.getCellInfoById(this.mySign);
		this.eventCtn.skin = ""
		if (this.myData) {
			if (Number(this.myData.type) == FogConst.cellType_Start) {
				FogFunc.fogStartCell = this;
				this.initMyRotate();
			} else if (Number(this.myData.type) == FogConst.cellType_End) {
				this.initMyRotate();
				this.eventCtn.skin = FogFunc.instance.getExitImgByRotate(this.myRotate)
				FogFunc.fogEndCell = this;
				FogFunc.fogEndCellSign = this.mySign;
			} else if (Number(this.myData.type) == FogConst.cellType_StartAround) {
				if (!FogFunc.fogStartCell) {
					LogsManager.errorTag("", "起始点还未初始化")
				}
				this.myRotate = FogFunc.fogStartCell.myRotate;
			} else if (Number(this.myData.type) == FogConst.cellType_EndAround) {
				if (!FogFunc.fogEndCell) {
					LogsManager.errorTag("", "终点还未初始化")
				}
				this.myRotate = FogFunc.fogEndCell.myRotate;
			}

			this.freshEventShow();
			this.freshMyState();
			this.checkRoleGuide_1201()
		} else {
			this.eventData = null;
		}
	}

	//重登检测己方角色引导
	checkRoleGuide_1201() {
		if (this.myData.ste == FogConst.FOG_CELLSTATE_OPEN && this.eventData && this.eventData.roleId && GuideManager.ins.nowGuideId != GuideConst.GUIDE_12_1201) {
			this.fogControler.showGuide_1201(this);
		}
	}

	/**刷新我的状态 */
	freshMyState() {
		this.myData = FogModel.instance.getCellInfoById(this.mySign);
		//已解锁
		if (this.checkfreshFog()) {
			if (this.eventData) {
				this.addRole();
			}
		}
		//格子被锁定了
		if (this.myData.lock) {
			this.signCtn.visible = true;
		} else {
			this.signCtn.visible = false;
		}
	}

	/**刷新迷雾图片的状态 */
	checkfreshFog() {
		var ste = this.myData && this.myData.ste;
		if (ste) {
			if (Number(ste) == FogConst.FOG_CELLSTATE_HALFOPEN) {
				// this.maskImg.skin = this.fogName + ".png";
				return false;
			} else if (Number(ste) == FogConst.FOG_CELLSTATE_OPEN) {
				// this.maskImg.visible = false;
				return true;
			}
		}
		return false;
	}

	/**刷新迷雾图标 */
	public refreshFogMist(isInit: boolean = false) {
		this.fogControler.mistControler.turnOneCellView(this.maskImg, this.lastMaskImg, this.xIndex, this.yIndex, isInit);
	}

	/**添加己方角色 */
	public addRole() {
		//解锁以后，如果我的事件类型是己方角色,安排一个角色
		if (this.eventData.logicType == FogEventTrigger.Event_logical_Role && !this.eventData.roleId) {
			var id = FogFunc.instance.getOneRoleId();
			if (id) {
				this.addEventData(this.eventData.eventId, id);
				//检测己方角色引导
				this.fogControler.showGuide_1201(this);
			} else {
				//没有多余的角色了，直接把这个事件删除
				this.delEventData();
			}
		}
	}

	/**设置我的旋转 起点和终点 */
	initMyRotate() {
		if (this.xIndex == 1) {
			//向右
			this.myRotate = FogConst.FOG_CELL_TURNRIGHT;
		} else if (this.xIndex == FogFunc.line) {
			//向左
			this.myRotate = FogConst.FOG_CELL_TURNLEFT;
		} else if (this.yIndex == 1) {
			//向上
			this.myRotate = FogConst.FOG_CELL_TURNUP;
		} else if (this.yIndex == FogFunc.row) {
			//向下
			this.myRotate = FogConst.FOG_CELL_TURNDOWN;
		}
	}

	/**刷新事件显示 */
	freshEventShow() {
		this.myData = FogModel.instance.getCellInfoById(this.mySign);
		var event = this.myData.evt;
		if (event) {
			if (!this.eventData) {
				this.eventData = new FogEventData(this);
			}
			this.eventData.upDateEvent(this.myData.evt, this.eventCtn);
		} else {
			this.eventData = null;
		}
	}

	/**获取周围的格子 */
	getAroundCell(pos) {
		var xIndex = this.xIndex;
		var yIndex = this.yIndex;
		if (pos == "left") {
			xIndex -= 1;
		} else if (pos == "right") {
			xIndex += 1;
		} else if (pos == "up") {
			yIndex += 1;
		} else if (pos == "down") {
			yIndex -= 1;
		}
		return xIndex + "_" + yIndex
	}

	/**获取固定偏移的格子id  主要对于出入口 不同的位置相对的x y 不同*/
	getOffestCellId(xOffest = 0, yOffest = 0) {
		var xIndex = this.xIndex;
		var yIndex = this.yIndex;
		this.myData = FogModel.instance.getCellInfoById(this.mySign);
		if (Number(this.myData.type) == FogConst.cellType_Start || Number(this.myData.type) == FogConst.cellType_End) {
			if (this.xIndex == 1) {
				//位于左边
				yIndex -= xOffest;
				xIndex += yOffest;
			} else if (this.xIndex == FogFunc.line) {
				//位于右边
				yIndex += xOffest;
				xIndex -= yOffest;
			}
			if (this.yIndex == 1) {
				//位于下边
				yIndex += yOffest;
				xIndex += xOffest;
			} else if (this.yIndex == FogFunc.row) {
				//位于上边
				yIndex -= yOffest;
				xIndex -= xOffest;
			}
		} else {
			xIndex += xOffest;
			yIndex += yOffest;
		}
		if (xIndex < 1 || yIndex < 1) {
			LogsManager.errorTag("无效的偏移，不存在此格子", "无效的偏移，不存在此格子,偏移" + xOffest + "_" + yOffest)
			return;
		}
		return xIndex + "_" + yIndex;
	}

	/**获取是否可作为寻路点 */
	getIsCanPath() {
		//已解锁并且可通行 起点终点解锁后默认可通行
		if (this.myData && this.myData.ste) {
			if (Number(this.myData.type) == FogConst.cellType_Start || Number(this.myData.type) == FogConst.cellType_End) return true;
			//半开放的格子不可寻路
			if (Number(this.myData.ste) == FogConst.FOG_CELLSTATE_HALFOPEN) return false;
			if (!this.eventData || this.eventData.pass) return true;
		}
		return false;
	}

	/**点击格子 */
	onClickItem() {
		if (!this.mySign || !this.fogControler || !this.fogControler.myBus) return
		LogsManager.echo("点击格子", this.mySign)
		//完成第一次引导点击格子
		if (this.mySign == "3_2" && GuideManager.ins.nowGuideId == GuideConst.GUIDE_6_603) {
			//先关闭引导界面，但不认为引导完成，等当前事件完成后再认为引导完成
			WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
		} else if (this.mySign == "3_2" && GuideManager.ins.recentGuideId == GuideConst.GUIDE_9_901) {
			WindowManager.CloseGuideUI(WindowCfgs.GuideUI);
		}
		//未解锁的格子，不可点击
		if (this.myData && !this.myData.ste) {
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_click_deep_cell"))
			return;
		}
		//格子被锁定了
		if (this.myData && this.myData.lock) {
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_fog_click_lock_cell"))
			return;
		}
		//已经完全驱散雾的的格子是空事件，并且不可通行 也不可点
		if (this.eventData && Number(this.myData.ste) == FogConst.FOG_CELLSTATE_OPEN && !this.eventData.pass && this.eventData.logicType == FogEventTrigger.Event_logical_None) return;
		//如果车已经在当前格子了，不可点击
		if (this.fogControler.myBus.mySign == this.mySign) {
			if (this.mySign == "3_2" && UserModel.instance.getMainGuide() == 11) {
				FogEventTrigger.checkEventTriggerOnInstance(FogEventTrigger.FogEvent_trigger_EnterCell, this.fogControler.getCellData(this.mySign))
			}
			return;
		}
		//如果触发了立即执行的事件
		if (FogEventTrigger.checkEventTriggerOnInstance(FogEventTrigger.FogEvent_trigger_Quick, this.fogControler.getCellData(this.mySign))) return;
		this.fogControler.myBus.moveToTargetPos(this);
		LogsManager.echo("小汽车准备寻路", this.mySign)


	}

	/**刪除格子事件 */
	public delEventData() {
		FogServer.delCellEvent({id: this.mySign}, () => {
			this.eventData && this.eventData.removeLastEvent();
			this.eventData = null;
		}, this)
	}

	/**添加格子事件 */
	public addEventData(evtId, role = null) {
		FogServer.addCellEvent({cellId: this.mySign, id: evtId, role: role}, () => {
			this.freshEventShow();
		}, this)
	}

	/**设置格子的层级 */
	public setOrder(order) {
		this.eventCtn.zOrder = order;
		if (order == 0) {
			this.fogControler.fogLayerControler.a23.setChildIndex(this.eventCtn, this.normalIndex)
		}
	}

	//销毁函数. 这个一般都是需要缓存的 而且单独缓存. 因为全局总共就不会创建超过20个
	public dispose() {
		this.removeSelf();
		this.fogControler = null;
		if (this.eventData) {
			this.eventData.removeLastEvent();
			this.eventData = null;
		}
		this.eventCtn.removeSelf();
		this.eventCtn = null;
		this.maskCtn.removeSelf();
		this.maskCtn = null;
	}

	//从舞台移除
	public onSetToCache() {
		this.removeSelf();
	}


}
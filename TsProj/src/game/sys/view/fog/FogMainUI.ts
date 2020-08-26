import IMessage from "../../interfaces/IMessage";
import {ui} from "../../../../ui/layaMaxUI";
import FogModel from "../../model/FogModel";
import FogFunc from "../../func/FogFunc";
import FogServer from "../../server/FogServer";
import {DataResourceType} from "../../func/DataResourceFunc";
import TranslateFunc from "../../../../framework/func/TranslateFunc";
import FogLogicalControler from "../../../fog/controler/FogLogicalControler";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import Message from "../../../../framework/common/Message";
import FogEvent from "../../event/FogEvent";
import FogConst from "../../consts/FogConst";
import UserExtModel from "../../model/UserExtModel";
import UserExtServer from "../../server/UserExtServer";
import RolesFunc from "../../func/RolesFunc";
import LogsManager from "../../../../framework/manager/LogsManager";
import ScreenAdapterTools from "../../../../framework/utils/ScreenAdapterTools";
import StringUtils from "../../../../framework/utils/StringUtils";
import StatisticsManager from "../../manager/StatisticsManager";
import UserModel from "../../model/UserModel";
import GuideManager from "../../manager/GuideManager";
import GuideConst from "../../consts/GuideConst";


/**迷雾街区主界面 */
export default class FogMainUI extends ui.gameui.fog.FogMainUI implements IMessage {

	//层数
	private layer = 1;
	public fogControler: FogLogicalControler;
	private nowForce;//战力

	constructor() {
		super();
		this.initBtn();
		this.addEvent();
		ScreenAdapterTools.alignNotch(this.topGroup, ScreenAdapterTools.Align_MiddleTop);
	}

	addEvent() {
		Message.instance.add(FogEvent.FOGEVENT_REFRESH_BUS, this);
		Message.instance.add(FogEvent.FOGEVENT_REFRESH_COMP, this);
		Message.instance.add(FogEvent.FOGEVENT_REFRESH_ACT, this);
		Message.instance.add(FogEvent.FOGEVENT_REFRESH_GUIDE, this);


	}

	initBtn() {
		new ButtonUtils(this.busBtn, this.onClickBus, this);
		new ButtonUtils(this.exitBtn, this.onClickExit, this);
		new ButtonUtils(this.bagBtn, this.onClickBag, this);
		new ButtonUtils(this.shopBtn, this.onClickShop, this);
		new ButtonUtils(this.addActBtn, this.onClickAddAct, this);
	}

	//初始化
	setData(data) {
		this.layer = FogModel.instance.getCurLayer() + 1;
		var allLayer = FogFunc.instance.getAllLayer();
		if (this.layer > allLayer) {
			this.layer = allLayer;
		}
		this.nowForce = RolesFunc.instance.getAllRoleForce();
		this.syncMyForce();
		this.initTop();
		this.initCell();

		//刷新大巴车按钮
		this.refreshBus();
		this.refreshShop();
		if (data && data.quickShowGuide) {
			this.showGuide_601();
		}
		//重登检测首场战斗引导
		this.fogControler.showGuide_701();
		//重登检测捡道具引导
		this.fogControler.showGuide_901();
		//重登检测升级大巴车
		this.showGuide_1001();
		//重登检测行动力引导
		this.showGuide_1101();
	}

	//同步战力
	syncMyForce() {
		var saveForce = UserExtModel.instance.getRoleForce();
		if (this.nowForce > saveForce) {

		} else {
			this.nowForce = saveForce
		}
		FogServer.syncForce({force: this.nowForce}, (result) => {
			if (!result || result.error) {
				LogsManager.echo("zm.向服务器同步战力失败")
			}
			//本地记录
			UserExtServer.saveMyForce({force: this.nowForce})
		}, this);
	}

	/**初始化顶部信息 */
	initTop() {
		var act = FogModel.instance.getActNum();
		if (act == 0) {
			StatisticsManager.ins.onEvent(StatisticsManager.FOG_START)
		} else {
			StatisticsManager.ins.onEvent(StatisticsManager.FOG_ENTER)
		}
		var cellData = FogModel.instance.getCellInfo();
		if (cellData) {
			this.actNum.text = StringUtils.getCoinStr(FogModel.instance.getActNum() + "");
		} else {
			var cfg = FogFunc.instance.getCfgDatas("Layer", this.layer);
			FogServer.addSourceCount({type: DataResourceType.ACT, count: cfg.mobility}, () => {
				this.actNum.text = StringUtils.getCoinStr(FogModel.instance.getActNum() + "");
			}, this);
		}
		this.conNum.text = StringUtils.getCoinStr(FogModel.instance.getCompNum() + "");

		this.layerTxt.text = TranslateFunc.instance.getTranslate("#tid_fog_layerTxt", null, this.layer);
		this.forceNum.text = StringUtils.getCoinStr(this.nowForce + "");
	}

	onClickAddAct() {
		WindowManager.OpenUI(WindowCfgs.FogFreeActUI, {noExit: 1});
	}

	refreshAct() {
		this.actNum.text = StringUtils.getCoinStr(FogModel.instance.getActNum() + "");
	}

	refreshComp() {
		this.conNum.text = StringUtils.getCoinStr(FogModel.instance.getCompNum() + "");
	}

	//初始化格子
	initCell() {
		this.fogControler = new FogLogicalControler(this.cellCtn, this);
		this.fogControler.setData(this.layer);
	}

	onClickBus() {
		WindowManager.OpenUI(WindowCfgs.FogBusUI, {"tab": 0});
	}

	onClickBag() {
		WindowManager.OpenUI(WindowCfgs.FogBagUI);

	}

	onClickShop() {
		//判断今日是否首次进入迷雾
		if (!UserExtModel.instance.checkFirstEnterFog()) {
			UserExtServer.setDailyFirstEnterFog(1, () => {
				this.shopRedImg.visible = false;
			}, this);
		}
		WindowManager.OpenUI(WindowCfgs.FogShopUI, {"id": "1", "type": FogConst.FOG_SHOP_TYPE_OUTER});
	}

	refreshShop() {
		this.shopRedImg.visible = false;

		//判断今日是否首次进入迷雾
		if (!UserExtModel.instance.checkFirstEnterFog()) {
			this.shopRedImg.visible = true;
		}
	}

	refreshBus() {
		this.busRedImg.visible = false;
		var busLevel = FogModel.instance.getBusLevel();
		var costNum = FogFunc.instance.getCfgDatasByKey("BusUpGrade", busLevel, "cost");
		var compNum = FogModel.instance.getCompNum();
		var busMaxLevel = FogFunc.instance.getBusMaxLevel();
		if (busLevel < busMaxLevel && Number(costNum) <= compNum) {
			this.busRedImg.visible = true;
		}

		this.busLevelTxt.text = "Lv." + busLevel;
	}

	onClickExit() {
		WindowManager.OpenUI(WindowCfgs.FogTipUI, {type: FogConst.FOG_VIEW_TYPE_EXIT_FOG})

	}

	//移动引导
	showGuide_601() {
		if (UserModel.instance.getMainGuide() == 9) {
			GuideManager.ins.setGuideData(GuideConst.GUIDE_6_601, GuideManager.GuideType.None);
			GuideManager.ins.openGuideUI(GuideConst.GUIDE_6_601, this.checkGuide_601_finish, this);
		}
	}

	checkGuide_601_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_6_601, this.showGuide_602, this, false);
	}

	showGuide_602() {
		GuideManager.ins.setGuideData(GuideConst.GUIDE_6_602, GuideManager.GuideType.None);
		GuideManager.ins.openGuideUI(GuideConst.GUIDE_6_602, this.checkGuide_602_finish, this);
	}

	checkGuide_602_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_6_602, this.showGuide_603, this, false);

	}

	showGuide_603() {
		var targetCell = this.fogControler.getCellData("3_2")
		GuideManager.ins.setGuideData(GuideConst.GUIDE_6_603, GuideManager.GuideType.Static, targetCell, this);
		GuideManager.ins.openGuideUI(GuideConst.GUIDE_6_603, null, this);
	}

	//显示点击大巴车引导
	showGuide_1001() {
		if (UserModel.instance.getMainGuide() == 12) {
			GuideManager.ins.setGuideData(GuideConst.GUIDE_10_1001, GuideManager.GuideType.Static, this.busImg, this);
			GuideManager.ins.openGuideUI(GuideConst.GUIDE_10_1001, this.checkGuide_1001_finish, this);
		}
	}

	checkGuide_1001_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_10_1001, this.onClickBus, this, false)
	}

	//行动力引导
	showGuide_1101() {
		if (UserModel.instance.getMainGuide() == 13) {
			GuideManager.ins.setGuideData(GuideConst.GUIDE_11_1101, GuideManager.GuideType.Static, this.actGroup, this);
			GuideManager.ins.openGuideUI(GuideConst.GUIDE_11_1101, this.checkGuide_1101_finish, this);
		}
	}

	checkGuide_1101_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_11_1101, this.showGuide_1102, this, false)
	}

	showGuide_1102() {
		GuideManager.ins.setGuideData(GuideConst.GUIDE_11_1102, GuideManager.GuideType.Static, this.exitImg, this);
		GuideManager.ins.openGuideUI(GuideConst.GUIDE_11_1102, this.checkGuide_1102_finish, this);
	}

	checkGuide_1102_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_11_1102, this.showGuide_1103, this, false)

	}

	showGuide_1103() {
		GuideManager.ins.setGuideData(GuideConst.GUIDE_11_1103, GuideManager.GuideType.Static, this.exitImg, this);
		GuideManager.ins.openGuideUI(GuideConst.GUIDE_11_1103, this.checkGuide_1103_finish, this);
	}

	checkGuide_1103_finish() {
		GuideManager.ins.guideFin(GuideConst.GUIDE_11_1103, null, null, true)
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogMainUI);
	}

	clear() {

	}

	dispose() {

	}

	freshGuide(data) {
		if (data == GuideConst.GUIDE_6_601) {
			this.showGuide_601();
		} else if (data == GuideConst.GUIDE_10_1001) {
			this.showGuide_1001();
		} else if (data == GuideConst.GUIDE_11_1101) {
			this.showGuide_1101();
		}
	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {
			//刷新大巴车按钮
			case FogEvent.FOGEVENT_REFRESH_BUS:
				this.refreshBus();
				break;
			//刷新零件
			case FogEvent.FOGEVENT_REFRESH_COMP:
				this.refreshComp();
				this.refreshBus();
				break;
			//刷新行动力
			case FogEvent.FOGEVENT_REFRESH_ACT:
				this.refreshAct();
				break;
			case FogEvent.FOGEVENT_REFRESH_GUIDE:
				this.freshGuide(data);
				break;

		}
	}

}
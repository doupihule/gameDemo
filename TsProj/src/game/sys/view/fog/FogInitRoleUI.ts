import IMessage from "../../interfaces/IMessage";
import {ui} from "../../../../ui/layaMaxUI";
import {ButtonUtils} from "../../../../framework/utils/ButtonUtils";
import WindowManager from "../../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../consts/WindowCfgs";
import RolesModel from "../../model/RolesModel";
import GameUtils from "../../../../utils/GameUtils";
import BattleFunc from "../../func/BattleFunc";
import {LoadManager} from "../../../../framework/manager/LoadManager";
import GlobalParamsFunc from "../../func/GlobalParamsFunc";
import FogRoleItemUI from "./FogRoleItemUI";
import TimerManager from "../../../../framework/manager/TimerManager";
import FogServer from "../../server/FogServer";
import ShareTvOrderFunc from "../../func/ShareTvOrderFunc";
import ShareOrTvManager from "../../../../framework/manager/ShareOrTvManager";
import BannerAdManager from "../../../../framework/manager/BannerAdManager";
import FogFunc from "../../func/FogFunc";
import Message from "../../../../framework/common/Message";
import FogEvent from "../../event/FogEvent";
import GuideConst from "../../consts/GuideConst";


/**迷雾街区初始化角色界面 */
export default class FogInitRoleUI extends ui.gameui.fog.FogInitRoleUI implements IMessage {

	private roleList = [];
	private roleIdList = [];
	private timeCode = 0;
	public isVideoGet = false;

	constructor() {
		super();
		this.initBtn();
	}

	initBtn() {
		new ButtonUtils(this.confirmBtn, this.onClickConfirm, this);
	}

	//初始化
	setData() {
		this.roleList = [];
		this.roleIdList = [];
		this.isVideoGet = false;
		this.initRoleList();

		BannerAdManager.addBannerQuick(this);
	}

	initRoleList() {
		//从玩家所有已解锁角色中，随机2个作为初始角色；看视频，可随机获得第3个初始角色
		var allRole = RolesModel.instance.getRolesList();
		var roleList = FogFunc.instance.initFogRoles();

		for (var i = 0; i < roleList.length; i++) {
			if (allRole.hasOwnProperty(roleList[i])) {
				var cfg = BattleFunc.instance.getCfgDatas("Role", roleList[i]);
				this.roleList.push(cfg);
				this.roleIdList.push(roleList[i]);
			}
		}

		var res = WindowManager.getUILoadGroup(WindowCfgs.FogRoleItemUI) || [];
		var resAll = [];
		for (var url of res) {
			resAll.push(url);
		}
		LoadManager.instance.load(resAll, Laya.Handler.create(this, this.initRoleBack));
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
			var freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_FOG_START_ADDROLE);
			if (i <= 1) {
				isShowVideo = false;
			} else {
				if (freeType == ShareOrTvManager.TYPE_QUICKRECEIVE) {
					isShowItem = false;
				} else {
					isShowVideo = true;
				}
			}


			var roleItem: FogRoleItemUI = new FogRoleItemUI(item, this, isShowVideo, isShowItem);
			this.lineGroup.addChild(roleItem);
			roleItem.x = i % 3 * roleItem.itemWidth;
			roleItem.y = Math.floor(i / 3) * roleItem.itemHeight;
		}
		this.timeCode = TimerManager.instance.add(this.freshSpeak, this, GlobalParamsFunc.instance.getDataNum("arraySpeakInterval"))
		this.freshSpeak();

		//保存初始角色数据
		var roleIdList = this.roleIdList;
		if (this.roleIdList.length > 2) {
			roleIdList = this.roleIdList.slice(0, this.roleIdList.length - 1);
		}

		//保存初始阵容数据
		FogServer.setInline({"line": roleIdList});
	}

	freshSpeak() {
		var index = this.lineGroup.numChildren > 2 ? 2 : 1;
		if (this.lineGroup.numChildren > 0) {
			this.leftSpeak.visible = false;
			this.rightSpeak.visible = false;
			for (var i = 0; i < this.lineGroup.numChildren - 1; i++) {
				var cur = this.lineGroup.getChildAt(i) as FogRoleItemUI;
				cur.insSpeak = false;
			}
			var randomIndex = GameUtils.getRandomInt(0, this.roleList.length - index);
			var item = this.lineGroup.getChildAt(randomIndex) as FogRoleItemUI;
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
			FogServer.setInline({"line": roleIdList}, () => {
			}, this);
		}

		this.close();
	}

	close() {
		WindowManager.CloseUI(WindowCfgs.FogInitRoleUI);
		Message.instance.send(FogEvent.FOGEVENT_REFRESH_GUIDE, GuideConst.GUIDE_6_601)
	}

	clear() {

	}

	dispose() {

	}

	recvMsg(cmd: string, data: any): void {
		switch (cmd) {

		}
	}

}
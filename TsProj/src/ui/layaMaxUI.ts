

var REG: Function = Laya.ClassUtils.regClass;
export module ui.gameui.battle {
	export class BattleUI extends Laya.Dialog {
		public battleCtn: ImageExpand;
		public topGroup: Laya.Box;
		public pauseBtn: ImageExpand;
		public levelTxt: Laya.Label;
		public rewardGroup: ImageExpand;
		public levelRewardImg: ImageExpand;
		public levelReward: Laya.Label;
		public leftGroup: ImageExpand;
		public leftDesTxt: Laya.Label;
		public leftTxt: Laya.Label;
		public bottomGroup: Laya.Box;
		public bottomImg: ImageExpand;
		public smallMapGroup: Laya.Box;
		public smallMapBg: ImageExpand;
		public pointGroup: Laya.Box;
		public nowArea: ImageExpand;
		public energyGroup: Laya.Box;
		public energyImg: ImageExpand;
		public energyTxt: Laya.Label;
		public roleList: Laya.List;
		public autoGroup: Laya.Box;
		public openCameraImg: ImageExpand;
		public guideArrow: ImageExpand;
		public warTipGroup: ImageExpand;
		public revokeLineBtn: ImageExpand;
		public startWarBtn: ImageExpand;
		public readyLineGroup: ImageExpand;
		public skillGroup: Laya.Box;
		public skillTipGroup: Laya.Box;
		public skillIcon: ImageExpand;
		public roleSignBtn: ImageExpand;
		public roleSignImg: ImageExpand;
		public enemySignBtn: ImageExpand;
		public enemySignImg: ImageExpand;
		public helpRoleGroup: ImageExpand;
		public helpbgImg: ImageExpand;
		public helpiconImg: ImageExpand;
		public helpmaskImg: ImageExpand;
		public helpLeftTxt: Laya.Label;
		public pauseGroup: ImageExpand;
		public returnMainBtn: ImageExpand;
		public rePlayBtn: ImageExpand;
		public continueBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/battle/Battle");
		}
	}

	REG("ui.gameui.battle.BattleUI", BattleUI);

	export class BattleDetailUI extends Laya.View {
		public bgCtn: ImageExpand;
		public roleCtn: ImageExpand;
		public txtCtn: ImageExpand;
		public helpRoleBtn: ImageExpand;
		public helpFreeImg: ImageExpand;
		public topGroup: Laya.Box;
		public levelTxt: Laya.Label;
		public levelRewardImg: ImageExpand;
		public levelReward: Laya.Label;
		public returnBtn: ImageExpand;
		public firstOver: ImageExpand;
		public firstOverRewardImg: ImageExpand;
		public firstOverRewardTxt: Laya.Label;
		public desTxt: Laya.Label;
		public startGameBtn: ImageExpand;
		public actCostGroup: ImageExpand;
		public actImg: ImageExpand;
		public costNum: Laya.Label;
		public fogFullStartBtn: ImageExpand;
		public spGroup: ImageExpand;
		public startGameBtn1: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/battle/BattleDetail");
		}
	}

	REG("ui.gameui.battle.BattleDetailUI", BattleDetailUI);

	export class BattleFullEnergyUI extends Laya.View {
		public fullStartBtn: ImageExpand;
		public freeImg: ImageExpand;
		public closeBtn: ImageExpand;
		public normalStartBtn: Laya.Label;
		public desTxt: Laya.Label;
		public rewardImg: ImageExpand;
		public rewardLab: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/battle/BattleFullEnergy");
		}
	}

	REG("ui.gameui.battle.BattleFullEnergyUI", BattleFullEnergyUI);

	export class BattleHelpRoleUI extends Laya.View {
		public aniGroup: ImageExpand;
		public useBtn: ImageExpand;
		public freeImg: ImageExpand;
		public exitBtn: Laya.Label;
		public desTxt: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/battle/BattleHelpRole");
		}
	}

	REG("ui.gameui.battle.BattleHelpRoleUI", BattleHelpRoleUI);

	export class BattleResultUI extends Laya.View {
		public pieceGroup: ImageExpand;
		public pieceIcon: ImageExpand;
		public pieceCount: Laya.Label;
		public win: ImageExpand;
		public multiReceiveBtn: ImageExpand;
		public receiveText: Laya.Label;
		public receiveImg: ImageExpand;
		public guideReturnBtn: ImageExpand;
		public shareVideoBtn: ImageExpand;
		public shareRewardNum: Laya.Label;
		public shareVideoImg: ImageExpand;
		public shareRewardImg: ImageExpand;
		public shareVideoTip: ImageExpand;
		public receiveBtn: ImageExpand;
		public lose: ImageExpand;
		public againBtn: ImageExpand;
		public returnBtn: ImageExpand;
		public failTxt: Laya.Label;
		public roleGroup: ImageExpand;
		public aniGroup: ImageExpand;
		public heroSpeak: ImageExpand;
		public heroTxt: Laya.Label;
		public enemySpeak: ImageExpand;
		public enemyTxt: Laya.Label;
		public rewardGroup1: Laya.Box;
		public rewardTxt1: Laya.Label;
		public rewardImg1: ImageExpand;
		public rewardGroup2: Laya.Box;
		public rewardTxt: Laya.Label;
		public rewardImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/battle/BattleResult");
		}
	}

	REG("ui.gameui.battle.BattleResultUI", BattleResultUI);

	export class BattleReviveUI extends Laya.View {
		public leftTxt: Laya.Label;
		public reviveBtn: ImageExpand;
		public adImg: ImageExpand;
		public desTxt: Laya.Label;
		public exitBtn: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/battle/BattleRevive");
		}
	}

	REG("ui.gameui.battle.BattleReviveUI", BattleReviveUI);

	export class BattleUseSkillUI extends Laya.View {
		public useBtn: ImageExpand;
		public freeImg: ImageExpand;
		public exitBtn: Laya.Label;
		public desTxt: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/battle/BattleUseSkill");
		}
	}

	REG("ui.gameui.battle.BattleUseSkillUI", BattleUseSkillUI);
}
export module ui.gameui.cartoon {
	export class CartoonPicUI extends Laya.View {
		public picCtn: ImageExpand;
		public continueTxt: Laya.Label;
		public closeBtn: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/cartoon/CartoonPic");
		}
	}

	REG("ui.gameui.cartoon.CartoonPicUI", CartoonPicUI);

	export class FogCartoonPicUI extends Laya.View {
		public skipTxt: Laya.Label;
		public picCtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/cartoon/FogCartoonPic");
		}
	}

	REG("ui.gameui.cartoon.FogCartoonPicUI", FogCartoonPicUI);
}
export module ui.gameui.changeData {
	export class ChangeDataUI extends Laya.View {
		public dataTxt: Laya.TextArea;
		public tipTxt: Laya.Label;
		public sureBtn: ImageExpand;
		public returnBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/changeData/ChangeData");
		}
	}

	REG("ui.gameui.changeData.ChangeDataUI", ChangeDataUI);
}
export module ui.gameui.chapter {
	export class ChapterBoxDoubleUI extends Laya.Scene {
		public titleLab: Laya.Label;
		public giftImg: ImageExpand;
		public itemList: Laya.List;
		public scrollBar: Laya.HScrollBar;
		public descGroup: ImageExpand;
		public desTxt: Laya.Label;
		public receiveGroup: ImageExpand;
		public doubleReceiveBtn: ImageExpand;
		public doubleTxt: Laya.Label;
		public adImg: ImageExpand;
		public closeBtn: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/chapter/ChapterBoxDouble");
		}
	}

	REG("ui.gameui.chapter.ChapterBoxDoubleUI", ChapterBoxDoubleUI);

	export class ChapterBoxRewardUI extends Laya.View {
		public levelImg: ImageExpand;
		public activeImg: ImageExpand;
		public workImg: ImageExpand;
		public itemList: Laya.List;
		public scrollBar: Laya.HScrollBar;
		public descGroup: ImageExpand;
		public lbl_desc: Laya.Label;
		public sureBtn: ImageExpand;
		public receiveGroup: ImageExpand;
		public normalReceiveBtn: ImageExpand;
		public doubleReceiveBtn: ImageExpand;
		public freeImg: ImageExpand;
		public hasReceiveTxt: Laya.Label;
		public closeBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/chapter/ChapterBoxReward");
		}
	}

	REG("ui.gameui.chapter.ChapterBoxRewardUI", ChapterBoxRewardUI);

	export class ChapterListUI extends Laya.View {
		public chapterList: Laya.List;
		public returnBtn: ImageExpand;
		public enterGuideImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/chapter/ChapterList");
		}
	}

	REG("ui.gameui.chapter.ChapterListUI", ChapterListUI);

	export class ChapterMapUI extends Laya.View {
		public ctn: ImageExpand;
		public topGroup: ImageExpand;
		public c0inGroup: ImageExpand;
		public coinImg: ImageExpand;
		public coinNum: Laya.Label;
		public addCoinBtn: ImageExpand;
		public goldGroup: ImageExpand;
		public goldImg: ImageExpand;
		public goldNum: Laya.Label;
		public addGoldBtn: ImageExpand;
		public spGroup: ImageExpand;
		public spImg: ImageExpand;
		public powerCountLab: Laya.Label;
		public powerTimerLab: Laya.Label;
		public addSpBtn: ImageExpand;
		public returnBtn: ImageExpand;
		public returnGuideGroup: ImageExpand;
		public handImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/chapter/ChapterMap");
		}
	}

	REG("ui.gameui.chapter.ChapterMapUI", ChapterMapUI);
}
export module ui.gameui.common {
	export class ComRewardDoubleUI extends Laya.View {
		public receiveBtn: ImageExpand;
		public receiveImg: ImageExpand;
		public rewardGroup: ImageExpand;
		public pieceBg: ImageExpand;
		public rewardImg: ImageExpand;
		public pieceTxt: Laya.Label;
		public rewardNum: Laya.Label;
		public lbl_desc: Laya.Label;
		public closeBtn: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/common/ComRewardDouble");
		}
	}

	REG("ui.gameui.common.ComRewardDoubleUI", ComRewardDoubleUI);
}
export module ui.gameui.fog {
	export class FogAnswerUI extends Laya.View {
		public titleLab: Laya.Label;
		public answerTitle: Laya.Label;
		public roleSpine: ImageExpand;
		public answerGroup: ImageExpand;
		public answer0: ImageExpand;
		public resultLab0: Laya.Label;
		public resultImg0: ImageExpand;
		public answer1: ImageExpand;
		public resultLab1: Laya.Label;
		public resultImg1: ImageExpand;
		public answer2: ImageExpand;
		public resultLab2: Laya.Label;
		public resultImg2: ImageExpand;
		public answer3: ImageExpand;
		public resultLab3: Laya.Label;
		public resultImg3: ImageExpand;
		public costGroup: ImageExpand;
		public costLab: Laya.Label;
		public costImg: ImageExpand;
		public btn_close: ImageExpand;
		public alertBtn: ImageExpand;
		public freeImg: ImageExpand;
		public rightLab: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogAnswer");
		}
	}

	REG("ui.gameui.fog.FogAnswerUI", FogAnswerUI);

	export class FogBagUI extends Laya.View {
		public titleLab: Laya.Label;
		public btn_close: ImageExpand;
		public itemPanel: Laya.Panel;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogBag");
		}
	}

	REG("ui.gameui.fog.FogBagUI", FogBagUI);

	export class FogBagItemUI extends Laya.View {
		public item: ImageExpand;
		public itemIcon: ImageExpand;
		public itemLab: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogBagItem");
		}
	}

	REG("ui.gameui.fog.FogBagItemUI", FogBagItemUI);

	export class FogBagItemDetailUI extends Laya.View {
		public closeBtn: ImageExpand;
		public itemName: Laya.Label;
		public itemDesc: Laya.Label;
		public itemUpDesc: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogBagItemDetail");
		}
	}

	REG("ui.gameui.fog.FogBagItemDetailUI", FogBagItemDetailUI);

	export class FogBagItemFullLevelUI extends Laya.View {
		public titleLab: Laya.Label;
		public itemList: Laya.List;
		public scrollBar: Laya.HScrollBar;
		public descGroup: ImageExpand;
		public lbl_desc: Laya.Label;
		public compImg: ImageExpand;
		public closeBtn: ImageExpand;
		public receiveBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogBagItemFullLevel");
		}
	}

	REG("ui.gameui.fog.FogBagItemFullLevelUI", FogBagItemFullLevelUI);

	export class FogBattleReviveUI extends Laya.View {
		public reviveBtn: ImageExpand;
		public freeImg: ImageExpand;
		public closeBtn: ImageExpand;
		public exitBtn: Laya.Label;
		public leftTxt: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogBattleRevive");
		}
	}

	REG("ui.gameui.fog.FogBattleReviveUI", FogBattleReviveUI);

	export class FogBattleStartAlertUI extends Laya.View {
		public desTxt: Laya.Label;
		public itemImg: ImageExpand;
		public leftCountTxt: Laya.Label;
		public startBtn: ImageExpand;
		public fullStartBtn: ImageExpand;
		public freeImg: ImageExpand;
		public btn_close: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogBattleStartAlert");
		}
	}

	REG("ui.gameui.fog.FogBattleStartAlertUI", FogBattleStartAlertUI);

	export class FogBoxUI extends Laya.View {
		public titleLab: Laya.Label;
		public boxImg: ImageExpand;
		public closeBtn: ImageExpand;
		public lockedGroup: ImageExpand;
		public keyOpenBtn: ImageExpand;
		public actOpenBtn: ImageExpand;
		public keyNum: Laya.Label;
		public costImg: ImageExpand;
		public actLab: Laya.Label;
		public unlockGroup: ImageExpand;
		public openBtn: ImageExpand;
		public boxDesc: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogBox");
		}
	}

	REG("ui.gameui.fog.FogBoxUI", FogBoxUI);

	export class FogBusUI extends Laya.View {
		public upgradeBtn: ImageExpand;
		public formationBtn: ImageExpand;
		public upgradeGroup: ImageExpand;
		public bussLevel: Laya.Label;
		public busDesc: Laya.Label;
		public busUpgradeGroup: ImageExpand;
		public busUpgradeBtn: ImageExpand;
		public upgradeCostGroup: ImageExpand;
		public costImg: ImageExpand;
		public costNum: Laya.Label;
		public fullLevel: Laya.Label;
		public busIcon: ImageExpand;
		public attriGroup: ImageExpand;
		public attackNum: Laya.Label;
		public bloodNum: Laya.Label;
		public energyNum: Laya.Label;
		public formationGroup: ImageExpand;
		public rolePanel: Laya.Panel;
		public leftRoleLab: Laya.Label;
		public btn_close: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogBus");
		}
	}

	REG("ui.gameui.fog.FogBusUI", FogBusUI);

	export class FogBusinessmanUI extends Laya.View {
		public titleLab: Laya.Label;
		public upperGroup: ImageExpand;
		public upperLab: Laya.Label;
		public middleGroup: ImageExpand;
		public roleName: Laya.Label;
		public roleDesc: Laya.Label;
		public roleImg: ImageExpand;
		public buyBtn: ImageExpand;
		public costImg: ImageExpand;
		public costNum: Laya.Label;
		public freeBuyBtn: ImageExpand;
		public freeImg: ImageExpand;
		public btn_close: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogBusinessman");
		}
	}

	REG("ui.gameui.fog.FogBusinessmanUI", FogBusinessmanUI);

	export class FogChooseUI extends Laya.View {
		public titleLab: Laya.Label;
		public middleGroup: ImageExpand;
		public itemName0: Laya.Label;
		public item0: ImageExpand;
		public itemImg0: ImageExpand;
		public itemDesc0: Laya.Label;
		public itemChoose0: ImageExpand;
		public itemNum0: Laya.Label;
		public itemName1: Laya.Label;
		public item1: ImageExpand;
		public itemImg1: ImageExpand;
		public itemChoose1: ImageExpand;
		public itemDesc1: Laya.Label;
		public itemNum1: Laya.Label;
		public singleBtn: ImageExpand;
		public allBtn: ImageExpand;
		public freeImg: ImageExpand;
		public eventDesc: Laya.Label;
		public btn_close: ImageExpand;
		public roleSpine: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogChoose");
		}
	}

	REG("ui.gameui.fog.FogChooseUI", FogChooseUI);

	export class FogComRewardUI extends Laya.View {
		public titleLab: Laya.Label;
		public receiveBtn: ImageExpand;
		public rewardGroup: ImageExpand;
		public reward1: ImageExpand;
		public pieceBg: ImageExpand;
		public rewardImg1: ImageExpand;
		public rewardNum1: Laya.Label;
		public reward2: ImageExpand;
		public rewardImg2: ImageExpand;
		public rewardNum2: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogComReward");
		}
	}

	REG("ui.gameui.fog.FogComRewardUI", FogComRewardUI);

	export class FogDoorUI extends Laya.View {
		public titleLab: Laya.Label;
		public eventImg: ImageExpand;
		public closeBtn: ImageExpand;
		public lockedGroup: ImageExpand;
		public keyOpenBtn: ImageExpand;
		public actOpenBtn: ImageExpand;
		public keyNum: Laya.Label;
		public costImg: ImageExpand;
		public actLab: Laya.Label;
		public unlockGroup: ImageExpand;
		public openBtn: ImageExpand;
		public doorDesc: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogDoor");
		}
	}

	REG("ui.gameui.fog.FogDoorUI", FogDoorUI);

	export class FogFreeActUI extends Laya.View {
		public titleLab: Laya.Label;
		public closeBtn: ImageExpand;
		public actNum: Laya.Label;
		public getBtn: ImageExpand;
		public freeLab: Laya.Label;
		public freeImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogFreeAct");
		}
	}

	REG("ui.gameui.fog.FogFreeActUI", FogFreeActUI);

	export class FogHandinUI extends Laya.View {
		public titleLab: Laya.Label;
		public descLab: Laya.Label;
		public handBtn: ImageExpand;
		public closeBtn: ImageExpand;
		public itemList: Laya.List;
		public roleSpine: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogHandin");
		}
	}

	REG("ui.gameui.fog.FogHandinUI", FogHandinUI);

	export class FogInitRoleUI extends Laya.View {
		public lineGroup: ImageExpand;
		public descGroup: ImageExpand;
		public descTxt: laya.display.Text;
		public confirmBtn: ImageExpand;
		public txtGroup: ImageExpand;
		public leftSpeak: ImageExpand;
		public leftTxt: Laya.Label;
		public rightSpeak: ImageExpand;
		public rightTxt: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogInitRole");
		}
	}

	REG("ui.gameui.fog.FogInitRoleUI", FogInitRoleUI);

	export class FogMainUI extends Laya.View {
		public cellCtn: ImageExpand;
		public topGroup: ImageExpand;
		public conGroup: ImageExpand;
		public conImg: ImageExpand;
		public conNum: Laya.Label;
		public actGroup: ImageExpand;
		public actImg: ImageExpand;
		public addActBtn: ImageExpand;
		public actNum: Laya.Label;
		public layerTxt: Laya.Label;
		public forceNum: Laya.Label;
		public bottomGroup: ImageExpand;
		public bagBtn: ImageExpand;
		public shopBtn: ImageExpand;
		public shopRedImg: ImageExpand;
		public busImg: ImageExpand;
		public busBtn: ImageExpand;
		public busLevelTxt: Laya.Label;
		public busRedImg: ImageExpand;
		public exitImg: Laya.Box;
		public exitBtn: ImageExpand;
		public itemName: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogMain");
		}
	}

	REG("ui.gameui.fog.FogMainUI", FogMainUI);

	export class FogMultiRewardUI extends Laya.View {
		public titleLab: Laya.Label;
		public receiveBtn: ImageExpand;
		public closeBtn: ImageExpand;
		public itemList: Laya.List;
		public scrollBar: Laya.HScrollBar;
		public descGroup: ImageExpand;
		public lbl_desc: Laya.Label;
		public compImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogMultiReward");
		}
	}

	REG("ui.gameui.fog.FogMultiRewardUI", FogMultiRewardUI);

	export class FogNpcTalkUI extends Laya.View {
		public bgImg: ImageExpand;
		public panel: ImageExpand;
		public panelImg: ImageExpand;
		public text: laya.display.Text;
		public continueBtn: Laya.Box;
		public leftImg: ImageExpand;
		public rightImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogNpcTalk");
		}
	}

	REG("ui.gameui.fog.FogNpcTalkUI", FogNpcTalkUI);

	export class FogObstacleUI extends Laya.View {
		public titleLab: Laya.Label;
		public costGroup: ImageExpand;
		public costBtn: ImageExpand;
		public costLab: Laya.Label;
		public costImg: ImageExpand;
		public costNum: Laya.Label;
		public freeBtn: ImageExpand;
		public freeLab: Laya.Label;
		public freeImg: ImageExpand;
		public btn_close: ImageExpand;
		public descLab: Laya.Label;
		public eventImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogObstacle");
		}
	}

	REG("ui.gameui.fog.FogObstacleUI", FogObstacleUI);

	export class FogResultUI extends Laya.View {
		public bgImg: ImageExpand;
		public rewardGroup: ImageExpand;
		public item1: ImageExpand;
		public itemImg: ImageExpand;
		public itemNum: Laya.Label;
		public item0: ImageExpand;
		public compNum: Laya.Label;
		public item2: ImageExpand;
		public eventNum: Laya.Label;
		public item3: ImageExpand;
		public killNum: Laya.Label;
		public layerGroup: ImageExpand;
		public maxLayer: Laya.Label;
		public scoreGroup: ImageExpand;
		public scoreNum: Laya.Label;
		public bottumGroup: ImageExpand;
		public coinNum: Laya.Label;
		public fogCoinNum: Laya.Label;
		public multiBtn: ImageExpand;
		public freeLab: Laya.Label;
		public freeImg: ImageExpand;
		public returnLab: Laya.Label;
		public returnBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogResult");
		}
	}

	REG("ui.gameui.fog.FogResultUI", FogResultUI);

	export class FogResultRewardUI extends Laya.View {
		public bgImg: ImageExpand;
		public rewardPanel: Laya.Panel;
		public continueBtn: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogResultReward");
		}
	}

	REG("ui.gameui.fog.FogResultRewardUI", FogResultRewardUI);

	export class FogRewardItemUI extends Laya.View {
		public item: ImageExpand;
		public itemIcon: ImageExpand;
		public itemLab: Laya.Label;
		public pieceImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogRewardItem");
		}
	}

	REG("ui.gameui.fog.FogRewardItemUI", FogRewardItemUI);

	export class FogRoleItemUI extends Laya.View {
		public item: ImageExpand;
		public qualImg: ImageExpand;
		public aniGroup: ImageExpand;
		public videoGroup: ImageExpand;
		public unlockImg: ImageExpand;
		public unlockTxt: Laya.Label;
		public starGroup: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogRoleItem");
		}
	}

	REG("ui.gameui.fog.FogRoleItemUI", FogRoleItemUI);

	export class FogRoleLineItemUI extends Laya.View {
		public item: Laya.Box;
		public qualImg: ImageExpand;
		public costTxt: Laya.Label;
		public iconImg: ImageExpand;
		public inlineGroup: ImageExpand;
		public inLineImg: ImageExpand;
		public starGroup: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogRoleLineItem");
		}
	}

	REG("ui.gameui.fog.FogRoleLineItemUI", FogRoleLineItemUI);

	export class FogShopUI extends Laya.View {
		public titleLab: Laya.Label;
		public itemName0: Laya.Label;
		public itemImg0: ImageExpand;
		public itemNum0: Laya.Label;
		public buyBtn0: ImageExpand;
		public costNum0: Laya.Label;
		public costImg0: ImageExpand;
		public smallImg0: ImageExpand;
		public item0: ImageExpand;
		public itemName1: Laya.Label;
		public itemImg1: ImageExpand;
		public itemNum1: Laya.Label;
		public buyBtn1: ImageExpand;
		public costNum1: Laya.Label;
		public costImg1: ImageExpand;
		public smallImg1: ImageExpand;
		public item1: ImageExpand;
		public itemName2: Laya.Label;
		public itemImg2: ImageExpand;
		public itemNum2: Laya.Label;
		public buyBtn2: ImageExpand;
		public costNum2: Laya.Label;
		public costImg2: ImageExpand;
		public smallImg2: ImageExpand;
		public item2: ImageExpand;
		public itemName3: Laya.Label;
		public itemImg3: ImageExpand;
		public itemNum3: Laya.Label;
		public buyBtn3: ImageExpand;
		public costNum3: Laya.Label;
		public costImg3: ImageExpand;
		public smallImg3: ImageExpand;
		public item3: ImageExpand;
		public itemName4: Laya.Label;
		public itemImg4: ImageExpand;
		public itemNum4: Laya.Label;
		public buyBtn4: ImageExpand;
		public costNum4: Laya.Label;
		public costImg4: ImageExpand;
		public smallImg4: ImageExpand;
		public item4: ImageExpand;
		public itemName5: Laya.Label;
		public itemImg5: ImageExpand;
		public itemNum5: Laya.Label;
		public buyBtn5: ImageExpand;
		public costNum5: Laya.Label;
		public costImg5: ImageExpand;
		public smallImg5: ImageExpand;
		public item5: ImageExpand;
		public freshBtn: ImageExpand;
		public freeImg: ImageExpand;
		public freeLab: Laya.Label;
		public closeBtn: ImageExpand;
		public freshTxt: Laya.Label;
		public topGroup: ImageExpand;
		public fogCoinGroup: ImageExpand;
		public fogCoinImg: ImageExpand;
		public fogCoinNum: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogShop");
		}
	}

	REG("ui.gameui.fog.FogShopUI", FogShopUI);

	export class FogShopItemDetailUI extends Laya.View {
		public closeBtn: ImageExpand;
		public itemName: Laya.Label;
		public itemDesc: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogShopItemDetail");
		}
	}

	REG("ui.gameui.fog.FogShopItemDetailUI", FogShopItemDetailUI);

	export class FogStartWarUI extends Laya.View {
		public descLab: Laya.Label;
		public confirmBtn: ImageExpand;
		public returnBtn: ImageExpand;
		public btn_close: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogStartWar");
		}
	}

	REG("ui.gameui.fog.FogStartWarUI", FogStartWarUI);

	export class FogTipUI extends Laya.View {
		public bgImg: ImageExpand;
		public titleImg: ImageExpand;
		public titleLab: Laya.Label;
		public exitGroup: Laya.Box;
		public overBtn: ImageExpand;
		public pauseBtn: ImageExpand;
		public commonTip: Laya.Box;
		public descLab: Laya.Label;
		public confirmBtn: ImageExpand;
		public tipBtnGroup: ImageExpand;
		public exitBtn: ImageExpand;
		public continueBtn: ImageExpand;
		public btn_close: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogTip");
		}
	}

	REG("ui.gameui.fog.FogTipUI", FogTipUI);

	export class FogUserRoleUI extends Laya.View {
		public titleLab: Laya.Label;
		public desc: Laya.Label;
		public roleSpine: ImageExpand;
		public btn_close: ImageExpand;
		public takeBtn: ImageExpand;
		public costGroup: ImageExpand;
		public costImg: ImageExpand;
		public costNum: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogUserRole");
		}
	}

	REG("ui.gameui.fog.FogUserRoleUI", FogUserRoleUI);

	export class FogVideoEnterUI extends Laya.View {
		public closeBtn: ImageExpand;
		public receiveBtn: ImageExpand;
		public receiveImg: ImageExpand;
		public countLab: Laya.Label;
		public lbl_desc: Laya.Label;
		public titleLab: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/fog/FogVideoEnter");
		}
	}

	REG("ui.gameui.fog.FogVideoEnterUI", FogVideoEnterUI);
}
export module ui.gameui.guide {
	export class GuideUI extends Laya.View {
		public guideArea: ImageExpand;
		public panel: ImageExpand;
		public text: laya.display.Text;
		public continueBtn: Laya.Box;
		public guideLeft: ImageExpand;
		public guideRight: ImageExpand;
		public touch: ImageExpand;
		public taskGroup: ImageExpand;
		public taskTxt: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/guide/Guide");
		}
	}

	REG("ui.gameui.guide.GuideUI", GuideUI);
}
export module ui.gameui.jump {
	export class InterJumpUI extends Laya.View {
		public img_jump: ImageExpand;
		public btn_exit: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/jump/InterJump");
		}
	}

	REG("ui.gameui.jump.InterJumpUI", InterJumpUI);

	export class JumpExitUI extends Laya.Scene {
		public img_jump: ImageExpand;
		public list_jump: Laya.Panel;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/jump/JumpExit");
		}
	}

	REG("ui.gameui.jump.JumpExitUI", JumpExitUI);

	export class JumpListUI extends Laya.View {
		public leftTopGroup: Laya.Box;
		public closeBtn: ImageExpand;
		public midTopGroup: Laya.Box;
		public topListGroup: Laya.Box;
		public iconPanel1: Laya.Panel;
		public iconPanel2: Laya.Panel;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/jump/JumpList");
		}
	}

	REG("ui.gameui.jump.JumpListUI", JumpListUI);

	export class JumpListZhiseUI extends Laya.View {
		public leftTopGroup: Laya.Box;
		public closeBtn: ImageExpand;
		public midTopGroup: Laya.Box;
		public topListGroup: Laya.Box;
		public iconPanel1: Laya.Panel;
		public iconPanel2: Laya.Panel;
		public playBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/jump/JumpListZhise");
		}
	}

	REG("ui.gameui.jump.JumpListZhiseUI", JumpListZhiseUI);

	export class MainJumpKariquUI extends Laya.View {
		public closeBtn: ImageExpand;
		public iconPanel: Laya.Panel;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/jump/MainJumpKariqu");
		}
	}

	REG("ui.gameui.jump.MainJumpKariquUI", MainJumpKariquUI);

	export class MainJumpZhiseUI extends Laya.View {
		public closeBtn: ImageExpand;
		public iconPanel: Laya.Panel;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/jump/MainJumpZhise");
		}
	}

	REG("ui.gameui.jump.MainJumpZhiseUI", MainJumpZhiseUI);

	export class ResultJumpUI extends Laya.View {
		public bg: ImageExpand;
		public iconPanel: Laya.Panel;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/jump/ResultJump");
		}
	}

	REG("ui.gameui.jump.ResultJumpUI", ResultJumpUI);

	export class ResultJumpDoubleUI extends Laya.View {
		public bg: ImageExpand;
		public tipLab: Laya.Label;
		public iconBg: ImageExpand;
		public iconPanel: Laya.Panel;
		public secondIconBg: ImageExpand;
		public secondIconPanel: Laya.Panel;
		public resultTitle: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/jump/ResultJumpDouble");
		}
	}

	REG("ui.gameui.jump.ResultJumpDoubleUI", ResultJumpDoubleUI);
}
export module ui.gameui.login {
	export class LoginUI extends Laya.View {
		public mainbg: ImageExpand;
		public account: Laya.TextInput;
		public password: Laya.TextInput;
		public invite: Laya.TextInput;
		public shareInfo: Laya.TextInput;
		public loginbtn: Laya.Button;
		public exitbtn: Laya.Button;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/login/Login");
		}
	}

	REG("ui.gameui.login.LoginUI", LoginUI);
}
export module ui.gameui.main {
	export class AirDropDetailUI extends Laya.View {
		public coinLab: Laya.Label;
		public rewardImg: ImageExpand;
		public closeBtn: ImageExpand;
		public receiveBtn: ImageExpand;
		public freeImg: ImageExpand;
		public desTxt: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/main/AirDropDetail");
		}
	}

	REG("ui.gameui.main.AirDropDetailUI", AirDropDetailUI);

	export class BoxInfoUI extends Laya.View {
		public desTxt: Laya.Label;
		public rewardCount: Laya.Label;
		public rewardImg: ImageExpand;
		public receiveBtn: ImageExpand;
		public closeBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/main/BoxInfo");
		}
	}

	REG("ui.gameui.main.BoxInfoUI", BoxInfoUI);

	export class DailyGoldUI extends Laya.View {
		public lbl_nextTime: Laya.Label;
		public lbl_nextNum: Laya.Label;
		public lbl_currentTime: Laya.Label;
		public lbl_currentNum: Laya.Label;
		public btn_getReward: ImageExpand;
		public img_adv: ImageExpand;
		public closeBtn: ImageExpand;
		public group_step: ImageExpand;
		public lbl_step: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/main/DailyGold");
		}
	}

	REG("ui.gameui.main.DailyGoldUI", DailyGoldUI);

	export class FlatItemUI extends Laya.View {
		public flatImg: ImageExpand;
		public leftRoleSpine: ImageExpand;
		public leftRoleClickArea: ImageExpand;
		public leftRoleName: Laya.Label;
		public leftEquipedImg: ImageExpand;
		public leftCanUpgrade: ImageExpand;
		public leftUnlockCond: ImageExpand;
		public leftUnlockCondLab: Laya.Label;
		public leftCompose: Laya.Label;
		public leftSpeak: ImageExpand;
		public leftSpeakLab: Laya.Label;
		public leftStar: ImageExpand;
		public rightRoleSpine: ImageExpand;
		public rightRoleClickArea: ImageExpand;
		public rightRoleName: Laya.Label;
		public rightEquipedImg: ImageExpand;
		public rightCanUpgrade: ImageExpand;
		public rightUnlockCond: ImageExpand;
		public rightUnlockCondLab: Laya.Label;
		public rightCompose: Laya.Label;
		public rightSpeak: ImageExpand;
		public rightSpeakLab: Laya.Label;
		public rightStar: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/main/FlatItem");
		}
	}

	REG("ui.gameui.main.FlatItemUI", FlatItemUI);

	export class FreeResourceUI extends Laya.View {
		public closeBtn: ImageExpand;
		public receiveBtn: ImageExpand;
		public receiveImg: ImageExpand;
		public lbl_desc: Laya.Label;
		public getNum: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/main/FreeResource");
		}
	}

	REG("ui.gameui.main.FreeResourceUI", FreeResourceUI);

	export class OfflineIncomeUI extends Laya.View {
		public normalRewardGroup: ImageExpand;
		public lbl_normalReward: Laya.Label;
		public btn_normalReward: ImageExpand;
		public multiRewardGroup: ImageExpand;
		public lbl_multiReward: Laya.Label;
		public btn_multiReward: ImageExpand;
		public lbl_multi: Laya.Label;
		public freeImg: ImageExpand;
		public closeBtn: ImageExpand;
		public roleSpine: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/main/OfflineIncome");
		}
	}

	REG("ui.gameui.main.OfflineIncomeUI", OfflineIncomeUI);

	export class OfflineRewardDoubleUI extends Laya.View {
		public lbl_desc: Laya.Label;
		public titleLab: Laya.Label;
		public normalRewardGroup: ImageExpand;
		public lbl_normalReward: Laya.Label;
		public btn_multiReward: ImageExpand;
		public freeImg: ImageExpand;
		public closeBtn: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/main/OfflineRewardDouble");
		}
	}

	REG("ui.gameui.main.OfflineRewardDoubleUI", OfflineRewardDoubleUI);

	export class SettingUI extends Laya.View {
		public bgMusicScroll: Laya.HScrollBar;
		public soundScroll: Laya.HScrollBar;
		public shakeBtn: ImageExpand;
		public closeImg: ImageExpand;
		public openImg: ImageExpand;
		public closeBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/main/Setting");
		}
	}

	REG("ui.gameui.main.SettingUI", SettingUI);

	export class SevenDaysUI extends Laya.View {
		public item0: ImageExpand;
		public rewardImg0: ImageExpand;
		public rewardTxt0: Laya.Label;
		public hasReceiveGroup0: ImageExpand;
		public receiveBtn0: ImageExpand;
		public receiveBtnLab0: Laya.Label;
		public item1: ImageExpand;
		public rewardImg1: ImageExpand;
		public rewardTxt1: Laya.Label;
		public hasReceiveGroup1: ImageExpand;
		public receiveBtn1: ImageExpand;
		public receiveBtnLab1: Laya.Label;
		public item2: ImageExpand;
		public rewardImg2: ImageExpand;
		public rewardTxt2: Laya.Label;
		public hasReceiveGroup2: ImageExpand;
		public receiveBtn2: ImageExpand;
		public receiveBtnLab2: Laya.Label;
		public item3: ImageExpand;
		public rewardImg3: ImageExpand;
		public rewardTxt3: Laya.Label;
		public hasReceiveGroup3: ImageExpand;
		public receiveBtn3: ImageExpand;
		public receiveBtnLab3: Laya.Label;
		public item4: ImageExpand;
		public rewardImg4: ImageExpand;
		public rewardTxt4: Laya.Label;
		public hasReceiveGroup4: ImageExpand;
		public receiveBtn4: ImageExpand;
		public receiveBtnLab4: Laya.Label;
		public item5: ImageExpand;
		public rewardImg5: ImageExpand;
		public rewardTxt5: Laya.Label;
		public hasReceiveGroup5: ImageExpand;
		public receiveBtn5: ImageExpand;
		public receiveBtnLab5: Laya.Label;
		public item6: ImageExpand;
		public rewardImg6: ImageExpand;
		public rewardTxt6: Laya.Label;
		public hasReceiveGroup6: ImageExpand;
		public receiveBtn6: ImageExpand;
		public receiveBtnLab6: Laya.Label;
		public closeBtn: ImageExpand;
		public roleSpine: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/main/SevenDays");
		}
	}

	REG("ui.gameui.main.SevenDaysUI", SevenDaysUI);

	export class TurnableUI extends Laya.View {
		public rotateGroup: ImageExpand;
		public rewardIcon0: ImageExpand;
		public rewardCount0: Laya.Label;
		public rewardIcon1: ImageExpand;
		public rewardCount1: Laya.Label;
		public rewardIcon2: ImageExpand;
		public rewardCount2: Laya.Label;
		public rewardIcon3: ImageExpand;
		public rewardCount3: Laya.Label;
		public rewardIcon4: ImageExpand;
		public rewardCount4: Laya.Label;
		public rewardIcon5: ImageExpand;
		public rewardCount5: Laya.Label;
		public rewardIcon6: ImageExpand;
		public rewardCount6: Laya.Label;
		public rewardIcon7: ImageExpand;
		public rewardCount7: Laya.Label;
		public zpZhenImg: ImageExpand;
		public turnCountTxt: Laya.Label;
		public boxGroup: ImageExpand;
		public progressImg: ImageExpand;
		public cjBtn: ImageExpand;
		public freeGroup: ImageExpand;
		public videoGroup: ImageExpand;
		public adImg: ImageExpand;
		public closeBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/main/Turnable");
		}
	}

	REG("ui.gameui.main.TurnableUI", TurnableUI);
}
export module ui.gameui.role {
	export class EquipComposeUI extends Laya.View {
		public bgImg: ImageExpand;
		public iconImg: ImageExpand;
		public nameTxt: Laya.Label;
		public desTxt: Laya.Label;
		public proDi: ImageExpand;
		public proImg: ImageExpand;
		public proTxt: Laya.Label;
		public attrTxt: Laya.Label;
		public getBtn: ImageExpand;
		public composeBtn: ImageExpand;
		public costImg: ImageExpand;
		public costTxt: Laya.Label;
		public closeBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/role/EquipCompose");
		}
	}

	REG("ui.gameui.role.EquipComposeUI", EquipComposeUI);

	export class EquipItemUI extends Laya.View {
		public bgImg: ImageExpand;
		public iconImg: ImageExpand;
		public noEquipGroup: ImageExpand;
		public composeGroup: ImageExpand;
		public composeTxt: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/role/EquipItem");
		}
	}

	REG("ui.gameui.role.EquipItemUI", EquipItemUI);

	export class EvoPreviewUI extends Laya.View {
		public bgImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/role/EvoPreview");
		}
	}

	REG("ui.gameui.role.EvoPreviewUI", EvoPreviewUI);

	export class EvoRewardUI extends Laya.View {
		public roleSpine: ImageExpand;
		public firstAttack: Laya.Label;
		public lastAttack: Laya.Label;
		public firstLife: Laya.Label;
		public lastLife: Laya.Label;
		public skillTxt: Laya.Label;
		public btn_close: ImageExpand;
		public btn_reward: ImageExpand;
		public rewardImg: ImageExpand;
		public rewardNum: Laya.Label;
		public freeImg: ImageExpand;
		public btn_return: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/role/EvoReward");
		}
	}

	REG("ui.gameui.role.EvoRewardUI", EvoRewardUI);

	export class HomeUpgradeUI extends Laya.View {
		public homeLevel: Laya.Label;
		public btn_close: ImageExpand;
		public homeSpine: ImageExpand;
		public homeMask: ImageExpand;
		public attrributeGroup: ImageExpand;
		public attrDesc_0: Laya.Label;
		public attrValue_0: Laya.Label;
		public attrValueAdd_0: Laya.Label;
		public attrDesc_1: Laya.Label;
		public attrValue_1: Laya.Label;
		public attrValueAdd_1: Laya.Label;
		public attrDesc_2: Laya.Label;
		public attrValue_2: Laya.Label;
		public attrValueAdd_2: Laya.Label;
		public attrDesc_3: Laya.Label;
		public attrValue_3: Laya.Label;
		public attrValueAdd_3: Laya.Label;
		public upSpineArea: ImageExpand;
		public skillGroup: ImageExpand;
		public skillGroup0: ImageExpand;
		public skillBtn0: ImageExpand;
		public skillIcon0: ImageExpand;
		public unlockLab0: Laya.Label;
		public skillGroup1: ImageExpand;
		public skillBtn1: ImageExpand;
		public skillIcon1: ImageExpand;
		public unlockLab1: Laya.Label;
		public skillGroup2: ImageExpand;
		public skillBtn2: ImageExpand;
		public skillIcon2: ImageExpand;
		public unlockLab2: Laya.Label;
		public skillGroup3: ImageExpand;
		public skillBtn3: ImageExpand;
		public skillIcon3: ImageExpand;
		public unlockLab3: Laya.Label;
		public upgradeGroup: ImageExpand;
		public fullLevelLab: Laya.Label;
		public canUpgradeGroup: ImageExpand;
		public upgradeBtn: ImageExpand;
		public upgradeLab: Laya.Label;
		public upgradeCostImg: ImageExpand;
		public upgradeCostNum: Laya.Label;
		public skillDescGroup: ImageExpand;
		public cdLab: Laya.Label;
		public skillDesclab: Laya.Label;
		public descIndexPos: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/role/HomeUpgrade");
		}
	}

	REG("ui.gameui.role.HomeUpgradeUI", HomeUpgradeUI);

	export class RoleBarrageUI extends Laya.View {
		public barrageCtn: ImageExpand;
		public roleSpine: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/role/RoleBarrage");
		}
	}

	REG("ui.gameui.role.RoleBarrageUI", RoleBarrageUI);

	export class RoleDetailUI extends Laya.View {
		public roleBtn: ImageExpand;
		public equipBtn: ImageExpand;
		public equipRed: ImageExpand;
		public ctn: ImageExpand;
		public btn_close: ImageExpand;
		public topGroup: ImageExpand;
		public coinGroup: ImageExpand;
		public coinNum: Laya.Label;
		public addCoinBtn: ImageExpand;
		public goldGroup: ImageExpand;
		public goldNum: Laya.Label;
		public addGoldBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/role/RoleDetail");
		}
	}

	REG("ui.gameui.role.RoleDetailUI", RoleDetailUI);

	export class RoleEquipmentUI extends Laya.View {
		public nameTxt: Laya.Label;
		public starGroup: ImageExpand;
		public equipGroup: ImageExpand;
		public aniGroup: ImageExpand;
		public evoluShow: ImageExpand;
		public unlockTxt: Laya.Label;
		public unlockEvoBtn: ImageExpand;
		public costBtn: ImageExpand;
		public costImg: ImageExpand;
		public costTxt: Laya.Label;
		public adEvoBtn: ImageExpand;
		public adImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/role/RoleEquipment");
		}
	}

	REG("ui.gameui.role.RoleEquipmentUI", RoleEquipmentUI);

	export class RoleInfoUI extends Laya.View {
		public roleSpine: ImageExpand;
		public roleMask: ImageExpand;
		public upSpineArea: ImageExpand;
		public roleSpeak: ImageExpand;
		public roleSpeakLab: Laya.Label;
		public roleName: Laya.Label;
		public roleLevel: Laya.Label;
		public roleDesc: Laya.Label;
		public attackImg: ImageExpand;
		public attackNum: Laya.Label;
		public moveSpeedImg: ImageExpand;
		public moveSpeedNum: Laya.Label;
		public hitImg: ImageExpand;
		public hitNum: Laya.Label;
		public targetImg: ImageExpand;
		public targetNum: Laya.Label;
		public bloodImg: ImageExpand;
		public bloodNum: Laya.Label;
		public disImg: ImageExpand;
		public attackRangeNum: Laya.Label;
		public attackType: ImageExpand;
		public attackTypeNum: Laya.Label;
		public attackSuImg: ImageExpand;
		public attackSpeedNum: Laya.Label;
		public beHitImg: ImageExpand;
		public beHitNum: Laya.Label;
		public dodgeImg: ImageExpand;
		public dodgeNum: Laya.Label;
		public unlockGroup: ImageExpand;
		public unlockBtn: ImageExpand;
		public unlockCostImg: ImageExpand;
		public unlockCostNum: Laya.Label;
		public upgradeGroup: ImageExpand;
		public fullLevelLab: Laya.Label;
		public canUpgradeGroup: ImageExpand;
		public upgradeBtn: ImageExpand;
		public upgradeLab: Laya.Label;
		public upgradeCostImg: ImageExpand;
		public upgradeCostNum: Laya.Label;
		public unlockLevelLab: Laya.Label;
		public videoUnlockGroup: ImageExpand;
		public videoUnlockBtn: ImageExpand;
		public freeUnlockLab: Laya.Label;
		public freeUnlockImg: ImageExpand;
		public upGroup: ImageExpand;
		public attackGroup: ImageExpand;
		public attackNum1: Laya.Label;
		public attackNum2: Laya.Label;
		public bloodGroup: ImageExpand;
		public bloodNum1: Laya.Label;
		public bloodNum2: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/role/RoleInfo");
		}
	}

	REG("ui.gameui.role.RoleInfoUI", RoleInfoUI);

	export class UnlockRoleUI extends Laya.View {
		public roleSpine: ImageExpand;
		public roleName: Laya.Label;
		public btn_close: ImageExpand;
		public btn_reward: ImageExpand;
		public rewardImg: ImageExpand;
		public rewardNum: Laya.Label;
		public freeImg: ImageExpand;
		public btn_return: Laya.Label;
		public btm_freeGet: ImageExpand;
		public freeGetImg: ImageExpand;
		public freeGetCount: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/role/UnlockRole");
		}
	}

	REG("ui.gameui.role.UnlockRoleUI", UnlockRoleUI);
}
export module ui.gameui.roleLine {
	export class RoleInLineUI extends Laya.View {
		public rolePanel: Laya.Panel;
		public sureBtn: ImageExpand;
		public lineGroup: ImageExpand;
		public txtGroup: ImageExpand;
		public leftSpeak: ImageExpand;
		public leftTxt: Laya.Label;
		public rightSpeak: ImageExpand;
		public rightTxt: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/roleLine/RoleInLine");
		}
	}

	REG("ui.gameui.roleLine.RoleInLineUI", RoleInLineUI);

	export class RoleItemUI extends Laya.View {
		public item: Laya.Box;
		public qualImg: ImageExpand;
		public costTxt: Laya.Label;
		public iconImg: ImageExpand;
		public inlineGroup: ImageExpand;
		public inLineImg: ImageExpand;
		public starGroup: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/roleLine/RoleItem");
		}
	}

	REG("ui.gameui.roleLine.RoleItemUI", RoleItemUI);

	export class RoleLineItemUI extends Laya.View {
		public item: ImageExpand;
		public qualImg: ImageExpand;
		public aniGroup: ImageExpand;
		public maskImg: ImageExpand;
		public unlockGroup: ImageExpand;
		public unlockTxt: Laya.Label;
		public starGroup: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/roleLine/RoleLineItem");
		}
	}

	REG("ui.gameui.roleLine.RoleLineItemUI", RoleLineItemUI);
}
export module ui.gameui.share {
	export class InviteUI extends Laya.View {
		public shareBtn: ImageExpand;
		public closeBtn: ImageExpand;
		public sharePanel: Laya.Panel;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/share/Invite");
		}
	}

	REG("ui.gameui.share.InviteUI", InviteUI);

	export class InviteListUI extends Laya.View {
		public dikuang: ImageExpand;
		public list_num: Laya.Label;
		public rewardImg: ImageExpand;
		public reward_num: Laya.Label;
		public reward_description: Laya.Label;
		public reward_has_recive: Laya.Label;
		public reward_no_recive: ImageExpand;
		public reward_btn: ImageExpand;
		public reward_status: Laya.Label;
		public reward_progress: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/share/InviteList");
		}
	}

	REG("ui.gameui.share.InviteListUI", InviteListUI);
}
export module ui.gameui.shop {
	export class EquipPieceGetUI extends Laya.View {
		public goldCostBtn: ImageExpand;
		public costImg: ImageExpand;
		public costNumTxt: Laya.Label;
		public btn_getReward: ImageExpand;
		public adCountTxt: Laya.Label;
		public img_adv: ImageExpand;
		public freeGroup: ImageExpand;
		public freeGetBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/shop/EquipPieceGet");
		}
	}

	REG("ui.gameui.shop.EquipPieceGetUI", EquipPieceGetUI);

	export class MainShopUI extends Laya.View {
		public ctn: Laya.Panel;
		public aniGroup: ImageExpand;
		public leftTxt: Laya.Label;
		public freshBtn: ImageExpand;
		public freeImg: ImageExpand;
		public freshShopGroup: ImageExpand;
		public exitBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/shop/MainShop");
		}
	}

	REG("ui.gameui.shop.MainShopUI", MainShopUI);

	export class MainShopItemUI extends Laya.View {
		public bgImg: ImageExpand;
		public itemImg: ImageExpand;
		public itemNum: Laya.Label;
		public smallImg: ImageExpand;
		public goodNameTxt: Laya.Label;
		public leftGrouup: Laya.Label;
		public leftCountTxt: Laya.Label;
		public discountTxt: Laya.Label;
		public noCountTxt: Laya.Label;
		public coinBtn: ImageExpand;
		public coinTxt: Laya.Label;
		public goldCostBtn: ImageExpand;
		public goldTxt: Laya.Label;
		public videoGetBtn: ImageExpand;
		public freeImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/shop/MainShopItem");
		}
	}

	REG("ui.gameui.shop.MainShopItemUI", MainShopItemUI);
}
export module ui.gameui.task {
	export class ChatDetailUI extends Laya.View {
		public titleTxt: Laya.Label;
		public receiveBtn: ImageExpand;
		public descTxt: Laya.Label;
		public nameTxt: Laya.Label;
		public processDi: ImageExpand;
		public processImg: ImageExpand;
		public rewardGroup1: Laya.Box;
		public rewardTxt1: Laya.Label;
		public rewardImg1: ImageExpand;
		public rewardGroup2: Laya.Box;
		public rewardTxt2: Laya.Label;
		public rewardImg2: ImageExpand;
		public goOnBtn: ImageExpand;
		public hasReceiveTxt: Laya.Label;
		public closeBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/task/ChatDetail");
		}
	}

	REG("ui.gameui.task.ChatDetailUI", ChatDetailUI);

	export class ChatDialogUI extends Laya.View {
		public topGroup: ImageExpand;
		public btn_close: ImageExpand;
		public chooseGroup: ImageExpand;
		public myDialog1: ImageExpand;
		public dialogTxt1: Laya.Label;
		public myDialog2: ImageExpand;
		public dialogTxt2: Laya.Label;
		public myDialog3: ImageExpand;
		public dialogTxt3: Laya.Label;
		public inPutGroup: ImageExpand;
		public levelGroup: ImageExpand;
		public watchBtn: ImageExpand;
		public returnBtn: ImageExpand;
		public group_ctn: Laya.Panel;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/task/ChatDialog");
		}
	}

	REG("ui.gameui.task.ChatDialogUI", ChatDialogUI);

	export class ChatItemUI extends Laya.View {
		public leftGroup: ImageExpand;
		public myIcon: ImageExpand;
		public leftBg: ImageExpand;
		public leftTxt: Laya.Label;
		public rightGroup: ImageExpand;
		public rightBg: ImageExpand;
		public rightTxt: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/task/ChatItem");
		}
	}

	REG("ui.gameui.task.ChatItemUI", ChatItemUI);

	export class ChatTaskUI extends Laya.View {
		public m_list: Laya.List;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/task/ChatTask");
		}
	}

	REG("ui.gameui.task.ChatTaskUI", ChatTaskUI);

	export class DailyTaskUI extends Laya.View {
		public m_list: Laya.List;
		public group_box: ImageExpand;
		public pro_boxDi: ImageExpand;
		public pro_boxImg: ImageExpand;
		public pointTxt: Laya.Label;
		public taskBox1: ImageExpand;
		public img_box1: ImageExpand;
		public lbl_point1: Laya.Label;
		public taskBox2: ImageExpand;
		public img_box2: ImageExpand;
		public lbl_point2: Laya.Label;
		public taskBox3: ImageExpand;
		public img_box3: ImageExpand;
		public lbl_point3: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/task/DailyTask");
		}
	}

	REG("ui.gameui.task.DailyTaskUI", DailyTaskUI);

	export class TaskUI extends Laya.View {
		public topGroup: ImageExpand;
		public btn_close: ImageExpand;
		public group_ctn: ImageExpand;
		public chatTaskBtn: ImageExpand;
		public dailyTaskBtn: ImageExpand;
		public dailyRed: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/task/Task");
		}
	}

	REG("ui.gameui.task.TaskUI", TaskUI);

	export class TaskDoubleRewardUI extends Laya.View {
		public receiveBtn: ImageExpand;
		public receiveImg: ImageExpand;
		public rewardGroup: ImageExpand;
		public lbl_desc: Laya.Label;
		public closeBtn: Laya.Label;
		public itemList: Laya.List;
		public scrollBar: Laya.HScrollBar;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/task/TaskDoubleReward");
		}
	}

	REG("ui.gameui.task.TaskDoubleRewardUI", TaskDoubleRewardUI);
}
export module ui.gameui.test {
	export class TestOpListUI extends Laya.View {
		public testBtn: ImageExpand;
		public titleLabel: Laya.Label;
		public ridLab: Laya.Label;
		public firstLabel: Laya.Label;
		public secondLabel: Laya.Label;
		public backBtn: ImageExpand;
		public list_params: Laya.List;
		public takeBtn: ImageExpand;
		public returnInfoPanel: Laya.Panel;
		public resultLabel: Laya.Label;
		public errorPanel: Laya.Panel;
		public errorLabel: Laya.Label;
		public clickPanel: Laya.Box;
		public firstPanel: Laya.Box;
		public list_first: Laya.List;
		public secondPanel: Laya.Box;
		public list_second: Laya.List;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/test/TestOpList");
		}
	}

	REG("ui.gameui.test.TestOpListUI", TestOpListUI);
}
export module ui.gameui.work {
	export class WorkCompanyUI extends Laya.View {
		public aniGroup: ImageExpand;
		public desTxt: Laya.Label;
		public companyLevelTxt: Laya.Label;
		public commissionTxt: Laya.Label;
		public starTxt: Laya.Label;
		public numTxt: Laya.Label;
		public timeTxt: Laya.Label;
		public nextGroup: ImageExpand;
		public commisionTxt2: Laya.Label;
		public starTxt2: Laya.Label;
		public numTxt2: Laya.Label;
		public timeTxt2: Laya.Label;
		public upGroup: Laya.Box;
		public passTxt: Laya.Label;
		public hasTxt: Laya.Label;
		public needTxt: Laya.Label;
		public videoUpBtn: ImageExpand;
		public freeImg: ImageExpand;
		public freeRedImg: ImageExpand;
		public upGradeGroup: ImageExpand;
		public costImg: ImageExpand;
		public costTxt: Laya.Label;
		public upGradeBtn: ImageExpand;
		public upRedImg: ImageExpand;
		public fullTxt: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/work/WorkCompany");
		}
	}

	REG("ui.gameui.work.WorkCompanyUI", WorkCompanyUI);

	export class WorkDetailUI extends Laya.View {
		public topGroup: ImageExpand;
		public btn_close: ImageExpand;
		public coinGroup: ImageExpand;
		public coinNum: Laya.Label;
		public addCoinBtn: ImageExpand;
		public goldGroup: ImageExpand;
		public goldNum: Laya.Label;
		public addGoldBtn: ImageExpand;
		public group_ctn: ImageExpand;
		public workBtn: ImageExpand;
		public workRedImg: ImageExpand;
		public companyBtn: ImageExpand;
		public redImg: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/work/WorkDetail");
		}
	}

	REG("ui.gameui.work.WorkDetailUI", WorkDetailUI);

	export class WorkInfoItemUI extends Laya.View {
		public nameTxt: Laya.Label;
		public starGroup: ImageExpand;
		public desTxt: Laya.Label;
		public roleGroup: ImageExpand;
		public startGroup: ImageExpand;
		public costTimeTxt: Laya.Label;
		public startBtn: ImageExpand;
		public doGroup: ImageExpand;
		public doProDi: ImageExpand;
		public doProcess: ImageExpand;
		public quickFinishBtn: ImageExpand;
		public quickFreeImg: ImageExpand;
		public leftTimeTxt: Laya.Label;
		public goldBtn: ImageExpand;
		public goldCostTxt: Laya.Label;
		public receiveBtn: ImageExpand;
		public reward1: ImageExpand;
		public lbl_num1: Laya.Label;
		public img_icon1: ImageExpand;
		public reward2: ImageExpand;
		public lbl_num2: Laya.Label;
		public img_icon2: ImageExpand;
		public finishBtn: ImageExpand;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/work/WorkInfoItem");
		}
	}

	REG("ui.gameui.work.WorkInfoItemUI", WorkInfoItemUI);

	export class WorkRoleUI extends Laya.View {
		public leftTxt: Laya.Label;
		public freshBtn: ImageExpand;
		public freeImg: ImageExpand;
		public companyLevelTxt: Laya.Label;
		public commissionTxt: Laya.Label;
		public workGroup: Laya.Panel;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/work/WorkRole");
		}
	}

	REG("ui.gameui.work.WorkRoleUI", WorkRoleUI);

	export class WorkRoleItemUI extends Laya.View {
		public itemBg: ImageExpand;
		public itemIcon: ImageExpand;
		public maskImg: ImageExpand;
		public workTxt: Laya.Label;
		public lockTxt: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("gameui/work/WorkRoleItem");
		}
	}

	REG("ui.gameui.work.WorkRoleItemUI", WorkRoleItemUI);
}
export module ui {
	export class MainSceneUI extends Laya.Scene {
		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("MainScene");
		}
	}

	REG("ui.MainSceneUI", MainSceneUI);
}
export module ui.native {
	export class GameMainUI extends Laya.View {
		public topGroup: ImageExpand;
		public coinGroup: ImageExpand;
		public coinNum: Laya.Label;
		public addCoinBtn: ImageExpand;
		public goldGroup: ImageExpand;
		public goldNum: Laya.Label;
		public addGoldBtn: ImageExpand;
		public spGroup: ImageExpand;
		public powerCountLab: Laya.Label;
		public powerTimerLab: Laya.Label;
		public addSpBtn: ImageExpand;
		public flatArea: Laya.Panel;
		public bottomGroup: ImageExpand;
		public workBtn: ImageExpand;
		public workRedImg: ImageExpand;
		public flatBtn: ImageExpand;
		public flatRedPoint: ImageExpand;
		public equipImg: ImageExpand;
		public equipBtn: ImageExpand;
		public equipRed: ImageExpand;
		public formationImg: Laya.Box;
		public formationBtn: ImageExpand;
		public formationRed: ImageExpand;
		public fogImg: ImageExpand;
		public fogBtn: ImageExpand;
		public fogRedPoint: ImageExpand;
		public fogLab: Laya.Label;
		public gameStartImg: Laya.Box;
		public gameStartBtn: ImageExpand;
		public costSp: Laya.Label;
		public enterRedImg: ImageExpand;
		public enterGuideImg: ImageExpand;
		public middleGroup: ImageExpand;
		public turnableBtn: ImageExpand;
		public turnQipao: ImageExpand;
		public inviteBtn: ImageExpand;
		public inviteRedPoint: ImageExpand;
		public signBtn: ImageExpand;
		public signRedPoint: ImageExpand;
		public gmBtn: Laya.Label;
		public freeGoldBtn: ImageExpand;
		public freeGoldTip: ImageExpand;
		public settimgBtn: ImageExpand;
		public chatTaskGroup: ImageExpand;
		public taskName: Laya.Label;
		public taskDesc: Laya.Label;
		public taskImg: ImageExpand;
		public taskBtn: ImageExpand;
		public taskPhone: ImageExpand;
		public dailyRedImg: ImageExpand;
		public taskRedTxt: Laya.Label;
		public offlineRewardGroup: ImageExpand;
		public btn_offlineReward: ImageExpand;
		public lbl_offlineReward: Laya.Label;

		constructor() {
			super()
		}

		createChildren(): void {
			super.createChildren();
			this.loadScene("native/GameMain");
		}
	}

	REG("ui.native.GameMainUI", GameMainUI);
}

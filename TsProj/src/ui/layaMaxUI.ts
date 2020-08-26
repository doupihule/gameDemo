

var REG: Function = Laya.ClassUtils.regClass;
export module ui.gameui.battle {
	export class BattleUI extends Laya.Dialog {
		public battleCtn: Laya.Image;
		public topGroup: Laya.Box;
		public pauseBtn: Laya.Image;
		public levelTxt: Laya.Label;
		public rewardGroup: Laya.Image;
		public levelRewardImg: Laya.Image;
		public levelReward: Laya.Label;
		public leftGroup: Laya.Image;
		public leftDesTxt: Laya.Label;
		public leftTxt: Laya.Label;
		public bottomGroup: Laya.Box;
		public bottomImg: Laya.Image;
		public smallMapGroup: Laya.Box;
		public smallMapBg: Laya.Image;
		public pointGroup: Laya.Box;
		public nowArea: Laya.Image;
		public energyGroup: Laya.Box;
		public energyImg: Laya.Image;
		public energyTxt: Laya.Label;
		public roleList: Laya.List;
		public autoGroup: Laya.Box;
		public openCameraImg: Laya.Image;
		public guideArrow: Laya.Image;
		public warTipGroup: Laya.Image;
		public revokeLineBtn: Laya.Image;
		public startWarBtn: Laya.Image;
		public readyLineGroup: Laya.Image;
		public skillGroup: Laya.Box;
		public skillTipGroup: Laya.Box;
		public skillIcon: Laya.Image;
		public roleSignBtn: Laya.Image;
		public roleSignImg: Laya.Image;
		public enemySignBtn: Laya.Image;
		public enemySignImg: Laya.Image;
		public helpRoleGroup: Laya.Image;
		public helpbgImg: Laya.Image;
		public helpiconImg: Laya.Image;
		public helpmaskImg: Laya.Image;
		public helpLeftTxt: Laya.Label;
		public pauseGroup: Laya.Image;
		public returnMainBtn: Laya.Image;
		public rePlayBtn: Laya.Image;
		public continueBtn: Laya.Image;

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
		public bgCtn: Laya.Image;
		public roleCtn: Laya.Image;
		public txtCtn: Laya.Image;
		public helpRoleBtn: Laya.Image;
		public helpFreeImg: Laya.Image;
		public topGroup: Laya.Box;
		public levelTxt: Laya.Label;
		public levelRewardImg: Laya.Image;
		public levelReward: Laya.Label;
		public returnBtn: Laya.Image;
		public firstOver: Laya.Image;
		public firstOverRewardImg: Laya.Image;
		public firstOverRewardTxt: Laya.Label;
		public desTxt: Laya.Label;
		public startGameBtn: Laya.Image;
		public actCostGroup: Laya.Image;
		public actImg: Laya.Image;
		public costNum: Laya.Label;
		public fogFullStartBtn: Laya.Image;
		public spGroup: Laya.Image;
		public startGameBtn1: Laya.Image;

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
		public fullStartBtn: Laya.Image;
		public freeImg: Laya.Image;
		public closeBtn: Laya.Image;
		public normalStartBtn: Laya.Label;
		public desTxt: Laya.Label;
		public rewardImg: Laya.Image;
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
		public aniGroup: Laya.Image;
		public useBtn: Laya.Image;
		public freeImg: Laya.Image;
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
		public pieceGroup: Laya.Image;
		public pieceIcon: Laya.Image;
		public pieceCount: Laya.Label;
		public win: Laya.Image;
		public multiReceiveBtn: Laya.Image;
		public receiveText: Laya.Label;
		public receiveImg: Laya.Image;
		public guideReturnBtn: Laya.Image;
		public shareVideoBtn: Laya.Image;
		public shareRewardNum: Laya.Label;
		public shareVideoImg: Laya.Image;
		public shareRewardImg: Laya.Image;
		public shareVideoTip: Laya.Image;
		public receiveBtn: Laya.Image;
		public lose: Laya.Image;
		public againBtn: Laya.Image;
		public returnBtn: Laya.Image;
		public failTxt: Laya.Label;
		public roleGroup: Laya.Image;
		public aniGroup: Laya.Image;
		public heroSpeak: Laya.Image;
		public heroTxt: Laya.Label;
		public enemySpeak: Laya.Image;
		public enemyTxt: Laya.Label;
		public rewardGroup1: Laya.Box;
		public rewardTxt1: Laya.Label;
		public rewardImg1: Laya.Image;
		public rewardGroup2: Laya.Box;
		public rewardTxt: Laya.Label;
		public rewardImg: Laya.Image;

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
		public reviveBtn: Laya.Image;
		public adImg: Laya.Image;
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
		public useBtn: Laya.Image;
		public freeImg: Laya.Image;
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
		public picCtn: Laya.Image;
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
		public picCtn: Laya.Image;

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
		public sureBtn: Laya.Image;
		public returnBtn: Laya.Image;

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
		public giftImg: Laya.Image;
		public itemList: Laya.List;
		public scrollBar: Laya.HScrollBar;
		public descGroup: Laya.Image;
		public desTxt: Laya.Label;
		public receiveGroup: Laya.Image;
		public doubleReceiveBtn: Laya.Image;
		public doubleTxt: Laya.Label;
		public adImg: Laya.Image;
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
		public levelImg: Laya.Image;
		public activeImg: Laya.Image;
		public workImg: Laya.Image;
		public itemList: Laya.List;
		public scrollBar: Laya.HScrollBar;
		public descGroup: Laya.Image;
		public lbl_desc: Laya.Label;
		public sureBtn: Laya.Image;
		public receiveGroup: Laya.Image;
		public normalReceiveBtn: Laya.Image;
		public doubleReceiveBtn: Laya.Image;
		public freeImg: Laya.Image;
		public hasReceiveTxt: Laya.Label;
		public closeBtn: Laya.Image;

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
		public returnBtn: Laya.Image;
		public enterGuideImg: Laya.Image;

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
		public ctn: Laya.Image;
		public topGroup: Laya.Image;
		public c0inGroup: Laya.Image;
		public coinImg: Laya.Image;
		public coinNum: Laya.Label;
		public addCoinBtn: Laya.Image;
		public goldGroup: Laya.Image;
		public goldImg: Laya.Image;
		public goldNum: Laya.Label;
		public addGoldBtn: Laya.Image;
		public spGroup: Laya.Image;
		public spImg: Laya.Image;
		public powerCountLab: Laya.Label;
		public powerTimerLab: Laya.Label;
		public addSpBtn: Laya.Image;
		public returnBtn: Laya.Image;
		public returnGuideGroup: Laya.Image;
		public handImg: Laya.Image;

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
		public receiveBtn: Laya.Image;
		public receiveImg: Laya.Image;
		public rewardGroup: Laya.Image;
		public pieceBg: Laya.Image;
		public rewardImg: Laya.Image;
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
		public roleSpine: Laya.Image;
		public answerGroup: Laya.Image;
		public answer0: Laya.Image;
		public resultLab0: Laya.Label;
		public resultImg0: Laya.Image;
		public answer1: Laya.Image;
		public resultLab1: Laya.Label;
		public resultImg1: Laya.Image;
		public answer2: Laya.Image;
		public resultLab2: Laya.Label;
		public resultImg2: Laya.Image;
		public answer3: Laya.Image;
		public resultLab3: Laya.Label;
		public resultImg3: Laya.Image;
		public costGroup: Laya.Image;
		public costLab: Laya.Label;
		public costImg: Laya.Image;
		public btn_close: Laya.Image;
		public alertBtn: Laya.Image;
		public freeImg: Laya.Image;
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
		public btn_close: Laya.Image;
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
		public item: Laya.Image;
		public itemIcon: Laya.Image;
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
		public closeBtn: Laya.Image;
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
		public descGroup: Laya.Image;
		public lbl_desc: Laya.Label;
		public compImg: Laya.Image;
		public closeBtn: Laya.Image;
		public receiveBtn: Laya.Image;

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
		public reviveBtn: Laya.Image;
		public freeImg: Laya.Image;
		public closeBtn: Laya.Image;
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
		public itemImg: Laya.Image;
		public leftCountTxt: Laya.Label;
		public startBtn: Laya.Image;
		public fullStartBtn: Laya.Image;
		public freeImg: Laya.Image;
		public btn_close: Laya.Image;

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
		public boxImg: Laya.Image;
		public closeBtn: Laya.Image;
		public lockedGroup: Laya.Image;
		public keyOpenBtn: Laya.Image;
		public actOpenBtn: Laya.Image;
		public keyNum: Laya.Label;
		public costImg: Laya.Image;
		public actLab: Laya.Label;
		public unlockGroup: Laya.Image;
		public openBtn: Laya.Image;
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
		public upgradeBtn: Laya.Image;
		public formationBtn: Laya.Image;
		public upgradeGroup: Laya.Image;
		public bussLevel: Laya.Label;
		public busDesc: Laya.Label;
		public busUpgradeGroup: Laya.Image;
		public busUpgradeBtn: Laya.Image;
		public upgradeCostGroup: Laya.Image;
		public costImg: Laya.Image;
		public costNum: Laya.Label;
		public fullLevel: Laya.Label;
		public busIcon: Laya.Image;
		public attriGroup: Laya.Image;
		public attackNum: Laya.Label;
		public bloodNum: Laya.Label;
		public energyNum: Laya.Label;
		public formationGroup: Laya.Image;
		public rolePanel: Laya.Panel;
		public leftRoleLab: Laya.Label;
		public btn_close: Laya.Image;

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
		public upperGroup: Laya.Image;
		public upperLab: Laya.Label;
		public middleGroup: Laya.Image;
		public roleName: Laya.Label;
		public roleDesc: Laya.Label;
		public roleImg: Laya.Image;
		public buyBtn: Laya.Image;
		public costImg: Laya.Image;
		public costNum: Laya.Label;
		public freeBuyBtn: Laya.Image;
		public freeImg: Laya.Image;
		public btn_close: Laya.Image;

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
		public middleGroup: Laya.Image;
		public itemName0: Laya.Label;
		public item0: Laya.Image;
		public itemImg0: Laya.Image;
		public itemDesc0: Laya.Label;
		public itemChoose0: Laya.Image;
		public itemNum0: Laya.Label;
		public itemName1: Laya.Label;
		public item1: Laya.Image;
		public itemImg1: Laya.Image;
		public itemChoose1: Laya.Image;
		public itemDesc1: Laya.Label;
		public itemNum1: Laya.Label;
		public singleBtn: Laya.Image;
		public allBtn: Laya.Image;
		public freeImg: Laya.Image;
		public eventDesc: Laya.Label;
		public btn_close: Laya.Image;
		public roleSpine: Laya.Image;

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
		public receiveBtn: Laya.Image;
		public rewardGroup: Laya.Image;
		public reward1: Laya.Image;
		public pieceBg: Laya.Image;
		public rewardImg1: Laya.Image;
		public rewardNum1: Laya.Label;
		public reward2: Laya.Image;
		public rewardImg2: Laya.Image;
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
		public eventImg: Laya.Image;
		public closeBtn: Laya.Image;
		public lockedGroup: Laya.Image;
		public keyOpenBtn: Laya.Image;
		public actOpenBtn: Laya.Image;
		public keyNum: Laya.Label;
		public costImg: Laya.Image;
		public actLab: Laya.Label;
		public unlockGroup: Laya.Image;
		public openBtn: Laya.Image;
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
		public closeBtn: Laya.Image;
		public actNum: Laya.Label;
		public getBtn: Laya.Image;
		public freeLab: Laya.Label;
		public freeImg: Laya.Image;

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
		public handBtn: Laya.Image;
		public closeBtn: Laya.Image;
		public itemList: Laya.List;
		public roleSpine: Laya.Image;

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
		public lineGroup: Laya.Image;
		public descGroup: Laya.Image;
		public descTxt: laya.display.Text;
		public confirmBtn: Laya.Image;
		public txtGroup: Laya.Image;
		public leftSpeak: Laya.Image;
		public leftTxt: Laya.Label;
		public rightSpeak: Laya.Image;
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
		public cellCtn: Laya.Image;
		public topGroup: Laya.Image;
		public conGroup: Laya.Image;
		public conImg: Laya.Image;
		public conNum: Laya.Label;
		public actGroup: Laya.Image;
		public actImg: Laya.Image;
		public addActBtn: Laya.Image;
		public actNum: Laya.Label;
		public layerTxt: Laya.Label;
		public forceNum: Laya.Label;
		public bottomGroup: Laya.Image;
		public bagBtn: Laya.Image;
		public shopBtn: Laya.Image;
		public shopRedImg: Laya.Image;
		public busImg: Laya.Image;
		public busBtn: Laya.Image;
		public busLevelTxt: Laya.Label;
		public busRedImg: Laya.Image;
		public exitImg: Laya.Box;
		public exitBtn: Laya.Image;
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
		public receiveBtn: Laya.Image;
		public closeBtn: Laya.Image;
		public itemList: Laya.List;
		public scrollBar: Laya.HScrollBar;
		public descGroup: Laya.Image;
		public lbl_desc: Laya.Label;
		public compImg: Laya.Image;

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
		public bgImg: Laya.Image;
		public panel: Laya.Image;
		public panelImg: Laya.Image;
		public text: laya.display.Text;
		public continueBtn: Laya.Box;
		public leftImg: Laya.Image;
		public rightImg: Laya.Image;

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
		public costGroup: Laya.Image;
		public costBtn: Laya.Image;
		public costLab: Laya.Label;
		public costImg: Laya.Image;
		public costNum: Laya.Label;
		public freeBtn: Laya.Image;
		public freeLab: Laya.Label;
		public freeImg: Laya.Image;
		public btn_close: Laya.Image;
		public descLab: Laya.Label;
		public eventImg: Laya.Image;

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
		public bgImg: Laya.Image;
		public rewardGroup: Laya.Image;
		public item1: Laya.Image;
		public itemImg: Laya.Image;
		public itemNum: Laya.Label;
		public item0: Laya.Image;
		public compNum: Laya.Label;
		public item2: Laya.Image;
		public eventNum: Laya.Label;
		public item3: Laya.Image;
		public killNum: Laya.Label;
		public layerGroup: Laya.Image;
		public maxLayer: Laya.Label;
		public scoreGroup: Laya.Image;
		public scoreNum: Laya.Label;
		public bottumGroup: Laya.Image;
		public coinNum: Laya.Label;
		public fogCoinNum: Laya.Label;
		public multiBtn: Laya.Image;
		public freeLab: Laya.Label;
		public freeImg: Laya.Image;
		public returnLab: Laya.Label;
		public returnBtn: Laya.Image;

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
		public bgImg: Laya.Image;
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
		public item: Laya.Image;
		public itemIcon: Laya.Image;
		public itemLab: Laya.Label;
		public pieceImg: Laya.Image;

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
		public item: Laya.Image;
		public qualImg: Laya.Image;
		public aniGroup: Laya.Image;
		public videoGroup: Laya.Image;
		public unlockImg: Laya.Image;
		public unlockTxt: Laya.Label;
		public starGroup: Laya.Image;

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
		public qualImg: Laya.Image;
		public costTxt: Laya.Label;
		public iconImg: Laya.Image;
		public inlineGroup: Laya.Image;
		public inLineImg: Laya.Image;
		public starGroup: Laya.Image;

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
		public itemImg0: Laya.Image;
		public itemNum0: Laya.Label;
		public buyBtn0: Laya.Image;
		public costNum0: Laya.Label;
		public costImg0: Laya.Image;
		public smallImg0: Laya.Image;
		public item0: Laya.Image;
		public itemName1: Laya.Label;
		public itemImg1: Laya.Image;
		public itemNum1: Laya.Label;
		public buyBtn1: Laya.Image;
		public costNum1: Laya.Label;
		public costImg1: Laya.Image;
		public smallImg1: Laya.Image;
		public item1: Laya.Image;
		public itemName2: Laya.Label;
		public itemImg2: Laya.Image;
		public itemNum2: Laya.Label;
		public buyBtn2: Laya.Image;
		public costNum2: Laya.Label;
		public costImg2: Laya.Image;
		public smallImg2: Laya.Image;
		public item2: Laya.Image;
		public itemName3: Laya.Label;
		public itemImg3: Laya.Image;
		public itemNum3: Laya.Label;
		public buyBtn3: Laya.Image;
		public costNum3: Laya.Label;
		public costImg3: Laya.Image;
		public smallImg3: Laya.Image;
		public item3: Laya.Image;
		public itemName4: Laya.Label;
		public itemImg4: Laya.Image;
		public itemNum4: Laya.Label;
		public buyBtn4: Laya.Image;
		public costNum4: Laya.Label;
		public costImg4: Laya.Image;
		public smallImg4: Laya.Image;
		public item4: Laya.Image;
		public itemName5: Laya.Label;
		public itemImg5: Laya.Image;
		public itemNum5: Laya.Label;
		public buyBtn5: Laya.Image;
		public costNum5: Laya.Label;
		public costImg5: Laya.Image;
		public smallImg5: Laya.Image;
		public item5: Laya.Image;
		public freshBtn: Laya.Image;
		public freeImg: Laya.Image;
		public freeLab: Laya.Label;
		public closeBtn: Laya.Image;
		public freshTxt: Laya.Label;
		public topGroup: Laya.Image;
		public fogCoinGroup: Laya.Image;
		public fogCoinImg: Laya.Image;
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
		public closeBtn: Laya.Image;
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
		public confirmBtn: Laya.Image;
		public returnBtn: Laya.Image;
		public btn_close: Laya.Image;

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
		public bgImg: Laya.Image;
		public titleImg: Laya.Image;
		public titleLab: Laya.Label;
		public exitGroup: Laya.Box;
		public overBtn: Laya.Image;
		public pauseBtn: Laya.Image;
		public commonTip: Laya.Box;
		public descLab: Laya.Label;
		public confirmBtn: Laya.Image;
		public tipBtnGroup: Laya.Image;
		public exitBtn: Laya.Image;
		public continueBtn: Laya.Image;
		public btn_close: Laya.Image;

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
		public roleSpine: Laya.Image;
		public btn_close: Laya.Image;
		public takeBtn: Laya.Image;
		public costGroup: Laya.Image;
		public costImg: Laya.Image;
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
		public closeBtn: Laya.Image;
		public receiveBtn: Laya.Image;
		public receiveImg: Laya.Image;
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
		public guideArea: Laya.Image;
		public panel: Laya.Image;
		public text: laya.display.Text;
		public continueBtn: Laya.Box;
		public guideLeft: Laya.Image;
		public guideRight: Laya.Image;
		public touch: Laya.Image;
		public taskGroup: Laya.Image;
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
		public img_jump: Laya.Image;
		public btn_exit: Laya.Image;

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
		public img_jump: Laya.Image;
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
		public closeBtn: Laya.Image;
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
		public closeBtn: Laya.Image;
		public midTopGroup: Laya.Box;
		public topListGroup: Laya.Box;
		public iconPanel1: Laya.Panel;
		public iconPanel2: Laya.Panel;
		public playBtn: Laya.Image;

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
		public closeBtn: Laya.Image;
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
		public closeBtn: Laya.Image;
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
		public bg: Laya.Image;
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
		public bg: Laya.Image;
		public tipLab: Laya.Label;
		public iconBg: Laya.Image;
		public iconPanel: Laya.Panel;
		public secondIconBg: Laya.Image;
		public secondIconPanel: Laya.Panel;
		public resultTitle: Laya.Image;

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
		public mainbg: Laya.Image;
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
		public rewardImg: Laya.Image;
		public closeBtn: Laya.Image;
		public receiveBtn: Laya.Image;
		public freeImg: Laya.Image;
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
		public rewardImg: Laya.Image;
		public receiveBtn: Laya.Image;
		public closeBtn: Laya.Image;

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
		public btn_getReward: Laya.Image;
		public img_adv: Laya.Image;
		public closeBtn: Laya.Image;
		public group_step: Laya.Image;
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
		public flatImg: Laya.Image;
		public leftRoleSpine: Laya.Image;
		public leftRoleClickArea: Laya.Image;
		public leftRoleName: Laya.Label;
		public leftEquipedImg: Laya.Image;
		public leftCanUpgrade: Laya.Image;
		public leftUnlockCond: Laya.Image;
		public leftUnlockCondLab: Laya.Label;
		public leftCompose: Laya.Label;
		public leftSpeak: Laya.Image;
		public leftSpeakLab: Laya.Label;
		public leftStar: Laya.Image;
		public rightRoleSpine: Laya.Image;
		public rightRoleClickArea: Laya.Image;
		public rightRoleName: Laya.Label;
		public rightEquipedImg: Laya.Image;
		public rightCanUpgrade: Laya.Image;
		public rightUnlockCond: Laya.Image;
		public rightUnlockCondLab: Laya.Label;
		public rightCompose: Laya.Label;
		public rightSpeak: Laya.Image;
		public rightSpeakLab: Laya.Label;
		public rightStar: Laya.Image;

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
		public closeBtn: Laya.Image;
		public receiveBtn: Laya.Image;
		public receiveImg: Laya.Image;
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
		public normalRewardGroup: Laya.Image;
		public lbl_normalReward: Laya.Label;
		public btn_normalReward: Laya.Image;
		public multiRewardGroup: Laya.Image;
		public lbl_multiReward: Laya.Label;
		public btn_multiReward: Laya.Image;
		public lbl_multi: Laya.Label;
		public freeImg: Laya.Image;
		public closeBtn: Laya.Image;
		public roleSpine: Laya.Image;

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
		public normalRewardGroup: Laya.Image;
		public lbl_normalReward: Laya.Label;
		public btn_multiReward: Laya.Image;
		public freeImg: Laya.Image;
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
		public shakeBtn: Laya.Image;
		public closeImg: Laya.Image;
		public openImg: Laya.Image;
		public closeBtn: Laya.Image;

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
		public item0: Laya.Image;
		public rewardImg0: Laya.Image;
		public rewardTxt0: Laya.Label;
		public hasReceiveGroup0: Laya.Image;
		public receiveBtn0: Laya.Image;
		public receiveBtnLab0: Laya.Label;
		public item1: Laya.Image;
		public rewardImg1: Laya.Image;
		public rewardTxt1: Laya.Label;
		public hasReceiveGroup1: Laya.Image;
		public receiveBtn1: Laya.Image;
		public receiveBtnLab1: Laya.Label;
		public item2: Laya.Image;
		public rewardImg2: Laya.Image;
		public rewardTxt2: Laya.Label;
		public hasReceiveGroup2: Laya.Image;
		public receiveBtn2: Laya.Image;
		public receiveBtnLab2: Laya.Label;
		public item3: Laya.Image;
		public rewardImg3: Laya.Image;
		public rewardTxt3: Laya.Label;
		public hasReceiveGroup3: Laya.Image;
		public receiveBtn3: Laya.Image;
		public receiveBtnLab3: Laya.Label;
		public item4: Laya.Image;
		public rewardImg4: Laya.Image;
		public rewardTxt4: Laya.Label;
		public hasReceiveGroup4: Laya.Image;
		public receiveBtn4: Laya.Image;
		public receiveBtnLab4: Laya.Label;
		public item5: Laya.Image;
		public rewardImg5: Laya.Image;
		public rewardTxt5: Laya.Label;
		public hasReceiveGroup5: Laya.Image;
		public receiveBtn5: Laya.Image;
		public receiveBtnLab5: Laya.Label;
		public item6: Laya.Image;
		public rewardImg6: Laya.Image;
		public rewardTxt6: Laya.Label;
		public hasReceiveGroup6: Laya.Image;
		public receiveBtn6: Laya.Image;
		public receiveBtnLab6: Laya.Label;
		public closeBtn: Laya.Image;
		public roleSpine: Laya.Image;

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
		public rotateGroup: Laya.Image;
		public rewardIcon0: Laya.Image;
		public rewardCount0: Laya.Label;
		public rewardIcon1: Laya.Image;
		public rewardCount1: Laya.Label;
		public rewardIcon2: Laya.Image;
		public rewardCount2: Laya.Label;
		public rewardIcon3: Laya.Image;
		public rewardCount3: Laya.Label;
		public rewardIcon4: Laya.Image;
		public rewardCount4: Laya.Label;
		public rewardIcon5: Laya.Image;
		public rewardCount5: Laya.Label;
		public rewardIcon6: Laya.Image;
		public rewardCount6: Laya.Label;
		public rewardIcon7: Laya.Image;
		public rewardCount7: Laya.Label;
		public zpZhenImg: Laya.Image;
		public turnCountTxt: Laya.Label;
		public boxGroup: Laya.Image;
		public progressImg: Laya.Image;
		public cjBtn: Laya.Image;
		public freeGroup: Laya.Image;
		public videoGroup: Laya.Image;
		public adImg: Laya.Image;
		public closeBtn: Laya.Image;

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
		public bgImg: Laya.Image;
		public iconImg: Laya.Image;
		public nameTxt: Laya.Label;
		public desTxt: Laya.Label;
		public proDi: Laya.Image;
		public proImg: Laya.Image;
		public proTxt: Laya.Label;
		public attrTxt: Laya.Label;
		public getBtn: Laya.Image;
		public composeBtn: Laya.Image;
		public costImg: Laya.Image;
		public costTxt: Laya.Label;
		public closeBtn: Laya.Image;

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
		public bgImg: Laya.Image;
		public iconImg: Laya.Image;
		public noEquipGroup: Laya.Image;
		public composeGroup: Laya.Image;
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
		public bgImg: Laya.Image;

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
		public roleSpine: Laya.Image;
		public firstAttack: Laya.Label;
		public lastAttack: Laya.Label;
		public firstLife: Laya.Label;
		public lastLife: Laya.Label;
		public skillTxt: Laya.Label;
		public btn_close: Laya.Image;
		public btn_reward: Laya.Image;
		public rewardImg: Laya.Image;
		public rewardNum: Laya.Label;
		public freeImg: Laya.Image;
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
		public btn_close: Laya.Image;
		public homeSpine: Laya.Image;
		public homeMask: Laya.Image;
		public attrributeGroup: Laya.Image;
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
		public upSpineArea: Laya.Image;
		public skillGroup: Laya.Image;
		public skillGroup0: Laya.Image;
		public skillBtn0: Laya.Image;
		public skillIcon0: Laya.Image;
		public unlockLab0: Laya.Label;
		public skillGroup1: Laya.Image;
		public skillBtn1: Laya.Image;
		public skillIcon1: Laya.Image;
		public unlockLab1: Laya.Label;
		public skillGroup2: Laya.Image;
		public skillBtn2: Laya.Image;
		public skillIcon2: Laya.Image;
		public unlockLab2: Laya.Label;
		public skillGroup3: Laya.Image;
		public skillBtn3: Laya.Image;
		public skillIcon3: Laya.Image;
		public unlockLab3: Laya.Label;
		public upgradeGroup: Laya.Image;
		public fullLevelLab: Laya.Label;
		public canUpgradeGroup: Laya.Image;
		public upgradeBtn: Laya.Image;
		public upgradeLab: Laya.Label;
		public upgradeCostImg: Laya.Image;
		public upgradeCostNum: Laya.Label;
		public skillDescGroup: Laya.Image;
		public cdLab: Laya.Label;
		public skillDesclab: Laya.Label;
		public descIndexPos: Laya.Image;

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
		public barrageCtn: Laya.Image;
		public roleSpine: Laya.Image;

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
		public roleBtn: Laya.Image;
		public equipBtn: Laya.Image;
		public equipRed: Laya.Image;
		public ctn: Laya.Image;
		public btn_close: Laya.Image;
		public topGroup: Laya.Image;
		public coinGroup: Laya.Image;
		public coinNum: Laya.Label;
		public addCoinBtn: Laya.Image;
		public goldGroup: Laya.Image;
		public goldNum: Laya.Label;
		public addGoldBtn: Laya.Image;

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
		public starGroup: Laya.Image;
		public equipGroup: Laya.Image;
		public aniGroup: Laya.Image;
		public evoluShow: Laya.Image;
		public unlockTxt: Laya.Label;
		public unlockEvoBtn: Laya.Image;
		public costBtn: Laya.Image;
		public costImg: Laya.Image;
		public costTxt: Laya.Label;
		public adEvoBtn: Laya.Image;
		public adImg: Laya.Image;

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
		public roleSpine: Laya.Image;
		public roleMask: Laya.Image;
		public upSpineArea: Laya.Image;
		public roleSpeak: Laya.Image;
		public roleSpeakLab: Laya.Label;
		public roleName: Laya.Label;
		public roleLevel: Laya.Label;
		public roleDesc: Laya.Label;
		public attackImg: Laya.Image;
		public attackNum: Laya.Label;
		public moveSpeedImg: Laya.Image;
		public moveSpeedNum: Laya.Label;
		public hitImg: Laya.Image;
		public hitNum: Laya.Label;
		public targetImg: Laya.Image;
		public targetNum: Laya.Label;
		public bloodImg: Laya.Image;
		public bloodNum: Laya.Label;
		public disImg: Laya.Image;
		public attackRangeNum: Laya.Label;
		public attackType: Laya.Image;
		public attackTypeNum: Laya.Label;
		public attackSuImg: Laya.Image;
		public attackSpeedNum: Laya.Label;
		public beHitImg: Laya.Image;
		public beHitNum: Laya.Label;
		public dodgeImg: Laya.Image;
		public dodgeNum: Laya.Label;
		public unlockGroup: Laya.Image;
		public unlockBtn: Laya.Image;
		public unlockCostImg: Laya.Image;
		public unlockCostNum: Laya.Label;
		public upgradeGroup: Laya.Image;
		public fullLevelLab: Laya.Label;
		public canUpgradeGroup: Laya.Image;
		public upgradeBtn: Laya.Image;
		public upgradeLab: Laya.Label;
		public upgradeCostImg: Laya.Image;
		public upgradeCostNum: Laya.Label;
		public unlockLevelLab: Laya.Label;
		public videoUnlockGroup: Laya.Image;
		public videoUnlockBtn: Laya.Image;
		public freeUnlockLab: Laya.Label;
		public freeUnlockImg: Laya.Image;
		public upGroup: Laya.Image;
		public attackGroup: Laya.Image;
		public attackNum1: Laya.Label;
		public attackNum2: Laya.Label;
		public bloodGroup: Laya.Image;
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
		public roleSpine: Laya.Image;
		public roleName: Laya.Label;
		public btn_close: Laya.Image;
		public btn_reward: Laya.Image;
		public rewardImg: Laya.Image;
		public rewardNum: Laya.Label;
		public freeImg: Laya.Image;
		public btn_return: Laya.Label;
		public btm_freeGet: Laya.Image;
		public freeGetImg: Laya.Image;
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
		public sureBtn: Laya.Image;
		public lineGroup: Laya.Image;
		public txtGroup: Laya.Image;
		public leftSpeak: Laya.Image;
		public leftTxt: Laya.Label;
		public rightSpeak: Laya.Image;
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
		public qualImg: Laya.Image;
		public costTxt: Laya.Label;
		public iconImg: Laya.Image;
		public inlineGroup: Laya.Image;
		public inLineImg: Laya.Image;
		public starGroup: Laya.Image;

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
		public item: Laya.Image;
		public qualImg: Laya.Image;
		public aniGroup: Laya.Image;
		public maskImg: Laya.Image;
		public unlockGroup: Laya.Image;
		public unlockTxt: Laya.Label;
		public starGroup: Laya.Image;

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
		public shareBtn: Laya.Image;
		public closeBtn: Laya.Image;
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
		public dikuang: Laya.Image;
		public list_num: Laya.Label;
		public rewardImg: Laya.Image;
		public reward_num: Laya.Label;
		public reward_description: Laya.Label;
		public reward_has_recive: Laya.Label;
		public reward_no_recive: Laya.Image;
		public reward_btn: Laya.Image;
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
		public goldCostBtn: Laya.Image;
		public costImg: Laya.Image;
		public costNumTxt: Laya.Label;
		public btn_getReward: Laya.Image;
		public adCountTxt: Laya.Label;
		public img_adv: Laya.Image;
		public freeGroup: Laya.Image;
		public freeGetBtn: Laya.Image;

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
		public aniGroup: Laya.Image;
		public leftTxt: Laya.Label;
		public freshBtn: Laya.Image;
		public freeImg: Laya.Image;
		public freshShopGroup: Laya.Image;
		public exitBtn: Laya.Image;

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
		public bgImg: Laya.Image;
		public itemImg: Laya.Image;
		public itemNum: Laya.Label;
		public smallImg: Laya.Image;
		public goodNameTxt: Laya.Label;
		public leftGrouup: Laya.Label;
		public leftCountTxt: Laya.Label;
		public discountTxt: Laya.Label;
		public noCountTxt: Laya.Label;
		public coinBtn: Laya.Image;
		public coinTxt: Laya.Label;
		public goldCostBtn: Laya.Image;
		public goldTxt: Laya.Label;
		public videoGetBtn: Laya.Image;
		public freeImg: Laya.Image;

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
		public receiveBtn: Laya.Image;
		public descTxt: Laya.Label;
		public nameTxt: Laya.Label;
		public processDi: Laya.Image;
		public processImg: Laya.Image;
		public rewardGroup1: Laya.Box;
		public rewardTxt1: Laya.Label;
		public rewardImg1: Laya.Image;
		public rewardGroup2: Laya.Box;
		public rewardTxt2: Laya.Label;
		public rewardImg2: Laya.Image;
		public goOnBtn: Laya.Image;
		public hasReceiveTxt: Laya.Label;
		public closeBtn: Laya.Image;

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
		public topGroup: Laya.Image;
		public btn_close: Laya.Image;
		public chooseGroup: Laya.Image;
		public myDialog1: Laya.Image;
		public dialogTxt1: Laya.Label;
		public myDialog2: Laya.Image;
		public dialogTxt2: Laya.Label;
		public myDialog3: Laya.Image;
		public dialogTxt3: Laya.Label;
		public inPutGroup: Laya.Image;
		public levelGroup: Laya.Image;
		public watchBtn: Laya.Image;
		public returnBtn: Laya.Image;
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
		public leftGroup: Laya.Image;
		public myIcon: Laya.Image;
		public leftBg: Laya.Image;
		public leftTxt: Laya.Label;
		public rightGroup: Laya.Image;
		public rightBg: Laya.Image;
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
		public group_box: Laya.Image;
		public pro_boxDi: Laya.Image;
		public pro_boxImg: Laya.Image;
		public pointTxt: Laya.Label;
		public taskBox1: Laya.Image;
		public img_box1: Laya.Image;
		public lbl_point1: Laya.Label;
		public taskBox2: Laya.Image;
		public img_box2: Laya.Image;
		public lbl_point2: Laya.Label;
		public taskBox3: Laya.Image;
		public img_box3: Laya.Image;
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
		public topGroup: Laya.Image;
		public btn_close: Laya.Image;
		public group_ctn: Laya.Image;
		public chatTaskBtn: Laya.Image;
		public dailyTaskBtn: Laya.Image;
		public dailyRed: Laya.Image;

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
		public receiveBtn: Laya.Image;
		public receiveImg: Laya.Image;
		public rewardGroup: Laya.Image;
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
		public testBtn: Laya.Image;
		public titleLabel: Laya.Label;
		public ridLab: Laya.Label;
		public firstLabel: Laya.Label;
		public secondLabel: Laya.Label;
		public backBtn: Laya.Image;
		public list_params: Laya.List;
		public takeBtn: Laya.Image;
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
		public aniGroup: Laya.Image;
		public desTxt: Laya.Label;
		public companyLevelTxt: Laya.Label;
		public commissionTxt: Laya.Label;
		public starTxt: Laya.Label;
		public numTxt: Laya.Label;
		public timeTxt: Laya.Label;
		public nextGroup: Laya.Image;
		public commisionTxt2: Laya.Label;
		public starTxt2: Laya.Label;
		public numTxt2: Laya.Label;
		public timeTxt2: Laya.Label;
		public upGroup: Laya.Box;
		public passTxt: Laya.Label;
		public hasTxt: Laya.Label;
		public needTxt: Laya.Label;
		public videoUpBtn: Laya.Image;
		public freeImg: Laya.Image;
		public freeRedImg: Laya.Image;
		public upGradeGroup: Laya.Image;
		public costImg: Laya.Image;
		public costTxt: Laya.Label;
		public upGradeBtn: Laya.Image;
		public upRedImg: Laya.Image;
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
		public topGroup: Laya.Image;
		public btn_close: Laya.Image;
		public coinGroup: Laya.Image;
		public coinNum: Laya.Label;
		public addCoinBtn: Laya.Image;
		public goldGroup: Laya.Image;
		public goldNum: Laya.Label;
		public addGoldBtn: Laya.Image;
		public group_ctn: Laya.Image;
		public workBtn: Laya.Image;
		public workRedImg: Laya.Image;
		public companyBtn: Laya.Image;
		public redImg: Laya.Image;

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
		public starGroup: Laya.Image;
		public desTxt: Laya.Label;
		public roleGroup: Laya.Image;
		public startGroup: Laya.Image;
		public costTimeTxt: Laya.Label;
		public startBtn: Laya.Image;
		public doGroup: Laya.Image;
		public doProDi: Laya.Image;
		public doProcess: Laya.Image;
		public quickFinishBtn: Laya.Image;
		public quickFreeImg: Laya.Image;
		public leftTimeTxt: Laya.Label;
		public goldBtn: Laya.Image;
		public goldCostTxt: Laya.Label;
		public receiveBtn: Laya.Image;
		public reward1: Laya.Image;
		public lbl_num1: Laya.Label;
		public img_icon1: Laya.Image;
		public reward2: Laya.Image;
		public lbl_num2: Laya.Label;
		public img_icon2: Laya.Image;
		public finishBtn: Laya.Image;

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
		public freshBtn: Laya.Image;
		public freeImg: Laya.Image;
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
		public itemBg: Laya.Image;
		public itemIcon: Laya.Image;
		public maskImg: Laya.Image;
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
		public topGroup: Laya.Image;
		public coinGroup: Laya.Image;
		public coinNum: Laya.Label;
		public addCoinBtn: Laya.Image;
		public goldGroup: Laya.Image;
		public goldNum: Laya.Label;
		public addGoldBtn: Laya.Image;
		public spGroup: Laya.Image;
		public powerCountLab: Laya.Label;
		public powerTimerLab: Laya.Label;
		public addSpBtn: Laya.Image;
		public flatArea: Laya.Panel;
		public bottomGroup: Laya.Image;
		public workBtn: Laya.Image;
		public workRedImg: Laya.Image;
		public flatBtn: Laya.Image;
		public flatRedPoint: Laya.Image;
		public equipImg: Laya.Image;
		public equipBtn: Laya.Image;
		public equipRed: Laya.Image;
		public formationImg: Laya.Box;
		public formationBtn: Laya.Image;
		public formationRed: Laya.Image;
		public fogImg: Laya.Image;
		public fogBtn: Laya.Image;
		public fogRedPoint: Laya.Image;
		public fogLab: Laya.Label;
		public gameStartImg: Laya.Box;
		public gameStartBtn: Laya.Image;
		public costSp: Laya.Label;
		public enterRedImg: Laya.Image;
		public enterGuideImg: Laya.Image;
		public middleGroup: Laya.Image;
		public turnableBtn: Laya.Image;
		public turnQipao: Laya.Image;
		public inviteBtn: Laya.Image;
		public inviteRedPoint: Laya.Image;
		public signBtn: Laya.Image;
		public signRedPoint: Laya.Image;
		public gmBtn: Laya.Label;
		public freeGoldBtn: Laya.Image;
		public freeGoldTip: Laya.Image;
		public settimgBtn: Laya.Image;
		public chatTaskGroup: Laya.Image;
		public taskName: Laya.Label;
		public taskDesc: Laya.Label;
		public taskImg: Laya.Image;
		public taskBtn: Laya.Image;
		public taskPhone: Laya.Image;
		public dailyRedImg: Laya.Image;
		public taskRedTxt: Laya.Label;
		public offlineRewardGroup: Laya.Image;
		public btn_offlineReward: Laya.Image;
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

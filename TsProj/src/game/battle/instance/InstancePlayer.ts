import BattleLogicalControler from "../controler/BattleLogicalControler";
import BattleConst from "../../sys/consts/BattleConst";
import BattleFunc from "../../sys/func/BattleFunc";
import ChooseTrigger from "../trigger/ChooseTrigger";

import InstanceHero from "./InstanceHero";
import {ButtonUtils} from "../../../framework/utils/ButtonUtils";
import GameConsts from "../../sys/consts/GameConsts";
import WindowManager from "../../../framework/manager/WindowManager";
import TranslateFunc from "../../../framework/func/TranslateFunc";
import ShareOrTvManager from "../../../framework/manager/ShareOrTvManager";
import ShareTvOrderFunc from "../../sys/func/ShareTvOrderFunc";
import {WindowCfgs} from "../../sys/consts/WindowCfgs";
import UserModel from "../../sys/model/UserModel";
import StatisticsManager from "../../sys/manager/StatisticsManager";
import ImageExpand from "../../../framework/components/ImageExpand";
import ViewTools from "../../../framework/components/ViewTools";
import LabelExpand from "../../../framework/components/LabelExpand";
//主角  控制超级武器的
export default class InstancePlayer extends InstanceHero {


	private skillArr;
	private skillParnet;
	private targetRole;
	private skillGroup;
	private useSkillGroup = {};
	private noCd = false;
	private freeType;

	constructor(controler: BattleLogicalControler) {
		super(controler);
		this.lifeType = BattleConst.LIFE_PLAYER;
		this.classModel = BattleConst.model_player;

	}

	doAiLogical() {
		this.updateSkillCd();
	}

	updateSkillCd() {
		//免cd的 不执行刷新
		if (this.noCd) return;
		var cdcheck = 20;
		//每半秒 可以提升运算性能
		if (this.updateCount % cdcheck != 0) {
			return;
		}
		//更新普通技能
		for (var i = 0; i < this.normalSkills.length; i++) {
			if (!this.skillGroup[i]) continue;
			var skill = this.normalSkills[i];
			if (skill.leftSkillCd > 0) {
				skill.leftSkillCd -= cdcheck;
				if (skill.leftSkillCd < 0) {
					skill.leftSkillCd = 0;
					if (this.skillGroup[i].getChildByName("mask").visible) {
						this.skillGroup[i].getChildByName("mask").visible = false;
						this.skillGroup[i].getChildByName("timeTxt").text = "";
					}
				}
				if (!this.skillGroup[i].getChildByName("mask").visible) {
					this.skillGroup[i].getChildByName("mask").visible = true;
				}
				this.skillGroup[i].getChildByName("timeTxt").text = Math.ceil(skill.leftSkillCd / GameConsts.gameFrameRate);

			} else {
				if (this.skillGroup[i].getChildByName("mask").visible) {
					this.skillGroup[i].getChildByName("mask").visible = false;
				}
				this.skillGroup[i].getChildByName("timeTxt").text = "";
			}
		}
	}

	setData(data) {
		this.targetRole = this.controler.myHome;
		this.skillGroup = [];
		this.useSkillGroup = {};
		this._myView = this.targetRole._myView;
		this.pos = this.targetRole.pos
		this.cfgData = data;
		super.setData(data);
		this.ignoreTimeScale = true;
		this.noCd = this.controler.battleSkillnoCd;
		this.freeType = ShareOrTvManager.instance.getShareOrTvType(ShareTvOrderFunc.SHARELINE_BATTLE_USESKILL)
	}

	//设置技能信息
	setSkillInfo(arr, parnet) {
		this.skillArr = arr;
		this.cfgData.skill = this.skillArr;
		this.skillParnet = parnet;
		this.initNormalSkill(this.targetRole, this.lifeType);
		this.addSkillIcon();

	}

	/**添加技能图标 */
	addSkillIcon() {
		for (var i = 0; i < this.skillArr.length; i++) {
			var item = this.skillArr[i];
			var skillInfo = BattleFunc.instance.getCfgDatas("Skill", item);
			var img: ImageExpand = ViewTools.createImage();
			img.setSkin( "uisource/skill/skill/" + skillInfo.pic + ".png");
			img.setSize(92,92);
			img.x = -i * (img.width + 10);
			this.skillParnet.addChild(img);
			var mask: ImageExpand = ViewTools.createImage("uisource/battle/battle/battle_image_jiangli.png");
			mask.setSize(92,92)
			mask.setSizeGrid(13,13,13,13)
			mask.name = "mask";
			img.addChild(mask);
			//如果是免cd 的 显示视频按钮
			if (this.noCd) {
				var freeImg: ImageExpand = ViewTools.createImage();
				freeImg.setSkin(ShareOrTvManager.instance.getFreeImgSkin(this.freeType))
				freeImg.setAnchor(0.5,0.5)
				freeImg.x = img.width / 2;
				freeImg.y = img.height / 2;
				freeImg.name = "freeImg"
				img.addChild(freeImg);
			} else {
				var timeTxt: LabelExpand= ViewTools.createLabel("",92,49,36);
				timeTxt.y = 25;
				timeTxt.name = "timeTxt"
				timeTxt.setColor(0xff,0xff,0xff)
				timeTxt.text = Math.ceil(this.normalSkills[i].leftSkillCd / GameConsts.gameFrameRate) + "";
				img.addChild(timeTxt);
			}
			this.skillGroup.push(img);
			if (this.noCd) {
				this.freshSkillShow(i, item)
			}
			new ButtonUtils(img, this.onClickSkill, this, null, null, i);
		}
	}

	freshSkillShow(index, id) {
		var item = this.skillGroup[index];
		var mask = item.getChildByName("mask");
		var freeImg = item.getChildByName("freeImg");
		//如果已经免费使用过一次了 显示视频按钮
		if (this.useSkillGroup[id]) {
			mask.visible = true;
			freeImg.visible = true;
		} else {
			mask.visible = false;
			freeImg.visible = false;
		}
	}

	public onClickSkill(index) {
		var skillData = this.normalSkills[index];
		if (!skillData) return;
		//免cd模式，剩余等待时长为
		if (this.noCd) {
			skillData.leftSkillCd = 0
		}
		if (skillData.isActive && skillData.leftSkillCd <= 0) {
			if (!this.noCd || (this.noCd && !this.useSkillGroup[skillData._skillId])) {
				this.useSkill(index);

			} else if (this.noCd && this.useSkillGroup[skillData._skillId]) {
				//如果无cd模式并且已经免费使用过一次了 就看视频
				WindowManager.OpenUI(WindowCfgs.BattleUseSkillUI, {
					callBack: this.useSkill.bind(this, index),
					thisObj: this,
					controler: this.controler,
					skillId: skillData._skillId
				})
			}
		}
	}

	/**使用技能 */
	private useSkill(index) {
		var tempArr = BattleFunc.getOneTempArr();
		var skillData = this.normalSkills[index];
		ChooseTrigger.getIsCanUseSkill(this.targetRole, skillData, tempArr);
		if (tempArr[0] != -1) {
			LogsManager.echo("使用了技能------------------")
			this.giveOutSkill(tempArr[1]);
			if (this.noCd && UserModel.instance.getMaxBattleLevel() > 0) {
				this.useSkillGroup[skillData._skillId] = 1
				this.freshSkillShow(index, skillData._skillId)
			}
		} else {
			WindowManager.ShowTip(TranslateFunc.instance.getTranslate("tid_battle_noAim"))
		}
		BattleFunc.cacheOneTempArr(tempArr);

	}
}
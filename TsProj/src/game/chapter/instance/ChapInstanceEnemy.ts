import FogInstanceBasic from "../../fog/instance/FogInstanceBasic";
import {ButtonUtils} from "../../../framework/utils/ButtonUtils";
import UserModel from "../../sys/model/UserModel";
import DisplayUtils from "../../../framework/utils/DisplayUtils";
import TranslateFunc from "../../../framework/func/TranslateFunc";
import WindowManager from "../../../framework/manager/WindowManager";
import {WindowCfgs} from "../../sys/consts/WindowCfgs";
import ChapterConst from "../../sys/consts/ChapterConst";
import BattleFunc from "../../sys/func/BattleFunc";
import TimerManager from "../../../framework/manager/TimerManager";
import LevelFunc from "../../sys/func/LevelFunc";

/**章节怪 */
export default class ChapInstanceEnemy extends FogInstanceBasic {

	private nameTxt: Laya.Label;
	private passSign: Laya.Image;
	private levelId;
;
	public levelName: string;

	constructor(fogControler) {
		super(fogControler);
		this.anchorX = 0.5;
		this.anchorY = 1;
		this.width = 200;
		this.height = 150;
		this.nameTxt = new Laya.Label("");
		this.nameTxt.width = 200;
		this.nameTxt.fontSize = 24;
		this.nameTxt.font = "Microsoft YaHei";
		this.nameTxt.color = "#ffffff";
		this.nameTxt.align = "center";
		this.nameTxt.y = this.height + 20;
		this.nameTxt.stroke = 2;
		this.nameTxt.bold = true;

		this.addChild(this.nameTxt);
		new ButtonUtils(this, this.onClickItem, this);
		this.passSign = new Laya.Image("native/main/main/main_image_yishangzhen.png");
		var txt = new Laya.Label(TranslateFunc.instance.getTranslate("#tid_chapter_finishLevel"));
		txt.width = 130;
		txt.height = 48;
		txt.fontSize = 22;
		txt.font = "Microsoft YaHei";
		txt.color = "#000000";
		txt.align = "center";
		txt.valign = "middle";
		this.passSign.anchorX = 0.5;
		this.passSign.x = this.width / 2
		this.passSign.addChild(txt);
		this.addChild(this.passSign);
	}

	public setData(data) {
		this.levelId = data.id;
		this.levelName = this.fogControler.chapterId + "-" + data.index
		this.nameTxt.text = this.levelName + "  " + TranslateFunc.instance.getTranslate(LevelFunc.instance.getCfgDatasByKey("Level", this.levelId, "name"));

	}

	/**刷新状态 */
	public freshInfo() {
		var level = UserModel.instance.getMaxBattleLevel()
		this.passSign.visible = false;
		DisplayUtils.clearViewFilter(this._myView)
		if (this.levelId == level + 1) {
			//当前关卡
			if (this.fogControler.doCurLevelCode) {
				TimerManager.instance.remove(this.fogControler.doCurLevelCode);
				this.fogControler.doCurLevelCode = 0;
			}
			this.fogControler.doCurLevelCode = TimerManager.instance.add(this.fogControler.nowLevelAni, this.fogControler, 800, Number.MAX_VALUE, false, [{
				x: this.pos.x,
				y: this.pos.y - this.height + 20
			}])
		} else if (this.levelId > level) {
			//未解锁关卡
			DisplayUtils.setViewDark(this._myView);
		} else {
			//已通过关卡
			this.passSign.visible = true;
		}
	}

	setPos(x, y, z) {
		super.setPos(x, y, z);
		this.freshInfo();
	}

	onClickItem() {
		var level = UserModel.instance.getMaxBattleLevel()
		if (this.levelId > level + 1) return;
		var isReturn = false;
		if (this.levelId == level + 1) {
			var arr = this.fogControler.boxArr;
			for (var i = 0; i < arr.length; i++) {
				var item = arr[i];
				if (item.levelId == this.levelId - 1) {
					if (item.type != ChapterConst.Chapter_boxState_receive) {
						isReturn = true;
						WindowManager.ShowTip(TranslateFunc.instance.getTranslate("#tid_chapter_openBox"))
						break;
					}
				}
			}
		}
		if (!isReturn) {
			if (BattleFunc.instance.showGetPower()) return;
			if (Number(this.levelId) == 2) {
				this.fogControler.showGuide_206_finish();
			}
			WindowManager.OpenUI(WindowCfgs.BattleDetailUI, {level: this.levelId, name: this.levelName})
		}
	}

	//销毁函数. 这个一般都是需要缓存的 而且单独缓存. 因为全局总共就不会创建超过20个
	public dispose() {
		this.removeSelf();
		this.fogControler = null;

	}

	//从舞台移除
	public onSetToCache() {
		this.removeSelf();
	}


}
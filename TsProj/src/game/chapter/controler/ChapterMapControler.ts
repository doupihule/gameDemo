import ScreenAdapterTools from "../../../framework/utils/ScreenAdapterTools";
import SubPackageManager from "../../../framework/manager/SubPackageManager";
import SubPackageConst from "../../sys/consts/SubPackageConst";
import UserInfo from "../../../framework/common/UserInfo";
import ChapterFunc from "../../sys/func/ChapterFunc";
import ChapterLogicControler from "./ChapterLogicControler";

export default class ChapterMapControler {


	private controler: ChapterLogicControler;
	private chapterData: any;
	private mapArr: any[] = [];
	// 当前地图块数量
	public allMapCount = 3;
	// 总地图块数量
	public totalMap = 3;
	//一块地图的高度
	public itemHeight = 1400;
	//放地图的容器
	private ctn1: Laya.Sprite;
	public offestY = 0;

	constructor(controler) {
		this.controler = controler;
	}

	//初始化设置数据 章节id
	public setData(chapterId) {
		this.chapterData = ChapterFunc.instance.getCfgDatas("Chapter", chapterId);
		this.ctn1 = new Laya.Sprite();
		this.ctn1.y = -ScreenAdapterTools.sceneOffsetY - ScreenAdapterTools.UIOffsetY;
		this.controler.chapterLayerControler.a21.y = -ScreenAdapterTools.sceneOffsetY - ScreenAdapterTools.UIOffsetY;
		this.controler.chapterLayerControler.a1.addChild(this.ctn1);
		this.allMapCount = Math.ceil(this.chapterData.high / this.itemHeight)
		this.controler.chapterLayerControler.maxHeight = this.allMapCount * this.itemHeight;
		this.controler.chapterLayerControler.showHeight = this.chapterData.high;
		this.controler.chapterLayerControler.setMinY(ScreenAdapterTools.height - this.allMapCount * this.itemHeight);
		this.createMap();
		this.offestY = this.controler.chapterLayerControler.showHeight - this.controler.chapterLayerControler.maxHeight
	}

	//创建地图
	createMap() {
		var name = this.chapterData.sceneName;
		for (var i = this.allMapCount; i > 0; i--) {
			var image = new Laya.Image();
			var imageUrl1;
			if (UserInfo.isSystemNative()) {
				imageUrl1 = "map/" + name + "/" + name + "_0" + i + ".png";
			} else {
				imageUrl1 = "map/" + name + "/" + name + "/" + name + "_0" + i + ".png";
				image.scale(2, 2);
			}
			this.ctn1.addChild(image);
			image.y = (this.allMapCount - i) * this.itemHeight;
			this.mapArr.push({view: image})
			var onMapComplete = () => {
				image.skin = imageUrl1;
			}
			if (SubPackageManager.getPackStyle(SubPackageConst.packName_map) == SubPackageConst.PATH_STYLE_SUBPACK) {
				SubPackageManager.loadDynamics(name, "map/" + name + "/" + name + "_0" + i, onMapComplete, this);
			} else {
				onMapComplete();
			}
		}
	}

	//销毁地图
	private destoryOneLayer() {
		var infoArr: any[] = this.mapArr;
		for (var i = 0; i < infoArr.length; i++) {
			var view: Laya.Image = infoArr[i].view;
			view.removeSelf();
			if (UserInfo.isSystemNative()) {
				//对图片做销毁处理
				view.dispose();
			}

		}
		this.ctn1.removeSelf();
		if (!UserInfo.isSystemNative()) {
			Laya.loader.clearRes("res/atlas/map/" + this.chapterData.sceneName + "/" + this.chapterData.sceneName + ".atlas")
			Laya.loader.clearRes("res/atlas/map/" + this.chapterData.sceneName + "/" + this.chapterData.sceneName + ".png")
		}
	}


	// 当地图发生运动
	public onMapMove(pos = 0) {
		this.updateOneLayer(pos)
	}

	//根据速度运动
	private updateOneLayer(pos) {
		this.ctn1.y += pos;
	}

	//销毁所有地形
	public destoryMap() {
		this.destoryOneLayer();
	}

	dispose() {
		this.destoryMap();
		this.controler = null;
	}

}

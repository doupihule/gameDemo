import ScreenAdapterTools from "./ScreenAdapterTools";
import GameConsts from "../../game/sys/consts/GameConsts";
import Sprite3DExpand from "../viewcomp/Sprite3DExpand";
import SkeletonExpand from "../viewcomp/SkeletonExpand";
import ResourceManager from "../manager/ResourceManager";
import SpriteFrameExpand from "../viewcomp/SpriteFrameExpand";

export default class DisplayUtils {
	public static swapChildrenAt(parent: Laya.Node, index1: number, index2: number) {
		var child1 = parent.getChildAt(index1);
		var child2 = parent.getChildAt(index2);
		parent.setChildIndex(child1, index2);
		parent.setChildIndex(child2, index1);
	}

	public static camera;

	/**传入资源url以及父物体获取当前加载对象，并添加摄像机 */
	public static getModelByUrl(url, parentObj, isClone = false) {
		var goal: Laya.Sprite3D;
		if (isClone) {
			goal = Laya.loader.getRes(url).clone();
		} else {
			goal = Laya.loader.getRes(url);

		}
		ResourceManager.checkParticalRendeMode(goal, url);
		var camera: Laya.Camera;
		camera = goal.getChildByName("main_camera") as Laya.Camera;
		var extraAdd = 0;
		camera.orthographic = true;
		camera.orthographicVerticalSize = 2;
		var x = (ScreenAdapterTools.UIOffsetX + ScreenAdapterTools.sceneOffsetX) * Laya.stage.clientScaleX;
		var y = (ScreenAdapterTools.UIOffsetY + ScreenAdapterTools.sceneOffsetY) * Laya.stage.clientScaleY
		camera.viewport = new Laya.Viewport(x, y, ScreenAdapterTools.designWidth * Laya.stage.clientScaleX, ScreenAdapterTools.designHeight * Laya.stage.clientScaleY);
		parentObj.addChild(camera);
		camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
		return goal;
	}

	public static adjustLabelPos() {

	}


	//创建一个摄像机
	public static createCamera(clearFlag: number = 2) {
		var camera = new Laya.Camera();
		var sx = Laya.stage.clientScaleX;
		var sy = Laya.stage.clientScaleY;
		camera.viewport = new Laya.Viewport((ScreenAdapterTools.UIOffsetX + ScreenAdapterTools.sceneOffsetX) * sx, ScreenAdapterTools.UIOffsetY * sy, ScreenAdapterTools.designWidth * sx, ScreenAdapterTools.designHeight * sy);
		camera.clearFlag = clearFlag;
		return camera;
	}

	//创建3D场景 是否启用带物理引擎的scene
	public static createScene3D(usePhysics: boolean = false) {
		var scene
		if (!usePhysics && GameConsts.isUsePhysics) {
			Laya3D["_enbalePhysics"] = false
			scene = new Laya.Scene3D();
			Laya3D["_enbalePhysics"] = true;
		} else {
			scene = new Laya.Scene3D();
		}
		return scene;
	}


	//设置一个模型所有子对象的renderquene
	public static setViewRenderQuene(view: Laya.Sprite3D, value) {
		var a: Laya.MeshSprite3D = view as Laya.MeshSprite3D;
		var b: Laya.SkinnedMeshSprite3D = view as Laya.SkinnedMeshSprite3D;
		if (a.meshRenderer && a.meshRenderer.material) {
			a.meshRenderer.material.renderQueue = value
		}
		if (b.skinnedMeshRenderer && b.skinnedMeshRenderer.material) {
			b.skinnedMeshRenderer.material.renderQueue = value;
		}
		for (var i = 0; i < view.numChildren; i++) {
			var child = view.getChildAt(i);
			this.setViewRenderQuene(child as Laya.Sprite3D, value);
		}

	}

	/**
	 *
	 * @param modelName  模型名字 比如role_1; 原则上战斗中不要这样使用. 会降低一定性能.多嵌套一层. 只适合系统层的开发
	 * @param showViewArr 需要显示的子对象名字.默认为空表是全部显示,否则按照传入的数组显示.可以多级显示,["child1.child12", "child2","child3",... ];
	 *  显示会显示某个路径以及这个路径的所有子对象 ,比如 child2 会显示child2以及所有子对象
	 * @param callBack 模型加载成功后的回调.
	 * @param thisObj
	 * @param args 回调附带参数
	 *  返回一个sprite3D对象. 目前是可以非阻塞的进行其他的流程
	 */
	public static createSpriteExpand(modelName: string, showViewArr = null, callBack = null, thisObj = null, args: any[] = null) {
		var sp = new Sprite3DExpand(modelName);
		sp.startLoadModel(modelName, callBack, thisObj, args)
		sp.setShowViewArr(showViewArr);
		return sp;
	}

	//创建动态特效
	public static createEffectExpand(modelName: string, showViewArr = null, callBack = null, thisObj = null, args: any[] = null) {

	}

	//创建动画扩展 aniName 动画短名,  aniMode 动画模式 0 不支持换装, 1,2支持换装, 原则上只使用1,
	public static createSkeletonExpand(aniName: string, aniMode = 0, completeFunc = null, thisObj = null, expandParams = null) {
		var ske = new SkeletonExpand(null, aniMode);
		ske.completeBackFunc = completeFunc;
		ske.completeThisObj = thisObj;
		ske.completeExpandParams = expandParams;
		ske.startLoadByShortName(aniName);
		return ske
	}

	//发光矩阵
	private static lightMatrix: any[] = [
		0.52, 0, 0, 0, 0,
		0, 0.52, 0, 0, 0,
		0, 0, 0.52, 0, 0,
		0, 0, 0, 0.52, 0,
	]

	//闪红矩阵
	private static littleRedMatrix: any[] = [
		1, 0, 0, 0, 80,
		0, 1, 0, 0, 0,
		0, 0, 1, 0, 0,
		0, 0, 0, 1, 0,
	]

	//变暗矩阵
	private static darkMatrix: any[] = [
		0.3, 0, 0, 0, 0,
		0, 0.3, 0, 0, 0,
		0, 0, 0.3, 0, 0,
		0, 0, 0, 1, 0,
	]


	//设置显示对象变暗 (通用对象未激活效果)
	static setViewDark(view) {
		this.setViewMatrixByMatirx(view, this.darkMatrix);
	}

	//设置显示对象变亮 (通用按钮点击变色效果)
	static setViewLight(view) {
		this.setViewMatrixByMatirx(view, this.lightMatrix);
	}

	//设置显示对象变红(通用闪红效果)
	static setViewLittleRed(view) {
		this.setViewMatrixByMatirx(view, this.littleRedMatrix);
	}

	//清空滤镜
	static clearViewFilter(view) {
		view.filters = null
	};

	//设置图片的颜色形变 r,g,b  -1,1,  offrgb  (-255,255);
	static setViewColorTransform(view: Laya.Sprite, r = 1, g = 1, b = 1, a = 1, offr = 0, offg = 0, offb = 0, offa = 0) {
		var matrixArr = [
			r, 0, 0, 0, offr,
			0, g, 0, 0, offg,
			0, 0, b, 0, offb,
			0, 0, 0, a, offa,
		]

		view.filters = [new Laya.ColorFilter(matrixArr)];
	}

	//设置颜色 滤镜效果
	static setViewMatrixFilter(view: Laya.Sprite, r1, r2, r3, r4, offr, g1, g2, g3, g4, offg, b1, b2, b3, b4, offb, a1, a2, a3, a4, offa) {
		var matrixArr = [
			r1, r2, r3, r4, offr,
			g1, g2, g3, g4, offg,
			b1, b2, b3, b4, offb,
			a1, a2, a3, a4, offa,
		]
		view.filters = [new Laya.ColorFilter(matrixArr)];
	}

	//设置颜色滤镜 根据矩阵数组. 这个是为了节省内存. 防止有大量数组创建
	static setViewMatrixByMatirx(view, matrix: any[]) {
		view.filters = [new Laya.ColorFilter(matrix)];
	}

	static localToLocalPos(p1Pos: Laya.Point, sp1: Laya.Sprite, sp2: Laya.Sprite) {
		sp1.localToGlobal(p1Pos);
		sp2.globalToLocal(p1Pos);
		return p1Pos
	}


	//创建序列帧动画  这个数据结构是最标准的.
	/**
	 * 序列帧动画的图片名字结尾必须是连续的数字 , 比如 role_atk_1,role_atk_2,...
	 * imagePath 图片路径,以/结尾 . 比如 frame/role1/;
	 * imageHead 可以为空串,
	 * 对于只有一个动作标签的 比如特效  默认的label全部配 idle
	 * labels:[
	 *  {
	 *      label:  'idle',
	 *      //采用这个结构是为了节省内存 牺牲可读性
	 *      frame: [ 图片1持续帧数,图片2持续帧数 ,...],
	 *      group:[101,102,103,... ]   //图片序号
	 *      offset:[1,1,1.1,1.2]        //根据图片的数量 依次向后排列 2位对应group1位
	 *  },
	 * {
	 *      label:  'attack',
	 *      frame: [1,1,1,1,1 ],         可以不传入 表示默认一个图片持续1帧
	 *      group:[101,102,103,104,105]    表示动作包含5个图片 ,.动作长度是9帧第一张图片持续1帧,第二张图持续2帧 依次类推
	 *  },
	 * ]
	 */
	public static createSpriteFrame(imagePath: string, imageHead: string, labelsArr: any = null, anchorX: number = 0.5, anchorY: number = 0.5, offsetMap: any = null) {
		var spriteFrame = new SpriteFrameExpand();
		spriteFrame.setFrameData(imagePath, imageHead, labelsArr, anchorX, anchorY, 1, offsetMap);
		return spriteFrame
	}


	/**
	 * 根据简短的标签数据创建序列帧动画
	 * @param labelsArr
	 *  [
	 *      {
	 *          label:"idle",
	 *          group:[1,10,1]      //group 3个值表示 起始序号,结束序号, 每一个图片持续帧数.
	 *      }
	 *
	 * ]
	 * @param offsetMap 坐标偏移表: {1001:[10,20],1002:[10,20],...};
	 */
	public static createSpriteFrameByShort(imagePath: string, imageHead: string, labelsArr: any, anchorX: number = 0.5, anchorY: number = 0.5, offsetMap: any = null) {
		var spriteFrame = new SpriteFrameExpand();
		spriteFrame.setFrameData(imagePath, imageHead, labelsArr, anchorX, anchorY, 2, offsetMap);
		return spriteFrame
	}

	/**设置panel的滚动
	 * isScroll：true 可以滚动 false 禁止滚动
	 */
	public static setPanelScrollVisbie(panel: Laya.Panel, isScroll) {
		if (panel.vScrollBar) {
			panel.vScrollBar.touchScrollEnable = isScroll;
		}
		if (panel.hScrollBar) {
			panel.hScrollBar.touchScrollEnable = isScroll;
		}
	}


}

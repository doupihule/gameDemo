import FogControler from "./FogControler";


export class FogLayerControler {
	/**
	 * 游戏图层管理器,初步将游戏分为4
	 * a = {
	 * 	a1,
	 * 	a2 = {
	 * 		a21,
	 * 		a22,
	 * 		a23,
	 * 	}
	 * 	a3:
	 * }
	 *
	 *
	 */

	/**游戏的根容器 */
	a: Laya.Sprite;
	/**游戏场景的后景层 */
	a1: Laya.Sprite;
	/**游戏世界元素交互的容器 */
	a2: Laya.Sprite;
	/**游戏场景的前景层 */
	a3: Laya.Sprite;
	/**游戏容器的偏移层级 */
	a2Offset: Laya.Sprite;
	/**游戏世界元素交互容器的后层,主要是放脚下光环.影子,等需要被角色压住的特效 */
	a21: Laya.Sprite;
	/**游戏世界元素里面的角色所在的容器,主要放角色.主要交互都在这一层 */
	a22: Laya.Sprite;
	/**游戏世界元素里面 的前景特效. 需要挡住角色.但是会被场景的前景挡住 */
	a23: Laya.Sprite;
	/**遮罩层 */
	a24: Laya.Sprite;


	public rootCtn: Laya.Sprite;

	private fogControler: FogControler;


	public constructor(fogControler: FogControler, rootCtn: Laya.Sprite) {
		this.fogControler = fogControler;
		this.rootCtn = rootCtn;
		this.a = new Laya.Sprite()
		this.a1 = new Laya.Sprite();
		this.a2 = new Laya.Sprite();
		this.a3 = new Laya.Sprite();


		this.a2Offset = new Laya.Sprite();

		this.a21 = new Laya.Sprite();
		this.a22 = new Laya.Sprite();
		this.a23 = new Laya.Sprite();
		this.a24 = new Laya.Sprite();


		rootCtn.addChild(this.a);
		this.a.addChild(this.a1);
		this.a.addChild(this.a2);
		this.a.addChild(this.a3);


		//为了方便坐标好算. 网格的(0,0)点会和 原点有一个相对坐标偏移
		this.a2.addChild(this.a2Offset);
		this.a2Offset.x = 0;
		this.a2Offset.y = 0;

		this.a2Offset.addChild(this.a21);
		this.a2Offset.addChild(this.a22);
		this.a2Offset.addChild(this.a23);
		this.a2Offset.addChild(this.a24);
	}


	//销毁函数
	dispose() {
		this.a && this.a.removeChildren();
		this.a = null;
		this.a1 = null;
		this.a2 = null;
		this.a3 = null;

		this.a21 = null;
		this.a22 = null;
		this.a23 = null;
		this.fogControler = null;
	}

}
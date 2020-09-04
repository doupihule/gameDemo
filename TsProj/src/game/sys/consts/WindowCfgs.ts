import {LoadingUI} from "../view/loading/LoadingUI";
import LoginUI from "../view/login/LoginUI";
import AlertUILocal from "../view/popup/AlertUILocal";
import TipsUI from "../view/tip/TipsUI";
import ReqLoadingUI from "../view/loading/ReqLoadingUI";
import GameMainUI from "../view/main/GameMainUI";
import ResultJumpUI from "../view/jump/ResultJumpUI";
import {BattleUI} from "../view/battle/BattleUI";
import JumpListUI from "../view/jump/JumpListUI";

export class WindowCfgs {

	//窗口的一些配置参数配置, 比如 是否配置模板, 是否是全屏窗口,是否需要额外加载什么资源
	public constructor() {
	}

	//缩放弹出效果
	static UISHOWTYPE_SCALEIN: number = 1;
	// 透明度渐变进入
	static UISHOWTYPE_FADEIN: number = 2;

	//UI层
	static UILAYER: string = "uilayer";
	//顶层
	static TOPLAYER: string = "toplayer";

	//网络异常弹窗界面 会盖住toplayer
	static HIGHLAYER: string = "highlayer";
	//调试界面
	static DEBUGLAYER: string = "debugLayer";


	//加载界面
	static LoadingUI: string = "LoadingControler";
	//数据请求界面
	static ReqLoadingUI: string = "ReqLoadingUI";
	//弹窗界面
	static AlertUILocal: string = "AlertUILocal";
	static AlertUI: string = "AlertUI";

	//测试接口弹窗
	static TestOpListUI: string = "TestOpListUI";

	//游戏系统ui
	static LoginUI: string = "LoginUI";
	//引导界面
	static GuideUI: string = "GuideUI"

	static TipsUI: string = "TipsUI";
	static TalkFrameUI: string = "TalkFrameUI";
	static JumpListUI: string = "JumpListUI";
	static ResultJumpUI: string = "ResultJumpUI";
	static ResultJumpDoubleUI: string = "ResultJumpDoubleUI";
	static GameMainUI: string = "GameMainUI";
	static BattleUI: string = "BattleUI";
	static BattleResultUI: string = "BattleResultUI";
	static  StageSelectUI:string = "StageSelectUI";
	static MainJumpZhiseUI: string = "MainJumpZhiseUI";
	static JumpListZhiseUI: string = "JumpListZhiseUI";

	static MainJumpKariquUI: string = "MainJumpKariquUI";
	//通用配置,如果不配置 就没有
	static commonCfgs: any = {
		modal: 1,	//ui默认是有模态的,
		modalAlpha: 0.3,		//默认模态透明度为0.3
		parent: WindowCfgs.UILAYER,	//parent 默认是UI层,如果有特殊层级, 在windowcfgs里面指定
		offset: [0, 0],					//坐标偏移, 默认是没有偏移的
		full: false,		//默认不是全屏ui
		group: [],		//需要加载的服务器资源组,
		sound: true,     //是否播放打开音效 ,默认是播放的
		autoClose: false,    //是否点击空白地方自动关闭
		style: 0,    //ui打开显示方式,默认为0,没有任何效果, UISHOWTYPE_SCALEIN
		cache: false,       //是否关闭ui时 缓存,不做dispos,重新打开的时候 做pop, 默认不缓存,原则上缓存的ui需要重写 onSelfPop函数

	}

	//窗口参数设置.
	/**
	 * key 就是对应ui类的类名
	 * modal: 是否显示半透模态, 0表示不显示,1表示显示, 默认是显示模态的
	 * modalAlpha: 模态透明度, 默认120
	 * bg: 背景图片,只配置背景图片名称不需要带后缀.如果给这个ui配置了背景, 那么这个ui就一定是全屏的full会强制为true.model就不需要创建了
	 * full: 特殊的是否指定是全屏ui, 可选
	 * style:打开方式 0 是硬开, 1是透明度渐变打开,2 fadetIn...后续扩展
	 * group:需要加载的资源组名 默认为空.
	 * group3d,需要加载的3D资源名,默认为空
	 * path:  对应view的类对方
	 */
	static _windowcfgs: any;
	static get windowcfgs() {
		if (!this._windowcfgs) {
			this._windowcfgs = {
				//公共界面
				//资源加载界面
				[WindowCfgs.LoadingUI]: {modal: 1, path: LoadingUI, modalAlpha: 0, position: 8, offset: [0, -100]},
				[WindowCfgs.ReqLoadingUI]: {
					modal: 1,
					path: ReqLoadingUI,
					parent: WindowCfgs.TOPLAYER,
					autoClose: true,
					modalAlpha: 0.01
				},
				[WindowCfgs.AlertUILocal]: {
					modal: 1,
					path: AlertUILocal,
					parent: WindowCfgs.HIGHLAYER,
					autoClose: true,
					modalAlpha: 0.01
				},
				[WindowCfgs.LoginUI]: {
					modal: 1,
					path: LoginUI,
					parent: WindowCfgs.TOPLAYER,
					modalAlpha: 0.01,
					group: ["gameui/login/Login.scene"],
					subPackage: ["uisource", "atlas_source"]
				},
				[WindowCfgs.TipsUI]: {modal: 1, path: TipsUI, modalAlpha: 0.01},
				[WindowCfgs.ResultJumpUI]: {
					modal: 1,
					path: ResultJumpUI,
					modalAlpha: 0.01,
					group: ["gameui/jump/ResultJump.scene",],
				},

				[WindowCfgs.JumpListUI]: {
					modal: 1,
					path: JumpListUI,
					modalAlpha: 0.01,
					group: ["gameui/jump/JumpList.scene",],
				},
				[WindowCfgs.GameMainUI]: {
					path: GameMainUI,
					prefabPath : "main",
					full: true
				},
				[WindowCfgs.BattleUI]: {
					path: BattleUI,
					full: true
				},
				[WindowCfgs.StageSelectUI]:{
					path: StageSelectUI,
					full: true
				}


			}

		}
		return this._windowcfgs;
	};

}    

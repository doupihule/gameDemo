export class MusicConst {
	//背景音乐
	static MUSIC_BGM: string = "main_bg";
	static MUSIC_BATTLE_MUSIC: string = "main_bg"

	/*=================================战斗相关=================================*/
	//关卡内背景音乐，从玩家开始操作车辆起，开始循环播放
	static SOUND_BATTLE_BG: string = "main_bg"

	/*=================================通用=================================*/
	//通用打开界面音效
	static SOUND_CLICK_OPEN: string = "click"
	//通用关闭界面音效
	static SOUND_CLICK_CLOSE: string = "click"
	//主界面循环播放
	static SOUND_MAIN_BG: string = "main_bg"
	/** 通用按钮音效 */
	static SOUND_BUTTON_CLICK: string = "click"

	//开枪音效
	static SOUND_SHOOT: string = "shoot"
	//子弹遇到墙体碰撞
	static SOUND_CRASH: string = "crash"
	//击中死亡
	static SOUND_HITDIE: string = "hitdie"
	//音效参数定义.暂时定义时长. 后面会定义 是否循环.时间等
	static soundCfgs = {}


}
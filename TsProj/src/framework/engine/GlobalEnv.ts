import BaseViewExpand from "../components/BaseViewExpand";

export  default  class  GlobalEnv {

	private  static  _stage:any;
	private  static  _uiroot:any;

	//游戏舞台
	public  static stage:BaseViewExpand;
	//ui的跟容器
	public  static  uiRoot:BaseViewExpand;

	static  initStage(){

	}

}
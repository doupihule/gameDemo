import UIBaseView from "../../../../framework/components/UIBaseView";
import ButtonExpand from "../../../../framework/components/ButtonExpand";



export default class GameMainUI extends UIBaseView  {


	public  btn_test:ButtonExpand;
	constructor() {
		super();


	}

	public  doAfterInit() {
		this.btn_test.setClickFunc(this.onClickTest,this,1)
		this.btn_test.setClickFunc(this.onClickTest,this,2)
		this.btn_test.set2dPos(100,100);
	}

	private  onClickTest(params){
		LogsManager.echo("__clickTest",params);
	}

}



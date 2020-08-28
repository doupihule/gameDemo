import BaseViewExpand from "./BaseViewExpand";
import BaseContainer from "./BaseContainer";


export default class LabelExpand extends BaseContainer{
	public  text:string;
	constructor(cobj) {
		super(cobj);
	}

	//设置颜色
	public  setColor(r,g,b,a=255){

	}

	//设置换行模式
	public  setWrapStyle(xSyle=0,yStyle =1){

	}

	//设置字体
	public  setFont(name:string){

	}

	//设置描边
	public setOutLine(xlen, ylen, a, r, g, b){

	}

	//设置投影
	public setShade(xlen, ylen, a, r, g, b){

	}

}

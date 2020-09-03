export default class UICompConst {
	static comp_base = "base";     //基础容器
	static comp_btn = "btn";
	static comp_img = "img";       //图片
	static comp_ctn = "ctn";       //容器
	static comp_label = "label";       //文本
	static comp_input = "input";   //输入文本
	static comp_scroll = "scroll";    //滚动容器
	static comp_list = "list";        //滚动列表
	static comp_spine = "spine";       //spine动画
	static comp_ui = "ui";			//ui也是一个类型 代表是子ui
	static  comp_base3d = "base3d"	//基础3d模型

	static  posStyle_2d:number = 1;
	static  posStyle_3d:number = 2;



//组件对应的类
	static classMap = {
		base: "BaseViewExpand",
		btn: "ButtonExpand",
		img: "ImageExpand",
		ctn: "BaseContainer",
		label: "LabelExpand",
		input: "InputExpand",
		list: "ListExpand",
		spine: "SpineGraphicExpand",
		ui:"UI",
		base3d:"Base3dViewExpand",

	}
}

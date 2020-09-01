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


//组件对应的类
	static classMap = {
		base: "BaseView",
		btn: "Button",
		img: "Image",
		ctn: "Container",
		label: "Label",
		input: "Input",
		list: "List",
		spine: "Spine",

	}
}

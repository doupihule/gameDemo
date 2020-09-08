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

	static  comp_compbase = "compbase";	//基础组件
	//3d组件
	static  comp_plane = "plane";		//底面
	static  comp_camera = "camera";
	static  comp_animator3d = "animator3d";	//动画3d
	static  comp_particle3d = "particle3d";	//粒子 3d
	static  comp_collider = "collider";		//碰撞器
	static  comp_rigidbody3d = "rigidbody3d";	//3d刚体

	//碰撞检测事件侦听. 这个一般自己绑定组件实现.继承BaseCompExpand即可
	static  comp_colliderListener = "colliderListener";


	static  posStyle_2d:number = 1;
	static  posStyle_3d:number = 2;


}

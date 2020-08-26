import UserInfo from "../../../framework/common/UserInfo";

export default class SubPackageConst {


	public static packName_share: string = "share";

	public static packName_json: string = "json";
	public static packName_jsonreview: string = "jsonreview";
	public static packName_mergefiles: string = "mergefiles";

	public static packName_uisource: string = "uisource";
	public static packName_atlas_source: string = "atlas_source";
	public static packName_atlas_native: string = "atlas_native";
	//声音是动态分包的.但是这里还是定义一个声音分包.用来判断声音是走cdn 还是走分包.方便底层判断
	public static packName_sound: string = "sound";
	public static packName_spine: string = "spine";  //动画分包

	public static packName_map: string = "map";
	public static packName_scene: string = "scene";

	public static packName_model3d: string = "model3d";
	public static packName_heroIconBig: string = "heroiconbig"
	public static packName_fogItem: string = "fogitemicon";
	public static packName_expedition: string = "expedition";
	public static packName_equipicon: string = "equipicon";


	//资源存放方式, 0是cdn ,  1 是 放到native里面  2 是放到 分包里面
	public static PATH_STYLE_CDN: number = 0;
	public static PATH_STYLE_NATIVE: number = 1;
	public static PATH_STYLE_SUBPACK: number = 2;


	/**配置需要分包加载的系统名和路径  配这个是为了将该文件夹加到本地资源列表中,
	 *
	 *  这个表后面会有更多的配置 所以做成表的格式
	 * 放到首包里面的模块 .json 和mergefiles 后期会根据项目调整.动态挪动. 比如可能会放到native里面 也可能会放到 subpack里面.还有可能走cdn
	 * path: 分包路径
	 * style: 资源存放方式.
	 *
	 */
	public static _subPackData: any = {
		//分享图是放 分包
		[SubPackageConst.packName_share]: {path: "share/", style: SubPackageConst.PATH_STYLE_CDN},
		[SubPackageConst.packName_json]: {path: "json/", style: SubPackageConst.PATH_STYLE_SUBPACK},
		[SubPackageConst.packName_jsonreview]: {path: "jsonreview/", style: SubPackageConst.PATH_STYLE_SUBPACK},
		[SubPackageConst.packName_mergefiles]: {path: "mergefiles/", style: SubPackageConst.PATH_STYLE_NATIVE},
		[SubPackageConst.packName_spine]: {path: "spine/", style: SubPackageConst.PATH_STYLE_SUBPACK}, //spine分包

		//ui放首包
		[SubPackageConst.packName_uisource]: {path: "uisource/", style: SubPackageConst.PATH_STYLE_NATIVE},
		[SubPackageConst.packName_atlas_source]: {
			path: "res/atlas/uisource/",
			style: SubPackageConst.PATH_STYLE_NATIVE
		},
		//动态分包的目录也需要在这里占一个坑
		[SubPackageConst.packName_sound]: {path: "sound/", style: SubPackageConst.PATH_STYLE_SUBPACK},

		[SubPackageConst.packName_map]: {path: "map/", style: SubPackageConst.PATH_STYLE_SUBPACK},
		[SubPackageConst.packName_scene]: {path: "scene/", style: SubPackageConst.PATH_STYLE_NATIVE},
		[SubPackageConst.packName_heroIconBig]: {
			path: "res/atlas/heroiconbig/",
			style: SubPackageConst.PATH_STYLE_SUBPACK
		},

		[SubPackageConst.packName_fogItem]: {
			path: "res/atlas/uisource/fogitemicon/",
			style: SubPackageConst.PATH_STYLE_SUBPACK
		},
		[SubPackageConst.packName_expedition]: {
			path: "res/atlas/uisource/expedition/",
			style: SubPackageConst.PATH_STYLE_SUBPACK
		},
		[SubPackageConst.packName_equipicon]: {
			path: "res/atlas/uisource/equipicon/",
			style: SubPackageConst.PATH_STYLE_SUBPACK
		},

		["scene_battle01"]: {path: "res/atlas/map/scene_battle01/", style: SubPackageConst.PATH_STYLE_NATIVE},

		["role_09"]: {path: "spine_native", style: SubPackageConst.PATH_STYLE_NATIVE},
		["role_16"]: {path: "spine_native", style: SubPackageConst.PATH_STYLE_NATIVE},
	}

	//获取分包配置. 这里需要出一次初始化覆盖逻辑
	public static get subPackData() {
		if (!this._hasCoverSubpack) {
			this._hasCoverSubpack = true;
			var data = this._platSubpackData[UserInfo.platformId];
			if (data) {
				for (var i in data) {
					this.subPackData[i] = data[i];
				}
			}
		}
		return this._subPackData;
	}

	//是否覆盖过分包
	private static _hasCoverSubpack: boolean = false;

	//根据平台区分分包 会把对应平台的分包 覆盖拷贝到_subPackData;
	//isWhole  代表 把这个目录下的所有文件作为一个整包. 目前只有声音做了这样的配置
	private static _platSubpackData: any = {
		"baidugame": {
			["sound"]: {path: "sound/", style: SubPackageConst.PATH_STYLE_SUBPACK, isWhole: true},
			["groupSound"]: {path: "groupSound/", style: SubPackageConst.PATH_STYLE_SUBPACK, isWhole: true},
		}

	}


	//按组配置分包.  后续这个配置可以通过脚本生成  groupSpine,groupSound,groupModel3d为统一固定的路径
	/**
	 * [
	 *  {
	 *      name: 组的分包名,
	 *      path: 相对于bin目录的文件夹路径.不带斜杠
	 *      child:[对应的子动画或者声音的目录,(每个子包必须都是文件夹形式. 保持原来的层级结构.)]
	 * }
	 *
	 * ]
	 */

	//spine组
	/**
	 * 只需要把对应的单个spine目录放到对应的spine组目录下, 同时在这里配置即可.代码底层已经做了反向路径映射
	 * spine分组原则:
	 * 1.如果角色 对应的特效数量超过3个  . 那么把角色 和角色对应的子弹作为一个组. 特效单独作为一个组. 否则 把角色以及对应的子弹和特效都作为一个组
	 * 2. 敌方角色, 如果有特效和子弹.  那么把敌方单个角色,子弹和特效作为一组.
	 * 3. 敌方没有单独特效. 可以把2个角色作为一个组
	 *
	 */
	public static spineGroupCfgs = [
		{
			path: 'groupSpine',
			name: 'group_effect_common',
			child: ['efect_same_born_01', 'effect_dianta_shoot_1006', 'effect_flat_skill1_aoe', 'effect_flat_skill2_aoe', 'effect_flat_skill3_aoe', 'effect_flat_skill4_hit', 'effect_geshou_skill2_hit', 'effect_huaji_attack_hit', 'effect_normal_boom', 'effect_tanya_attack_hit']
		},
		{path: 'groupSpine', name: 'group_role_01', child: ['bullet_gangjing_attack', 'role_01']},
		{path: 'groupSpine', name: 'group_role_02', child: ['effect_jiafang_attack_self', 'role_02']},
		{path: 'groupSpine', name: 'group_role_03', child: ['effect_lvcha_attack_self', 'role_03', 'role_03_1']},
		{
			path: 'groupSpine',
			name: 'group_role_05',
			child: ['effect_longge_attack_hit', 'effect_longge_attack_self', 'role_05']
		},
		{path: 'groupSpine', name: 'group_role_06', child: ['effect_digouyou_attack_self', 'role_06']},
		{
			path: 'groupSpine',
			name: 'group_role_07',
			child: ['bullet_leidian_attack', 'effect_leidian_attack_buff', 'effect_leidian_attack_hit', 'role_07']
		},
		{
			path: 'groupSpine',
			name: 'group_role_08',
			child: ['bullet_jiapanxia_attack', 'effect_jianpanxia_attack_hit', 'role_08']
		},
		{
			path: 'groupSpine',
			name: 'group_role_10',
			child: ['effect_xiongmaoren_attack_hit', 'effect_xiongmaoren_attack_self', 'effect_xiongmaoren_skill2', 'role_10']
		},
		{
			path: 'groupSpine',
			name: 'group_role_1000',
			child: ['bullet_jidi_attack', 'bullet_jidi_attack01', 'bullet_jidi_attack02', 'effect_jidi_attack01_hit', 'effect_jidi_attack02_hit', 'effect_jidi_attack_hit', 'effect_jidi_boom_1015', 'role_1000']
		},
		{path: 'groupSpine', name: 'group_role_1001', child: ['role_1001']},
		{
			path: 'groupSpine',
			name: 'group_role_11',
			child: ['effect_murcat_attack_buff', 'effect_murcat_attack_buff_1', 'effect_murcat_attack_self', 'effect_shield_buff', 'role_11']
		},
		{
			path: 'groupSpine',
			name: 'group_role_12',
			child: ['effect_huangniao_attack_hit', 'effect_huangniao_attack_self', 'effect_huangniao_skill01_AOE', 'role_12']
		},
		{
			path: 'groupSpine',
			name: 'group_role_13',
			child: ['effect_pipixia_attack_buff', 'effect_pipixia_attack_hit', 'role_13']
		},
		{
			path: 'groupSpine',
			name: 'group_role_14',
			child: ['bullet_foxi_attack', 'effect_foxi_attack_buff', 'effect_foxi_attack_hit', 'effect_foxi_attack_self', 'role_14']
		},
		{
			path: 'groupSpine',
			name: 'group_role_15',
			child: ['bullet_ningmeng_attack', 'effect_ningmeng_attack_aoe', 'effect_ningmeng_attack_buff', 'role_15']
		},
		{path: 'groupSpine', name: 'group_role_16', child: ['effect_lanqiu_attack_aoe', 'effect_lanqiu_attack_aoe2']},
		{
			path: 'groupSpine',
			name: 'group_role_17',
			child: ['bullet_gewala_attack_self', 'effect_gewala_attack_hit', 'effect_gewala_attack_self', 'bullet_gewala_attack_self_01', 'role_17', 'role_17_1']
		},
		{
			path: 'groupSpine',
			name: 'group_role_21',
			child: ['bullet_996_skill01', 'effect_996_skill01_aoe', 'effect_996_skill02_aoe', 'effect_996_skill02_self', 'role_21']
		},
		{path: 'groupSpine', name: 'group_role_19', child: ['role_19']},
		{
			path: 'groupSpine',
			name: 'group_role_20',
			child: ['role_20', 'bullet_chigua_attack', 'effect_chigua_attack_self']
		}

	]
	//声音组
	/**
	 * 只需要把声音放到 对应的组目录下. 然后在这里配置即可
	 * 声音分组原则:
	 * 暂定5个音效一个组(如果能根据业务逻辑区分更好). 背景音乐独立.
	 */
	public static soundGroupCfgs = [
		{
			name: "group_sound_1",
			path: "groupSound",
			child: [
				"shoot_1", "shoot_2", "shoot_3",
			]
		}

	]

	//3D模型组
	public static model3dGroupCfgs = []


}
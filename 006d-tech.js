
var hzpmg;

(function()
{
	var root = document.getElementById( "doodle-main" );
	hzpmg = new HanzipadMinigame( root );

	hzpmg.words = [
		{ glyphs: "器", sound: "qi4", eng: "tool" },
		{ glyphs: "上传", sound: "shang4 chuan2", eng: "to upload" },
		{ glyphs: "脚本", sound: "jiao3 ben3", eng: "script" },
		{ glyphs: "开发板", sound: "kai1 fa1 ban3", eng: "development board" },
		{ glyphs: "运行", sound: "yun4 xing2", eng: "to run (a script or program)" },
		{ glyphs: "编辑", sound: "bian1 ji2", eng: "to edit" },
		{ glyphs: "文本编辑", sound: "wen2 ben3 bian1 ji2", eng: "text editor", image: "assets/006d/images/vim.svg" },
		{ glyphs: "开机", sound: "kai1 ji1", eng: "to boot (a device or computer)" },
		{ glyphs: "自动", sound: "zi4 dong4", eng: "automatically" },
		{ glyphs: "串口", sound: "chuan4 kou3", eng: "serial port" },
		{ glyphs: "加密", sound: "jia1 mi4", eng: "encryption" },
		{ glyphs: "刷入", sound: "shua1 ru4", eng: "to flash (firmware)" },
		{ glyphs: "固件", sound: "gu4 jian4", eng: "firmware" },
		{ glyphs: "头", sound: "tou2", eng: "header" },
		{ glyphs: "格式", sound: "ge2 shi4", eng: "format" },
		{ glyphs: "文件", sound: "wen2 jian4", eng: "file" },
		{ glyphs: "文件格式", sound: "wen2 jian4 ge2 shi4", eng: "file format" },
		{ glyphs: "文件管理器", sound: "wen2 jian4 guan3 li3 qi4", eng: "file manager" },
		{ glyphs: "变量", sound: "bian4 liang4", eng: "variable" },
		{ glyphs: "全局变量", sound: "quan2 ju2 bian4 liang4", eng: "environment variable" },
		{ glyphs: "变动", sound: "bian4 dong4", eng: "change, alteration (commit)" },
		{ glyphs: "模块", sound: "mo2 kuai4", eng: "module, component" },
		{ glyphs: "容器", sound: "rong2 qi4", eng: "container" },
		{ glyphs: "对象", sound: "dui4 xiang4", eng: "object" },
		{ glyphs: "面向对象", sound: "mian4 xiang4 dui4 xiang4", eng: "object oriented" },
		{ glyphs: "支持", sound: "zhi1 chi2", eng: "to support" },
		{ glyphs: "路由器", sound: "lu4 you2 qi4", eng: "router" },
		{ glyphs: "路由协定", sound: "lu4 you2 xie2 ding4", eng: "routing protocol" },
		{ glyphs: "请求", sound: "qing3 qiu2", eng: "request" },
		{ glyphs: "跨域请求", sound: "qua4 yv4 qing3 qiu2", eng: "cross-domain request" },
		{ glyphs: "数据库", sound: "shu4 jv4 ku4", eng: "database" },
		{ glyphs: "中间件", sound: "zhong1 jian1 jian4", eng: "middleware" },
		{ glyphs: "软件", sound: "ruan3 jian4", eng: "software" },
		{ glyphs: "硬件", sound: "ying4 jian4", eng: "hardware" },
		{ glyphs: "版本", sound: "ban3 ben3", eng: "version" },
		{ glyphs: "安装", sound: "an1 zhuang1", eng: "to install" },
		{ glyphs: "启动服务", sound: "qi3 dong4 fu2 wu4", eng: "to start a service" },
		{ glyphs: "启动", sound: "qi3 dong4", eng: "to start (a machine or service)" },
		{ glyphs: "服务", sound: "fu2 wu4", eng: "service" },
		{ glyphs: "浏览器", sound: "liu2 lan3 qi4", eng: "web browser" },
		{ glyphs: "手册", sound: "shou3 ce4", eng: "manual" },
		{ glyphs: "手册页", sound: "shou3 ce4 ye4", eng: "manpage" },
		{ glyphs: "指导", sound: "zhi3 dao3", eng: "guide" },
		{ glyphs: "离线", sound: "li2 xian4", eng: "offline" },
		{ glyphs: "在线", sound: "zai4 xian4", eng: "online" },
		{ glyphs: "在线游戏", sound: "zai4 xian4 you2 xi4", eng: "online game" },
		{ glyphs: "开发", sound: "kai1 fa1", eng: "development" },
		{ glyphs: "软件开发", sound: "ruan3 jian4 kai1 fa1", eng: "software development" },
		{ glyphs: "软件开发师", sound: "ruan3 jian4 kai1 fa1 shi", eng: "software developer" },
		{ glyphs: "升级", sound: "sheng1 ji2", eng: "upgrade" },
		{ glyphs: "命名规范", sound: "ming4 ming2 gui1 fan4", eng: "naming convention" },
		{ glyphs: "版本控制软件", sound: "ban3 ben3 kong4 zhi4 ruan3 jian4", eng: "version control software" },
		{ glyphs: "版本控制", sound: "ban3 ben3 kong4 zhi4", eng: "version control" },
		{ glyphs: "前端", sound: "qian2 duan1", eng: "frontend" },
		{ glyphs: "后端", sound: "hou4 duan1", eng: "backend" },
		{ glyphs: "全栈", sound: "quan2 zhan4", eng: "fullstack" },
		{ glyphs: "全屏", sound: "quan2 ping2", eng: "fullscreen" },
		{ glyphs: "显示", sound: "xian3 shi4", eng: "display, to display" },
		{ glyphs: "核心", sound: "he2 xin1", eng: "kernel" },
		{ glyphs: "发布日期", sound: "fa1 bu4 ri4 qi1", eng: "release date" },
	];

	hzpmg.start();

})();


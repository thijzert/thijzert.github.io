
var hzpmg;

(function()
{
	var root = document.getElementById( "doodle-main" );
	hzpmg = new HanzipadMinigame( root );

	hzpmg.words = [
		{ glyphs: "器", sound: "qi4", eng: "tool", audio: "assets/006d/audio/qi4.mp3" },
		{ glyphs: "上传", sound: "shang4 chuan2", eng: "to upload", audio: "assets/006d/audio/shang4chuan2.mp3" },
		{ glyphs: "脚本", sound: "jiao3 ben3", eng: "script", audio: "assets/006d/audio/jiao3ben3.mp3" },
		{ glyphs: "开发板", sound: "kai1 fa1 ban3", eng: "development board", audio: "assets/006d/audio/kai1fa1ban3.mp3" },
		{ glyphs: "运行", sound: "yun4 xing2", eng: "to run (a script or program)", audio: "assets/006d/audio/yun4xing2.mp3" },
		{ glyphs: "编辑", sound: "bian1 ji2", eng: "to edit", audio: "assets/006d/audio/bian1ji2.mp3" },
		{ glyphs: "文本编辑", sound: "wen2 ben3 bian1 ji2", eng: "text editor", image: "assets/006d/images/vim.svg", audio: "assets/006d/audio/wen2ben3bian1ji2.mp3" },
		{ glyphs: "开机", sound: "kai1 ji1", eng: "to boot (a device or computer)", audio: "assets/006d/audio/kai1ji1.mp3" },
		{ glyphs: "自动", sound: "zi4 dong4", eng: "automatically", audio: "assets/006d/audio/zi4dong4.mp3" },
		{ glyphs: "串口", sound: "chuan4 kou3", eng: "serial port", audio: "assets/006d/audio/chuan4kou3.mp3" },
		{ glyphs: "加密", sound: "jia1 mi4", eng: "encryption", audio: "assets/006d/audio/jia1mi4.mp3" },
		{ glyphs: "刷入", sound: "shua1 ru4", eng: "to flash (firmware)", audio: "assets/006d/audio/shua1ru4.mp3" },
		{ glyphs: "固件", sound: "gu4 jian4", eng: "firmware", audio: "assets/006d/audio/gu4jian4.mp3" },
		{ glyphs: "头", sound: "tou2", eng: "header", audio: "assets/006d/audio/tou2.mp3" },
		{ glyphs: "格式", sound: "ge2 shi4", eng: "format", audio: "assets/006d/audio/ge2shi4.mp3" },
		{ glyphs: "文件", sound: "wen2 jian4", eng: "file", audio: "assets/006d/audio/wen2jian4.mp3" },
		{ glyphs: "文件格式", sound: "wen2 jian4 ge2 shi4", eng: "file format", audio: "assets/006d/audio/wen2jian4ge2shi4.mp3" },
		{ glyphs: "文件管理器", sound: "wen2 jian4 guan3 li3 qi4", eng: "file manager", audio: "assets/006d/audio/wen2jian4guan3li3qi4.mp3" },
		{ glyphs: "变量", sound: "bian4 liang4", eng: "variable", audio: "assets/006d/audio/bian4liang4.mp3" },
		{ glyphs: "全局变量", sound: "quan2 ju2 bian4 liang4", eng: "environment variable", audio: "assets/006d/audio/quan2ju2bian4liang4.mp3" },
		{ glyphs: "变动", sound: "bian4 dong4", eng: "change, alteration (commit)", audio: "assets/006d/audio/bian4dong4.mp3" },
		{ glyphs: "模块", sound: "mo2 kuai4", eng: "module, component", audio: "assets/006d/audio/mo2kuai4.mp3" },
		{ glyphs: "容器", sound: "rong2 qi4", eng: "container", audio: "assets/006d/audio/rong2qi4.mp3" },
		{ glyphs: "对象", sound: "dui4 xiang4", eng: "object", audio: "assets/006d/audio/dui4xiang4.mp3" },
		{ glyphs: "面向对象", sound: "mian4 xiang4 dui4 xiang4", eng: "object oriented", audio: "assets/006d/audio/mian4xiang4dui4xiang4.mp3" },
		{ glyphs: "支持", sound: "zhi1 chi2", eng: "to support", audio: "assets/006d/audio/zhi1chi2.mp3" },
		{ glyphs: "路由器", sound: "lu4 you2 qi4", eng: "router", audio: "assets/006d/audio/lu4you2qi4.mp3" },
		{ glyphs: "路由协定", sound: "lu4 you2 xie2 ding4", eng: "routing protocol", audio: "assets/006d/audio/lu4you2xie2ding4.mp3" },
		{ glyphs: "请求", sound: "qing3 qiu2", eng: "request", audio: "assets/006d/audio/qing3qiu2.mp3" },
		{ glyphs: "跨域请求", sound: "qua4 yv4 qing3 qiu2", eng: "cross-domain request", audio: "assets/006d/audio/qua4yv4qing3qiu2.mp3" },
		{ glyphs: "数据库", sound: "shu4 jv4 ku4", eng: "database", audio: "assets/006d/audio/shu4jv4ku4.mp3" },
		{ glyphs: "中间件", sound: "zhong1 jian1 jian4", eng: "middleware", audio: "assets/006d/audio/zhong1jian1jian4.mp3" },
		{ glyphs: "软件", sound: "ruan3 jian4", eng: "software", audio: "assets/006d/audio/ruan3jian4.mp3" },
		{ glyphs: "硬件", sound: "ying4 jian4", eng: "hardware", audio: "assets/006d/audio/ying4jian4.mp3" },
		{ glyphs: "版本", sound: "ban3 ben3", eng: "version", audio: "assets/006d/audio/ban3ben3.mp3" },
		{ glyphs: "安装", sound: "an1 zhuang1", eng: "to install", audio: "assets/006d/audio/an1zhuang1.mp3" },
		{ glyphs: "启动服务", sound: "qi3 dong4 fu2 wu4", eng: "to start a service", audio: "assets/006d/audio/qi3dong4fu2wu4.mp3" },
		{ glyphs: "启动", sound: "qi3 dong4", eng: "to start (a machine or service)", audio: "assets/006d/audio/qi3dong4.mp3" },
		{ glyphs: "服务", sound: "fu2 wu4", eng: "service", audio: "assets/006d/audio/fu2wu4.mp3" },
		{ glyphs: "浏览器", sound: "liu2 lan3 qi4", eng: "web browser", audio: "assets/006d/audio/liu2lan3qi4.mp3" },
		{ glyphs: "手册", sound: "shou3 ce4", eng: "manual", audio: "assets/006d/audio/shou3ce4.mp3" },
		{ glyphs: "手册页", sound: "shou3 ce4 ye4", eng: "manpage", audio: "assets/006d/audio/shou3ce4ye4.mp3" },
		{ glyphs: "指导", sound: "zhi3 dao3", eng: "guide", audio: "assets/006d/audio/zhi3dao3.mp3" },
		{ glyphs: "离线", sound: "li2 xian4", eng: "offline", audio: "assets/006d/audio/li2xian4.mp3" },
		{ glyphs: "在线", sound: "zai4 xian4", eng: "online", audio: "assets/006d/audio/zai4xian4.mp3" },
		{ glyphs: "在线游戏", sound: "zai4 xian4 you2 xi4", eng: "online game", audio: "assets/006d/audio/zai4xian4you2xi4.mp3" },
		{ glyphs: "开发", sound: "kai1 fa1", eng: "development", audio: "assets/006d/audio/kai1fa1.mp3" },
		{ glyphs: "软件开发", sound: "ruan3 jian4 kai1 fa1", eng: "software development", audio: "assets/006d/audio/ruan3jian4kai1fa1.mp3" },
		{ glyphs: "软件开发师", sound: "ruan3 jian4 kai1 fa1 shi", eng: "software developer", audio: "assets/006d/audio/ruan3jian4kai1fa1shi.mp3" },
		{ glyphs: "升级", sound: "sheng1 ji2", eng: "upgrade", audio: "assets/006d/audio/sheng1ji2.mp3" },
		{ glyphs: "命名规范", sound: "ming4 ming2 gui1 fan4", eng: "naming convention", audio: "assets/006d/audio/ming4ming2gui1fan4.mp3" },
		{ glyphs: "版本控制软件", sound: "ban3 ben3 kong4 zhi4 ruan3 jian4", eng: "version control software", audio: "assets/006d/audio/ban3ben3kong4zhi4ruan3jian4.mp3" },
		{ glyphs: "版本控制", sound: "ban3 ben3 kong4 zhi4", eng: "version control", audio: "assets/006d/audio/ban3ben3kong4zhi4.mp3" },
		{ glyphs: "前端", sound: "qian2 duan1", eng: "frontend", audio: "assets/006d/audio/qian2duan1.mp3" },
		{ glyphs: "后端", sound: "hou4 duan1", eng: "backend", audio: "assets/006d/audio/hou4duan1.mp3" },
		{ glyphs: "全栈", sound: "quan2 zhan4", eng: "fullstack", audio: "assets/006d/audio/quan2zhan4.mp3" },
		{ glyphs: "全屏", sound: "quan2 ping2", eng: "fullscreen", audio: "assets/006d/audio/quan2ping2.mp3" },
		{ glyphs: "显示", sound: "xian3 shi4", eng: "display, to display", audio: "assets/006d/audio/xian3shi4.mp3" },
		{ glyphs: "核心", sound: "he2 xin1", eng: "kernel", audio: "assets/006d/audio/he2xin1.mp3" },
		{ glyphs: "发布日期", sound: "fa1 bu4 ri4 qi1", eng: "release date", audio: "assets/006d/audio/fa1bu4ri4qi1.mp3" },
	];

	hzpmg.start();

})();


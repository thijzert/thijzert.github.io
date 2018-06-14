
var hzpmg;

(function()
{
	var root = document.getElementById( "doodle-main" );
	hzpmg = new HanzipadMinigame( root );

	hzpmg.words = [];

	const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
	const name = () => pick([
		{s: 1, en: "Zhang Wei", zh: "张伟", male: 1},
		{s: 1, en: "Wang Wei", zh: "王伟", male: 1},
		{s: 1, en: "Wang Fang", zh: "王芳", male: 0},
		{s: 1, en: "Li Wei", zh: "李伟", male: 1},
		{s: 1, en: "Wang Xiuying", zh: "王秀英", male: 0},
		{s: 1, en: "Li Xiuying", zh: "李秀英", male: 0},
		{s: 1, en: "Li Na", zh: "李娜", male: 0},
		{s: 1, en: "Zhang Xiuying", zh: "张秀英", male: 0},
		{s: 1, en: "Liu Wei", zh: "刘伟", male: 1},
		{s: 1, en: "Zhang Min", zh: "张敏", male: 0},
		{s: 1, en: "Li Jing", zh: "李静", male: 0},
		{s: 1, en: "Zhang Li", zh: "张丽", male: 0},
		{s: 1, en: "Wang Jing", zh: "王静", male: 0},
		{s: 1, en: "Wang Li", zh: "王丽", male: 0},
		{s: 1, en: "Li Qiang", zh: "李强", male: 1},
		{s: 1, en: "Zhang Jing", zh: "张静", male: 0},
		{s: 1, en: "Li Min", zh: "李敏", male: 0},
		{s: 1, en: "Wang Min", zh: "王敏", male: 0},
		{s: 1, en: "Wang lei", zh: "王磊", male: 1},
		{s: 1, en: "Li Jun", zh: "李军", male: 1},
		{s: 1, en: "Liu Yang", zh: "刘洋", male: 0},
		{s: 1, en: "Wang Yong", zh: "王勇", male: 1},
		{s: 1, en: "Zhang Yong", zh: "张勇", male: 1},
		{s: 1, en: "Wang Yan", zh: "王艳", male: 0},
		{s: 1, en: "Li Jie", zh: "李杰", male: 1},
		{s: 1, en: "Zhang Lei", zh: "张磊", male: 1},
		{s: 1, en: "Wang Qiang", zh: "王强", male: 1},
		{s: 1, en: "Wang Jun", zh: "王军", male: 1},
		{s: 1, en: "Zhang Jie", zh: "张杰", male: 1},
		{s: 1, en: "Li Juan", zh: "李娟", male: 0},
		{s: 1, en: "Zhang Yan", zh: "张艳", male: 0},
		{s: 1, en: "Zhang Tao", zh: "张涛", male: 1},
		{s: 1, en: "Wang Tao", zh: "王涛", male: 1},
		{s: 1, en: "Li Ming", zh: "李明", male: 1},
		{s: 1, en: "Li Yan", zh: "李艳", male: 0},
		{s: 1, en: "Wang Chao", zh: "王超", male: 1},
		{s: 1, en: "Li Yong", zh: "李勇", male: 1},
		{s: 1, en: "Wang Juan", zh: "王娟", male: 0},
		{s: 1, en: "Liu Jie", zh: "刘杰", male: 1},
		{s: 1, en: "Wang Xiulan", zh: "王秀兰", male: 0},
		{s: 1, en: "Li Xia", zh: "李霞", male: 0},
		{s: 1, en: "Liu Min", zh: "刘敏", male: 0},
		{s: 1, en: "Zhang Jun", zh: "张军", male: 1},
		{s: 1, en: "Li Li", zh: "李丽", male: 0},
		{s: 1, en: "Zhang Qiang", zh: "张强", male: 1},
		{s: 1, en: "Wang Ping", zh: "王平", male: 1},
		{s: 1, en: "Wang Gang", zh: "王刚", male: 1},
		{s: 1, en: "Wang Jie", zh: "王杰", male: 1},
		{s: 1, en: "Li Guiying", zh: "李桂英", male: 0},
		{s: 1, en: "Liu Fang", zh: "刘芳", male: 0},
	]);
	const subj = () => {
		let rv = pick([
			{s: 0, en: "they", zh: "他们"},
			{s: 1, en: "he", zh: "他"},
			{s: 1, en: "she", zh: "她"},
			{s: 0, en: "I", zh: "我"},
			{s: 0, en: "you", zh: "你"},
			{s: 0, en: "we", zh: "我们"},
			name,
			name,
			name,
		]);
		if ( typeof(rv) == "function" )
			rv = rv();
		return rv;
	};
	const obj = () => pick([
		{en: "an orange", zh: "橙子"},
		{en: "a dog", zh: "狗"},
	]);


	hzpmg.words.push((() =>
	{
		let rv = () => {
			let s = subj()
			let o = obj()
			let doo = s.s ? "does" : "do";
			return {eng: `${s.en} ${doo}n't have ${o.en}`, glyphs: `${s.zh}没有${o.zh}`}
		};
		rv.label = "Negation of you3 with mei2";
		return rv;
	})());


	/*
	hzpmg.words.push((() =>
	{
		let rv = () => {
		};
		rv.label = "";
		return rv;
	})());
	*/

	hzpmg.start();

})();


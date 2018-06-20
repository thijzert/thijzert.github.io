
var hzpmg;

(function()
{
	var root = document.getElementById( "doodle-main" );
	hzpmg = new HanzipadMinigame( root );

	hzpmg.words = [];

	const capitalise = (str) => str.substr(0,1).toUpperCase() + str.substr(1);

	const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
	const name = () => pick([
		{s: 1, pn: 1, en: "Zhang Wei", zh: "张伟", male: 1},
		{s: 1, pn: 1, en: "Wang Wei", zh: "王伟", male: 1},
		{s: 1, pn: 1, en: "Wang Fang", zh: "王芳", male: 0},
		{s: 1, pn: 1, en: "Li Wei", zh: "李伟", male: 1},
		{s: 1, pn: 1, en: "Wang Xiuying", zh: "王秀英", male: 0},
		{s: 1, pn: 1, en: "Li Xiuying", zh: "李秀英", male: 0},
		{s: 1, pn: 1, en: "Li Na", zh: "李娜", male: 0},
		{s: 1, pn: 1, en: "Zhang Xiuying", zh: "张秀英", male: 0},
		{s: 1, pn: 1, en: "Liu Wei", zh: "刘伟", male: 1},
		{s: 1, pn: 1, en: "Zhang Min", zh: "张敏", male: 0},
		{s: 1, pn: 1, en: "Li Jing", zh: "李静", male: 0},
		{s: 1, pn: 1, en: "Zhang Li", zh: "张丽", male: 0},
		{s: 1, pn: 1, en: "Wang Jing", zh: "王静", male: 0},
		{s: 1, pn: 1, en: "Wang Li", zh: "王丽", male: 0},
		{s: 1, pn: 1, en: "Li Qiang", zh: "李强", male: 1},
		{s: 1, pn: 1, en: "Zhang Jing", zh: "张静", male: 0},
		{s: 1, pn: 1, en: "Li Min", zh: "李敏", male: 0},
		{s: 1, pn: 1, en: "Wang Min", zh: "王敏", male: 0},
		{s: 1, pn: 1, en: "Wang Lei", zh: "王磊", male: 1},
		{s: 1, pn: 1, en: "Li Jun", zh: "李军", male: 1},
		{s: 1, pn: 1, en: "Liu Yang", zh: "刘洋", male: 0},
		{s: 1, pn: 1, en: "Wang Yong", zh: "王勇", male: 1},
		{s: 1, pn: 1, en: "Zhang Yong", zh: "张勇", male: 1},
		{s: 1, pn: 1, en: "Wang Yan", zh: "王艳", male: 0},
		{s: 1, pn: 1, en: "Li Jie", zh: "李杰", male: 1},
		{s: 1, pn: 1, en: "Zhang Lei", zh: "张磊", male: 1},
		{s: 1, pn: 1, en: "Wang Qiang", zh: "王强", male: 1},
		{s: 1, pn: 1, en: "Wang Jun", zh: "王军", male: 1},
		{s: 1, pn: 1, en: "Zhang Jie", zh: "张杰", male: 1},
		{s: 1, pn: 1, en: "Li Juan", zh: "李娟", male: 0},
		{s: 1, pn: 1, en: "Zhang Yan", zh: "张艳", male: 0},
		{s: 1, pn: 1, en: "Zhang Tao", zh: "张涛", male: 1},
		{s: 1, pn: 1, en: "Wang Tao", zh: "王涛", male: 1},
		{s: 1, pn: 1, en: "Li Ming", zh: "李明", male: 1},
		{s: 1, pn: 1, en: "Li Yan", zh: "李艳", male: 0},
		{s: 1, pn: 1, en: "Wang Chao", zh: "王超", male: 1},
		{s: 1, pn: 1, en: "Li Yong", zh: "李勇", male: 1},
		{s: 1, pn: 1, en: "Wang Juan", zh: "王娟", male: 0},
		{s: 1, pn: 1, en: "Liu Jie", zh: "刘杰", male: 1},
		{s: 1, pn: 1, en: "Wang Xiulan", zh: "王秀兰", male: 0},
		{s: 1, pn: 1, en: "Li Xia", zh: "李霞", male: 0},
		{s: 1, pn: 1, en: "Liu Min", zh: "刘敏", male: 0},
		{s: 1, pn: 1, en: "Zhang Jun", zh: "张军", male: 1},
		{s: 1, pn: 1, en: "Li Li", zh: "李丽", male: 0},
		{s: 1, pn: 1, en: "Zhang Qiang", zh: "张强", male: 1},
		{s: 1, pn: 1, en: "Wang Ping", zh: "王平", male: 1},
		{s: 1, pn: 1, en: "Wang Gang", zh: "王刚", male: 1},
		{s: 1, pn: 1, en: "Wang Jie", zh: "王杰", male: 1},
		{s: 1, pn: 1, en: "Li Guiying", zh: "李桂英", male: 0},
		{s: 1, pn: 1, en: "Liu Fang", zh: "刘芳", male: 0},
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
		{en: "a job", zh: "工作"},
		{en: "a son", zh: "一个儿子"},
	]);
	const city = () => pick([
		{en: "Shanghai", zh: "上海"},
		{en: "Beijing", zh: "北京"},
		{en: "Rotterdam", zh: "鹿特丹"},
		{en: "The Hague", zh: "海牙"},
		{en: "London", zh: "伦敦"},
	]);
	const x_is = (s) => {
		if ( s.s || typeof(s.s) == "undefined" )
			return `${capitalise(s.en)}'s`;
		else if ( s.en == "I" )
			return "I'm";
		else
			return `${capitalise(s.en)}'re`;
	}
	// Adjectives to describe a person
	const padj = () => pick([
		{en: "tall", zh: "高"},
		{en: "fat", zh: "胖"},
		{en: "handsome", zh: "帅"},
		{en: "pretty", zh: "漂亮"},
		{en: "angry", zh: "生气"},
	]);
	const phrase = (subj) => {
		let phr = pick([
			{o: 0, n: 0, ens: "likes it", enp: "like it", zh: "喜欢"},
			{o: 0, n: 1, ens: "doesn't like it", enp: "don't like it", zh: "不喜欢"},
			// We need better objects for these two. (Now we have stuff like "Wang Ping doesn't like a job either.")
			//{o: 1, n: 0, ens: "likes", enp: "like", zh: "喜欢"},
			//{o: 1, n: 1, ens: "doesn't like", enp: "don't like", zh: "不喜欢"},
			{o: 1, n: 0, ens: "has", enp: "have", zh: "有"},
			{o: 1, n: 1, ens: "doesn't have", enp: "don't have", zh: "没有"},
		]);

		rv = { n: phr.n, zh: phr.zh };
		if ( subj.s )
			rv.en = phr.ens;
		else
			rv.en = phr.enp;

		if ( phr.o )
		{
			let o = obj();
			rv.en += " " + o.en;
			rv.zh += o.zh;
		}

		return rv;
	}


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


	hzpmg.words.push((() =>
	{
		let subj2 = () => {
			let s1 = subj()
			while ( s1.s == 0 )
				s1 = subj();
			let s2 = subj()
			while ( s2.s == 0 )
				s2 = subj();

			if ( s1.pn == 1 )
			{
				let t = s1;
				s1 = s2;
				s2 = t;
			}

			return [ s1, s2 ];
		};

		let gens = [
			(s) => {
				let o = obj()
				return {eng: `${capitalise(s.en)} all have ${o.en}`, glyphs: `${s.zh}都有${o.zh}`}
			},
			(s) => {
				let o = obj()
				return {eng: `Do ${s.en} all have ${o.en}?`, glyphs: `${s.zh}都有${o.zh}吗`}
			},
			(s) => {
				let c = city()
				return {eng: `Do ${s.en} all live in ${c.en}?`, glyphs: `${s.zh}都住在${c.zh}吗`}
			},
			(s) => {
				let c = city()
				return {eng: `${capitalise(s.en)} are all in ${c.en}`, glyphs: `${s.zh}都在${c.zh}`}
			},
			(_s) => {
				let s = subj2();
				let o = obj();

				return {
					eng: `Both ${s[0].en} and ${s[1].en} have ${o.en}`,
					glyphs: `${s[0].zh}和${s[1].zh}都有${o.zh}`
				};
			},
			(_s) => {
				let s = subj2();
				let o = obj();

				return {
					eng: `Neither ${s[0].en} nor ${s[1].en} has ${o.en}`,
					glyphs: `${s[0].zh}和${s[1].zh}都没有${o.zh}`
				};
			},
		];
		let rv = () => {
			let subj = pick([
				{s: 0, en: "they", zh: "他们"},
				{s: 0, en: "you", zh: "你们"},
			]);
			let f = pick(gens);
			return f( subj );
		};
		rv.label = "The 'all' adverb 'dou1'";
		return rv;
	})());


	hzpmg.words.push((() =>
	{
		let rv = () => {
			let s = subj();
			let phr = phrase(s);

			if ( phr.n )
				return {
					eng: `${capitalise(s.en)} ${phr.en} either`,
					glyphs: `${s.zh}也${phr.zh}`
				};
			else
				return {
					eng: `${capitalise(s.en)} also ${phr.en}`,
					glyphs: `${s.zh}也${phr.zh}`
				};
		};
		rv.label = "ye3 with verb phrases";
		return rv;
	})());


	hzpmg.words.push((() =>
	{
		let rv = () => {
			let s = subj()
			let pa = padj()

			if ( Math.random() < 0.5 )
				return { eng: `${x_is(s)} also ${pa.en}`, glyphs: `${s.zh}也很${pa.zh}` };
			else
				return { eng: `${x_is(s)} not ${pa.en} either`, glyphs: `${s.zh}也不${pa.zh}` };
		};
		rv.label = "ye3 with adjective phrases";
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

	if ( location.hash && location.hash.substr(0,7) == "#debug-" )
	{
		let i = parseInt( location.hash.substr(7), 10 );
		if ( i < hzpmg.words.length )
		{
			let w = hzpmg.words[i];
			if ( typeof(w) != "function" )  return;

			let db = document.getElementById( "debug-generator" );
			let h1 = db.getElementsByTagName( "H2" )[0];
			console.log(h1)
			h1.textContent = w.label;

			for ( var j = 0; j < 50; j++ )
			{
				let p = document.createElement("P");
				let ch = w();

				p.textContent = ch.eng + " - " + ch.glyphs;
				db.appendChild(p);
			}
		}
	}


})();


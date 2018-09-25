
var hzpmg;

(function()
{
	var root = document.getElementById( "doodle-main" );
	hzpmg = new HanzipadMinigame( root );

	hzpmg.words = [];

	// Convenience functions {{{
	const capitalise = (str) => str.substr(0,1).toUpperCase() + str.substr(1);

	// pick(arr), pick2(arr), get2(fn) {{{
	const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
	const pick2 = (arr) => {
		let p1 = pick(arr);
		let p2 = pick(arr);
		while ( p1.zh == p2.zh )
			p2 = pick(arr);
		return [ p1, p2 ];
	}
	const get2 = (fn) => {
		let p1 = fn();
		let p2 = fn();
		while ( p1.zh == p2.zh )
			p2 = fn();
		return [ p1, p2 ];
	}
	// }}}
	// const name = () => pick([names]) {{{
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
	// }}}
	// const subj = () => pick([sentence subjects]) {{{
	const subj = () => {
		let rv = pick([
			{s: 0, en: "they", zh: "他们"},
			{s: 1, en: "he", zh: "他"},
			{s: 1, en: "she", zh: "她"},
			{s: 0, en: "I", zh: "我"},
			{s: 0, en: "you", zh: "你"},
			{s: 0, en: "we", zh: "我们"},
			{s: 1, pn: 1, en: "his girlfriend", zh: "他女朋友"},
			{s: 1, pn: 1, en: "his mother", zh: "他妈妈"},
			name,
			name,
			name,
		]);
		if ( typeof(rv) == "function" )
			rv = rv();
		return rv;
	};
	// }}}
	// const subj2a = () => [ subj(), subj() ] {{{
	const subj2a = () => {
		let s1 = subj()
		while ( s1.s == 0 )
			s1 = subj();
		let s2 = subj()
		while ( s2.s == 0 || s2.zh == s1.zh )
			s2 = subj();

		if ( s1.pn == 1 )
		{
			let t = s1;
			s1 = s2;
			s2 = t;
		}

		return [ s1, s2 ];
	};
	// }}}
	// const subj2 = () => `${subj1} and ${subj2}` {{{
	const subj2 = () => {
		let s = subj2a();
		return {
			s: 0,
			pn: s[0].pn,
			en: `${s[0].en} and ${s[1].en}`,
			zh: `${s[0].zh}和${s[1].zh}`
		};
	};
	// }}}
	// obj(), food(), drink(), city() {{{
	const obj = (part) => {
		let rv = pick([
			{enb: "orange",       enp: "an orange",      zh: "橙子"},
			{enb: "dog",          enp: "a dog",          zh: "狗"},
			{enb: "job",          enp: "a job",          zh: "工作"},
			{enb: "bicycle",      enp: "a bicycle",      zh: "自行车"},
			{enb: "teacher",      enp: "a teacher",      zh: "老师"},
			{enb: "mobile phone", enp: "a mobile phone", zh: "手机"},
			{enb: "money",        enp: "money",          zh: "钱"},
			{enb: "car",          enp: "a car",          zh: "车"},
			{enb: "boss",         enp: "a boss",         zh: "老板"},
		]);

      if ( part )
         return {en: rv.enp, zh: rv.zh};
      else
         return {en: rv.enb, zh: rv.zh};
	}
	const food = () => pick([
		{en: "Chinese food", zh: "中国菜"},
		{en: "dumplings", zh: "饺子"},
		{en: "bread", zh: "面包"},
		{en: "noodles", zh: "面条"},
		{en: "pork", zh: "猪肉"},
	]);
	const drink = () => pick([
		{en: "water", zh: "水"},
		{en: "tea", zh: "茶"},
		{en: "coffee", zh: "咖啡"},
		{en: "alcohol", zh: "酒"},
		{en: "beer", zh: "啤酒"},
	]);
	const city = () => pick([
		{en: "Shanghai", zh: "上海"},
		{en: "Beijing", zh: "北京"},
		{en: "Rotterdam", zh: "鹿特丹"},
		{en: "The Hague", zh: "海牙"},
		{en: "London", zh: "伦敦"},
	]);
	// }}}
	// const x_is = (x) => `${x} is` {{{
	const x_is = (s) => {
		if ( s.s || typeof(s.s) == "undefined" )
			return `${capitalise(s.en)}'s`;
		else if ( s.en == "I" )
			return "I'm";
		else if ( s.en == "you" || s.en == "we" || s.en == "they" )
			return `${capitalise(s.en)}'re`;
		else
			return `${capitalise(s.en)} are`;
	}
	// }}}
	// const x_their = (x) => `${x}'s` {{{
	const x_their = (s) => {
		if ( s.en == "I" )
			return "my";
		else if ( s.en == "you" )
			return "your";
		else if ( s.en == "he" )
			return "his";
		else if ( s.en == "she" )
			return "her";
		else if ( s.en == "it" )
			return "its";
		else if ( s.en == "we" )
			return "our";
		else if ( s.en == "they" )
			return "their";
		else if ( s.en.substr(s.en.length - 2).toLowerCase() == "s" )
			return `${s.en}'`;
		else
			return `${s.en}'s`;
	}
	// }}}
	// const padj = () => pick([adj]) {{{
	// Adjectives to describe a person
	const padj = () => pick([
		{en: "tall", zh: "高"},
		{en: "fat", zh: "胖"},
		{en: "handsome", zh: "帅"},
		{en: "pretty", zh: "漂亮"},
		{en: "angry", zh: "生气"},
	]);
	// }}}
	// const phrase = (subj) => `${subj} does something` {{{
	const phrase = (subj) => {
		let phr = pick([
			{n: 0, ens: "likes it", enp: "like it", zh: "喜欢"},
			{n: 1, ens: "doesn't like it", enp: "don't like it", zh: "不喜欢"},
			{fo: 1, n: 0, ens: "likes", enp: "like", zh: "喜欢"},
			{fo: 1, n: 1, ens: "doesn't like", enp: "don't like", zh: "不喜欢"},
			{o: 1, n: 0, ens: "has", enp: "have", zh: "有"},
			{o: 1, n: 1, ens: "doesn't have", enp: "don't have", zh: "没有"},
		]);

		let rv = { n: phr.n, zh: phr.zh };

		if ( subj.s )
			rv.en = phr.ens;
		else
			rv.en = phr.enp;

		if ( phr.o )
		{
			let o = obj(1);
			rv.en += " " + o.en;
			rv.zh += o.zh;
		}
		else if ( phr.fo )
		{
			let o = pick([ food, drink ])();
			rv.en += " " + o.en;
			rv.zh += o.zh;
		}

		return rv;
	}
	// }}}
	// number(min,max), n2zh(n) {{{
	let number = (min,max) => {
		let n = min + Math.floor((1+max-min) * Math.random())
		return { n: n, en: n, zh: n2zh(n) };
	};
	let n2zh = (n) => {
		let num = [ "", "一", "二", "三", "四", "五", "六", "七", "八", "九" ];
		let sfx = [ "", "十", "百", "千" ];
		let rv = "";

		if ( n >= 100000000 )
		{
			rv += n2zh(Math.floor(n/100000000)) + "亿";
			n = n % 100000000
		}
		if ( n >= 10000 )
		{
			rv += n2zh(Math.floor(n/10000)) + "万";
			n = n % 10000
		}
		if ( n == 0 )
		{
			if ( rv == "" )  return "零";
			return rv;
		}

		let tail = "";
		let i = 0;
		while ( n > 0 )
		{
			if ( n % 10 > 0 )
			{
				if ( n < 10 && n%10 == 1 && i == 1 )
					tail = sfx[i] + tail;
				else
					tail = num[n%10] + sfx[i] + tail;
			}
			else if ( n > 10 )
			{
				tail = "零" + tail
			}

			n = Math.floor(n/10);
			i++;
		}

		return rv + tail;
	};
	// }}}

	// }}}
	// Games {{{


	// Negation of you3 with mei2 {{{
	hzpmg.words.push((() =>
	{
		let rv = () => {
			let s = subj()
			let o = obj(1)
			let doo = s.s ? "does" : "do";
			return {eng: `${s.en} ${doo}n't have ${o.en}`, glyphs: `${s.zh}没有${o.zh}`}
		};
		rv.label = "Negation of you3 with mei2";
		return rv;
	})());
	// }}}


	// The 'all' adverb 'dou1' {{{
	hzpmg.words.push((() =>
	{
		let gens = [
			(s) => {
				let o = obj(1)
				return {eng: `${capitalise(s.en)} all have ${o.en}`, glyphs: `${s.zh}都有${o.zh}`}
			},
			(s) => {
				let o = obj(1)
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
				let s = subj2a();
				let o = obj(1);

				return {
					eng: `Both ${s[0].en} and ${s[1].en} have ${o.en}`,
					glyphs: `${s[0].zh}和${s[1].zh}都有${o.zh}`
				};
			},
			(_s) => {
				let s = subj2a();
				let o = obj(1);

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
	// }}}


	// ye3 with verb phrases {{{
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
	// }}}


	// ye3 with adjective phrases {{{
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
	// }}}


	// combining nouns with 'he2' {{{
	hzpmg.words.push((() =>
	{
		let rv = () => {
			if ( Math.random() < 0.5 )
			{
				let s = subj2()
				if ( Math.random() < 0.5 )
				{
					let pa = padj();

					if ( Math.random() < 0.5 )
						return { eng: `${x_is(s)} ${pa.en}`, glyphs: `${s.zh}很${pa.zh}` };
					else
						return { eng: `${x_is(s)} not ${pa.en}`, glyphs: `${s.zh}不${pa.zh}` };
				}
				else
				{
					let phr = phrase(s);
					return {
						eng: `${capitalise(s.en)} ${phr.en}`,
						glyphs: `${s.zh}${phr.zh}`
					};
				}
			}

			let s = subj();
			let doo = s.s ? "has" : "have";
			let o1 = obj(1);
			let o2 = obj(1);
			while ( o2.zh == o1.zh ) o2 = obj(1);

			return {
				eng: `${capitalise(s.en)} ${doo} ${o1.en} and ${o2.en}`,
				glyphs: `${s.zh}有${o1.zh}和${o2.zh}`,
			};
		};
		rv.label = "combining nouns with 'he2'";
		return rv;
	})());
	// }}}


	// Offering choices with "haishi" {{{
	hzpmg.words.push((() =>
	{
		let gens = [
			() => {
				let s = subj()
				while ( s.en == "I" )
					s = subj();

				let foodgroup = pick([{fn:food,zh:"吃"},{fn:drink,zh:"喝"}]);
				let p = get2(foodgroup.fn);

				let doo = s.s ? "Does" : "Do";
				let want = pick([
					{en: `${doo} ${s.en} want`, zh: `${s.zh}要`},
					{en: `Would ${s.en} like`, zh: `${s.zh}想`},
					{en: `${doo} ${s.en} like`, zh: `${s.zh}喜欢`},
				]);

				return {
					eng: `${want.en} ${p[0].en} or ${p[1].en}?`,
					glyphs: `${want.zh}${foodgroup.zh}${p[0].zh}还是${p[1].zh}`
				};
			},
			() => {
				let s = subj()
				while ( s.en == "I" )
					s = subj();

				let p = get2(city);

				let doo = s.s ? "Does" : "Do";
				let want = pick([
					{en: `${doo} ${s.en}`, zh: `${s.zh}`},
					{en: `Would ${s.en} like to`, zh: `${s.zh}想`},
				]);

				return {
					eng: `${want.en} live in ${p[0].en} or ${p[1].en}?`,
					glyphs: `${want.zh}住在${p[0].zh}还是${p[1].zh}`
				};
			},
		];
		let rv = () => {
			let f = pick(gens);
			return f();
		};
		rv.label = "Offering choices with \"haishi\"";
		return rv;
	})());
	// }}}


	// Age with "sui" {{{
	hzpmg.words.push((() =>
	{
		let rv = () => {
			let s = subj();
			let n = number(11,175);
			return {eng: `${x_is(s)} ${n.n} years old.`, glyphs: `${s.zh}${n.zh}岁`}
		};
		rv.label = "Age with \"sui\"";
		return rv;
	})());
	// }}}


	// Measure word 'ge' {{{
	hzpmg.words.push((() =>
	{
		let rv = () => {
			let n = number(1,20);
			if ( n.n == 2 ) n.zh = "两";
			let obj = pick([
				{zh: "人", en: "people", en1: "person"},
				{zh: "朋友", en: "friends", en1: "friend"},
				{zh: "手机", en: "mobile phones", en1: "mobile phone"},
				{zh: "星期", en: "weeks", en1: "week"},
				{zh: "月", en: "months", en1: "month"},
			]);

			rv = {eng: `${n.n} ${obj.en}`, glyphs: `${n.zh}个${obj.zh}`};
			if ( n.n == 1 )
				rv.eng = `one ${obj.en1}`;

			return rv;
		};
		rv.label = "Measure word 'ge'";
		return rv;
	})());
	// }}}


	// Dates {{{
	hzpmg.words.push((() =>
	{
		let rv = () => {
			let d = new Date()
			d = new Date( d.getTime() + (Math.random() - 0.8)*(25*366*86400*1000) );

			let y = d.getFullYear();
			let year = "";
			for ( let i = 0; i < 4; i++ )
			{
				year = year.concat( n2zh("".concat(y).substr(i,1)) );
			}

			return {
				eng: d.toLocaleDateString("en-GB", {month:"long",day:"numeric",year:"numeric"}),
				glyphs: `${year}年${n2zh(d.getMonth()+1)}月${n2zh(d.getDate())}日`
			};
		};
		rv.label = "Dates";
		return rv;
	})());
	// }}}


	// Times {{{
	hzpmg.words.push((() =>
	{
		let rv = () => {
			// Round to nearest n minute interval
			let n = pick([30,30,30,30,30,15,15,15,5,5,5,5,1,1])*60*1000;
			let d = new Date()
			d = d.getTime() + Math.random()*Math.random()*(Math.random()-0.5)*(86400*1000);
			d = Math.round(d/n)*n;
			d = new Date(d);

			// 上午下午点钟半分刻差两

			let h = d.getHours();
			let m = d.getMinutes();
			let zh = "";

			if ( h == 12 && m == 0 )
				zh += "中午";
			else if ( h < 12 )
				zh += "上午";
			else
				zh += "下午";

			if ( m == 58 )
				zh += "差两分";
			else if ( m > 45 )
				zh += "差" + n2zh(60-m) + "分";

			if ( (h%12) == 2 )
				zh += "两点";
			else if ( (h%12) == 0 )
				zh += "十二点";
			else
				zh += n2zh(h%12)+"点";

			if ( m == 0 )
				zh += "钟";
			else if ( m == 15 )
				zh += "一刻";
			else if ( m == 30 )
				zh += "半";
			else if ( m == 45 )
				zh += "三刻";
			else if ( m < 10 )
				zh += "零" + n2zh(m) + "分";
			else if ( m < 45 )
				zh += n2zh(m) + "分";

			return {
				eng: d.toLocaleTimeString("en-GB").substr(0,5),
				glyphs: zh
			};
		};
		rv.label = "Dates";
		return rv;
	})());
	// }}}


	// Expressing posession with 'de' {{{
	hzpmg.words.push((() =>
	{
		let rv = () => {
			let foo = subj();
			let bar = obj(0);
			return {eng: `${x_their(foo)} ${bar.en}`, glyphs: `${foo.zh}的${bar.zh}`};
		};
		rv.label = "Expressing posession with 'de'";
		return rv;
	})());
	// }}}


	/*

	// ++ {{{
	hzpmg.words.push((() =>
	{
		let rv = () => {
			let foo = pick([{en: "foo", zh: "夫"}]);
			let bar = pick([{en: "bar", zh: "吧"}]);
			return {eng: `${foo.en} does ${bar.en}`, glyphs: `${foo.zh}${bar.zh}`};
		};
		rv.label = "++";
		return rv;
	})());
	// }}}


	*/

	// }}}

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
			h1.textContent = w.label;

			for ( var j = 0; j < 50; j++ )
			{
				let p = document.createElement("P");
				let ch = w();

				p.textContent = ch.eng + " - " + ch.glyphs;
				db.appendChild(p);
			}

			db.scrollIntoView();
		}
	}


})();


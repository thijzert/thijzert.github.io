
var hzpmg;

(function()
{
	var root = document.getElementById( "doodle-main" );
	hzpmg = new HanzipadMinigame( root );

	hzpmg.words = [
		{ glyphs: "开心", sound: "kai1 xin1",    eng: "happy",         image: "assets/006e/images/happy.jpeg"        },
		{ glyphs: "伤心", sound: "zhang1 xin1",  eng: "heart-broken",  image: "assets/006e/images/heart-broken.jpeg" },
		{ glyphs: "难过", sound: "nan2 guo4",    eng: "sad",           image: "assets/006e/images/sad.jpeg"          },
		{ glyphs: "兴奋", sound: "xing1 fen4",   eng: "excited",       image: "assets/006e/images/excited.jpeg"      },
		{ glyphs: "失望", sound: "shi1 wang4",   eng: "disappointed",  image: "assets/006e/images/disappointed.jpeg" },
		{ glyphs: "害怕", sound: "hai4 pa4",     eng: "scared",        image: "assets/006e/images/scared.jpeg"       },
		{ glyphs: "好奇", sound: "hao3 qi2",     eng: "curious",       image: "assets/006e/images/curious.jpeg"      },
		{ glyphs: "担心", sound: "dan1 xin1",    eng: "worried",       image: "assets/006e/images/worried.jpeg"      },
		{ glyphs: "放松", sound: "fang4 song1",  eng: "relaxed",       image: "assets/006e/images/relaxed.jpeg"      },
		{ glyphs: "吃惊", sound: "chi1 jing1",   eng: "surprised",     image: "assets/006e/images/surprised.jpeg"    },
	];

	hzpmg.start();

})();


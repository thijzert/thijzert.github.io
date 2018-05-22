
var hzpmg;

(function()
{
	var root = document.getElementById( "doodle-main" );
	hzpmg = new HanzipadMinigame( root );

	hzpmg.words = [
		{ glyphs: "衣服", sound: "yi1 fu5", eng: "clothes", image: "assets/006b/images/clothes.jpg" },
		{ glyphs: "裤子", sound: "ku4 zi5", eng: "trousers", image: "assets/006b/images/trousers.jpg" },
		{ glyphs: "牛仔裤", sound: "niu2 zai3 ku4", eng: "jeans", image: "assets/006b/images/jeans.jpg" },
		{ glyphs: "衬衫", sound: "chen4 shan1", eng: "shirt", image: "assets/006b/images/shirt.jpg" },
		{ glyphs: "Ｔ恤", sound: "t xu4", eng: "t-shirt", image: "assets/006b/images/t-shirt.jpg" },
		{ glyphs: "裙子", sound: "qvn2 zi5", eng: "skirt/dress", image: "assets/006b/images/skirt-dress.jpg" },
		{ glyphs: "短裙", sound: "duan3 qvn2", eng: "skirt", image: "assets/006b/images/skirt.jpg" },
		{ glyphs: "连衣裙", sound: "lian2 yi1 qvn2", eng: "dress", image: "assets/006b/images/dress.jpg" },
		{ glyphs: "短裤", sound: "duan3 ku4", eng: "shorts", image: "assets/006b/images/shorts.jpg" },
		{ glyphs: "毛衣", sound: "mao2 yi1", eng: "wool jumper", image: "assets/006b/images/wool-jumper.jpg" },
		{ glyphs: "外套", sound: "wai4 tao4", eng: "jacket", image: "assets/006b/images/jacket.jpg" },
		{ glyphs: "大衣", sound: "da4 yi1", eng: "coat", image: "assets/006b/images/coat.jpg" },
		{ glyphs: "内裤", sound: "nei4 ku4", eng: "pants", image: "assets/006b/images/pants.jpg" },
		{ glyphs: "内衣", sound: "nei4 yi1", eng: "underwear", image: "assets/006b/images/underwear.jpg" },
		{ glyphs: "鞋子", sound: "xie2 zi5", eng: "shoes", image: "assets/006b/images/shoes.jpg" },
		{ glyphs: "拖鞋", sound: "tuo1 xie2", eng: "slippers", image: "assets/006b/images/slippers.jpg" },
		{ glyphs: "运动鞋", sound: "yun4 dong4 xie2", eng: "trainers", image: "assets/006b/images/trainers.jpg" },
		{ glyphs: "套头衫", sound: "tao4 tou2 shan1", eng: "sweater", image: "assets/006b/images/sweater.jpg" },
		{ glyphs: "围巾", sound: "wei2 jin1", eng: "scarf", image: "assets/006b/images/scarf.jpg" },
		{ glyphs: "帽子", sound: "mao4 zi5", eng: "hat", image: "assets/006b/images/hat.jpg" },
		{ glyphs: "袜子", sound: "wa4 zi5", eng: "socks", image: "assets/006b/images/socks.jpg" },
		{ glyphs: "丝袜", sound: "si1 wa4", eng: "stockings", image: "assets/006b/images/stockings.jpg" },
		{ glyphs: "靴子", sound: "xue1 zi5", eng: "boots", image: "assets/006b/images/boots.jpg" },
		{ glyphs: "手套", sound: "shou3 tao4", eng: "gloves", image: "assets/006b/images/gloves.jpg" },
		{ glyphs: "西装", sound: "xi1 zhuang1", eng: "suit", image: "assets/006b/images/suit.jpg" },
		{ glyphs: "领带", sound: "ling3 dai4", eng: "tie", image: "assets/006b/images/tie.jpg" },
		// { glyphs: "穿", sound: "chuan1", eng: "to wear (clothes or shoes)" },
		{ glyphs: "穿衣服", sound: "chuan1 yi1 fu5", eng: "to put on clothes" },
		// { glyphs: "四件衬衫", sound: "si4 jian4 chen4 shan1", eng: "4 shirts", image: "assets/006b/images/4-shirts.jpg" },
		// { glyphs: "三条裙子", sound: "san1 tiao2 qvn2 zi5", eng: "3 dresses", image: "assets/006b/images/3-dresses.jpg" },
		// { glyphs: "一条裤子", sound: "yi4 tiao2 ku4 zi5", eng: "a pair of trousers", image: "assets/006b/images/1-trousers.jpg" },
		// { glyphs: "戴帽子", sound: "dai4 mao4 zi5", eng: "to wear a hat", image: "assets/006b/images/to-wear-a-hat.jpg" },
		// { glyphs: "一双袜子", sound: "yi4 shuang1 wa4 zi5", eng: "a pair of socks", image: "assets/006b/images/1-socks.jpg" },
		// { glyphs: "一双手套", sound: "yi4 shuang1 shou3 tao4", eng: "a pair of gloves", image: "assets/006b/images/1-gloves.jpg" },
		// { glyphs: "三双鞋子", sound: "san1 shuang1 xie2 zi5", eng: "three pairs of shoes", image: "assets/006b/images/3-shoes.jpg" }
	];

	hzpmg.start();

})();


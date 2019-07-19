const shareList = [{
		type: 1,
		icon: '/static/temp/share_wechat.png',
		text: '微信好友'
	},
	{
		type: 2,
		icon: '/static/temp/share_moment.png',
		text: '朋友圈'
	},
	{
		type: 3,
		icon: '/static/temp/share_qq.png',
		text: 'QQ好友'
	},
	{
		type: 4,
		icon: '/static/temp/share_qqzone.png',
		text: 'QQ空间'
	}
]
const lazyLoadList = [{
		src: 'http://img0.imgtn.bdimg.com/it/u=2396068252,4277062836&fm=26&gp=0.jpg'
	},
	{
		src: 'http://img.pconline.com.cn/images/upload/upc/tx/itbbs/1309/06/c4/25310541_1378426131583.jpg'
	},
	{
		src: 'http://img.pconline.com.cn/images/upload/upc/tx/photoblog/1610/26/c4/28926240_1477451226577_mthumb.jpg'
	},
	{
		src: 'http://picture.ik123.com/uploads/allimg/190219/12-1Z219105139.jpg'
	},
	{
		src: 'http://img5.imgtn.bdimg.com/it/u=2904900134,438461613&fm=26&gp=0.jpg'
	},
	{
		src: 'http://img1.imgtn.bdimg.com/it/u=1690475408,2565370337&fm=26&gp=0.jpg'
	},
	{
		src: 'http://img.99114.com/group1/M00/7F/99/wKgGS1kVrPGAe5LmAAU2KrJmb3Q923_600_600.jpg'
	},
	{
		src: 'http://img4.imgtn.bdimg.com/it/u=261047209,372231813&fm=26&gp=0.jpg'
	},
	{
		src: 'http://i2.17173cdn.com/i7mz64/YWxqaGBf/tu17173com/20150107/eMyVMObjlbcvDEv.jpg'
	},
	{
		src: 'http://img008.hc360.cn/m4/M02/E7/87/wKhQ6FSrfU6EfUoyAAAAAITAfyc280.jpg'
	},
	{
		src: 'http://pic1.win4000.com/wallpaper/d/5991569950166.jpg'
	},
	{
		src: 'http://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/6f061d950a7b0208f9fe945e60d9f2d3572cc85e.jpg'
	},
	{
		src: 'http://pic41.nipic.com/20140429/18169759_125841756000_2.jpg'
	},
	{
		src: 'http://www.k73.com/up/allimg/130415/22-130415093527.jpg'
	},
	{
		src: 'http://img.52z.com/upload/news/image/20180530/20180530081619_31029.jpg'
	},
	{
		src: 'http://b-ssl.duitang.com/uploads/item/201410/02/20141002111638_tXAzU.jpeg'
	},
	{
		src: 'http://img2.ph.126.net/C4JW6f57QWSB21-8jh2UGQ==/1762596304262286698.jpg'
	},
	{
		src: 'http://att.bbs.duowan.com/forum/201405/17/190257nzcvkkdg6w2e8226.jpg'
	},
	{
		src: 'http://attach.bbs.miui.com/forum/201504/10/223644v3intigyvva0vgym.jpg'
	},
	{
		src: 'http://pic1.win4000.com/mobile/3/57888a298d61d.jpg'
	},
]

/**
 * 评论列表
 */
const evaluateListData = [{
		header_img: "http://cs.zhangkaixing.com/face/face_2.jpg",
		user_name: "测试1",
		rate: 5,
		create_time: "2019-04-12",
		content: "好评",
		imgs: [
			'http://cs.zhangkaixing.com/face/face.jpg',
			'http://cs.zhangkaixing.com/face/p10.jpg',
			'http://cs.zhangkaixing.com/face/face_14.jpg',
			'http://cs.zhangkaixing.com/face/face.jpg',
			'http://cs.zhangkaixing.com/face/p10.jpg',
		]
	},
	{
		content: "中评",
		create_time: "2019-04-12",
		header_img: "http://cs.zhangkaixing.com/face/face_12.jpg",
		user_name: "测试2",
		rate: 4,
		// imgs:[]
	},
	{
		content: "",
		create_time: "2019-04-12",
		header_img: "http://cs.zhangkaixing.com/face/face_15.jpg",
		user_name: "测试3",
		rate: 2,
		// imgs:[]
	}, {
		content: "好评",
		create_time: "2019-04-12",
		header_img: "http://cs.zhangkaixing.com/face/face_2.jpg",
		user_name: "测试1",
		rate: 5,
		imgs: [
			'http://cs.zhangkaixing.com/face/face.jpg',
			'http://cs.zhangkaixing.com/face/p10.jpg',
			'http://cs.zhangkaixing.com/face/face_14.jpg',
			'http://cs.zhangkaixing.com/face/face.jpg',
			'http://cs.zhangkaixing.com/face/p10.jpg',
		]
	},
	{
		content: "中评",
		create_time: "2019-04-12",
		header_img: "http://cs.zhangkaixing.com/face/face_12.jpg",
		user_name: "测试2",
		rate: 3.5,
		// imgs:[]
	},
	{
		content: "",
		create_time: "2019-04-12",
		header_img: "http://cs.zhangkaixing.com/face/face_15.jpg",
		user_name: "测试3",
		rate: 2.3,
		// imgs:[]
	},
]

export default {
	lazyLoadList,
	shareList,
	evaluateListData
}

<template>
	<view class="content">
		<view class="top"></view>
		<view class="banner">
			<dl>
				<dt>
					<image src="../../static/share/logo.png" mode=""></image>
				</dt>
				<dd>我的推广二维码</dd>
			</dl>
			<view class="img">
				<image src="../../static/share/ewm.jpg" mode=""></image>
			</view>
			<view class="tgtit">推广链接：<text class="tugurl">http://sishuquan.com?id=3228969</text></view>
			<view class="sharbuttn">
				<view class="btn" @click="save">保存二维码</view>
				<view class="btn" @click="sharurl">复制推广链接</view>
			</view>

			<view class="shartitle">
				<view>分享说明</view>
			</view>
			<view class="bottom">
				<ul>
					<li>1、发送邀请二维码给微信好友。</li>
					<li>2、好友识别二维码成为您的客户，他们在商场中购买的任意商品您都享受分销佣金。</li>
					<li>3、您可以在会员中心查看【分销佣金】和【我的团队】等信息。</li>
				</ul>
			</view>
			<view class="zy-bottom-tip">
				温馨提示：分享此二维码之前必须成为分销商，否则不享受订单反佣。
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {
			//复制分享链接
			sharurl() {
				uni.setClipboardData({
					data: 'http://sishuquan.com?id=3228969',
					success: function() {
						console.log('success');
						uni.showModal({
							title: '复制成功',
							content: '内容已复制到粘贴板，可前往其他应用粘贴查看。',
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									//console.log('用户点击确定');
								} else if (res.cancel) {
									//console.log('用户点击取消');
								}
							}
						});
					}
				});
			},
			//保存图片到相册
			save() {
				uni.showActionSheet({
					itemList: ['保存图片到相册'],
					success: () => {
						// plus.gallery.save('http://pds.jyt123.com/wxtest/logo.png', function() {
						// 	uni.showToast({
						// 		title:'保存成功',
						// 		icon:'none'
						// 	})
						// }, function() {
						// 	uni.showToast({
						// 		title:'保存失败，请重试！',
						// 		icon:'none'
						// 	})
						// });
						uni.saveFile({
							tempFilePath: 'http://pds.jyt123.com/wxtest/logo.png',
							success: (res) => {
								uni.showModal({
									title: '保存成功',
									content: '可在手机相册中查看',
									showCancel: false
								});
							},
							fail: (res) => {
								uni.showModal({
									title: '保存失败',
									content: '失败原因: ' + JSON.stringify(res),
									showCancel: false
								});
							}
						})
					}
				})
			},

			/**
			 * 打开连接
			 */
			// openLink() {
			// 	plus.runtime.openWeb(this.sourceLink)
			// }
		}
	}
</script>

<style>
	.tugurl {
		color: #999;
	}

	.sharbuttn {
		display: flex;
		justify-content: center;
	}

	.shartitle {
		width: 80%;
		text-align: center;
		margin-left: 10%;
		border-bottom: 1px solid #dddddd;
		position: relative;
		height: 60upx;
	}

	.tgtit {
		text-align: center;
	}

	.shartitle view {
		height: 50upx;
		line-height: 50upx;
		font-size: 28upx;
		color: #999;
		width: 120upx;
		margin: 32upx auto;
		position: absolute;
		background: #fff;
		left: 50%;
		margin-left: -60upx;
	}

	.sharapk {
		display: flex;
		justify-content: center;
		margin: 20upx auto
	}

	.sharapk view {
		margin: 40upx;
	}

	.sharapk view image {
		height: 80upx;
		width: 80upx;
	}

	.content {
		width: 100%;
		background-color: #ffffff;
	}

	.top {
		width: 100%;
		height: 400upx;
		background: url(http://pds.jyt123.com/wxtest/banner.png) no-repeat;
		background-size: 100%;
		background-position: center center;
	}

	.banner {
		width: 100%;
		background-color: #FFFFFF;
		border-radius: 60upx 60upx 0 0;
		margin-top: -60upx;
	}

	.banner dl {
		margin-top: -80upx;
	}

	.banner dl dt {
		text-align: center;
	}

	.banner dl dt image {
		width: 160upx;
		height: 160upx;
		border-radius: 50%;
	}

	.banner dl dd {
		text-align: center;
	}

	.img {
		width: 300upx;
		height: 300upx;
		background-color: red;
		margin: 0 auto;
		margin-top: 60upx;
	}

	.img image {
		width: 100%;
		height: 100%;
	}

	.btn {
		width: 260upx;
		height: 60upx;
		line-height: 60upx;
		margin: 0 auto;
		margin-top: 60upx;
		border-radius: 40upx;
		border: 0;
		font-size: 26upx;
		outline: 0;
		background: #33b17b;
		color: #FFFFFF;
		text-align: center;
	}

	.bottom {
		width: 100%;
		height: 400upx;
		/* 	background: url(../../static/share/beij.png) no-repeat; */
		background-position: left bottom;
		/* 设置背景图片位置 */
		background-size: 20%;
	}

	.bottom ul {
		margin-top: 40upx;
		padding-left: 40upx;
		box-sizing: border-box;
		list-style: none;
	}

	.bottom ul li {
		width: 100%;
		height: auto;
		padding: 20upx 0;
	}
	.zy-bottom-tip {
		background-color: red;
		padding: 20upx 10upx;
		color: #FFFFFF;
		margin: 50upx 30upx
	}
</style>

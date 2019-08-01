<template>
	<view class="content">
		<view class="banner">
			<dl>
				<dt>
					<image src="../../static/share/logo.png" mode="aspectFill"></image>
				</dt>
			</dl>
			<!-- #ifdef H5 -->
			<view class="img">
				<!-- <image :src="shareCode" mode=""></image> -->
				<tki-qrcode cid="qrcode" ref="qrcode" :val="shareLink" size="300"/>
			</view>
			<view class="tgtit">
				推广链接：
				<text class="tugurl">
					{{shareLink}}
				</text>
			</view>
			<view class="sharbuttn">
				<view class="btn" @click="save">保存二维码</view>
				<view class="btn" @click="sharurl">复制推广链接</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view>
				<button class="btn" open-type="share">
					立即分享
				</button>
			</view>
			<!--#endif -->

			<view class="shartitle">
				<view>分享说明</view>
			</view>
			<view class="bottom">
				<!-- #ifdef H5 -->
				<ul>
					<li>1、发送邀请二维码给微信好友。</li>
					<li v-if="distributionFlag">2、好友识别二维码并微信授权后，在商城中购买商品您可享受分销佣金。</li>
					<li v-if="!distributionFlag">2、好友识别二维码并微信授权后，您可享受分销佣金。</li>
					<li>3、您可以在【我的】菜单中查看【分销佣金】和【我的团队】。</li>
				</ul>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<ul>
					<li>1、点击【立即分享】按钮，转发小程序给微信好友。</li>
					<li v-if="distributionFlag">2、好友识别二维码并微信授权后，在商城中购买商品您可享受分销佣金。</li>
					<li v-if="!distributionFlag">2、好友识别二维码并微信授权后，您可享受分销佣金。</li>
					<li>3、您可以在【我的】菜单中查看【分销佣金】和【我的团队】。</li>
				</ul>
				<!-- #endif -->
			</view>
			<view class="zy-bottom-tip" v-if="distributionFlag">
				温馨提示：成为分销商才能享受佣金。
			</view>
		</view>

	</view>
</template>

<script>
	import {
		doGet,
		showInfoToast,
		showSuccessToast,
		MY_SHARE_CODE,
		SHARE_CODE_PAGE_IMG,
		SHARE_TITLE
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				shareLink: 'http://.....',
				urls: {
					shareCodeUrl: '/share-generator/gzh-qrcode',
					shareLinkUrl: '/share-generator/gzh-link'
				},
				distributionFlag: false
			}
		},
		onLoad() {
			// #ifdef H5
			this.loadData()
			// #endif
			this.loadDistributionConfig();
		},
		// #ifdef MP-WEIXIN
		onShareAppMessage(res) {
			var shareCode = uni.getStorageSync(MY_SHARE_CODE);
			return  {
				title: SHARE_TITLE,
				path: '/pages/index/index?shareCode=' + shareCode,
				imageUrl: SHARE_CODE_PAGE_IMG
			}
		},
		// #endif
		methods: {
			/**
			 * 加载分销配置
			 */
			loadDistributionConfig(){
				doGet('/sys-config/any/distribution-config', {}).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						let distributionConfig = res.data.data.distributionAgentSwitch;
						this.distributionFlag = distributionConfig;
					} else {
						showInfoToast(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			/**
			 * 加载数据
			 */
			loadData() {
				this.loadShareLink();
			},
			/**
			 * 加载分享连接
			 */
			loadShareLink() {
				doGet(this.urls.shareLinkUrl, {}, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code = ResponseStatus.OK) {
						this.shareLink = res.data.data;
						this.$refs.qrcode._makeCode();
					} else {
						showInfoToast(res.data.message);
					}

				}).catch(err => {
					console.log(err);
				})
			},
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
				this.$refs.qrcode._saveCode()
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

<style lang="scss">
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
		margin: 0 auto;
		margin-top: 60upx;
	}

	.img image {
		width: 100%;
		height: 100%;
	}

	.btn {
		width: 520upx;
		height: 60upx;
		line-height: 60upx;
		margin: 0 auto;
		margin-top: 60upx;
		border-radius: 40upx;
		border: 0;
		font-size: 26upx;
		outline: 0;
		background: $base-color;
		color: #FFFFFF;
		text-align: center;
	}

	.bottom {
		width: 100%;
		/* 	background: url(../../static/share/beij.png) no-repeat; */
		background-position: left bottom;
		/* 设置背景图片位置 */
		background-size: 20%;
		font-size: 28upx;
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
		margin: 30upx 30upx;
		font-size: 30upx;
	}
</style>

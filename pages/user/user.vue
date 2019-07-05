<template>
	<view class="container">

		<view class="user-section">
			<image class="bg" src="/static/user-bg.jpg"></image>
			<view class="user-info-box">
				<view class="portrait-box">
					<image class="portrait" :src="userInfo.portrait || '/static/missing-face.png'"></image>
				</view>
				<view class="info-box">
					<view>
						<text class="username">{{userInfo.nickname || '游客'}}</text>
						<text class="yticon icon-iLinkapp- zy-vip-icon"></text>
					</view>
					<view>
						<text class="phone">{{userInfo.phone || '暂无手机号'}}</text>
					</view>
				</view>
			</view>
			<view class="vip-card-box">
				<image class="card-bg" src="/static/vip-card-bg.png" mode=""></image>
				<view class="b-btn">
					成为代理
				</view>
				<view class="tit">
					<text class="yticon icon-iLinkapp-"></text>
					代理商
				</view>
				<text class="e-m">Distributor</text>
				<text class="e-b">成为代理商，低价购物，购物得佣金</text>
			</view>
		</view>

		<view class="cover-container" :style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
		 @touchstart="coverTouchstart" @touchmove="coverTouchmove" @touchend="coverTouchend">
			<image class="arc" src="/static/arc.png"></image>

			<view class="tj-sction">
				<view class="tj-item">
					<text class="num">128.8</text>
					<text>余额</text>
				</view>
				<view class="tj-item" @click="toCouponPage">
					<text class="num">0</text>
					<text>优惠券</text>
				</view>
				<view class="tj-item">
					<text class="num">20</text>
					<text>积分</text>
				</view>
			</view>
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="toOrderPage(0)" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-shouye"></text>
					<text>全部订单</text>
				</view>
				<view class="order-item" @click="toOrderPage(1)" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-daifukuan"></text>
					<text>待付款</text>
				</view>
				<view class="order-item" @click="toOrderPage(2)" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-yishouhuo"></text>
					<text>待收货</text>
				</view>
				<view class="order-item" @click="toOrderPage(4)" hover-class="common-hover" :hover-stay-time="50">
					<text class="yticon icon-shouhoutuikuan"></text>
					<text>退款售后</text>
				</view>
			</view>
			<!-- 分销 -->
			<view class="order-section">
				<view class="order-section-item">
					<zywork-icon type="iconyongjin" color="#1296db" size="26" class="zy-icon" />
					<view class="order-item" @click="navTo('/pages/order/order?state=0')" hover-class="common-hover" :hover-stay-time="50">
						<text>分销佣金</text>
						<text>0/元</text>
					</view>
				</view>
				<view class="order-section-item">
					<zywork-icon type="icongroup" color="#1296db" size="26" class="zy-icon" />
					<view class="order-item" @click="navTo('/pages/order/order?state=4')" hover-class="common-hover" :hover-stay-time="50">
						<text>我的团队</text>
						<text>0/人</text>
					</view>
				</view>

			</view>
			<!-- 浏览历史 -->
			<view class="history-section icon">
				<view class="sec-header">
					<text class="yticon icon-lishijilu"></text>
					<text>浏览历史</text>
				</view>
				<scroll-view v-if="browserHistoryArray.length > 0" scroll-x class="h-list">
					<image v-for="(item, index) in browserHistoryArray" :key="index" @click="navTo('/pages/product/product')" :src="item"
					 mode="aspectFill"></image>
				</scroll-view>
				<view v-else class="zy-not-browser-history">暂无浏览记录</view>
				<!-- <list-cell icon="icon-iconfontweixin" iconColor="#e07472" title="我的钱包" tips="您的会员还有3天过期"></list-cell> -->
				<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="地址管理" @eventClick="toAddressPage"></list-cell>
				<list-cell icon="icon-share" iconColor="#9789f7" title="推广二维码" tips="邀请好友的佣金" @eventClick="toSharePage"></list-cell>
				<!-- <list-cell icon="icon-pinglun-copy" iconColor="#ee883b" title="晒单" tips="晒单抢红包"></list-cell> -->
				<list-cell icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#54b4ef" title="我的收藏"></list-cell>
				<list-cell icon="icon-shezhi1" iconColor="#e07472" title="设置" border="" @eventClick="toSetPage"></list-cell>
			</view>
		</view>
	</view>
</template>
<script>
	import zyworkIcon from '@/components/zywork-icon/zywork-icon.vue'
	import listCell from '@/components/mix-list-cell';
	import {
		COUPON_PAGE,
		SHARE_PAGE,
		SET_PAGE,
		ADDRESS_PAGE,
		NOTICE_PAGE,
		ORDER_PAGE
	} from '@/common/page-url.js'
	import {
		navTo
	} from '@/common/util.js'
	import {
		getBrowseHistory
	} from '@/common/storage.js'
	import {
		mapState
	} from 'vuex';
	let startY = 0,
		moveY = 0,
		pageAtTop = true;
	export default {
		components: {
			listCell,
			zyworkIcon
		},
		data() {
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				browserHistoryArray: []
			}
		},
		onLoad() {
			this.loadData();
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.toSetPage();
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				this.toNoticePage();
			}
		},
		// #endif
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			/**
			 * 加载数据
			 */
			loadData() {
				// 加载浏览历史
				var browserHistory = getBrowseHistory();
				var _this = this;
				if (browserHistory.length > 0) {
					browserHistory.forEach(item => {
						var imgSrc = item.split('#')[1];
						_this.browserHistoryArray.push(imgSrc);
					})
				}
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				if (!this.hasLogin) {
					url = '/pages/public/login';
				}
				uni.navigateTo({
					url
				})
			},

			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e) {
				if (pageAtTop === false) {
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e) {
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if (moveDistance < 0) {
					this.moving = false;
					return;
				}
				this.moving = true;
				if (moveDistance >= 80 && moveDistance < 100) {
					moveDistance = 80;
				}

				if (moveDistance > 0 && moveDistance <= 80) {
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend() {
				if (this.moving === false) {
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			},
			/**
			 * 前往通知页面
			 */
			toNoticePage() {
				navTo(NOTICE_PAGE, true);
			},
			/**
			 * 前往我的优惠券
			 */
			toCouponPage() {
				navTo(COUPON_PAGE, true);
			},
			/**
			 * 前往分享
			 */
			toSharePage() {
				navTo(SHARE_PAGE, true);
			},
			/**
			 * 前往设置
			 */
			toSetPage() {
				navTo(SET_PAGE, true);
			},
			/**
			 * 前往地址设置
			 */
			toAddressPage() {
				navTo(ADDRESS_PAGE, true);
			},
			/**
			 * 前往订单页面
			 */
			toOrderPage(type) {
				navTo(ORDER_PAGE + '?state=' + type, true);
			}
		}
	}
</script>
<style lang='scss'>
	@import '@/common/zywork-main.scss';

	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 10upx;
	}

	.user-section {
		height: 520upx;
		padding: 100upx 30upx 0;
		position: relative;

		.bg {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}
	}

	.user-info-box {
		height: 180upx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1;

		.portrait {
			width: 130upx;
			height: 130upx;
			border: 5upx solid #fff;
			border-radius: 50%;
		}

		.username {
			font-size: $font-lg + 6upx;
			color: $font-color-dark;
			margin-left: 20upx;
		}

		.phone {
			font-size: $font-sm + 6upx;
			margin-left: 20upx;
		}

		.zy-vip-icon {
			margin-left: 20upx;
		}
	}

	.vip-card-box {
		display: flex;
		flex-direction: column;
		color: #f7d680;
		height: 240upx;
		background: linear-gradient(left, rgba(0, 0, 0, .7), rgba(0, 0, 0, .8));
		border-radius: 16upx 16upx 0 0;
		overflow: hidden;
		position: relative;
		padding: 20upx 24upx;

		.card-bg {
			position: absolute;
			top: 20upx;
			right: 0;
			width: 380upx;
			height: 260upx;
		}

		.b-btn {
			position: absolute;
			right: 20upx;
			top: 16upx;
			width: 132upx;
			height: 40upx;
			text-align: center;
			line-height: 40upx;
			font-size: 22upx;
			color: #36343c;
			border-radius: 20px;
			background: linear-gradient(left, #f9e6af, #ffd465);
			z-index: 1;
		}

		.tit {
			font-size: $font-base+2upx;
			color: #f7d680;
			margin-bottom: 28upx;

			.yticon {
				color: #f6e5a3;
				margin-right: 16upx;
			}
		}

		.e-b {
			font-size: $font-sm;
			color: #d8cba9;
			margin-top: 10upx;
		}
	}

	.cover-container {
		background: $page-color-base;
		margin-top: -150upx;
		padding: 0 30upx;
		position: relative;
		background: #f5f5f5;
		padding-bottom: 20upx;

		.arc {
			position: absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}

	.tj-sction {
		@extend %section;

		.tj-item {
			@extend %flex-center;
			flex-direction: column;
			height: 140upx;
			font-size: $font-sm;
			color: #75787d;
		}

		.num {
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 8upx;
		}
	}

	.order-section {
		@extend %section;
		padding: 28upx 0;
		margin-top: 20upx;

		.order-item {
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: $font-color-dark;
		}

		.yticon {
			font-size: 48upx;
			margin-bottom: 18upx;
			color: #fa436a;
		}

		.icon-shouhoutuikuan {
			font-size: 44upx;
		}

		.order-section-item {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

	}

	.history-section {
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius: 10upx;

		.sec-header {
			display: flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;

			.yticon {
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}

		.h-list {
			white-space: nowrap;
			padding: 30upx 30upx 0;

			image {
				display: inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
	
	.zy-not-browser-history {
		margin: 10upx 90upx;
	}
</style>

<template>
	<view>
		<view class="zy-head zy-display-flex">
			<view class="zy-display-flex">
				<image class="zy-head-img" :src="userInfo.headicon || defaultHeadIcon"></image>
				<view>{{userInfo.nickname}}</view>
			</view>
			<view class="zy-display-flex-right">
				<button class="zy-head-btn" @click="toOrderPage">写评价</button>
			</view>
		</view>

		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex == index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<!-- <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData('reachBottom')"> -->
				<view>
					
					<!-- 评价列表 -->
					<view class="order-item" v-for="(item, index) in evaluateList" :key="index">
						<view class="i-top b-b">
							<view class="zy-display-flex">
								<image class="zy-head-img" :src="item.userDetailHeadicon || defaultHeadIcon"></image>
								<view>{{item.userDetailNickname}}</view>
							</view>
						</view>
						<view class="zy-goods-sku zy-display-flex">
							<view>
								{{item.goodsCommentSkuInfo}}
							</view>
							<view class="zy-display-flex-right">
								{{item.goodsCommentCreateTime}} 
							</view>
						</view>
						<view class="zy-content">
							{{item.goodsCommentComments || '此用户没有填写评价'}}
						</view>
						<view v-if="item.picCount > 0">
							<view v-for="(imgItem, imgIndex) in item.imageList" :key="imgIndex" class="goods-item">
								<image class="goods-img" style="width: 170upx; height: 170upx;" :src="localFileStorage ? frontBaseUrl + imgItem : imgItem" mode="aspectFill"></image>
							</view>
						</view>
						<view class="zy-replay" v-if="item.goodsCommentReply">
							<view class="zy-replay-temp"></view>
							掌柜回复：{{item.goodsCommentReply}}
						</view>
						<view v-else>
							<view class="goods-box-single">
								<image class="goods-img" :src="localFileStorage ? frontBaseUrl + item.goodsPicPicUrl : item.goodsPicPicUrl"
								 mode="aspectFill"></image>
								<view class="right">
									<text class="title clamp">{{item.goodsCommentSkuTitle}}</text>
									<text class="price">{{item.goodsCommentPrice}}</text>
								</view>
							</view>
						</view>
					</view>


					<uni-load-more :status="loadingType"></uni-load-more>
				</view>
				<!-- </scroll-view>
			</swiper-item>
		</swiper> -->
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import {
		doPostJson,
		doGet,
		showInfoToast,
		showSuccessToast,
		nullToStr,
		FRONT_BASE_URL,
		LOCAL_FILE_STORAGE,
		REFRESH_ORDER,
		DEFAULT_HEADICON
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				userInfo: null,
				tabCurrentIndex: 0,
				loadingType: 'more',
				evaluateList: [],
				navList: [{
						state: 0,
						text: '全部'
					},
					{
						state: 1,
						text: '有图'
					}
				],
				urls: {
					searchUrl: '/user-goods-comment/user/pager-cond',
					userInfoUrl: '/user-detail/user/one'
				},
				pager: {
					pageNo: 1,
					pageSize: 10,
					goodsCommentIsActive: 0,
					sortColumn: 'goodsCommentCreateTime',
					sortOrder: 'desc',
				},
				frontBaseUrl: FRONT_BASE_URL,
				localFileStorage: LOCAL_FILE_STORAGE,
				defaultHeadIcon: DEFAULT_HEADICON,
			};
		},
		onLoad(options) {
			this.loadData('init');
			this.loadUserInfo();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.pager.pageNo = 1
			this.loadData('pullDown')
		},
		//加载更多
		onReachBottom() {
			this.loadData('reachBottom');
		},
		methods: {
			//获取评价列表
			loadData(type) {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				if (this.loadingType === 'loading') {
					//防止重复加载
					return
				}
				if (this.loadingType === 'nomore' && type !== 'init') {
					return
				}
				if (type === 'reachBottom') {
					this.pager.pageNo += 1
				}
				this.loadingType = 'loading';
				doPostJson(this.urls.searchUrl, this.pager, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						// 判断是否还有数据， 有改为 more， 没有改为noMore 
						this.loadingType = this.pager.pageNo * this.pager.pageSize >= res.data.data.total ? 'nomore' : 'more'
						let rows = nullToStr(res.data.data.rows);
						let evaluateList = []
						rows.forEach(item => {
							if (item.picCount > 0) {
								evaluateList.push(item)
							}
						})
						if (index === 1) {
							rows = evaluateList
						}
						if (type === 'init') {
							this.evaluateList = rows;
						} else if (type === 'pullDown') {
							uni.stopPullDownRefresh();
							this.evaluateList = rows;
						} else if (type === 'reachBottom') {
							if (rows.length > 0) {
								this.evaluateList = this.evaluateList.concat(rows);
							}
						}
					} else {
						showInfoToast(res.data.message);
					}
				}).catch(err => {
					console.log(err);
				})
			},
			/**
			 * 加载用户信息
			 */
			loadUserInfo() {
				doGet(this.urls.userInfoUrl, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						this.userInfo = res.data.data
					} else {
						showInfoToast(res.data.message);
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//swiper 切换
			changeTab(e) {
				const index = e.target.current;
				this.tabClick(index);
			},
			//顶部tab点击
			tabClick(index) {
				if (this.tabCurrentIndex != index) {
					this.pager.pageNo = 1
					this.tabCurrentIndex = index
					this.navList[index].loadingType = 'more'
					
					this.loadData('init');
				}
			},
			/**
			 * 前往订单页面
			 */
			toOrderPage() {
				uni.navigateTo({
					url: '/pages/order/order?state=3'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/zywork-main.scss';

	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}
	
	.list-scroll-content {
		height: 100%;
	}
	
	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;
	
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
	
			&.current {
				color: $base-color;
	
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}
	
	.uni-swiper-item {
		height: auto;
	}
	
	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
	
		.i-top {
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right: 30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
	
			.time {
				flex: 1;
			}
	
			.state {
				color: $base-color;
			}
	
			.del-btn {
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
	
				&:after {
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
	
		/* 多条商品 */
		.goods-box {
			height: 160upx;
			padding: 20upx 0;
			white-space: nowrap;
	
			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}
	
			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
	
		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;
	
			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}
	
			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;
	
				.title {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}
	
				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}
	
				.price {
					font-size: $font-base + 10upx;
					color: red;
	
					&:before {
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
					}
				}
			}
		}
	
		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
	
			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}
	
			.price {
				font-size: $font-lg;
				color: $font-color-dark;
	
				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
	
		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
	
		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
	
			&:after {
				border-radius: 100px;
			}
	
			&.recom {
				background: #fff9f9;
				color: $base-color;
	
				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}

	.zy-head {
		background-color: #FFF;
		padding: 40upx 20upx;

		.zy-head-btn {
			height: 50upx;
			line-height: 50upx;
			border: 1px solid #fa436a;
			color: #fa436a;
			border-radius: 30upx;
			background-color: transparent;
			font-size: 23upx;
		}
	}

	.zy-head-img {
		width: 50upx;
		height: 50upx;
		border-radius: 50%;
		margin-right: 20upx;
		display: inline-block;
	}
	
	.zy-goods-sku {
		margin-top: 20upx;
	}
	.zy-goods-sku view {
		font-size: 28upx;
		color: #c5c8ce;
	}
	.zy-content {
		color: #000000;
		padding: 20upx 20upx 20upx 0upx;
	}
	.zy-replay {
		position: relative;
		border-radius: 20upx;
		background-color: #f3f3f3;
		padding: 20upx;
		margin: 40upx 20upx 40upx 0upx;
		
	}
	.zy-replay-temp {
		display: none;
		width: 50px;
		height: 50px;
		border: 50px solid;
		border-color: #f3f3f3;
	}
	.zy-replay::before {
		content: '';
		width: 0;
		height: 0;
		border: 20px solid;
		position: absolute;
		top: -40px;
		left: 20px;
		border-color:  transparent transparent #f3f3f3;
	}
	.zy-replay::after {
		content: '';
		width: 0;
		height: 0;
		border: 20px solid;
		position: absolute;
		top: -36px;
		left: 20px;
		border-color:  transparent transparent #f3f3f3;
	}
	
</style>

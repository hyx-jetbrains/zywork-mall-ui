<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">
						<view class="i-top b-b">
							<text class="time">{{item.time}}</text>
							<text class="state" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
							<!-- 已取消的订单可以删除 -->
							<text v-if="item.state===6" class="del-btn iconfont iconguanbi" @click="deleteOrder(index)"></text>
						</view>

						<scroll-view v-if="item.goodsList.length > 1" class="goods-box" scroll-x>
							<view v-for="(goodsItem, goodsIndex) in item.goodsList" :key="goodsIndex" class="goods-item">
								<image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view v-if="item.goodsList.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.goodsList"
						 :key="goodsIndex">
							<image class="goods-img" :src="goodsItem.image" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.title}}</text>
								<text class="attr-box">{{goodsItem.attr}} x {{goodsItem.number}}</text>
								<text class="price">{{goodsItem.price}}</text>
							</view>
						</view>

						<view class="price-box">
							共
							<text class="num">7</text>
							件商品 实付款
							<text class="price">143.7</text>
						</view>
						<!-- 待付款 -->
						<view class="action-box b-t" v-if="item.state === 1">
							<button class="action-btn" @click="cancelOrder(item)">取消订单</button>
							<button class="action-btn recom">立即支付</button>
						</view>
						<!-- 待收货 -->
						<view class="action-box b-t" v-else-if="item.state === 2">
							<button class="action-btn">查看物流</button>
							<button class="action-btn recom">确认收货</button>
						</view>
						<!-- 待评价 -->
						<view class="action-box b-t" v-else-if="item.state === 3">
							<button class="action-btn">查看物流</button>
							<button class="action-btn recom" @click="toAddEvaluatePage">立即评价</button>
						</view>
						<!-- 售后 -->
						<view class="action-box b-t" v-else-if="item.state === 4">
							<button class="action-btn recom">申请售后</button>
						</view>
					</view>

					<uni-load-more :status="tabItem.loadingType"></uni-load-more>

				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import Json from '@/Json';
	import {
		ADD_EVALUATE_PAGE
	} from '@/common/page-url.js'
	import {
		doPostJson,
		showInfoToast,
		nullToStr
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待付款',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '待评价',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 4,
						text: '售后',
						loadingType: 'more',
						orderList: []
					}
				],
				urls: {
					searchUrl: '/user-goods-order-item/user/pager-cond'
				},
				pager: {
					pageNo: 1,
					pageSize: 10,
					isActive: 0,
					goodsOrderOrderStatusMin: '',
					goodsOrderOrderStatusMax: ''
				}
			};
		},

		onLoad(options) {
			this.loadData('init');
		},
		//下拉刷新
		onPullDownRefresh() {
			this.pager.pageNo = 1;
			this.loadData('pullDown');
		},
		//加载更多
		onReachBottom() {
			this.pager.pageNo += 1;
			this.loadData('reachBottom');
		},
		methods: {
			//获取订单列表
			loadData(type) {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				navItem.loadingType = 'loading';
				doPostJson(this.urls.searchUrl, this.pager, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						// 判断是否还有数据， 有改为 more， 没有改为noMore 
						navItem.loadingType = 'more';
						if (this.pager.pageNo * this.pager.pageSize >= res.data.data.total) {
							navItem.loadingType = 'nomore';
						}
						const rows = nullToStr(res.data.data.rows);
						rows = Json.rows.filter(item => {
							//添加不同状态下订单的表现形式
							item = Object.assign(item, this.orderStateExp(item));
							return item;
						});
						if (type === 'init') {
							navItem.orderList = rows;
						} else if (type === 'pullDown') {
							uni.stopPullDownRefresh();
							navItem.orderList = rows;
						} else if (type === 'reachBottom') {
							if (rows.length > 0) {
								navItem.orderList = navItem.orderList.concat(rows);
							}
						}
					} else {
						showInfoToast(res.data.message);
					}
				}).catch(err => {
					console.log(err);
				})
			},

			//swiper 切换
			changeTab(e) {
				const index = e.target.current;
				this.tabClick(index);
			},
			//顶部tab点击
			tabClick(index) {
				if (this.tabCurrentIndex !== index) {
					this.tabCurrentIndex = index;
					if (index === 0) {
						// 全部订单
						this.pager.goodsOrderOrderStatusMin = this.pager.goodsOrderOrderStatusMax = '';
					} else if (index === 1) {
						// 待付款订单
						this.pager.goodsOrderOrderStatusMin = this.pager.goodsOrderOrderStatusMax = 0;
					} else if (index === 2) {
						// 待收货订单
						this.pager.goodsOrderOrderStatusMin = this.pager.goodsOrderOrderStatusMax = 4;
					} else if (index === 3) {
						// 待评价订单
						this.pager.goodsOrderOrderStatusMin = this.pager.goodsOrderOrderStatusMax = 5;
					} else if (index === 4) {
						// 售后订单
						this.pager.goodsOrderOrderStatusMin = 7
						this.pager.goodsOrderOrderStatusMax = 10;
					}
					this.loadData('init');
				}
			},
			//删除订单
			deleteOrder(index) {
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(() => {
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600)
			},
			//取消订单
			cancelOrder(item) {
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(() => {
					let {
						stateTip,
						stateTipColor
					} = this.orderStateExp(9);
					item = Object.assign(item, {
						state: 9,
						stateTip,
						stateTipColor
					})

					//取消订单后删除待付款中该项
					let list = this.navList[1].orderList;
					let index = list.findIndex(val => val.id === item.id);
					index !== -1 && list.splice(index, 1);

					uni.hideLoading();
				}, 600)
			},

			//订单状态文字和颜色
			orderStateExp(item) {
				const state = item.goodsOrderOrderStatus;
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch (+state) {
					case 0:
						stateTip = '待付款';
						time = item.goodsOrderCreateTime;
						break;
					case 1:
						stateTip = '已付款';
						time = item.goodsOrderCreateTime;
						break;
					case 2:
						stateTip = '支付失败';
						time = item.goodsOrderPayTime;
						break;
					case 3:
						stateTip = '待发货';
						time = item.goodsOrderPayTime;
						break;
					case 4:
						stateTip = '待收货';
						time = item.goodsOrderDeliverTime;
						break;
					case 5:
						stateTip = '已确认收货';
						time = item.goodsOrderDealTime;
						break;
					case 6:
						stateTip = '已取消';
						stateTipColor = '#909399';
						time = item.goodsOrderCreateTime;
						break;
					case 7:
						stateTip = '已申请退货';
						time = item.goodsOrderCreateTime;
						break;
					case 8:
						stateTip: '拒绝退货';
						time = item.goodsOrderCreateTime;
						break;
					case 9:
						stateTip: '退货中';
						time = item.goodsOrderCreateTime;
						break;
					case 10:
						stateTip: '已退货';
						time = item.goodsOrderCreateTime;
						break;
				}
				return {
					stateTip,
					stateTipColor,
					time
				};
			},
			/**
			 * 前往发布商品评论页面
			 */
			toAddEvaluatePage() {
				uni.navigateTo({
					url: ADD_EVALUATE_PAGE
				})
			}
		}

	}
</script>

<style lang="scss">
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
					font-size: $font-base + 2upx;
					color: $font-color-dark;

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
</style>

<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex == index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData('reachBottom')">
					<!-- 空白页 -->
					<empty v-if="tabItem.orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item">

						<view class="i-top b-b">
							<text class="time" @click="toOrderDetail(item.goodsOrderId)">{{item.timeTip}}:{{item.time}}</text>
							<text class="state" @click="toOrderDetail(item.goodsOrderId)" :style="{color: item.stateTipColor}">{{item.stateTip}}</text>
							<!-- 已取消的订单可以删除 -->
							<text v-if="item.goodsOrderOrderStatus===6" class="del-btn iconfont iconguanbi" @click="deleteOrder(item.goodsOrderId)"></text>
						</view>
						<view @click="toOrderDetail(item.goodsOrderId)">
							<scroll-view v-if="item.userGoodsOrderItemVOList.length > 1" class="goods-box" scroll-x>
								<view v-for="(goodsItem, goodsIndex) in item.userGoodsOrderItemVOList" :key="goodsIndex" class="goods-item">
									<image class="goods-img" :src="localFileStorage ? frontBaseUrl + goodsItem.goodsPicPicUrl : goodsItem.goodsPicPicUrl" mode="aspectFill"></image>
								</view>
							</scroll-view>
							<view v-if="item.userGoodsOrderItemVOList.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.userGoodsOrderItemVOList"
							 :key="goodsIndex">
								<image class="goods-img" :src="localFileStorage ? frontBaseUrl + goodsItem.goodsPicPicUrl : goodsItem.goodsPicPicUrl" mode="aspectFill"></image>
								<view class="right">
									<text class="title clamp">{{goodsItem.goodsOrderItemSkuTitle}}</text>
									<text class="attr-box">{{goodsItem.goodsOrderItemSkuInfo}} x {{goodsItem.goodsOrderItemQuantity}}</text>
									<text class="price">{{goodsItem.goodsOrderItemPayAmount}}</text>
								</view>
							</view>

							<view class="price-box">
								共
								<text class="num">{{item.userGoodsOrderItemVOList.length}}</text>
								件商品
								实付款
								<text class="price">{{item.goodsOrderPayAmount}}</text>
							</view>
						</view>
						<!-- 待付款 -->
						<view class="action-box b-t" v-if="item.goodsOrderOrderStatus === 0">
							<button class="action-btn" @click="cancelOrder(item, index)">取消订单</button>
							<button class="action-btn recom" @click="toPayPage(item.goodsOrderId, item.goodsOrderPayAmount)">立即支付</button>
						</view>
						<!-- 待收货 -->
						<view class="action-box b-t" v-else-if="item.goodsOrderOrderStatus === 4">
							<button class="action-btn" @click="toLogisticsPage">查看物流</button>
							<button class="action-btn recom" @click="confirmReceipt(item)">确认收货</button>
						</view>
						<!-- 已确认收货 -->
						<view class="action-box b-t" v-else-if="item.goodsOrderOrderStatus === 11">
							<button class="action-btn recom" @click="applyAfter">申请售后</button>
							<button class="action-btn" @click="toLogisticsPage">查看物流</button>
							<button class="action-btn recom" @click="toAddEvaluatePage(item)">立即评价</button>
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
		doGet,
		showInfoToast,
		showSuccessToast,
		nullToStr,
		FRONT_BASE_URL,
		LOCAL_FILE_STORAGE
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: -1,
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
					searchUrl: '/user-goods-order/user/pager-cond',
					removeUrl: '/goods-order/user/remove/',
					confirmUrl: '/goods-order/user/confirm'
				},
				pager: {
					pageNo: 1,
					pageSize: 10,
					isActive: 0,
					sortColumn: 'goodsOrderCreateTime',
					sortOrder: 'desc',
					goodsOrderOrderStatusMin: '',
					goodsOrderOrderStatusMax: ''
				},
				frontBaseUrl: FRONT_BASE_URL,
				localFileStorage: LOCAL_FILE_STORAGE
			};
		},
		onLoad(options) {
			const type = options.state;
			if (type) {
				this.tabClick(type);
			} else {
				this.loadData('init');
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.pager.pageNo = 1
			this.loadData('pullDown')
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
					return
				}
				if (navItem.loadingType === 'nomore') {
					return
				}
				if (type === 'reachBottom') {
					this.pager.pageNo += 1
				}
				navItem.loadingType = 'loading';
				doPostJson(this.urls.searchUrl, this.pager, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						// 判断是否还有数据， 有改为 more， 没有改为noMore 
						navItem.loadingType = this.pager.pageNo * this.pager.pageSize >= res.data.data.total ? 'nomore' : 'more'
						let tempRows = nullToStr(res.data.data.rows);
						let rows = []
						tempRows.forEach(item => {
							//添加不同状态下订单的表现形式
							item = Object.assign(item, this.orderStateExp(item));
							rows.push(item);
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
				if (this.tabCurrentIndex != index) {
					this.pager.pageNo = 1
					this.tabCurrentIndex = index
					this.navList[index].loadingType = 'more'
					if (index == 0) {
						// 全部订单
						this.pager.goodsOrderOrderStatusMin = this.pager.goodsOrderOrderStatusMax = '';
					} else if (index == 1) {
						// 待付款订单
						this.pager.goodsOrderOrderStatusMin = this.pager.goodsOrderOrderStatusMax = 0;
					} else if (index == 2) {
						// 待收货订单
						this.pager.goodsOrderOrderStatusMin = 3
						this.pager.goodsOrderOrderStatusMax = 4;
					} else if (index == 3) {
						// 待评价订单
						this.pager.goodsOrderOrderStatusMin = this.pager.goodsOrderOrderStatusMax = 11;
					} else if (index == 4) {
						// 售后订单
						this.pager.goodsOrderOrderStatusMin = 7
						this.pager.goodsOrderOrderStatusMax = 10;
					}
					this.loadData('init');
				}
			},
			//删除订单
			deleteOrder(id) {
				uni.showModal({
					title: '确定删除订单？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后...'
							})
							doGet(this.urls.removeUrl + id, {}, false).then(response => {
								uni.hideLoading();
								let [error, res] = response;
								if (res.data.code === ResponseStatus.OK) {
									showSuccessToast("删除成功");
								} else {
									showInfoToast(res.data.message);
								}
								this.loadData('init');
								
							}).catch(err => {
								console.log(err);
							})
						}
					}
				})

			},
			//取消订单
			cancelOrder(item, index) {
				uni.showModal({
					title: '确定取消订单？',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '请稍后...'
							})
							doPostJson('/goods-order/user/cancel', item, {}, true).then(response => {
								let [error, res] = response;
								uni.hideLoading();
								if (res.data.code === ResponseStatus.OK) {
									if (this.tabCurrentIndex == 0) {
										item.goodsOrderOrderStatus = 6
										item = Object.assign(item, this.orderStateExp(item))
									}
									if (this.tabCurrentIndex == 1) {
										this.navList[this.tabCurrentIndex].orderList.splice(index, 1)
									}
									showInfoToast('订单已取消')
								} else {
									showInfoToast(res.data.message);
								}
								this.loadData('init');
								
							}).catch(err => {
								console.log(err);
							})
						}
					}
				})
			},
			confirmOrder() {
				uni.showLoading({
					title: '请稍后...'
				})
				const data = {
					id: item.goodsOrderId
				}
				doPostJson('/goods-order/user/confirm', data, {}, true).then(response => {
					let [error, res] = response
					uni.hideLoading();
					if (res.data.code === ResponseStatus.OK) {
						this.navList[this.tabCurrentIndex].orderList.splice(index, 1)
						showInfoToast('已确认收货')
					} else {
						showInfoToast(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//订单状态文字和颜色
			orderStateExp(item) {
				const state = item.goodsOrderOrderStatus;
				let stateTip = '',
					stateTipColor = '#fa436a',
					time = '',
					timeTip = '';
				switch (+state) {
					case 0:
						stateTip = '待付款';
						time = item.goodsOrderCreateTime;
						timeTip = '下单时间';
						break;
					case 1:
						stateTip = '已付款';
						time = item.goodsOrderCreateTime;
						timeTip = '下单时间';
						break;
					case 2:
						stateTip = '支付失败';
						time = item.goodsOrderPayTime;
						timeTip = '支付时间';
						break;
					case 3:
						stateTip = '待发货';
						time = item.goodsOrderPayTime;
						timeTip = '支付时间';
						break;
					case 4:
						stateTip = '待收货';
						time = item.goodsOrderDeliverTime;
						timeTip = '发货时间';
						break;
					case 5:
						stateTip = '已确认收货';
						time = item.goodsOrderDealTime;
						timeTip = '交易时间';
						break;
					case 6:
						stateTip = '已取消';
						stateTipColor = '#909399';
						time = item.goodsOrderCreateTime;
						timeTip = '下单时间';
						break;
					case 7:
						stateTip = '已申请退货';
						time = item.goodsOrderCreateTime;
						timeTip = '下单时间';
						break;
					case 8:
						stateTip: '拒绝退货';
						time = item.goodsOrderCreateTime;
						timeTip = '下单时间';
						break;
					case 9:
						stateTip: '退货中';
						time = item.goodsOrderCreateTime;
						timeTip = '下单时间';
						break;
					case 10:
						stateTip: '已退货';
						time = item.goodsOrderCreateTime;
						timeTip = '下单时间';
						break;
					case 11:
						stateTip: '待评价';
						time = item.goodsOrderCreateTime;
						timeTip = '下单时间';
						break;
					case 12:
						stateTip: '已评价';
						time = item.goodsOrderCreateTime;
						timeTip = '下单时间';
						break;
				}
				return {
					stateTip,
					stateTipColor,
					time,
					timeTip
				};
			},
			/**
			 * 前往发布商品评论页面
			 */
			toAddEvaluatePage(item) {
				uni.navigateTo({
					url: ADD_EVALUATE_PAGE + '?goodsList=' + JSON.stringify(item.userGoodsOrderItemVOList) + '&orderId=' + item.goodsOrderId
				})
			},
			/**
			 * 查看物流
			 */
			toLogisticsPage() {
				showInfoToast('查看物流')
			},
			/**
			 * 申请售后
			 */
			applyAfter() {
				showInfoToast('申请售后')
			},
			/**
			 * 立即支付
			 * @param {Object} orderId 订单id
			 * @param {Object} actualPay 支付金额
			 */
			toPayPage(orderId, actualPay) {
				uni.navigateTo({
					url: `/pages/money/pay?orderId=${orderId}&totalPay=${actualPay}`
				})
			},
			/**
			 * 确认收货
			 * @param {Object} orderId 订单id
			 */
			confirmReceipt(item) {
				const params = {
					id: item.goodsOrderId
				}
				doPostJson(this.urls.confirmUrl, params, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						uni.redirectTo({
							url: '/pages/status-page/transaction-success?orderInfo=' + JSON.stringify(item)
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
			/**
			 * 前往订单详情
			 * @param {Object} orderId 订单id
			 */
			toOrderDetail(orderId) {
				uni.redirectTo({
					url: `/pages/order/orderDetail?orderId=${orderId}`
				})
			},
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

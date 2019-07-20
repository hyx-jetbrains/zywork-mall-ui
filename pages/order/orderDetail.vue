<template>
	<view class="content">
		<view class="zy-top">
			<view class="zy-text-bold zy-status">{{orderInfo.stateTip}}</view>
			<view style="margin: 20upx;">
				<Button type="default" class="zy-btn" @click="repurchase">再次购买</Button>
			</view>
			<view class="zy-memo zy-display-flex">
				<view>
					<text class="iconfont iconjifen"></text>
					<text>本单购物返积分</text>
				</view>
				<view class="zy-display-flex-right">
					<text>{{orderInfo.goodsOrderIntegralAmount}}</text>
					<text class="iconfont iconxiangyou"></text>
				</view>
			</view>
		</view>
		<view style="margin-top: -40upx;">
		<view v-for="(item, index) in orderInfo.userGoodsOrderItemVOList" :key="index">
			<view class="goods-section" >
				<!-- 商品列表 -->
				<view class="zy-item">
					<image :src="imgBaseUrl + '/' + item.goodsPicPicUrl"></image>
					<view class="right">
						<text class="title clamp">{{item.goodsOrderItemSkuTitle}}</text>
						<text class="spec">{{item.goodsOrderItemSkuInfo}}</text>
						<view class="price-box">
							<text class="price">￥{{item.goodsOrderItemPayAmount}}</text>
							<text class="number">x {{item.goodsOrderItemQuantity}}</text>
						</view>
					</view>
				</view>
				<!-- 店铺信息 -->
				<view class="zy-bottom">
					<image class="logo" src="http://duoduo.qibukj.cn/./Upload/Images/20190321/201903211727515.png"></image>
					<text class="name">智悦商城</text>
				</view>
			</view>
		</view>
		</view>
		<!-- 商品信息 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">订单编号:</text>
				<text class="cell-tip">{{orderInfo.goodsOrderId}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">下单时间:</text>
				<text class="cell-tip">{{orderInfo.goodsOrderCreateTime}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">支付方式:</text>
				<text class="cell-tip">{{orderInfo.goodsOrderPayType}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">备注:</text>
				<text class="cell-tip">{{orderInfo.goodsOrderRemark}}</text>
			</view>
		</view>
		<!-- 金额信息 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">订单金额:</text>
				<text class="cell-tip">¥ {{orderInfo.goodsOrderTotalAmount}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额:</text>
				<text class="cell-tip">¥ {{orderInfo.goodsOrderDiscountAmount}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">实付金额:</text>
				<text class="cell-tip red">¥ {{orderInfo.goodsOrderPayAmount}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		doPostJson,
		showInfoToast,
		nullToStr,
		IMAGE_BASE_URL
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		components: {},
		data() {
			return {
				imgBaseUrl: IMAGE_BASE_URL,
				orderInfo: {},
				urls: {
					searchUrl: '/user-goods-order/user/pager-cond'
				},
				pager: {
					pageNo: 1,
					pageSize: 10,
					isActive: 0,
					goodsOrderId: 0
				}
			};
		},

		onLoad(options) {
			this.loadData(options.orderId);
		},
		methods: {
			loadData(orderId) {
				uni.showLoading({
					title: '加载中...'
				})
				this.pager.goodsOrderId = orderId;
				doPostJson(this.urls.searchUrl, this.pager, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						let tempRows = nullToStr(res.data.data.rows);
						let rows = []
						tempRows.forEach(item => {
							//添加不同状态下订单的表现形式
							item = Object.assign(item, this.orderStateExp(item));
							rows.push(item);
						});
						this.orderInfo = rows[0];
					} else {
						showInfoToast(res.data.message);
					}
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
				})
			},
			/**
			 * 再次购买
			 */
			repurchase() {
				showInfoToast('再次购买')
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
				}
				return {
					stateTip,
					stateTipColor,
					time,
					timeTip
				};
			},
		}

	}
</script>

<style lang="scss">
	@import '@/common/zywork-main.scss';

	page,
	.content {
		background: #F8F8F8;
		height: 100%;
	}

	.zy-top {
		height: 340upx;
		background: linear-gradient(to bottom right, #fa436a, #d06b2f);
		text-align: center;
		padding-top: 20upx;

		.zy-status {
			color: #fff;
			font-size: 38upx;
		}

		.zy-btn {
			width: 200upx;
			height: 60upx;
			line-height: 60upx;
			background: #fff;
			border: none;
			border-radius: 30upx;
			color: #fa436a;
		}

		.zy-memo {
			margin: 40upx;
			padding: 20upx;
			border-radius: 30upx;
			background-color: rgba(255, 255, 255, 0.2);
		}

		.zy-memo text {
			color: #fff;
			margin-left: 10upx;
		}
	}
	.goods-section {
		margin-bootom: 20upx;
		background: #fff;
		padding-bottom: 1px;
		border-radius: 20upx;

		.zy-bottom {
			border-top: 1px solid #E4E7ED;
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.zy-item {
			padding-top: 20upx;
			display: flex;
			margin: 20upx 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}

				.number {
					font-size: 26upx;
					color: $font-color-base;
					margin-left: 20upx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}

	.yt-list {
		margin-top: 20upx;
		background: #fff;
		border-radius: 20upx;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
</style>

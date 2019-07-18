<template>
	<view class="content">
		<view class="zy-top">
			<view class="zy-text-bold zy-status">完成</view>
			<view>
				<Button type="default" class="zy-btn">再次购买</Button>
			</view>
			<view class="zy-memo zy-display-flex">
				<view>
					<text class="iconfont iconjifen"></text>
					<text>本单购物返积分</text>
				</view>
				<view class="zy-display-flex-right">
					<text>100</text>
					<text class="iconfont iconxiangyou"></text>
				</view>
			</view>
		</view>
		<view class="goods-section">
			<view v-for="(item, index) in skuList" :key="index">
				<!-- 商品列表 -->
				<view class="zy-item">
					<image :src="item.goodsSkuPicUrl"></image>
					<view class="right">
						<text class="title clamp">{{item.title}}</text>
						<text class="spec">{{item.skuSpecStr}}</text>
						<view class="price-box">
							<text class="price">￥{{item.salePrice}}</text>
							<text class="number">x {{item.quantity}}</text>
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
		<!-- 商品信息 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">订单编号:</text>
				<text class="cell-tip">23423423423423</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">下单时间:</text>
				<text class="cell-tip">2019-07-24 22:33:33</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">支付方式:</text>
				<text class="cell-tip">微信支付</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">备注:</text>
				<text class="cell-tip">微信支付</text>
			</view>
		</view>
		<!-- 金额信息 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">订单金额:</text>
				<text class="cell-tip">¥ 100</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额:</text>
				<text class="cell-tip">¥ 20</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">实付金额:</text>
				<text class="cell-tip red">¥ 80</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				skuList: [{
					goodsSkuPicUrl: 'http://duoduo.qibukj.cn/./Upload/Images/20190321/201903211727515.png',
					title: '商品标题',
					skuSpecStr: 'S 黄色',
					salePrice: 88,
					quantity: 1
				}]
			};
		},

		onLoad(options) {

		},
		//下拉刷新
		onPullDownRefresh() {

		},
		//加载更多
		onReachBottom() {

		},
		methods: {

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
			background: #fff;
			border: none;
			border-radius: 30upx;
			margin: 20upx;
			color: #fa436a;
		}

		.zy-memo {
			margin: 20upx;
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
		margin-top: -40upx;
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
			&.red{
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

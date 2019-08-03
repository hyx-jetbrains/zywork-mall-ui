<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{totalPay}}</text>
		</view>

		<view class="pay-type-list">

			<view class="type-item b-b" @click="changePayType(1)">
				<text class="icon iconfont iconweixinzhifu" style="color:#4CD964;"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 0' />
					</radio>
				</label>
			</view>
			<!--
			<view class="type-item b-b" @click="changePayType(2)">
				<text class="icon iconfont iconzhifubaozhifu" style="color: #4399FC;"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<view class="type-item" @click="changePayType(3)">
				<text class="icon iconfont iconbalance" style="color:#D76D9D;"></text>
				<view class="con">
					<text class="tit">余款支付</text>
					<text>可用余额 ¥0</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 3' />
					</radio>
				</label>
			</view>
			-->
		</view>
		
		<button class="mix-btn" @click="confirm" :disabled="payDisabled">确认支付</button>
	</view>
</template>

<script>
	import {doGet, showInfoToast} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		data() {
			return {
				payType: 0, // 0 微信， 1 支付宝，2、银联支付， 3 余额
				orderIds: null,
				totalPay: null,
				payDisabled: false
			};
		},
		computed: {
		
		},
		onLoad(options) {
			// 由英文逗号分割的多个订单的id
			this.orderIds = options.orderIds
			this.totalPay = options.totalPay
		},

		methods: {
			//选择支付方式
			changePayType(type) {
				this.payType = type
			},
			//确认支付
			confirm: async function() {
				this.payDisabled = true
				let payUrl = ''
				// #ifdef H5
				payUrl = '/wx-pay/goods-order/gzh-pay-request/'
				// #endif
				// #ifdef MP-WEIXIN
				payUrl = '/wx-pay/goods-order/xcx-pay-request/'
				// #endif
				doGet(payUrl + this.orderIds, {}, true).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						let payData = res.data.data
						uni.requestPayment({
							provider: 'wxpay',
							orderInfo: this.orderIds,
							appId: payData.appId,
							timeStamp: payData.timeStamp,
							nonceStr: payData.nonceStr,
							package: payData.packages,
							signType: 'MD5',
							paySign: payData.paySign,
							success: () => {
								this.payDisabled = true
								uni.redirectTo({
									url: '/pages/money/paySuccess'
								})
							},
							fail: (e) => {
								this.payDisabled = false
								uni.showModal({
									content: "支付失败，请联系客服",
									showCancel: false
								})
							}
						})
					} else {
						showInfoToast(res.data.message)
					}
				}).catch(error => {
					console.log(error)
				})
			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28upx;
		color: #909399;

		.price{
			font-size: 50upx;
			color: #303133;
			margin-top: 12upx;
			&:before{
				content: '￥';
				font-size: 40upx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20upx;
		background-color: #fff;
		padding-left: 60upx;
		
		.type-item{
			height: 120upx;
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60upx;
			font-size: 30upx;
			position:relative;
		}
		
		.icon{
			width: 100upx;
			font-size: 52upx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4upx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630upx;
		height: 80upx;
		margin: 80upx auto 30upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>

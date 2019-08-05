<template>
	<view>
		<view class="zy-head" >
			<view class="zy-head-title">余额</view>
		</view>
		<view class="zy-content">
			<view>总余额</view>
			<view class="zy-content-top"><text class="zy-price">{{userWallet.rmbBalance}}</text></view>
			<view class="zy-display-flex zy-content-bottom">
				<view class="zy-content-left"><text class="zy-price">{{userWallet.usableRmbBalance}}</text>可用</view>
				<view class="zy-content-right"><text class="zy-price">{{userWallet.frozenRmbBalance}}</text>冻结</view>
			</view>
		</view>
		
		<view class="zy-head" >
			<view class="zy-head-title">积分</view>
		</view>
		<view class="zy-content">
			<view>总积分</view>
			<view class="zy-content-top"><text class="zy-price">{{userWallet.integral}}</text></view>
			<view class="zy-display-flex zy-content-bottom">
				<view class="zy-content-left"><text class="zy-price">{{userWallet.usableIntegral}}</text>可用</view>
				<view class="zy-content-right"><text class="zy-price">{{userWallet.frozenIntegral}}</text>冻结</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import { showInfoToast } from '@/common/util.js'
	
	export default {
		data() {
			return {
				userWallet: {}
			}
		},
		onLoad(options) {
			this.userWallet = JSON.parse(options.userWallet)
		},
 		methods: {
		}
	}
</script>

<style lang="scss">
	@import '@/common/zywork-main.scss';
	.zy-head {
		padding: 10upx 0upx;
		margin-top: 20upx;
		background: #FFF;
	}
	.zy-head-title {
		border-left: 5px solid #fa436a;
		padding-left: 20upx;
		margin-left: 20upx;
		font-size: 28upx;
	}
	.zy-content {
		background-color: #FFF;
		padding: 20upx;
		text-align: center;
		
		.zy-content-top {
			margin: 60upx;
			margin-top: 10upx;
		}
		
		.zy-price {
			color: red;
			font-size: 36upx;
		}
	}
	.zy-content-bottom view {
		width: 50%;
	}
</style>

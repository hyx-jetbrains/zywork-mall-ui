<template>
	<view class="container">
		<view class="list-cell">
			<view class="zy-head-img">
				<image src="../../static/about.png"></image>
				<view class="zy-name-tit">智悦科技</view>
				<view class="zy-name-tip">版本号：1.0</view>
			</view>
		</view>
		<view class="list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">客服电话</text>
			<text class="cell-tip" style="color: #108EE9" @click="callPhone">0797-2538</text>
		</view>

	</view>
</template>

<script>
	import zyworkIcon from '@/components/zywork-icon/zywork-icon.vue'
	import {
		mapMutations
	} from 'vuex';
	export default {
		components: {
			zyworkIcon,
		},
		data() {
			return {};
		},
		methods: {
			/**
			 * 拨打电话
			 * @param {Object} phone 手机号
			 */
			callPhone(phone) {
				uni.makePhoneCall({
					phoneNumber: phone + '',
					success: () => {
						console.log("成功拨打电话")
					}
				})
			}
		}
	}
</script>

<style lang='scss'>
	@import '@/common/zywork-main.scss';

	page {
		background: $page-color-base;
	}

	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 20upx $page-row-spacing;
		line-height: 60upx;
		position: relative;
		background: #fff;
		justify-content: center;

		&.log-out-btn {
			margin-top: 40upx;

			.cell-tit {
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		&.m-t {
			margin-top: 16upx;
		}

		.cell-more {
			align-self: baseline;
			font-size: $font-lg;
			color: $font-color-light;
			margin-left: 10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: $font-base;
			color: $font-color-light;
		}

		.cell-input {
			font-size: $font-base;
			color: $font-color-light;
			width: 75%;
		}

		.cell-picker {
			font-size: $font-base;
			color: $font-color-light;
			width: 75%;
			padding-left: 30upx;
		}

		.zy-head-img {
			margin: 10upx auto;
			text-align: center;
			
			.zy-name-tit {
				font-size: $font-base + 10upx;
			}
			.zy-name-tip {
				font-size: $font-base;
				color: $font-color-light;
			}
		}

		.zy-head-img image {
			border-radius: 50%;
			width: 200upx;
			height: 200upx;
		}
	}
</style>

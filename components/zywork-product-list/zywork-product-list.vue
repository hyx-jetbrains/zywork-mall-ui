<template>
	<view>
		<!-- 空白页 -->
		<empty v-if="list.length === 0"></empty>
		<view v-else class="goods-list">
			<view v-for="(item, index) in list" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="localFileStorage ? frontBaseUrl + item.goodsPicPicUrl : item.goodsPicPicUrl" mode="aspectFill"></image>
				</view>
				<view class="zy-hot-section">
					<text class="zy-tag-hot" v-if="item.hotCount > 0">热</text>
					<text class="title clamp">{{item.goodsInfoTitle}}</text>
				</view>
				<view class="price-box">
					<view class="zy-hot-section">
						<text class="price">{{item.goodsAttributeValueAttrValue}}</text>
						<text class="zy-tag-activity" v-if="item.agentCount > 0 || item.grouponCount > 0 || item.promotionCount > 0 || item.seckillCount > 0">活动</text>
					</view>
					<text>已售 {{item.goodsInfoSaleCount}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import empty from "@/components/empty"
	import {FRONT_BASE_URL, LOCAL_FILE_STORAGE} from '@/common/util.js'
	export default {
		components: {
			empty
		},
		props: {
			list: { // 商品list
				type: [Array],
				default: [],
			}
		},
		data() {
			return {
				frontBaseUrl: FRONT_BASE_URL,
				localFileStorage: LOCAL_FILE_STORAGE
			};
		},
		onLoad() {
		},
		methods: {
			//详情
			navToDetailPage(item) {
				let goodsInfoId = item.goodsInfoId
				let goodsSkuId = item.goodsSkuId
				uni.navigateTo({
					url: `/pages/product/product?gi=${goodsInfoId}&si=${goodsSkuId}`
				})
			},
		},
	}
</script>

<style lang="scss">
	/* 商品列表 */
	.goods-list {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		padding-top: 10upx;
		background: #fff;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
	}
	
	.zy-hot-section {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
		
	.zy-tag-hot {
		color: #fa436a; 
		font-size: 22upx; 
		margin-right: 10upx;
	}
	
	.zy-tag-activity {
		color: #fa436a;
		font-size: 23upx;
		width: 70upx;
		line-height: 35upx;
		text-align: center;
		border: 1upx solid #fa436a;
		border-radius: 20upx;
		margin-left: 10upx;
	}
</style>

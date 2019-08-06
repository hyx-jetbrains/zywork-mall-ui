<template>
	<view>
		<my-issue key="1" ref="myIssue" @submit="submit" />
	</view>
</template>

<script>
	import myIssue from '@/components/my-issue/my-issue.vue'
	import {
		showInfoToast,
		doPostJson
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		components: {
			myIssue
		},
		data() {
			return {
				orderId: '',
				goodsList: [],
				urls: {
					batchSaveUrl: '/goods-comment/user/batch-save/',
				}
			};
		},
		onLoad(options) {
			this.orderId = options.orderId
			let goodsDataList = JSON.parse(options.goodsList)
			console.log(goodsDataList)
			goodsDataList.forEach(item => {
				this.goodsList.push({
					shopId: item.goodsShopId,
					goodsId: item.goodsOrderItemGoodsId,
					goodsSkuId: item.goodsOrderItemGoodsSkuId,
					userId: item.userId,
					skuTitle: item.goodsOrderItemSkuTitle,
					skuInfo: item.goodsOrderItemSkuInfo,
					quantity: item.goodsOrderItemQuantity,
					commentLevel: 0,
					commentRate: 5,
					comments: '',
					goodsPicPicUrl: item.goodsPicPicUrl,
					skuPicId: item.goodsPicId,
					price: item.goodsOrderPayAmount,
					imageList: []
				});
			})
			this.$refs.myIssue.goodsList = this.goodsList;
		},
		methods: {
			/**
			 * 提交评价
			 * @param {Object} formData
			 */
			submit(formData) {
				doPostJson(this.urls.batchSaveUrl + this.orderId, formData, {}, true).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						showInfoToast('评价成功');
						// 更新订单状态成功
						setTimeout(function() {
							uni.redirectTo({
								url: '/pages/status-page/comment-success'
							});
						}, 1000)
					} else {
						showInfoToast(res.data.message);
					}
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style lang='scss'>
</style>

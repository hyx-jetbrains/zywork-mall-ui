<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!hasUserInfo || empty===true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasUserInfo" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasUserInfo" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartList" :key="index">
					<view class="cart-item" :class="{'b-b': index!==cartList.length-1}">
						<view class="image-wrapper">
							<image :src="localFileStorage ? frontBaseUrl + item.goodsSkuPicUrl : item.goodsSkuPicUrl" :class="[item.loaded]"
							 mode="aspectFill" lazy-load @load="onImageLoad('cartList', index)" @error="onImageError('cartList', index)"></image>
						</view>
						<view class="item-right">
							<view @click="navToGoodsSku(item.goodsInfoId, item.goodsSkuId)">
								<text class="clamp title">{{item.title}}</text>
								<text class="attr">{{item.skuSpecStr}}</text>
								<view>
									<text class="price">¥{{item.salePrice}}</text>
								</view>
								
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		doPostJson,
		doGet,
		showInfoToast,
		REFRESH_CART,
		FRONT_BASE_URL,
		LOCAL_FILE_STORAGE,
		HAS_USER_INFO
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	import {
		LOGIN_PAGE
	} from '@/common/page-url.js'
	export default {
		components: {},
		data() {
			return {
				hasUserInfo: false,
				empty: true, //空白页现实  true|false
				cartList: [],
				total: 0, //总价格
				discount: 0,
				allChecked: false, //全选状态  true|false
				frontBaseUrl: FRONT_BASE_URL,
				localFileStorage: LOCAL_FILE_STORAGE
			}
		},
		onLoad() {
			if (uni.getStorageSync(HAS_USER_INFO)) {
				this.loadCollection()
			}
		},
		onShow() {
			if (uni.getStorageSync(HAS_USER_INFO)) {
				this.hasUserInfo = true
				if (uni.getStorageSync(REFRESH_CART)) {
					this.loadCollection()
					uni.setStorageSync(REFRESH_CART, false)
				}
			}
		},
		watch:{
			//显示空白页
			cartList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		computed: {
		
		},
		methods: {
			//请求收藏数据
			async loadCollection(){
				uni.showLoading({
					title: '加载商品...'
				})
				doPostJson('/goods-collection/user/pager-cond', {
					sortColumn: 'updateTime',
					sortOrder: 'desc'
				}, {}, true).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						let cartDataList = res.data.data.rows
						let skuIds = ''
						cartDataList.forEach((item, index) => {
							skuIds += item.goodsSkuId + ','
						})
						this.loadCollectionSku(skuIds, cartDataList)
					}
				}).catch(error => {
					console.log(error)
				})
			},
			// 根据购物车中的skuid去获取sku所有的属性信息
			loadCollectionSku(skuIds, cartDataList) {
				this.cartList = []
				doPostJson('/goods-sku-attr-val/any/goods-goods-sku-attr/' + skuIds, {}, {}).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						uni.hideLoading()
						let goodsList = res.data.data
						if (goodsList.length > 0) {
							let list = []
							goodsList.forEach((item, index) => {
								let goodsSku = item.goodsSkuVOList[0]
								let theSkuInfo = {}
								theSkuInfo.goodsInfoId = item.goodsInfoId
								theSkuInfo.goodsSkuId = goodsSku.goodsSkuId
								theSkuInfo.goodsSkuPicUrl = goodsSku.goodsPicPicUrl
								let skuSpecStr = ''
								goodsSku.goodsSkuAttrVOList.forEach((goodsSkuAttr, index) => {
									if (goodsSkuAttr.goodsAttributeAttrCode === 'title') {
										theSkuInfo.title = goodsSkuAttr.goodsAttributeValueAttrValue
									}
									if (goodsSkuAttr.goodsAttributeAttrCode === 'salePrice') {
										theSkuInfo.salePrice = goodsSkuAttr.goodsAttributeValueAttrValue
									}
									if (goodsSkuAttr.goodsAttributeAttrCode === 'storeCount') {
										theSkuInfo.storeCount = goodsSkuAttr.goodsAttributeValueAttrValue
									}
									if (goodsSkuAttr.goodsCategoryAttributeIsAttrGroup === 1) {
										skuSpecStr += goodsSkuAttr.goodsAttributeValueAttrValue + ' '
									}
								})
								theSkuInfo.skuSpecStr = skuSpecStr
								list.push(theSkuInfo)
							})
							let cartList = list.map(item=>{
								item.checked = true
								return item
							})
							this.cartList = cartList
							// 获取每个sku的购买数量
							this.cartList.forEach((cartItem, index) => {
								cartDataList.forEach((cartData, index) => {
									if (cartItem.goodsSkuId === cartData.goodsSkuId) {
										cartItem.id = cartData.id
										cartItem.quantity = cartData.quantity
									}
								})
							})
							this.calcTotal()
						}
						
					} 
				}).catch(error => {
					console.log(error)
				})
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			/**
			 * 前往登录页面
			 */
			navToLogin(){
				let url = LOGIN_PAGE
				// #ifdef H5
				url += '?fromUrl=/pages/cart/cart'
				// #endif
				uni.navigateTo({
					url: url
				})
			},
			navToGoodsSku(goodsId, goodsSkuId) {
				uni.navigateTo({
					url: `/pages/product/product?goodsInfoId=${goodsId}&goodsSkuId=${goodsSkuId}`
				})
			},
		}
	}
</script>

<style lang="scss">
	.container{
		padding-bottom: 134upx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100upx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240upx;
				height: 160upx;
				margin-bottom:30upx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:30upx 40upx;
		.image-wrapper{
			width: 230upx;
			height: 230upx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8upx;
			}
		}
		.checkbox{
			position:absolute;
			left:-16upx;
			top: -16upx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30upx;
			.title,.price{
				font-size:$font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
			}
			.attr{
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
			}
			.price{
				height: 50upx;
				line-height:50upx;
			}
			.number-box {
				position:absolute;
				bottom: 0;
			}
		}
		.del-btn{
			padding:4upx 10upx;
			font-size:34upx; 
			height: 50upx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100upx;
		/* #endif */
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690upx;
		height: 100upx;
		padding: 0 30upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		.checkbox{
			height:52upx;
			position:relative;
			image{
				width: 52upx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120upx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			flex-direction: column;
			text-align:right;
			padding-right: 40upx;
			.price{
				font-size: $font-lg;
				color: $font-color-dark;
			}
			.coupon{
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38upx;
			margin: 0;
			border-radius: 100px;
			height: 76upx;
			line-height: 76upx;
			font-size: $font-base + 2upx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
</style>

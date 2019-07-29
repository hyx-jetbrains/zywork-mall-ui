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
				<block v-for="(item, shopIndex) in shopSkuList" :key="shopIndex">
					<view :class="{'b-b': shopIndex!==shopSkuList.length-1}">
						<view class="shop-info">
							<view 
								class="iconfont iconxuanzhong shop-checkbox"
								:class="{checked: item.checked}"
								@click="check('shop', shopIndex)"
							></view>
							<image :src="localFileStorage ? frontBaseUrl + item.shopLogo : item.shopLogo" mode="aspectFill"></image>
							<view class="right">
								{{item.shopTitle}}
							</view>
						</view>
						<view class="cart-item" v-for="(sku, skuIndex) in item.skuList" :key="skuIndex">
							<view class="image-wrapper">
								<image :src="localFileStorage ? frontBaseUrl + sku.goodsSkuPicUrl : sku.goodsSkuPicUrl" 
									:class="[sku.loaded]"
									mode="aspectFill" 
									lazy-load 
									@load="onImageLoad(shopIndex, skuIndex)" 
									@error="onImageError(shopIndex, skuIndex)"
								></image>
								<view 
									class="iconfont iconxuanzhong checkbox"
									:class="{checked: sku.checked}"
									@click="check('item', shopIndex, skuIndex)"
								></view>
							</view>
							<view class="item-right">
								<view @click="navToGoodsSku(sku.goodsInfoId, sku.goodsSkuId)">
									<view class="clamp title">{{sku.title}}</view>
									<view class="attr">{{sku.skuSpecStr}}</view>
									<view class="price">¥{{sku.salePrice}}</view>
								</view>
								<!-- #ifdef MP || APP-PLUS -->
								<uni-number-box
									class="number-box"
									:min="1" 
									:max="sku.storeCount"
									:value="sku.quantity"
									:index="shopIndex"
									:index_="skuIndex"
									@eventChange="numberChange"
								></uni-number-box>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<uni-number-box
									class="number-box"
									:min="1" 
									:max="sku.storeCount"
									:value="sku.quantity"
									:index="shopIndex"
									:index_="skuIndex"
									:disabled="true"
									@eventChange="numberChange"
								></uni-number-box>
								<!-- #endif -->
							</view>
							<text class="del-btn iconfont iconguanbi" @click="deleteCartItem(sku.id, shopIndex, skuIndex)"></text>
						</view>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view>
				<view class="total-box">
					<text class="price">¥{{total}}</text>
					<text class="coupon">
						已优惠
						<text>{{discount}}</text>
						元
					</text>
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue'
	import {doPostJson, doGet, showInfoToast, REFRESH_CART, FRONT_BASE_URL, LOCAL_FILE_STORAGE} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	import {
		LOGIN_PAGE
	} from '@/common/page-url.js'
	import {
		navTo,
		HAS_USER_INFO
	} from '@/common/util.js'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				hasUserInfo: false,
				empty: true, //空白页现实  true|false
				shopSkuList: [],
				total: 0, //总价格
				discount: 0,
				allChecked: false, //全选状态  true|false
				frontBaseUrl: FRONT_BASE_URL,
				localFileStorage: LOCAL_FILE_STORAGE
			};
		},
		onLoad() {
			// #ifdef H5
			let openid = options.openid
			let token = options.token
			if (openid && token) {
				// 公众号授权登录成功返回的openid和token
				uni.setStorageSync(USER_OPENID, openid)
				uni.setStorageSync(USER_TOKEN_KEY, token)
				uni.setStorageSync(HAS_USER_INFO, true)
			}
			// #endif
			if (uni.getStorageSync(HAS_USER_INFO)) {
				this.loadCart()
			}
		},
		onShow() {
			if (uni.getStorageSync(HAS_USER_INFO)) {
				this.hasUserInfo = true
				if (uni.getStorageSync(REFRESH_CART)) {
					this.loadCart()
					uni.setStorageSync(REFRESH_CART, false)
				}
			}
		},
		watch:{
			//显示空白页
			shopSkuList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		methods: {
			//请求购物车数据
			async loadCart(){
				uni.showLoading({
					title: '加载购物车...'
				})
				doPostJson('/goods-cart/user/all-cond', {
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
						this.loadShopSkuList(skuIds, cartDataList)
					}
				}).catch(error => {
					console.log(error)
				})
			},
			// 根据购物车中的skuid去获取sku所有的属性信息
			loadShopSkuList(skuIds, cartDataList) {
				this.shopSkuList = []
				doPostJson('/goods-sku-attr-val/any/goods-goods-sku-attr/' + skuIds, {}, {}).then(response => {
					uni.hideLoading()
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						let goodsList = res.data.data
						if (goodsList.length > 0) {
							let list = []
							goodsList.forEach((item, index) => {
								list.push(this.getSkuInfo(item))
							})
							this.calSkuQuantity(list, cartDataList)
							this.filterSkuListByShop(list)
							this.checkAllSkus()
							this.calcTotal()
						}
					} 
				}).catch(error => {
					console.log(error)
				})
			},
			// 根据商品信息获取到商品的SKU列表
			getSkuInfo(goodsInfo) {
				let goodsSku = goodsInfo.goodsSkuVOList[0]
				let theSkuInfo = {}
				theSkuInfo.shopId = goodsInfo.goodsInfoShopId
				theSkuInfo.shopLogo = goodsInfo.goodsShopLogo
				theSkuInfo.shopTitle = goodsInfo.goodsShopTitle
				theSkuInfo.goodsInfoId = goodsInfo.goodsInfoId
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
				return theSkuInfo
			},
			// 获取每个sku的购买数量
			calSkuQuantity(shopSkuList, cartDataList) {
				shopSkuList.forEach((shopSkus, index) => {
					cartDataList.forEach((cartData, index) => {
						if (shopSkus.goodsSkuId === cartData.goodsSkuId) {
							shopSkus.id = cartData.id
							shopSkus.quantity = cartData.quantity
						}
					})
				})
			},
			// 对所有商品SKU列表进行过滤，把同一个店铺的商品SKU归类到同一个对象中
			filterSkuListByShop(goodsSkuList) {
				let shopIds = []
				goodsSkuList.forEach((item, index) => {
					if (shopIds.indexOf(item.shopId) < 0) {
						shopIds.push(item.shopId)
					}
				})
				shopIds.forEach((item, index) => {
					let shopSkus = {}
					shopSkus.skuList = []
					shopSkus.skuList = goodsSkuList.filter(goodsSku => goodsSku.shopId == item)
					shopSkus.shopId = shopSkus.skuList[0].shopId
					shopSkus.shopLogo = shopSkus.skuList[0].shopLogo
					shopSkus.shopTitle = shopSkus.skuList[0].shopTitle
					this.shopSkuList.push(shopSkus)
				})
			},
			checkAllSkus() {
				this.shopSkuList.forEach(shopSkus => {
					shopSkus.checked = true
					shopSkus.skuList.forEach(item => {
						item.checked = true
					})
				})
			},
			//监听image加载完成
			onImageLoad(shopIndex, skuIndex) {
				this.$set(this.shopSkuList[shopIndex].skuList[skuIndex], 'loaded', 'loaded')
			},
			//监听image加载失败
			onImageError(shopIndex, skuIndex) {
				console.log('bb')
				this.shopSkuList[shopIndex].skuList[skuIndex].image = '/static/errorImage.jpg'
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
			 //选中状态处理
			check(type, shopIndex, skuIndex){
				if(type === 'item'){
					this.shopSkuList[shopIndex].skuList[skuIndex].checked = !this.shopSkuList[shopIndex].skuList[skuIndex].checked
					let shopChecked = true
					for (let sku of this.shopSkuList[shopIndex].skuList) {
						if (!sku.checked) {
							shopChecked = false
							break
						}
					}
					this.shopSkuList[shopIndex].checked = shopChecked
				} else if (type === 'shop') {
					this.shopSkuList[shopIndex].checked = !this.shopSkuList[shopIndex].checked
					this.shopSkuList[shopIndex].skuList.forEach(item => {
						item.checked = this.shopSkuList[shopIndex].checked
					})
				} else{
					const checked = !this.allChecked
					const list = this.shopSkuList
					list.forEach(item=>{
						item.checked = checked
						item.skuList.forEach(sku => {
							sku.checked = checked
						})
					})
					this.allChecked = checked
				}
				this.calcTotal(type)
			},
			//数量
			numberChange(data){
				this.shopSkuList[data.index].skuList[data.index_].quantity = data.number;
				this.calcTotal();
			},
			navToGoodsSku(goodsId, goodsSkuId) {
				uni.navigateTo({
					url: `/pages/product/product?goodsInfoId=${goodsId}&goodsSkuId=${goodsSkuId}`
				})
			},
			//删除
			deleteCartItem(id, shopIndex, skuIndex){
				uni.showModal({
					content: '删除商品？',
					success: (e)=>{
						if(e.confirm){
							uni.showLoading({
								title: '删除中...'
							})
							doGet('/goods-cart/user/remove/' + id, {}, true).then(response => {
								let [error, res] = response
								if (res.data.code === ResponseStatus.OK) {
									this.shopSkuList[shopIndex].skuList.splice(skuIndex, 1);
									this.calcTotal();
									uni.hideLoading();
								}
							}).catch(error => {
								console.log(error)
							})
						}
					}
				})
			},
			//清空
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							uni.showLoading({
								title: '清空中...'
							})
							let ids = []
							this.shopSkuList.forEach((shopSku, index) => {
								shopSku.skuList.forEach(item => {
									ids.push(item.id)
								})
							})
							doPostJson('/goods-cart/user/batch-remove', ids, {}, true).then(response => {
								let [error, res] = response
								if (res.data.code === ResponseStatus.OK) {
									this.shopSkuList = []
									uni.hideLoading();
								}
							}).catch(error => {
								console.log(error)
							})
						}
					}
				})
			},
			//计算总价
			calcTotal(){
				let list = this.shopSkuList;
				if(list.length === 0){
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item=>{
					item.skuList.forEach(sku => {
						if(sku.checked === true){
							total += sku.salePrice * sku.quantity;
						}else if(checked === true){
							checked = false;
						}
					})
					
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			//创建订单
			createOrder(){
				let cartData = []
				this.shopSkuList.forEach(shopSkus => {
					shopSkus.skuList.forEach(item => {
						if(item.checked){
							cartData.push({
								cartId: item.id,
								goodsSkuId: item.goodsSkuId,
								quantity: item.quantity
							})
						}
					})
				})
				if (cartData.length === 0) {
					showInfoToast('请选择商品')
					return
				}
				uni.navigateTo({
					url: `/pages/order/createOrder?cartData=${JSON.stringify(cartData)}`
				})
			}
		}
	}
</script>

<style lang='scss'>
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
	
	.shop-info {
		display: flex;
		flex-direction: row;
		align-items: center;
		background: #fff;
		margin-top: 16upx;
		padding: 12upx 30upx;
		
		.shop-checkbox{
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		
		.shop-checkbox.checked{
			color: $uni-color-primary;
		}
		
		image {
			width: 80upx;
			height: 80upx;
			border-radius: 80upx;
			margin-left: 20upx;
		}
		
		.right {
			color: $font-color-dark;
			font-size: $font-base;
			font-weight: bold;
			padding-left: 26upx;
		}
	}
</style>

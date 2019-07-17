<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in goodsPics" :key="index">
					<view class="image-wrapper">
						<image :src="item.goodsPicPicUrl" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="introduce-section">
			<text class="title">{{selectSku.title}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{selectSku.salePrice}}</text>
				<text class="m-price">¥{{selectSku.price}}</text>
				<text class="coupon-tip">{{(selectSku.salePrice / selectSku.price * 10).toFixed(1)}}折</text>
			</view>
			<view class="bot-row">
				<text>销量: {{goodsInfo.goodsInfoSaleCount}}</text>
				<text>库存: {{selectSku.storeCount}}</text>
				<text>浏览量: {{goodsInfo.goodsInfoClickCount}}</text>
			</view>
		</view>
		
		<!--  分享 -->
		<view class="share-section" @click="share">
			<view class="share-des">
				<view class="share-icon">
					<text class="iconfont iconxingxing"></text>
					<text style="color: #fff;">返</text>
				</view>
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="iconfont iconbangzhu" style="font-size: 24upx;"></text>
			<view class="share-btn">
				立即分享
				<text class="iconfont icon-you"></text>
			</view>
			
		</view>
		
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
						{{sItem.name}}
					</text>
				</view>
				<text class="iconfont iconxiangyou icon-more"></text>
			</view>
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买数量</text>
				<view class="con">
					<text class="selected-text">{{selectSkuQuantity}}</text>
				</view>
				<text class="iconfont iconxiangyou icon-more"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="iconfont iconxiangyou icon-more"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text>新人首单送20元无门槛代金券</text>
					<text>订单满50减10</text>
					<text>订单满100减30</text>
					<text>单笔购买满两件免邮费</text>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view>
		</view>
		
		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header" @click="toEvaluatePage">
				<text class="tit">评价</text>
				<text>(86)</text>
				<text class="tip">好评率 100%</text>
				<text class="iconfont iconxiangyou icon-more"></text>
			</view> 
			<view class="eva-box">
				<image class="portrait" src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg" mode="aspectFill"></image>
				<view class="right">
					<text class="name">Leo yo</text>
					<text class="con">商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text>
					<view class="bot">
						<text class="attr">购买类型：XL 红色</text>
						<text class="time">2019-04-01 19:21</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text :nodes="goodsInfo.goodsInfoIntro" style="font-size: 28upx;"></rich-text>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="iconfont iconshouye"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="iconfont icongouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="iconfont iconshoucang"></text>
				<text>收藏</text>
			</view>
			
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="addCart">加入购物车</button>
			</view>
		</view>
		
		
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="selectSku.picUrl" mode="aspectFill"></image>
					<view class="right">
						<text class="price">¥{{selectSku.salePrice}}</text>
						<text class="stock">库存：{{selectSku.storeCount}}</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.name}}
							</text>
						</view>
						<view class="selected">
							数量：
							<text class="selected-text">{{selectSkuQuantity}}</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in specList" :key="index" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text 
							v-for="(childItem, childIndex) in specChildList" 
							v-if="childItem.pid === item.id"
							:key="childIndex" class="text tit"
							:class="[{selected: childItem.selected, 'enable-text': !childItem.disable, 'disable-text': childItem.disable}]"
							@click="selectSpec(childIndex, childItem.pid)"
						>
							{{childItem.name}}
						</text>
					</view>
				</view>
				<view class="attr-list quantity">
					<text>数量</text>
					<!-- #ifdef MP || APP-PLUS -->
					<uni-number-box 
						:min="1" 
						:max="parseInt(selectSku.storeCount)"
						:value="selectSkuQuantity"
						@eventChange="changeQuantity"
					></uni-number-box>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<uni-number-box 
						:min="1" 
						:max="parseInt(selectSku.storeCount)"
						:value="selectSkuQuantity"
						:disabled="true"
						@eventChange="changeQuantity"
					></uni-number-box>
					<!-- #endif -->
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:contentHeight="580"
			:shareList="shareList"
		></share>
	</view>
</template>

<script>
	import share from '@/components/share'
	import uniNumberBox from '@/components/uni-number-box.vue'
	import {doPostJson, showInfoToast} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	import {
		EVALUATE_PAGE
	} from '@/common/page-url.js'
 	export default{
		components: {
			share,
			uniNumberBox
		},
		data() {
			return {
				goodsInfo: {},
				goodsPics: [],
				categorySpec: [], // 商品的组合属性（规格属性），按属性正序排列
				// 选择的sku
				selectSku: {
					skuId: null,
					title: null,
					picUrl: null,
					price: null,
					salePrice: null,
					storeCount: null
				},
				selectSkuQuantity: 1,
				specClass: 'none',
				specSelected:[], // 选择的sku规格值
				specSelectedStr: '', // 选择的sku规格组成的字符串，如7#黄色-9#S
				specList: [], // id, name，用于存储可选规格的名称
				specChildList: [], // id, pid, name，disable用于存储可选规格的值
				skuSpecs: {}, // {"1":"7#黄色-9#S-","2":"7#白色-9#M-"}用于存储所有SKU的可选规格的字符串，key为sku的id, 并判断用户选择的规格是否有对应的SKU
				favorite: true,
				shareList: [],
			}
		},
		async onLoad(options){
			let goodsInfoId = options.goodsInfoId
			if (options.goodsSkuId) {
				this.selectSku.skuId = options.goodsSkuId
			}
			this.loadGoodsPic(goodsInfoId)
			this.loadGoodsInfoById(goodsInfoId)
			this.shareList = await this.$api.json('shareList');
		},
		methods:{
			// 加载商品的所有图片
			loadGoodsPic(goodsInfoId) {
				doPostJson('/goods-pic/any/all-cond', {
					goodsId: goodsInfoId,
					sortColumn: 'picOrder',
					sortOrder: 'asc'
				}, {}).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						this.goodsPics = res.data.data.rows
					} 
				}).catch(error => {
					console.log(error)
				})
			},
			// 加载商品的详细信息，包括所有 SKU 的所有属性值 
			loadGoodsInfoById(goodsInfoId) {
				doPostJson('/goods-sku-attr-val/any/goods-goods-sku-attr', {
					"goodsInfoId": goodsInfoId,
					"sortColumn": "goodsSkuId",
					"sortOrder":"asc"
				}, {}).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						this.goodsInfo = res.data.data
						if (this.goodsInfo.goodsSkuVOList && this.goodsInfo.goodsSkuVOList.length > 0) {
							// 设置被选中的sku信息
							this.setSelectSku()
						}
						// 加载商品类目指定的组合属性（规格属性），按属性正序排列
						this.loadCategoryAttrGroup()
					} else {
						showInfoToast('没有商品信息')
					}
				}).catch(error => {
					console.log(error)
				})
			},
			// 设置被选中的SKU信息
			setSelectSku() {
				if (this.selectSku.skuId == null) {
					// 如果不是由某个具体的SKU进来的，则显示商品的第一个SKU信息
					let skuInfo = this.goodsInfo.goodsSkuVOList[0]
					this.setSkuInfo(skuInfo)
				} else {
					// 否则显示指定的SKU的信息
					for (let skuInfo of this.goodsInfo.goodsSkuVOList) {
						if (skuInfo.goodsSkuId === this.selectSku.skuId) {
							this.setSkuInfo(skuInfo)
							break
						}
					}
				}
			},
			// 从SKU中获取selectSku需要的信息并赋值给selectSku
			setSkuInfo(skuInfo) {
				this.selectSku.skuId = skuInfo.goodsSkuId
				this.selectSku.picUrl = skuInfo.goodsPicPicUrl
				skuInfo.goodsSkuAttrVOList.forEach((skuAttr, index) => {
					if (skuAttr.goodsAttributeAttrCode == 'title') {
						this.selectSku.title = skuAttr.goodsAttributeValueAttrValue
					} else if (skuAttr.goodsAttributeAttrCode == 'price') {
						this.selectSku.price = skuAttr.goodsAttributeValueAttrValue
					} else if (skuAttr.goodsAttributeAttrCode == 'salePrice') {
						this.selectSku.salePrice = skuAttr.goodsAttributeValueAttrValue
					} else if (skuAttr.goodsAttributeAttrCode == 'storeCount') {
						this.selectSku.storeCount = skuAttr.goodsAttributeValueAttrValue
					}
				})
			},
			// 获取类目的组合属性（规格属性）
			loadCategoryAttrGroup() {
				doPostJson('/goods-category-attr/any/all-cond', {
					goodsCategoryId: this.goodsInfo.goodsInfoCategoryId,
					goodsCategoryAttributeIsAttrGroup: 1,
					sortColumn: 'goodsCategoryAttributeAttrOrder',
					sortOrder: 'asc'
				}, {}).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						this.categorySpec = res.data.data.rows
						this.getSkuSpec()
					}
				}).catch(error => {
					console.log(error)
				})
			},
			// 获取sku的所有规格，包括规格名称和规格的值；并且记录所有sku对应的规格字符串，字符串格式参考data部分说明
			getSkuSpec() {
				let idIndex = 1
				let attrValueArray = []
				this.categorySpec.forEach((item, index) => {
					let attrId = item.goodsAttributeId
					// 设置规格名称
					this.specList.push({
						id: attrId,
						name: item.goodsAttributeAttrName
					})
					let attrCode = item.goodsAttributeAttrCode
					// 按照SKU的顺序去获取所有可选的规格值
					this.goodsInfo.goodsSkuVOList.forEach((skuItem, index) => {
						let skuAttrList = skuItem.goodsSkuAttrVOList
						for (let skuAttr of skuAttrList) {
							// 如果sku属性的代码与规格属性代码一致
							if (skuAttr.goodsAttributeAttrCode === attrCode) {
								let attrValue = skuAttr.goodsAttributeValueAttrValue
								this.skuSpecs[skuItem.goodsSkuId] = this.skuSpecs[skuItem.goodsSkuId] === undefined ? 
								attrId + '#' + attrValue + '-' 
								: this.skuSpecs[skuItem.goodsSkuId] + attrId + '#' + attrValue + '-'
								if (attrValueArray.indexOf(attrValue) < 0) {
									attrValueArray.push(attrValue)
									this.specChildList.push({
										id: idIndex,
										pid: attrId,
										name: attrValue
									})
									idIndex++
								}
								break
							}
						}
					})
				})
				// 设置选中的SKU的规格
				this.setSelectSkuSpec()
			},
			// 设置选中的sku的规格
			setSelectSkuSpec() {
				this.specList.forEach(item=>{
					// specChildList中，每个规格属性的第一个规格值就是第一个SKU的规格 
					for(let cItem of this.specChildList){
						if(cItem.pid === item.id){
							this.$set(cItem, 'selected', true)
							this.specSelected.push(cItem)
							this.specSelectedStr += cItem.pid + '#' + cItem.name + '-'
							break
						}
					}
				})
			},
			//选择规格
			selectSpec(index, pid){
				// 标记选中的规格是否有对应的sku
				let hasSku = false
				// 清除已选中规格的字符串
				this.specSelectedStr = ''
				let list = this.specChildList
				if (list[index].disable) {
					// 如果选择的规格是不可用的，则直接返回
					console.log(list[index].disable)
					return
				}
				this.selectSkuQuantity = 1
				// 把同一个规格名称的所有规格值设置为未选中状态
				list.forEach(item=>{
					if(item.pid === pid){
						this.$set(item, 'selected', false)
					}
				})
				// 把当前选中的规格设置为选中状态
				this.$set(list[index], 'selected', true)
				// 选中的规格清除
				this.specSelected = []
				// 把所有选中状态的规格放入到specSelected中，并组装选中规格的字符串值，字符串格式参考data部分说明
				list.forEach(item=>{ 
					if(item.selected === true){ 
						this.specSelectedStr += item.pid + '#' + item.name + '-'
						this.specSelected.push(item)
					} 
				})
				// 对已经选择的规格进行判断，看是否有对应的skuid与之对应，如果没有，则specSelected中只保留最后一个选择的规格值
				for (let key in this.skuSpecs) {
					if (this.skuSpecs[key] === this.specSelectedStr) {
						// 选择的规格有对应的sku，则把key赋值给selectSku
						this.selectSku.skuId = parseInt(key)
						// 重新设置sku的基本信息
						this.setSelectSku()
						hasSku = true
						break;
					}
				}
				if (!hasSku) {
					// 如果没有对应的规格，则specSelected中只保留最后一个选择的规格值
					this.specSelected = this.specSelected.filter(item => item.id === list[index].id)
				}
				// 去计算规格是否可以进行相互组合，对于不能相互组合的规格，会禁用掉，以不能点击选择
				this.specMatch(list[index], hasSku)
			},
			specMatch(specItem, hasSku) {
				// 用户选择的规格的pid
				let specPid = specItem.pid
				// 用户选择的规格值
				let specValue = specItem.name
				// 把所有规格都设置成禁用状态
				this.specChildList.forEach((item, index) => {
					item.disable = true
				})
				// 对记录的SKU的规格信息进行循环，"7#黄色-9#S-", 3: "7#红色-9#M-", 4: "7#白色-9#S-"
				for (let key in this.skuSpecs) {
					// sku对应的规格字符串
					let skuSpecValue = this.skuSpecs[key]
					// 如果sku对应的规格字符串包含有用户点选的规格值
					if (skuSpecValue.indexOf(specValue) >= 0) {
						// 对sku对应的规格字符串按 - 切分，得到所有规格值的父编号和规格的值，如7#黄色，9#S
						let skuSpecValArray = skuSpecValue.split('-')
						skuSpecValArray.forEach((skuSpecVal, index) => {
							// 分别获取SKU规格值的父id和规格具体值
							let thePid = skuSpecVal.split('#')[0]
							let theVal = skuSpecVal.split('#')[1]
							if (theVal) {
								this.specChildList.forEach((item, index) => {
									// 如果规格值的父id与选择的规格值的父id一致，则这类规格值可选择，规格值disable为false
									if (item.pid === specPid) {
										item.disable = false
									}
									// 如果规格值的父id与选择的规格值的父id不一致，
									// 且规格值的父id与SKU的规格值的父id一致，
									// 且规格值与记录的规格值一致，表明sku拥有此规格值，规格值是可选择的，规格值disable设置为false
									if (item.pid != specPid && item.pid == thePid && item.name == theVal) {
										item.disable = false
									}
									// 如果规格值的父id与选择的规格值的父id不一致，
									// 且规格值的父id与SKU的规格值的父id一致，
									// 且规格值与记录的规格值不一样，表明sku不拥有此规格值，规格值是不可选择的，规格值disable保持为true
									// 但是此时由于规格值可能是被选中状态的，所以当选择新规格值时，没有对应的新的sku，则需要把原先不属于sku的选中状态的规格值设置为未选中状态
									if (item.pid !== specPid && item.pid == thePid && item.name != theVal && !hasSku) {
										if (item.selected) {
											item.selected = false
										}
									}
								})
							}
						})
					}
				}
			},
			changeQuantity(data) {
				this.selectSkuQuantity = data.number
			},
			//规格弹窗开关
			toggleSpec() {
				if (this.specSelected.length !== this.categorySpec.length) {
					showInfoToast('请选择商品规格')
					return
				}
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			addCart() {
				if (this.selectSku.skuId === null) {
					showInfoToast('请选择商品规格')
					return
				}
				doPostJson('/goods-cart/user/save', {
					goodsId: this.goodsInfo.goodsInfoId,
					goodsSkuId: this.selectSku.skuId,
					quantity: this.selectSkuQuantity
				}, {}, true).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						showInfoToast('已加入购物车')
					} else if (res.data.code === ResponseStatus.AUTHENTICATION_TOKEN_ERROR) {
						showInfoToast('您好像还未登录哦')
					} else {
						showInfoToast('请稍候再加入购物车')
					}
				}).catch(error => {
					console.log(error)
				})
			},
			buy(){
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			},
			//分享
			share(){
				this.$refs.share.toggleMask();	
			},
			//收藏
			toFavorite(){
				this.favorite = !this.favorite;
			},
			stopPrevent(){},
			/**
			 * 前往商品评论页面
			 */
			toEvaluatePage() {
				uni.navigateTo({
					url: EVALUATE_PAGE
				})
			}
		},

	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel {
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20upx 30upx;
		
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2upx;
		}
		.m-price{
			margin:0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-des {
			width: 70upx;
			height: 30upx;
			border-radius: 4upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: $uni-color-primary;
			color: #fff;
			font-size: 22upx;
			.share-icon{
				display: flex;
				flex-direction: row;
				align-items: center;
				.iconxingxing {
					font-size: 24upx;
					margin-right: 10upx;
				}
			}
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}
	
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10upx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20upx 0;
		.portrait{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10upx 30upx;
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.quantity {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			.text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
				border: 1upx solid $uni-color-primary;
			}
			.enable-text {
				color: $font-color-dark;
			}
			.disable-text {
				color: #ccc;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30upx;
		bottom:30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
		border-radius: 16upx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.iconfont{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .iconfont{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
	.icon-more {
		font-size: 26upx;
		color: #909399;
	}
	
</style>

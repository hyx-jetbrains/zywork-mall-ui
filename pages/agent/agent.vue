<template>
	<view class="content">
		
		<view class="navbar" :style="{position:headerPosition,top:headerTop}" v-if="distributionFlag">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				综合排序
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				销量优先
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 'asc' && filterIndex === 2}" class="iconfont iconfangxiang-xiangshang"></text>
					<text :class="{active: priceOrder === 'desc' && filterIndex === 2}" class="iconfont iconfangxiang-xiangxia"></text>
				</view>
			</view>
			<text class="search-item iconfont iconfenleichazhao" @click="toggleSearchMask('show')"></text>
		</view>
		
		<!-- 商品列表 -->
		<zywork-product-list :list="goodsList" style="" v-if="distributionFlag"></zywork-product-list>

		<uni-load-more :status="loadingType"></uni-load-more>

		<view class="search-mask" :class="searchMaskState===0 ? 'none' : searchMaskState===1 ? 'show' : ''" @click="toggleSearchMask"
		 @touchmove.stop.prevent="stopPrevent">
			<view class="search-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="search-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two">{{item.title}}</view>
						<view class="b-b three">
							<view v-for="tItem in item.child" :key="tItem.id" class="cate-item" :class="{active: tItem.id == cateId}" @click="changeCate(tItem)">
								{{tItem.title}}
							</view>
						</view>
					</view>
					<view>
						<text class="cate-item b-b two">价格区间（元）</text>
						<view class="price-input">
							<input class="price" v-model="salePriceMin" type="number" placeholder="最低价" placeholder-class="placeholder" />
							<text style="color: #ccc;">—</text>
							<input class="price" v-model="salePriceMax" type="number" placeholder="最高价" placeholder-class="placeholder" />
						</view>
					</view>
					<view class="action-btn-group">
						<button type="primary" class=" action-btn no-border buy-now-btn" @click="cancelSearch">重置</button>
						<button type="primary" class=" action-btn no-border add-cart-btn" @click="doSearch">确定</button>
					</view>
				</scroll-view>

			</view>
		</view>
	</view>
</template>

<script>
	import zyworkIcon from '@/components/zywork-icon/zywork-icon.vue'
	import zyworkProductList from '@/components/zywork-product-list/zywork-product-list.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'

	import {
		doPostForm,
		doPostJson,
		doGet,
		showInfoToast
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'

	export default {
		components: {
			zyworkIcon,
			uniLoadMore,
			zyworkProductList
		},
		data() {
			return {
				searchMaskState: 0, //分类面板展开状态
				canPullDownRefresh: true,
				onPullDownRefresh: false,
				showLoading: false,
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0, // 0 综合排序，1 按销量排序 2 按价格排序
				firstLevelCateId: 0, //一级分类id
				cateId: 0, //已选三级分类id
				priceOrder: 'normal',
				cateList: [],
				goodsList: [],
				isHot: 0,
				pager: {
					pageNo: 0,
					pageSize: 10
				},
				salePriceMin: null,
				salePriceMax: null,
				distributionFlag: false
			};
		},

		onLoad(options) {
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
			if (this.headerTop === '0px') {
				this.headerTop = '44px'
			}
			// #endif
			if (options.tid) {
				this.cateId = options.tid
			}
			if (options.isHot) {
				this.isHot = options.isHot
			}
			if (options.fid) {
				this.firstLevelCateId = options.fid
			}
			
			this.loadDistributionConfig()
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			if (this.canPullDownRefresh && this.distributionFlag) {
				this.onPullDownRefresh = true
				this.loadGoods('refresh')
			}
		},
		//加载更多
		onReachBottom() {
			if (this.distributionFlag) {
				this.loadGoods();
			}
		},
		methods: {
			/**
			 * 加载分销配置
			 */
			loadDistributionConfig(){
				doGet('/sys-config/any/distribution-config', {}).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						let distributionConfig = res.data.data.distributionAgentSwitch;
						this.distributionFlag = distributionConfig;
						if (distributionConfig) {
							// 设置开启，加载商品之类的东西
							this.loadGoods()
						}
					} else {
						showInfoToast(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			/**
			 * 加载代理商商品
			 * @param {Object} type
			 */
			loadAgentGoods(type) {
				let params = {
					pageNo: this.pager.pageNo,
					pageSize: this.pager.pageSize,
					goodsInfoIsActive: 0,
					goodsAttributeAttrCode: "salePrice"
				}
				this.changeQuery(params)
				doPostJson('/goods-sku-attr-val/any/agent-goods-sku-attr', params, {}).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						this.loadingType = this.pager.pageNo * this.pager.pageSize >= res.data.data.total ? 'nomore' : 'more'
						if (type === 'refresh') {
							this.goodsList = res.data.data.rows
						} else {
							this.goodsList = this.goodsList.concat(res.data.data.rows)
						}
						if (this.onPullDownRefresh) {
							uni.stopPullDownRefresh()
						}
						if (this.showLoading) {
							this.showLoading = false
							uni.hideLoading()
						}
					}
				}).catch(error => {
					console.log(error)
				})
			},
			loadGoods(type = 'add') {
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return
					}
					this.loadingType = 'loading'
					this.pager.pageNo = this.pager.pageNo + 1
				} else {
					this.loadingType = 'more'
				}
				if (type === 'refresh') {
					this.pager.pageNo = 1
				}
				// 加载代理商商品
				this.loadAgentGoods(type)
			},
			
			changeQuery(params) {
				if (this.filterIndex === 1) {
					params.sortColumn = 'saleQuantity'
					params.sortOrder = 'desc'
				}
				if (this.filterIndex === 2) {
					params.sortColumn = 'salePrice'
					params.sortOrder = this.priceOrder
				}
				params.salePriceMin = this.salePriceMin
				params.salePriceMax = this.salePriceMax
			},
			//筛选点击
			tabClick(index) {
				if (this.filterIndex === index && index !== 2) {
					return
				}
				this.filterIndex = index
				if (index === 2) {
					this.priceOrder = this.priceOrder === 'asc' ? 'desc' : 'asc'
				} else {
					this.priceOrder = 'normal'
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				uni.showLoading({
					title: '正在加载'
				})
				this.showLoading = true
				this.loadGoods('refresh')
			},
			//显示搜索面板
			toggleSearchMask(type) {
				this.canPullDownRefresh = !this.canPullDownRefresh
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.searchMaskState = 2;
				setTimeout(() => {
					this.searchMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item) {
				this.cateId = item.id
				/**
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
				*/
			},
			doSearch() {
				if (this.checkPrice()) {
					this.toggleSearchMask()
					uni.showLoading({
						title: '正在加载'
					})
					this.showLoading = true
					this.loadGoods('refresh')
				}
			},
			checkPrice() {
				this.salePriceMin = parseInt(this.salePriceMin);
				this.salePriceMax = parseInt(this.salePriceMax);
				if (this.salePriceMin && !this.salePriceMax && this.salePriceMin <= 0) {
					showInfoToast('最低价必须大于0')
					return false
				}
				if (this.salePriceMax && !this.salePriceMin && this.salePriceMax <= 0) {
					showInfoToast('最高价必须大于0')
					return false
				}
				if (this.salePriceMax && this.salePriceMin && (this.salePriceMin <= 0 || this.salePriceMax <= 0)) {
					showInfoToast('价格必须大于0')
					return false
				}
				if (this.salePriceMax && this.salePriceMin && this.salePriceMin >= this.salePriceMax) {
					showInfoToast('最低价需小于最高价')
					return false
				}
				return true
			},
			cancelSearch() {
				this.salePriceMin = null
				this.salePriceMax = null
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	
	page,
	.content {
		background: $page-color-base;
	}

	.content {
		padding-top: 96upx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.iconfont{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-top: 10upx;
				margin-left: 6upx;
				font-size: 22upx;
				color: #888;
				&.active{
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.search-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 筛选 */
	.search-mask {
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: .3s;

		.search-content {
			width: 75%;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.search-content {
				transform: translateX(0);
			}
		}
	}

	.search-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			font-weight: bold;
			background: #f8f8f8;
		}

		.three {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			margin-right: 20upx;
		}

		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.active {
			color: $base-color;
		}
	}

	.price-input {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		margin-top: 20upx;
		padding-left: 30upx;

		.price {
			border: none;
			border-radius: 80upx;
			height: 60upx;
			width: 200upx;
			background-color: #f8f8f8;
			font-size: 28upx;
			text-align: center;
		}
	}

	.action-btn-group {
		display: flex;
		height: 76upx;
		border-radius: 100px;
		overflow: hidden;
		box-shadow: 0 20upx 40upx -16upx #fa436a;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
		background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
		margin-left: 20upx;
		position: fixed;
		right: 20upx;
		bottom: 20upx;

		&:after {
			content: '';
			position: absolute;
			top: 50%;
			right: 50%;
			transform: translateY(-50%);
			height: 28upx;
			width: 0;
			border-right: 1px solid rgba(255, 255, 255, .5);
		}

		.action-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 180upx;
			height: 100%;
			font-size: $font-base;
			padding: 0;
			border-radius: 0;
			background: transparent;
		}
	}

	.btn-group {
		position: fixed;
		bottom: 20upx;
		right: 20upx;
	}
</style>

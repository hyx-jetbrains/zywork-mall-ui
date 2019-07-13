<template>
	<view class="content">
		<view class="navbar" :style="{position:headerPosition,top:headerTop}">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				综合排序
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				销量优先
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="search-item yticon icon-fenlei1" @click="toggleSearchMask('show')"></text>
		</view>
		<!-- 商品列表 -->
		<zywork-product-list :list="goodsList"></zywork-product-list>
		
		<uni-load-more :status="loadingType"></uni-load-more>
		
		<view class="search-mask" :class="searchMaskState===0 ? 'none' : searchMaskState===1 ? 'show' : ''" @click="toggleSearchMask" @touchmove.stop.prevent="stopPrevent">
			<view class="search-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="search-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two">{{item.title}}</view>
						<view class="b-b three">
							<view 
								v-for="tItem in item.child" :key="tItem.id" 
								class="cate-item" 
								:class="{active: tItem.id == cateId}"
								@click="changeCate(tItem)">
								{{tItem.title}}
							</view>
						</view>
					</view>
					<view>
						<text class="cate-item b-b two">价格区间（元）</text>
						<view class="price-input">
							<input class="price" type="text" placeholder="最低价" placeholder-class="placeholder" />
							<text style="color: #ccc;">—</text>
							<input class="price" type="text" placeholder="最高价" placeholder-class="placeholder" />
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
	import zyworkProductList from '@/components/zywork-product-list/zywork-product-list.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
	
	import {BASE_URL, doPostForm} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	
 	export default {
		components: {
			uniLoadMore,
			zyworkProductList
		},
		data() {
			return {
				searchMaskState: 0, //分类面板展开状态
				onPullDownRefresh: true,
				headerPosition:"fixed",
				headerTop:"0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0, 
				cateId: 0, //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				isHot: 0
			};
		},
		
		onLoad(options){
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
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
			this.loadCateList(options.fid)
			this.loadData()
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			if (this.onPullDownRefresh) {
				this.loadData('refresh')
			}
		},
		//加载更多
		onReachBottom(){
			this.loadData();
		},
		methods: {
			//加载分类，前提条件是有一级分类
			async loadCateList(fid){
				if (fid) {
					doPostForm(BASE_URL + '/goods-category/any/by-first-level-category', {
						categoryId: fid
					}, {}).then(response => {
						let [error, res] = response
						if (res.data.code === ResponseStatus.OK) {
							let list = res.data.data.rows
							let cateList = list.filter(item => item.parentId == fid)
							cateList.forEach(item=>{
								let tempList = list.filter(val => val.parentId == item.id)
								item.child = tempList
							})
							this.cateList = cateList
						}
					}).catch(error => {
						console.log(error)
					})
				}
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type='add', loading) {
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				
				let goodsList = await this.$api.json('goodsList');
				if(type === 'refresh'){
					this.goodsList = [];
				}
				//筛选，测试数据直接前端筛选了
				if(this.filterIndex === 1){
					goodsList.sort((a,b)=>b.sales - a.sales)
				}
				if(this.filterIndex === 2){
					goodsList.sort((a,b)=>{
						if(this.priceOrder == 1){
							return a.price - b.price;
						}
						return b.price - a.price;
					})
				}
				
				this.goodsList = this.goodsList.concat(goodsList);
				
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				this.loadingType  = this.goodsList.length > 20 ? 'nomore' : 'more';
				if(type === 'refresh'){
					if(loading == 1){
						uni.hideLoading()
					}else{
						uni.stopPullDownRefresh();
					}
				}
			},
			//筛选点击
			tabClick(index){
				if(this.filterIndex === index && index !== 2){
					return;
				}
				this.filterIndex = index;
				if(index === 2){
					this.priceOrder = this.priceOrder === 1 ? 2: 1;
				}else{
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//显示搜索面板
			toggleSearchMask(type){
				this.onPullDownRefresh = !this.onPullDownRefresh
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.searchMaskState = 2;
				setTimeout(()=>{
					this.searchMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item){
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
				this.toggleSearchMask()
			},
			cancelSearch() {
				
			},
			stopPrevent(){}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
	}
	.content{
		padding-top: 96upx;
	}

	.navbar{
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0,0,0,.06);
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
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
		.p-box{
			display: flex;
			flex-direction: column;
			.yticon{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;
				&.active{
					color: $base-color;
				}
			}
			.xia{
				transform: scaleY(-1);
			}
		}
		.search-item{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;
			&:after{
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
	.search-mask{
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 95;
		transition: .3s;
		
		.search-content{
			width: 75%;
			height: 100%;
			background: #fff;
			float:right;
			transform: translateX(100%);
			transition: .3s;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.search-content{
				transform: translateX(0);
			}
		}
	}
	.search-list{
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
		.cate-item{
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}
		.active{
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
	
	.action-btn-group{
		display: flex;
		height: 76upx;
		border-radius: 100px;
		overflow: hidden;
		box-shadow: 0 20upx 40upx -16upx #fa436a;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
		background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
		margin-left: 20upx;
		position:fixed;
		right: 20upx;
		bottom: 20upx;
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
	
	.btn-group {
		position: fixed;
		bottom: 20upx;
		right: 20upx;
	}
</style>

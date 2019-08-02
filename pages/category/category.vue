<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)">
				{{item.title}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside">
			<view v-for="item in slist" :key="item.id" class="s-list" :id="'main-'+item.id">
				<text class="s-item">{{item.title}}</text>
				<view class="t-list">
					<view @click="navToProductList(item.id, titem.id, titem.title)" v-if="titem.parentId === item.id" class="t-item" v-for="titem in tlist" :key="titem.id">
						<image :src="localFileStorage ? frontBaseUrl + titem.picUrl : titem.picUrl"></image>
						<text>{{titem.title}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		doPostJson, 
		doPostForm, 
		showInfoToast,
		MY_SHARE_CODE,
		SHARE_CODE_PAGE_IMG,
		SHARE_TITLE,
		FRONT_BASE_URL,
		LOCAL_FILE_STORAGE
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 0,
				flist: [],
				slist: [],
				tlist: [],
				frontBaseUrl: FRONT_BASE_URL,
				localFileStorage: LOCAL_FILE_STORAGE
			}
		},
		onLoad(){
			this.loadCategory('init');
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadCategory('pullDown');
		},
		// #ifdef MP-WEIXIN
		onShareAppMessage(res) {
			var shareCode = uni.getStorageSync(MY_SHARE_CODE);
			return  {
				title: SHARE_TITLE,
				path: '/pages/index/index?shareCode=' + shareCode,
				imageUrl: SHARE_CODE_PAGE_IMG
			}
		},
		// #endif
		methods: {
			loadCategory(type){
				uni.showLoading({
					title: '加载中...'
				})
				doPostJson('/goods-category/any/all-cond', {
					sortColumn: 'categoryOrder',
					sortOrder: 'asc',
					parentId: 0
				}, {}).then(response => {
					uni.hideLoading()
					if (type === 'pullDown') {
						uni.stopPullDownRefresh()
					}
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						if (res.data.data.rows.length > 0) {
							if (type !== 'pullDown') {
								this.currentId = res.data.data.rows[0].id
							}
							this.flist = res.data.data.rows
							this.loadCategoryByFirstLevel(false)
						} else {
							showInfoToast('暂无商品分类')
						}
					} else {
						showInfoToast('暂时无法获取商品分类，请稍候再试')
					}
				}).catch(error => {
					console.log(error)
				})
			},
			loadCategoryByFirstLevel(showLoading) {
				if (showLoading) {
					uni.showLoading({
						title: '加载中...'
					})
				}
				doPostForm('/goods-category/any/by-first-level-category', {
					categoryId: this.currentId,
					sortColumn: 'categoryOrder',
					sortOrder: 'asc'
				}, {}).then(response => {
					uni.hideLoading()
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						if (res.data.data.rows.length > 0) {
							this.slist = []
							this.tlist = []
							res.data.data.rows.forEach((item, index) => {
								if(item.categoryLevel === 2){
									this.slist.push(item)
								} else if (item.categoryLevel === 3){
									this.tlist.push(item)
								}
							})
						} else {
							this.slist = []
							this.tlist = []
						}
					} else {
						showInfoToast('暂时无法获取商品分类，请稍候再试')
					}
				}).catch(error => {
					console.log(error)
				})
			},
			//一级分类点击
			tabtap(item){
				this.currentId = item.id
				this.loadCategoryByFirstLevel(true)
			},
			navToProductList(sid, tid, pageTitle){
				uni.navigateTo({
					url: `/pages/product/list?fid=${this.currentId}&sid=${sid}&tid=${tid}&pageTitle=${pageTitle}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		
		image{
			width: 140upx;
			height: 140upx;
		}
	}
</style>

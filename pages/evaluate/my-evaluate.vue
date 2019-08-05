<template>
	<view>
		<view class="zy-head zy-display-flex">
			<view class="zy-display-flex">
				<image class="zy-head-img" src="../../static/about.png"></image>
				<view>Wjhsamrt</view>
			</view>
			<view class="zy-display-flex-right">
				<button class="zy-head-btn">写评价</button>
			</view>
		</view>
		
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex == index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData('reachBottom')">
					<!-- 空白页 -->
					<empty v-if="tabItem.evaluateList.length === 0"></empty>
		
					<!-- 评价列表 -->
					<view v-for="(item,index) in tabItem.evaluateList" :key="index" class="order-item">
						<view>
							<view>
								<view class="zy-display-flex">
									<image class="zy-head-img" src="../../static/about.png"></image>
									<view>Wjhsamrt</view>
								</view>
							</view>
							<view>
								2019-08-28 黄色 S
							</view>
							<view>
								评价内容评价内容评价内容评价内容评价内容评价内容
							</view>
						</view>
					</view>
						
		
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
		
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import {
		doPostJson,
		doGet,
		showInfoToast,
		showSuccessToast,
		nullToStr,
		FRONT_BASE_URL,
		LOCAL_FILE_STORAGE,
		REFRESH_ORDER
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						evaluateList: []
					},
					{
						state: 1,
						text: '有图',
						loadingType: 'more',
						evaluateList: []
					}
				],
				urls: {
					searchUrl: '/goods-comment/user/pager-cond',
				},
				pager: {
					pageNo: 1,
					pageSize: 10,
					isActive: 0,
					sortColumn: 'createTime',
					sortOrder: 'desc',
				},
			};
		},
		onLoad(options) {
			this.loadData('init');
		},
		methods: {
			//获取评价列表
			loadData(type) {
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				if (navItem.loadingType === 'loading') {
					//防止重复加载
					return
				}
				if (navItem.loadingType === 'nomore' && type !== 'init') {
					return
				}
				if (type === 'reachBottom') {
					this.pager.pageNo += 1
				}
				navItem.loadingType = 'loading';
				doPostJson(this.urls.searchUrl, this.pager, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						// 判断是否还有数据， 有改为 more， 没有改为noMore 
						navItem.loadingType = this.pager.pageNo * this.pager.pageSize >= res.data.data.total ? 'nomore' : 'more'
						let rows = nullToStr(res.data.data.rows);
						if (type === 'init') {
							navItem.evaluateList = rows;
						} else if (type === 'pullDown') {
							uni.stopPullDownRefresh();
							navItem.evaluateList = rows;
						} else if (type === 'reachBottom') {
							if (rows.length > 0) {
								navItem.evaluateList = navItem.evaluateList.concat(rows);
							}
						}
					} else {
						showInfoToast(res.data.message);
					}
				}).catch(err => {
					console.log(err);
				})
			},
			//swiper 切换
			changeTab(e) {
				const index = e.target.current;
				this.tabClick(index);
			},
			//顶部tab点击
			tabClick(index) {
				if (this.tabCurrentIndex != index) {
					this.pager.pageNo = 1
					this.tabCurrentIndex = index
					this.navList[index].loadingType = 'more'
					if (index == 0) {
						// 全部评价
						
					} else if (index == 1) {
						// 有图评价
						
					}
					this.loadData('init');
				}
			},
		}
	}
</script>

<style lang="scss">
	@import '@/common/zywork-main.scss';
	page {
		background: #f5f5f5;
	}
	.swiper-box {
		height: calc(100% - 40px);
	}
	
	.list-scroll-content {
		height: 100%;
	}
	
	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;
	
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
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
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}
	
	.uni-swiper-item {
		height: auto;
	}
	.zy-head {
		background-color: #FFF;
		padding: 40upx 20upx;
		
		.zy-head-btn {
			height: 50upx;
			line-height: 50upx;
			border: 1px solid #fa436a;
			color: #fa436a;
			border-radius: 30upx;
			background-color:transparent;
			font-size: 23upx;
		}
	}
	.zy-head-img {
		width: 50upx;
		height: 50upx;
		border-radius: 50%;
		margin-right: 20upx;
		display: inline-block;
	}
</style>

<template>
	<view class="content b-t">
		<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
			<view class="wrapper">
				<view class="address-box">
					<text v-if="item.isDefault === 1" class="tag">默认</text>
					<view>
						<view class="address-title">{{item.addressAlias}}</view>
						<view class="address">{{item.address}} {{item.area}}</view>
					</view>
				</view>
				<view class="u-box">
					<text class="name">{{item.realName}}</text>
					<text class="mobile">{{item.phone}}</text>
				</view>
			</view>
			<text class="iconfont iconbianji" @click.stop="addAddress('edit', item)"></text>
		</view>

		<button class="zy-add-btn" @click="addAddress('add')">新增地址</button>

		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import {
		doPostJson,
		doGet,
		nullToStr,
		showInfoToast,
		showSuccessToast
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		data() {
			return {
				loadMoreText: "加载中...",
				showLoadMore: false,
				source: 0, // 来源，如果是1，则表示是从下单页面过来的
				addressList: [],
				pager: {
					pageNo: 1,
					pageSize: 10,
					isActive: 0
				},
				urls: {
					listUrl: '/shipping-address/user/pager-cond',
					saveUrl: '/shipping-address/user/save',
					updateUrl: '/shipping-address/user/update',
					deleteUrl: '/shipping-address/user/remove/'
				}
			}
		},
		onLoad(option) {
			console.log(option.source);
			this.source = option.source;
			this.loadData('init');
		},
		onPullDownRefresh() {
			this.pager.pageNo = 1;
			this.loadData('pullDown');
		},
		onReachBottom() {
			this.pager.pageNo += 1;
			this.loadData('reachBottom');
		},
		methods: {
			/**
			 * 加载数据
			 */
			loadData(type) {
				this.loadAddressList(type)
			},
			/**
			 * 加载地址列表数据
			 */
			loadAddressList(type) {
				uni.showLoading({
					title: '加载中'
				})
				doPostJson(this.urls.listUrl, this.pager, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						const rows = nullToStr(res.data.data.rows);
						if (type === 'init') {
							this.addressList = rows;
						} else if (type === 'pullDown') {
							this.addressList = rows;
							uni.stopPullDownRefresh();
							this.showLoadMore = false;
							this.loadMoreText = '加载中...';
						} else if (type === 'reachBottom') {
							if (rows.length > 0) {
								this.addressList = this.addressList.concat(rows);
								this.loadMoreText = '加载更多';
							} else {
								this.loadMoreText = '已加载全部';
							}
						}
					} else {
						showInfoToast(res.data.message);
					}
					uni.hideLoading()
				}).catch(err => {
					console.log(err);
				})
			},
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().selectedAddress = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item) {
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//添加或修改成功之后回调
			refreshList(data, type) {
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				// this.addressList.unshift(data);
				if (type === 'delete') {
					doGet(this.urls.deleteUrl + data.id, {}, true).then(response => {
						let [error, res] = response;
						if (res.data.code === ResponseStatus.OK) {
							showSuccessToast(res.data.message);
							this.loadAddressList('init');
						} else {
							showInfoToast(res.data.message);
						}
					}).catch(err => {
						console.log(err);
					})
				} else {
					let url = this.urls.saveUrl;
					if (type === 'edit') {
						url = this.urls.updateUrl;
					}
					doPostJson(url, data, {}, true).then(response => {
						let [error, res] = response;
						if (res.data.code === ResponseStatus.OK) {
							showSuccessToast(res.data.message);
							this.loadAddressList('init');
						} else {
							showInfoToast(res.data.message);
						}
					}).catch(err => {
						console.log(err);
					})
				}
			}
		}
	}
</script>

<style lang='scss'>
	page {
		padding-bottom: 120upx;
	}

	.content {
		position: relative;
	}

	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		;
		background: #fff;
		position: relative;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		align-items: center;

		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address-title {
			font-size: 30upx;
			color: $font-color-dark;
		}
		
		.address {
			font-size: 30upx;
			color: $font-color-light;
		}
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.zy-add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>

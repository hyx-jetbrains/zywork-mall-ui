<template>
	<view>
		<view class="zy-commission-card">
			<view style="color: #7bc0f1">我的佣金</view>
			<view class="zy-commission zy-text-bold">{{totalAmount}}</view>
		</view>
		<view class="zy-display-flex">
			<view class="zy-type-title zy-text-bold">佣金记录</view>
			<!-- <view class="zy-display-flex-right">
				<view class="uni-list-cell-db">
					<picker @change="chooseType" :value="typeIndex" :range="typeArray">
						<view class="zy-type-picker">
							<text>{{typeArray[typeIndex]}}</text>
							<zywork-icon type="iconxiangxia"/>
						</view>
					</picker>
				</view>
			</view> -->
		</view>
		<view class="zy-commission-record">
			<view v-if="commissionList.length > 0" class="zy-page-list" style="padding: 0upx 30upx;">
				<view v-for="(commissionItem, index) in commissionList" :key="index" v-if="commissionItem.amount > 0" class="zy-page-list-item">
					<view class="zy-display-flex">
						<view class="zy-text-big zy-text-bold zy-overflow-hidden">{{commissionItem.subType}}</view>
						<view class="zy-text-info zy-text-small zy-display-flex-right" style="color: #F0AD4E">
							{{commissionItem.amount > 0 ? '+' : ''}}{{commissionItem.amount}}
						</view>
					</view>
					<view>{{commissionItem.remark}}</view>
					<view>{{commissionItem.createTime}}</view>
				</view>
				<uni-pagination :current="pager.pageNo" :total="pager.pageTotal" title="标题文字" prev-text="前一页" next-text="后一页" @change="changePageTotal" />
			</view>
			<zywork-no-data v-else text="暂无佣金记录"></zywork-no-data>
		</view>
		
	</view>
</template>

<script>
	import zyworkNoData from '@/components/zywork-no-data/zywork-no-data.vue'
	import zyworkIcon from '@/components/zywork-icon/zywork-icon.vue'
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	import {
		revenueExpenditureStatusArray
	} from '@/common/picker-data.js'
	import { 
		doPostJson,
		showInfoToast
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	
	export default {
		components: {
			zyworkNoData,
			zyworkIcon,
			uniPagination
		},
		data() {
			return {
				totalAmount: 0,
				commissionList: [],
				urls: {
					searchUrl: '/account-detail/user/pager-cond'
				},
				pager: {
					subType: '商城分销佣金收入',
					pageNo: 1,
					pageSize: 10,
					isActive: 0,
					pageTotal: 0
				},
				typeIndex: 0,
				typeArray: revenueExpenditureStatusArray,
			}
		},
		onLoad(event) {
			uni.hideShareMenu();
			this.totalAmount = event.totalAmount;
			this.loadData();
		},
		methods: {
			// 选择收支类别
			chooseType: function(e) {
				this.typeIndex = e.target.value
				if(this.typeIndex == 0) {
					this.params.transferType = null
				} else {
					this.params.transferType = this.typeArray[this.typeIndex]
				}
			},
			/**
			 * 切换分页
			 * @param {Object} e
			 */
			changePageTotal(e) {
				console.log(e.type)
				this.pager.pageNo = e.current;
				this.loadData();
				// let type = e.type;
				// if (type === 'next') {
				// 	// 下一页
				// 	
				// } else if (type === 'prev') {
				// 	// 上一页
				// }
			},
			/**
			 * 加载数据
			 */
			loadData() {
				doPostJson(this.urls.searchUrl, this.pager, {}, true).then(response => {
					let [error, res] = response
					if (res.data.code === ResponseStatus.OK) {
						this.commissionList = res.data.data.rows;
						this.pager.pageTotal = res.data.data.total;
					}
				}).catch(error => {
					console.log(error)
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/zywork-main.scss';
	
	.zy-commission-card {
		height: 200upx;
		background-color:#f1f1f1;
		text-align: center;
		margin: 30upx 20upx;
		border-radius: 20upx;
		padding-top: 60upx;
	}
	
	.zy-commission {
		color: #108EE9;
		font-size: 64upx;
	}
	
	.zy-type-picker {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-right: 10upx;
		width: 100upx;
	}
	
	.zy-commission-record {
		margin: 10upx 20upx;
	}
	
</style>

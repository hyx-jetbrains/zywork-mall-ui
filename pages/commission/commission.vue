<template>
	<view>
		<view class="zy-commission-card">
			<view style="color: #7bc0f1">我的佣金</view>
			<view class="zy-commission zy-text-bold">{{userWallet.rmbBalance/100}}</view>
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
							{{commissionItem.amount > 0 ? '+' : ''}}{{commissionItem.amount/100}}
						</view>
					</view>
					<view>{{commissionItem.createTime}}</view>
				</view>
			</view>
			<zywork-no-data v-else text="暂无佣金记录"></zywork-no-data>
		</view>
		
	</view>
</template>

<script>
	import zyworkNoData from '@/components/zywork-no-data/zywork-no-data.vue'
	import zyworkIcon from '@/components/zywork-icon/zywork-icon.vue'
	import {
		revenueExpenditureStatusArray
	} from '@/common/picker-data.js'
	
	export default {
		components: {
			zyworkNoData,
			zyworkIcon
		},
		data() {
			return {
				userWallet: {
					rmbBalance: 10000
				},
				commissionList: [
					{
						amount: 1000,
						subType: '购买商品反佣'
					}
					
				],
				params: {
					transferType: null,
					pageNo: 1,
					pageSize: 10
				},
				typeIndex: 0,
				typeArray: revenueExpenditureStatusArray,
			}
		},
		onLoad(event) {
			// uni.hideShareMenu();
			// TODO 后面把参数名替换成 payload
			// const payload = event.itemData || event.payload;
			// // 目前在某些平台参数会被主动 decode，暂时这样处理。
			// try {
			// 	this.userWallet = JSON.parse(decodeURIComponent(payload));
			// } catch (error) {
			// 	this.userWallet = JSON.parse(payload);
			// }
			
			// this.initData()
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
			initData() {
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

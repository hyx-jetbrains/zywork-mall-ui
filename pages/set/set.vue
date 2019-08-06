<template>
	<view class="container">
		<view class="zy-list-cell b-b m-t" @click="toUserDataPage" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">个人资料</text>
			<zywork-icon type="iconxiangyou" color="#909399" size="12" class="cell-more" />
		</view>
		<view class="zy-list-cell b-b" @click="toAddressPage" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">收货地址</text>
			<zywork-icon type="iconxiangyou" color="#909399" size="12" class="cell-more" />
		</view>
		<view class="zy-list-cell" @click="toAccountSetPage" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">账户与安全</text>
			<zywork-icon type="iconxiangyou" color="#909399" size="12" class="cell-more" />
		</view>
		
		<view class="zy-list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#fa436a" @change="switchChange" />
		</view>
		<view class="zy-list-cell m-t b-b" @click="clearCache()" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<zywork-icon type="iconxiangyou" color="#909399" size="12" class="cell-more" />
			
		</view>
		<view class="zy-list-cell b-b" @click="toAbountPage" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于商城</text>
			<zywork-icon type="iconxiangyou" color="#909399" size="12" class="cell-more" />
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="zy-list-cell">
			<text class="cell-tit">检查更新</text>
			<text class="cell-tip">当前版本 1.0.3</text>
			<zywork-icon type="iconxiangyou" color="#909399" size="12" class="cell-more" />
		</view>
		
		<view class="zy-list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">退出登录</text>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import zyworkIcon from '@/components/zywork-icon/zywork-icon.vue'
	import {
		USER_DATA_PAGE,
		ADDRESS_PAGE,
		ACCOUNT_SET_PAGE,
		ABOUT_PAGE
	} from '@/common/page-url.js'
	import {PRODUCT_HISTORY} from '@/common/storage.js'
	import * as utils from '@/common/util.js'
	import {  
	    mapMutations  
	} from 'vuex';
	export default {
		components: {
			zyworkIcon
		},
		data() {
			return {
				
			};
		},
		methods:{
			...mapMutations(['logout']),

			navTo(url){
				this.$api.msg(`跳转到${url}`);
			},
			//退出登录
			toLogout(){
				uni.showModal({
				    content: '确定要退出登录么',
				    success: (e)=>{
				    	if(e.confirm){
				    		this.logout();
				    		setTimeout(()=>{
				    			uni.navigateBack();
				    		}, 200)
				    	}
				    }
				});
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},
			/**
			 * 前往修改个人资料页面
			 */
			toUserDataPage() {
				utils.navTo(USER_DATA_PAGE, true);
			},
			/**
			 * 前往收货地址设置页面
			 */
			toAddressPage() {
				utils.navTo(ADDRESS_PAGE, true);
			},
			/**
			 * 前往账户与安全设置页面
			 */
			toAccountSetPage() {
				utils.navTo(ACCOUNT_SET_PAGE, true);
			},
			/**
			 * 前往关于我们页面
			 */
			toAbountPage() {
				utils.navTo(ABOUT_PAGE, true);
			},
			clearCache() {
				uni.showModal({
					title: '确定清空缓存？',
					success: (e) => {
						if(e.confirm){
							uni.removeStorage({
								key: PRODUCT_HISTORY,
								success() {
									utils.showInfoToast('已清除缓存')
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang='scss'>
	@import '@/common/zywork-main.scss';
	page{
		background: $page-color-base;
	}
</style>

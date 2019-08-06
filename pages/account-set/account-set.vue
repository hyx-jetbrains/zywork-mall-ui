<template>
	<view class="container">
		<view class="zy-list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">昵称</text>
			<text class="cell-tip">{{user.nickname}}</text>
		</view>
		<view class="zy-list-cell b-b" @click="toUpdatePhonePage" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改手机号</text>
			<text class="cell-tip">{{user.phone}}</text>
			<zywork-icon type="iconxiangyou" color="#909399" size="12" class="cell-more" />
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="zy-list-cell b-b" @click="toForgetPage" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改登录密码</text>
			<zywork-icon type="iconxiangyou" color="#909399" size="12" class="cell-more" />
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import zyworkIcon from '@/components/zywork-icon/zywork-icon.vue'
	import {
		UPDATE_PHONE_PAGE,
		FORGET_PAGE
	} from '@/common/page-url.js'
	import {
		USER_TOKEN_KEY,
		showSuccessToast,
		showInfoToast,
		doGet,
		navTo,
		USER_PHONE
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	import {  
	    mapMutations  
	} from 'vuex';
	export default {
		components: {
			zyworkIcon
		},
		data() {
			return {
				user: {},
				urls: {
					infoUrl: '/user-detail/user/get-info',
				}
			};
		},
		onLoad() {
			this.loadData();
		},
		methods:{
			/**
			 * 加载数据
			 */
			loadData() {
				uni.showLoading({
					title: '加载中...'
				})
				doGet(this.urls.infoUrl, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						this.user = res.data.data;
					} else {
						showInfoToast(res.data.message);
					}
					uni.hideLoading()
				}).catch(err => {
					console.log(err);
				})
			},
			/**
			 * 前往修改手机号的页面
			 */
			toUpdatePhonePage() {
				let phone = uni.getStorageSync(USER_PHONE)
				if (!phone) {
					showInfoToast('请先获取手机号')
					return
				}
				navTo(UPDATE_PHONE_PAGE, true);
			},
			/**
			 * 前往修改密码页面
			 */
			toForgetPage() {
				showInfoToast('修改密码')
				// navTo(FORGET_PAGE, true);
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

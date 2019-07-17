<template>
	<view class="container">
		<view class="zy-list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">昵称</text>
			<text class="cell-tip">危锦辉</text>
		</view>
		<view class="zy-list-cell b-b" @click="toUpdatePhonePage" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改手机号</text>
			<text class="cell-tip">18279700225</text>
			<zywork-icon type="iconxiangyou" color="#909399" size="12" class="cell-more" />
		</view>
		<view class="zy-list-cell b-b" @click="toForgetPage" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">修改登录密码</text>
			<zywork-icon type="iconxiangyou" color="#909399" size="12" class="cell-more" />
		</view>
	</view>
</template>

<script>
	import zyworkIcon from '@/components/zywork-icon/zywork-icon.vue'
	import {
		UPDATE_PHONE_PAGE,
		FORGET_PAGE
	} from '@/common/page-url.js'
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
			
			/**
			 * 前往修改手机号的页面
			 */
			toUpdatePhonePage() {
				utils.navTo(UPDATE_PHONE_PAGE, true);
			},
			/**
			 * 前往修改密码页面
			 */
			toForgetPage() {
				utils.navTo(FORGET_PAGE, true);
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

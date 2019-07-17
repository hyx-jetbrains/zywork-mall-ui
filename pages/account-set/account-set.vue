<template>
	<view class="container">
		<view class="list-cell">
			<text class="cell-tit">昵称</text>
			<text class="cell-tip">危锦辉</text>
		</view>
		<view class="list-cell" @click="toUpdatePhonePage">
			<text class="cell-tit">修改手机号</text>
			<text class="cell-tip">18279700225</text>
			<zywork-icon type="iconarr-right" color="#909399" size="16" class="zy-icon cell-more" />
		</view>
		<view class="list-cell" @click="toForgetPage">
			<text class="cell-tit">修改登录密码</text>
			<zywork-icon type="iconarr-right" color="#909399" size="16" class="zy-icon cell-more" />
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
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>

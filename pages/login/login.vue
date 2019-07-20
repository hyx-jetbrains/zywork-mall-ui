<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn iconfont iconicon-arrow-left4" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<!-- #ifdef APP-PLUS -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input 
						type="number" 
						:value="mobile" 
						placeholder="请输入手机号码"
						maxlength="11"
						data-key="mobile"
						@input="inputChange"
					/>
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input 
						type="mobile" 
						value="" 
						placeholder="8-18位不含特殊字符的数字、字母组合"
						placeholder-class="input-empty"
						maxlength="20"
						password 
						data-key="password"
						@input="inputChange"
						@confirm="toLogin"
					/>
				</view>
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
			<view class="forget-section" @click="toForgetPage">
				忘记密码?
			</view>
		</view>
		<view class="register-section">
			还没有账号?
			<text @click="toRegisterPage">马上注册</text>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<button class="confirm-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="bindGetUserInfo">
				<view class="zy-text-big zy-text-bold" style="color: #fff;">微信登录</view>
			</button>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<button class="confirm-btn" @click="gzhLogin" :disabled="logining">
				<view class="zy-text-big zy-text-bold" style="color: #fff;">微信登录</view>
			</button>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		REGISTER_PAGE,
		FORGET_PAGE
	} from '@/common/page-url.js'
	import {
		FRONT_BASE_URL,
		USER_OPENID,
		USER_TOKEN_KEY,
		navTo,
		redTo,
		doPostForm,
		doGetForm,
		SHARE_CODE,
		HAS_USER_INFO
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default{
		data(){
			return {
				mobile: '',
				password: '',
				logining: false,
				fromUrl: '/pages/index/index'
			}
		},
		onLoad(options){
			this.fromUrl = options.fromUrl
			// #ifdef H5
			let openid = options.openid
			let token = options.token
			if (openid && token) {
				// 公众号授权登录成功返回的openid和token
				uni.setStorageSync(USER_OPENID, openid)
				uni.setStorageSync(USER_TOKEN_KEY, token)
				uni.setStorageSync(HAS_USER_INFO, true)
			}
			// #endif
			this.judgeLogin()
		},
		methods: {
			judgeLogin(type) {
				if (!uni.getStorageSync(USER_TOKEN_KEY)){
					// #ifdef MP-WEIXIN
					this.xcxLogin()
					// #endif
					// #ifdef H5
					this.gzhLogin()
					// #endif
				}
			},
			/**
			 * 小程序登入
			 */
			xcxLogin() {
				var myThis = this;
				uni.login({
					provider: 'weixin',
					success: function(wxRes) {
						let theShareCode = uni.getStorageSync(SHARE_CODE)
						if (!theShareCode) {
							theShareCode = null
						}
						const data = {
							code: wxRes.code,
							shareCode: theShareCode
						}
						doGetForm('/wx-auth/xcx', data, {}, false).then(response => {
							let [error, res] = response;
							if (res.data.code === ResponseStatus.OK) {
								// 保存用户的openid和token
								uni.setStorageSync(USER_OPENID, res.data.data[1]);
								uni.setStorageSync(USER_TOKEN_KEY, res.data.data[2]);
								if (res.data.data[0] === 'firstLogin') {
									// 第一次小程序登录，需要点击登录按钮，才能获取用户信息再保存用户信息
									uni.removeStorageSync(SHARE_CODE);
								}
							} else {
								showInfoToast(res.data.message);
							}
						}).catch(err => {
							console.log(err);
						})
					}
				})
			},
			gzhLogin() {
				const shareCode = uni.getStorageSync(SHARE_CODE);
				let fromUrl = this.fromUrl ? this.fromUrl : '/pages/index/index'
				const data = {
					extraParams : FRONT_BASE_URL + '/#' + fromUrl + '__' + FRONT_BASE_URL + '/#' + fromUrl + '__' + (shareCode ? shareCode : 'shareCode')
				}
				doGetForm('/wx-auth/to-gzh', data, {}, false).then(response => {}).catch(err => {
					console.log(err);
				})
			},
			bindGetUserInfo(e) {
				const openId = uni.getStorageSync(USER_OPENID);
				const data = {
					openid: openId,
					nickname: e.detail.userInfo.nickName,
					headicon: e.detail.userInfo.avatarUrl,
					gender: e.detail.userInfo.gender
				};
				uni.showLoading({
					title: '登录中'
				})
				doPostForm('/wx-auth/xcx-userdetail', data, {}, false).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						// 设置已登录并且获取用户信息
						uni.setStorageSync(HAS_USER_INFO, true)
						uni.navigateBack({
						})
					} else {
						showInfoToast(res.data.message);
					}
					uni.hideLoading()
				}).catch(err => {
					console.log(err)
				})
			},
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack(){
				uni.navigateBack();
			},
			/**
			 * 前往找回密码页面
			 */
			toForgetPage() {
				redTo(FORGET_PAGE, false);
			},
			/**
			 * 前往注册页面
			 */
			toRegisterPage(){
				redTo(REGISTER_PAGE, false);
			},
			async toLogin(){
				this.logining = true;
				const {mobile, password} = this;
			}
		},

	}
</script>

<style lang='scss'>
	@import '@/common/zywork-main.scss';
	page{
		background: #fff;
	}
	.container{
		padding-top: 115px;
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.left-top-sign{
		font-size: 120upx;
		color: $page-color-base;
		position:relative;
		left: -16upx;
	}
	.right-top-sign{
		position:absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;
		&:before, &:after{
			display:block;
			content:"";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}
		&:before{
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}
		&:after{
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}
	.left-bottom-sign{
		position:absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}
	.welcome{
		position:relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0,0,0,.3);
	}
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
	
	.zy-wx-btn {
		line-height: 1;
		display: inline;
		padding: 0;
	}
</style>

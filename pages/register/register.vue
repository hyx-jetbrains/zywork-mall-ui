<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn iconfont iconicon-arrow-left4" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">REGISTER</view>
			<view class="welcome">
				欢迎加入！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" :value="mobile" placeholder="请输入手机号码" maxlength="11" data-key="mobile" @input="inputChange" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="mobile" value="" placeholder="8-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20"
					 password data-key="password" @input="inputChange" />
				</view>
				<view class="input-item zy-position-relative">
					<text class="tit">验证码</text>
					<input type="mobile" value="" placeholder="输入手机验证码" placeholder-class="input-empty" maxlength="20" password
					 data-key="code" @input="inputChange" />
					<button class="zy-get-code-btn" @click="getCode" :disabled="getCodeDisabled">{{getCodeText}}</button>
				</view>
			</view>
			<button class="confirm-btn" @click="toRegister" :disabled="logining">注册</button>
			<view class="forget-section">
				<radio value="agreement" :checked="agreement" class="zy-form-redio" @click="switchRedio" />
				<text @click="seeAgreement">同意软件用户协议</text>
			</view>
		</view>
		<view class="register-section">
			已有账号?
			<text @click="toLoginPage">去登录</text>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import {
		LOGIN_PAGE
	} from '@/common/page-url.js'
	import {
		redTo
	} from '@/common/util.js'
	export default {
		data() {
			return {
				mobile: '',
				password: '',
				code: '',
				logining: false,
				getCodeText: '获取验证码',
				getCodeDisabled: false,
				agreement: true
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['login']),
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			/**
			 * 获取验证码
			 */
			getCode() {
				this.getCodeDisabled = true;
				var _this = this;
				var time = 60;
				var set = setInterval(function() {
					_this.getCodeText = '('+ --time +')秒后重新获取';
				}, 1000);
				setTimeout(function() {
					_this.getCodeDisabled = false;
					_this.getCodeText = '获取验证码';
					clearInterval(set);
				}, 60000);
			},
			/**
			 * 切换单选按钮
			 */
			switchRedio() {
				if (this.agreement) {
					this.agreement = false;
				} else {
					this.agreement = true;
				}
			},
			/**
			 * 查看协议
			 */
			seeAgreement() {
				this.$api.msg("查看协议")
			},
			/**
			 * 返回上一页
			 */
			navBack() {
				uni.navigateBack();
			},
			/**
			 * 前往登录
			 */
			toLoginPage() {
				redTo(LOGIN_PAGE, false);
			},
			/**
			 * 注册
			 */
			async toRegister() {
				this.logining = true;
				const {
					mobile,
					password
				} = this;
				/* 数据验证模块
				if(!this.$api.match({
					mobile,
					password
				})){
					this.logining = false;
					return;
				}
				*/
				const sendData = {
					mobile,
					password
				};
				const result = await this.$api.json('userInfo');
				if (result.status === 1) {
					this.login(result.data);
					uni.navigateBack();
				} else {
					this.$api.msg(result.msg);
					this.logining = false;
				}
			}
		},

	}
</script>

<style lang='scss'>
	@import '@/common/zywork-main.scss';
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.forget-section text {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}

	.zy-get-code-btn {
		position: absolute;
		top: 20upx;
		right: 0upx;
		z-index: 9999;
		background: $uni-color-primary;
		color: #fff;
	}
	.zy-form-redio {
		transform:scale(0.7);
	}
</style>

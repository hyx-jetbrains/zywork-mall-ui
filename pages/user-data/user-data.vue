<template>
	<view class="container">
		<view class="list-cell">
			<view class="zy-head-img">
				<image src="../../static/share/ewm.jpg"></image>
				<view class="zy-link-color" @click="updateHead">更换头像</view>
			</view>
		</view>
		<view class="list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">昵称</text>
			<input class="cell-input" v-model="user.nickname" />
			<text v-html="'&#8195'" />
		</view>
		<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">性别</text>
			<!-- <input class="cell-input" v-model="genderArray[user.gender]" :disabled="true" /> -->
			<picker class="cell-picker" @change="chooseGender" :range="genderArray">
				<input v-model="genderArray[user.gender]" :disabled="true" />
			</picker>
			<zywork-icon type="iconarr-right" color="#909399" size="16" class="zy-icon cell-more yticon " />
		</view>
		<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">手机号</text>
			<input class="cell-input" v-model="user.phone" :disabled="true" />
			<text v-html="'&#8195'" />
		</view>

	</view>
</template>

<script>
	import zyworkIcon from '@/components/zywork-icon/zywork-icon.vue'
	import {
		mapMutations
	} from 'vuex';
	import {
		genderArray,
		sourceType,
		sizeType
	} from '@/common/picker-data.js'
	import {
		BASE_URL,
		USER_TOKEN_KEY,
		showSuccessToast
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		components: {
			zyworkIcon,
		},
		data() {
			return {
				genderArray: genderArray,
				sourceTypeIndex: 2,
				sizeTypeIndex: 2,
				user: {
					nickname: '危锦辉',
					gender: 1,
					phone: '18279700225'
				}
			};
		},
		methods: {
			...mapMutations(['logout']),

			/**
			 * 监听性别下拉选择
			 */
			chooseGender(e) {
				this.user.gender = e.target.value
			},
			/**
			 * 更换头像
			 */
			updateHead: async function() {
				var myThis = this;
				const userToken = uni.getStorageSync(USER_TOKEN_KEY);
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: 1,
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						// uni.showLoading({
						// 	title: '正在上传'
						// })
						// uni.uploadFile({
						// 	url: BASE_URL + '/user/user/upload-res',
						// 	filePath: tempFilePaths[0],
						// 	name: 'file',
						// 	header: {
						// 		'Authorization': 'Bearer ' + userToken
						// 	},
						// 	success: function (res) {
						// 		const data = JSON.parse(res.data);
						// 		if (data.code = ResponseStatus.OK) {
						// 			showSuccessToast(data.message);
						// 		} else {
						// 			showInfoToast(data.message);
						// 		}
						// 	},
						// 	fail: () => {
						// 		networkError()
						// 	},
						// 	complete: () => {
						// 		uni.hideLoading()
						// 	}
						// });
					}
				})
			},

			navTo(url) {
				this.$api.msg(`跳转到${url}`);
			},
			//退出登录
			toLogout() {
				uni.showModal({
					content: '确定要退出登录么',
					success: (e) => {
						if (e.confirm) {
							this.logout();
							setTimeout(() => {
								uni.navigateBack();
							}, 200)
						}
					}
				});
			},
			//switch
			switchChange(e) {
				let statusTip = e.detail.value ? '打开' : '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss'>
	@import '@/common/zywork-main.scss';
	
	page {
		background: $page-color-base;
	}

	.list-cell {
		display: flex;
		align-items: baseline;
		padding: 20upx $page-row-spacing;
		line-height: 60upx;
		position: relative;
		background: #fff;
		justify-content: center;

		&.log-out-btn {
			margin-top: 40upx;

			.cell-tit {
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		&.m-t {
			margin-top: 16upx;
		}

		.cell-more {
			align-self: baseline;
			font-size: $font-lg;
			color: $font-color-light;
			margin-left: 10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: $font-base;
			color: $font-color-light;
		}

		.cell-input {
			font-size: $font-base;
			color: $font-color-light;
			width: 75%;
		}
		.cell-picker {
			font-size: $font-base;
			color: $font-color-light;
			width: 75%;
			padding-left: 30upx;
		}

		.zy-head-img {
			margin:10upx auto;
			text-align: center;
		}
		.zy-head-img image {
			border-radius: 50%;
			width: 200upx;
			height: 200upx;
		}
	}
</style>

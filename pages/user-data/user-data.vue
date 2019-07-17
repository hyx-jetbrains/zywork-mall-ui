<template>
	<view class="container">
		<view class="zy-list-cell">
			<view class="zy-head-img">
				<image :src="user.headicon || defaultIcon"></image>
				<view class="zy-link-color" @click="updateHead">更换头像</view>
			</view>
		</view>
		<view class="zy-list-cell b-b m-t" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">昵称</text>
			<input class="cell-content" v-model="user.nickname" />
			
		</view>
		<view class="zy-list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">性别</text>
			<picker class="cell-content" @change="chooseGender" :range="genderArray">
				<input v-model="genderArray[user.gender]" :disabled="true" />
			</picker>
			<zywork-icon type="iconxiangyou" color="#909399" size="12" class="cell-more" />
		</view>
		<button class="zy-add-btn" @click="confirm">完成</button>
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
		DEFAULT_HEADICON,
		showSuccessToast,
		showInfoToast,
		doGet,
		doPostJson
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		components: {
			zyworkIcon,
		},
		data() {
			return {
				defaultIcon: DEFAULT_HEADICON,
				genderArray: genderArray,
				sourceTypeIndex: 2,
				sizeTypeIndex: 2,
				user: {},
				urls: {
					infoUrl: '/user-detail/user/get-info',
					updateInfoUrl: '/user-detail/user/update'
				}
			};
		},
		onLoad() {
			this.loadData();
		},
		methods: {
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
						uni.showLoading({
							title: '正在上传'
						})
						uni.uploadFile({
							url: BASE_URL + '/user-detail/user/upload-headicon',
							filePath: tempFilePaths[0],
							name: 'file',
							header: {
								'Authorization': 'Bearer ' + userToken
							},
							success: function(res) {
								const data = JSON.parse(res.data);
								if (data.code = ResponseStatus.OK) {
									showSuccessToast(data.message);
								} else {
									showInfoToast(data.message);
								}
							},
							fail: () => {
								networkError()
							},
							complete: () => {
								uni.hideLoading()
							}
						});
					}
				})
			},
			/**
			 * 提交资料修改
			 */
			confirm() {
				uni.showLoading({
					title: '正在更新'
				})
				doPostJson(this.urls.updateInfoUrl, this.user, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code = ResponseStatus.OK) {
						showSuccessToast(res.data.message);
					} else {
						showInfoToast(res.data.message);
					}
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
				})
			}
		}
	}
</script>

<style lang='scss'>
	@import '@/common/zywork-main.scss';

	page {
		background: $page-color-base;
	}
	.zy-head-img {
		margin: 10upx auto;
		text-align: center;
	}

	.zy-head-img image {
		border-radius: 50%;
		width: 200upx;
		height: 200upx;
	}
</style>

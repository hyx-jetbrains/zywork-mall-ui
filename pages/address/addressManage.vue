<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.realName" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.phone" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">地址</text>
			<text @click="chooseLocation" class="input">
				{{addressData.addressAlias}}
			</text>
			<zywork-icon @click="chooseLocation" type="icondizhi" size="16"></zywork-icon>
		</view>
		<view class="row b-b"> 
			<text class="tit">详细地址</text>
			<input class="input" type="text" v-model="addressData.address" placeholder="详细地址" placeholder-class="placeholder" />
		</view>
		<view class="row b-b"> 
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="addressData.area" placeholder="楼号、门牌" placeholder-class="placeholder" />
		</view>
		
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.isDefault === 1" color="#fa436a" @change="switchChange" />
		</view>
		
		<view class="row default-row" @click="deleteAddress" v-if="type === 'edit'">
			<text class="tit" style="color: red;">删除收货地址</text>
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	import zyworkIcon from '@/components/zywork-icon/zywork-icon.vue'
	import { showInfoToast,USER_PHONE } from '@/common/util.js'
	export default {
		components: {
			zyworkIcon
		},
		data() {
			return {
				type: 'add',
				addressData: {
					realName: '',
					phone: '',
					addressAlias: '在地图选择',
					address: '',
					area: '',
					isDefault: 0
				}
			}
		},
		onLoad(option){
			let title = '新增收货地址';
			if(option.type==='edit'){
				title = '编辑收货地址'
				this.addressData = JSON.parse(option.data)
			} else if (option.type === 'add') {
				const userPhone = uni.getStorageSync(USER_PHONE);
				if (userPhone) {
					this.addressData.phone = userPhone;
				}
			}
			this.type = option.type
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			switchChange(e){
				console.log(e.detail)
				var val = e.detail;
				this.addressData.isDefault = val.value ? 1 : 0;
				console.log(this.addressData.isDefault)
			},
			
			//地图选择地址
			chooseLocation(){
				let myThis = this
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						uni.chooseLocation({
							success: (data)=> {
								myThis.addressData.addressAlias = data.name;
								myThis.addressData.address = data.address;
							}
						})
					},
					fail() {
						showInfoToast('必须授权才能获取位置信息')
					}
				})
			},
			/**
			 * 删除收货地址
			 */
			deleteAddress() {
				uni.showModal({
					content: '您确定要删除收货地址吗？',
					success: (res) => {
						if (res.confirm) {
							this.manageType = 'delete';
							this.$api.prePage().refreshList(this.addressData, this.manageType);
							showInfoToast('地址删除成功');
							setTimeout(()=>{
								uni.navigateBack()
							}, 800)
						}
					}
				})
			},
			//提交
			confirm(){
				let data = this.addressData;
				if(!data.realName){
					showInfoToast('请填写收货人姓名');
					return;
				}
				if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.phone)){
					showInfoToast('请输入正确的手机号码');
					return;
				}
				if(!data.address){
					showInfoToast('请在地图选择所在位置');
					return;
				}
				if(!data.area){
					showInfoToast('请填写门牌号信息');
					return;
				}
				console.log(this.addressData.isDefault)
				//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				this.$api.prePage().refreshList(data, this.manageType);
				showInfoToast(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
				setTimeout(()=>{
					uni.navigateBack()
				}, 800)
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row{
		display: flex;
		align-items: center;
		position: relative;
		padding:0 30upx;
		height: 110upx;
		background: #fff;
		
		.tit{
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}
		.input{
			flex: 1;
			font-size: 30upx;
			color: $font-color-light;
		}
		.icon-shouhuodizhi{
			font-size: 36upx;
			color: $font-color-light;
		}
	}
	.default-row{
		margin-top: 16upx;
		.tit{
			flex: 1;
		}
		switch{
			transform: translateX(16upx) scale(.9);
		}
	}
	.add-btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>

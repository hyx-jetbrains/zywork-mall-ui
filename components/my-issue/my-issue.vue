<template>
	<view class='issue'>
		<view class="issue-head zy-issue-head zy-display-flex">
			<slot name="headPic"></slot>
			<zywork-icon type="iconyunliankeji-" color="#8A8A8A" size="30" class="zy-icon" />
			<view class="zy-display-flex zy-rate">
				<view class="zy-display-flex" @click="switchRateType(0)">
					<zywork-icon type="iconhaoping" :color="rateType == 0 ? '#dd524d' : '#8A8A8A'" size="24" class="zy-icon" />
					<text :style="{color:(rateType == 0 ? '#dd524d' : '#8A8A8A')}">好评</text>
				</view>
				<view class="zy-display-flex" @click="switchRateType(1)">
					<zywork-icon type="iconchaping1" :color="rateType == 1 ? '#dd524d' : '#8A8A8A'" size="24" class="zy-icon" />
					<text :style="{color:(rateType == 1 ? '#dd524d' : '#8A8A8A')}">中评</text>
				</view>
				<view class="zy-display-flex" @click="switchRateType(2)">
					<zywork-icon type="iconchaping1" :color="rateType == 2 ? '#dd524d' : '#8A8A8A'" size="24" class="zy-icon" />
					<text :style="{color:(rateType == 2 ? '#dd524d' : '#8A8A8A')}">差评</text>
				</view>
				
			</view>
		</view>
		<textarea v-if="textareaShow" @blur="blur" :value="infoReceive.textareaValue" :placeholder="textareaPlaceholder" />
		<view class="zy-display-flex zy-issue-rate">
			 商品评分：<uni-rate />
		 </view>
		<view class="issue-btn-box">
		 	<!-- <button v-if="submitShow" class="submit-btn" type="primary" @click="doSubmit">{{submitText}}</button> -->
			<button v-if="submitShow" class="zy-add-btn" @click="doSubmit">{{submitText}}</button>
			<slot name="submit"></slot>
		 </view>
		 
	</view>
</template>
<script>
	import uniRate from '@/components/uni-rate/uni-rate.vue'
	import zyworkIcon from '@/components/zywork-icon/zywork-icon.vue'
	export default {
		components: {
			uniRate,
			zyworkIcon
		},
		props:{
			headTitleShow:{ //标题
				type:[String,Boolean],
				default:true,
			},
			headTitleValue:{
				type:String,
				default:"描述相符"
			},
			
			starsShow:{
				type:[String,Boolean],
				default:true,
			},
			starsMax:{ // 星星最大个数
				type:[String,Number],
				default:5,
			},
			
			textareaShow:{ // 多行文本显示
				type:[String,Boolean],
				default:true,
			},
			textareaPlaceholder:{
				type:[String],
				default:"宝贝满足你的期待吗？说说你的使用心得，分享给想买的他们吧"
			},
			
			
			submitShow:{ // 发布按钮
				type:[String,Boolean],
				default:true,
			},
			submitText:{
				type:String,
				default:"发布",
			},
			
			infoReceive:{ // 获取值
				type:Object,
				default:function(){
					return {
						score:0,
						textareaValue:""
					}
				}
			}
		},
		computed:{
		},
		data() {
			return {
				rateType: 0
			};
		},
		methods: {
			/**
			 * 设置评价类型
			 * @param {Object} type 评价类型
			 */
			switchRateType(type) {
				if (this.rateType !== type) {
					this.rateType = type
				}
			},
			/**
			 * @name 获取textarea内容
			 */
			
			blur(e){
				this.infoReceive.textareaValue=e.detail.value
			},
			
			/**
			 * @name 提交
			 */
			doSubmit(){
				this.$emit('submit',this.infoReceive)
			}
		},
		created() {
			this.infoReceive.score=this.score
		}
	}
</script>
<style lang='scss'>
	
	$backgroundC:#f9f9f9;
	$borderColor:#f5f5f5;
	$white:#ffffff;
	$fontSize:28upx;
	
	.issue {
		background-color: $backgroundC;
		
		&-head{
			background-color: $white;
			height: 100upx;
			border-top: 1upx solid $borderColor;
			border-bottom: 1upx solid $borderColor;
			padding: 0 25upx;
			
			&-pic{
				width: 70upx;
				height: 70upx;
				border-radius: 50%;
				vertical-align: middle;
				margin-right: 17upx;
			}
			&-title{
				line-height: 100upx;
				font-size: 30upx;
				vertical-align: middle;
				margin-right: 35upx;
			}
			
			&-star-box{
				display: inline-block;
				
				image{
					width: 32upx;
					height: 32upx;
					vertical-align: middle;
					margin-right: 14upx;
				}
				image.active{
					animation: star_move ease-in 1 1s,star_rotate ease 1.5s infinite 1s;
				}
			}
		}
		textarea{
			width: 100%;
			height: 420upx;
			background-color: $white;
			font-size: $fontSize;
			color: #898989;
			padding: 24upx;
			box-sizing: border-box;
			line-height: 40upx
		}
		&-btn-box{
			padding: 54upx 30upx;
		}
	}
	
	@keyframes star_move{
		from{
			width: 50upx;
			height: 50upx;
			transform: rotate(180deg)
		}
		to{
			width: 32upx;
			height: 32upx;
			transform: rotate(0)
		}
	}
	@keyframes star_rotate{
		0%{
			transform: rotateY(360deg)
		}
		100%{
			transform: rotateY(180deg)
		}
	}
	
	.zy-display-flex {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.zy-icon {
		display: inline-block; 
		margin-right: 20upx;
	}
	
	.zy-issue-head {
		padding-top: 10upx;
	}
	.zy-issue-rate {
		padding: 10upx 25upx;
		background-color: #FFF;
	}
	.zy-rate view {
		margin: 0 10upx;
	}
	.zy-rate text {
		font-size: 30upx;
	}
	.zy-add-btn{
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

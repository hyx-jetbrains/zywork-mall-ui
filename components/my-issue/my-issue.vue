<template>
	<view class='issue'>
		<view v-for="(item, index) in goodsList" :key="index">
			<view class="zy-display-flex zy-head">
				<view>
					{{item.skuTitle}}
				</view>
				<view class="zy-display-flex-right zy-head-tip">
					{{item.skuInfo}}
				</view>
			</view>
			<view class="issue-head zy-issue-head zy-display-flex">
				<slot name="headPic"></slot>
				<!-- <zywork-icon type="iconyunliankeji-" color="#8A8A8A" size="30" class="zy-icon" /> -->
				<image class="zy-goods-img" :src="localFileStorage ? frontBaseUrl + goodsItem.goodsPicPicUrl : goodsItem.goodsPicPicUrl" mode="aspectFill"></image>
				<view class="zy-display-flex zy-rate">
					<view class="zy-display-flex" @click="switchRateType(index, 0)">
						<zywork-icon type="iconhaoping" :color="item.commentLevel == 0 ? '#dd524d' : '#8A8A8A'" size="24" class="zy-icon" />
						<text :style="{color:(item.commentLevel == 0 ? '#dd524d' : '#8A8A8A')}">好评</text>
					</view>
					<view class="zy-display-flex" @click="switchRateType(index, 1)">
						<zywork-icon type="iconchaping1" :color="item.commentLevel == 1 ? '#dd524d' : '#8A8A8A'" size="24" class="zy-icon" />
						<text :style="{color:(item.commentLevel == 1 ? '#dd524d' : '#8A8A8A')}">中评</text>
					</view>
					<view class="zy-display-flex" @click="switchRateType(index, 2)">
						<zywork-icon type="iconchaping1" :color="item.commentLevel == 2 ? '#dd524d' : '#8A8A8A'" size="24" class="zy-icon" />
						<text :style="{color:(item.commentLevel == 2 ? '#dd524d' : '#8A8A8A')}">差评</text>
					</view>
					
				</view>
			</view>
			<textarea v-if="textareaShow" v-model="item.comments" :placeholder="textareaPlaceholder" />
			<view class="zy-display-flex zy-issue-rate">
				商品评分：<uni-rate :value="item.commentRate" :max="5" :index="index" @change="rateChange"/>
			</view>
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
	import {
		FRONT_BASE_URL,
		LOCAL_FILE_STORAGE
	} from '@/common/util.js'
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
				frontBaseUrl: FRONT_BASE_URL,
				localFileStorage: LOCAL_FILE_STORAGE,
				goodsList: [],
			};
		},
		methods: {
			/**
			 * 设置评价类型
			 * @param {Object} type 评价类型
			 */
			switchRateType(index, type) {
				this.$set(this.goodsList[index], 'commentLevel', type);
			},
			/**
			 * 星星点击监听
			 */
			rateChange(e, index) {
				this.$set(this.goodsList[e.index], 'commentRate', e.value);
			},
			
			/**
			 * @name 提交
			 */
			doSubmit(){
				this.$emit('submit', this.goodsList)
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
			height: 220upx;
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
	.zy-display-flex-right {
		margin-left: auto;
		margin-right: 20upx;
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
		font-size: 28upx;
		margin-bottom: 20upx;
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
	.zy-goods-img {
		width: 60upx;
		height: 60upx;
		margin-right: 20upx;
	}
	.zy-head {
		background-color: #FFF;
		padding: 10upx;
		font-size: 28upx;
	}
	.zy-head-tip {
		color: #898989;
	}
</style>

<template>
	<view>
		<view class="zy-head" >
			<view class="zy-head-title">积分</view>
		</view>
		<view class="qiun-charts" >
			<canvas canvas-id="canvasRing" id="canvasRing" class="charts" @touchstart="touchRing"></canvas>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import  { isJSON } from '@/common/checker.js';
	import { showInfoToast } from '@/common/util.js'
	var _self;
	var canvaRing=null;
   
	export default {
		data() {
			return {
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				textarea:'',
				userWallet: {}
			}
		},
		onLoad(options) {
			_self = this;
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.userWallet = JSON.parse(options.userWallet)
			this.loadData();
		},
 		methods: {
			loadData(){
				let tempList = [
					{
						name: '可用',
						data: this.userWallet.usableIntegral
					},
					{
						name: '冻结',
						data: this.userWallet.frozenIntegral
					}
				]
				let Ring={series:[]};
				//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				Ring.series=tempList;
				//自定义文案示例，需设置format字段
				for(let i = 0 ;i < Ring.series.length;i++){
					Ring.series[i].format=()=>{return Ring.series[i].name+Ring.series[i].data};
				}
				_self.textarea = JSON.stringify(Ring);
				_self.showRing("canvasRing",Ring);
			},
			showRing(canvasId,chartData){
				canvaRing=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'ring',
					fontSize:11,
					padding:[5,5,5,5],
					legend:{
						show:true,
						position:'right',
						float:'center',
						itemGap:10,
						fontSize:11,
						padding:5,
						lineHeight:26,
						margin:5,
						//backgroundColor:'rgba(41,198,90,0.2)',
						//borderColor :'rgba(41,198,90,0.5)',
						borderWidth :1
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: false,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					disablePieStroke: true,
					dataLabel: true,
					subtitle: {
						name: this.userWallet.integral + '',
						color: '#7cb5ec',
						fontSize: 25*_self.pixelRatio,
					},
					title: {
						name: '总积分',
						color: '#666666',
						fontSize: 15*_self.pixelRatio,
					},
					extra: {
						pie: {
						  offsetAngle: -105,
						  ringWidth: 40*_self.pixelRatio,
						  labelWidth:15
						}
					},
				});
			},
			touchRing(e){
				canvaRing.touchLegend(e, {
					animation : false
				});
				canvaRing.showToolTip(e, {
					format: function (item) {
						return item.name + ':' + item.data 
					}
				});
			},
			changeData(){
				if(isJSON(_self.textarea)){
					let newdata=JSON.parse(_self.textarea);
					canvaRing.updateData({
						series: newdata.series,
						categories: newdata.categories
					});
				}else{
					showInfoToast('数据格式错误');
				}
			}
		}
	}
</script>

<style>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
	
	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
	.zy-head {
		padding: 10upx 0upx;
		margin-top: 20upx;
		background: #FFF;
	}
	.zy-head-title {
		border-left: 5px solid #fa436a;
		padding-left: 20upx;
		margin-left: 20upx;
		font-size: 28upx;
	}
</style>

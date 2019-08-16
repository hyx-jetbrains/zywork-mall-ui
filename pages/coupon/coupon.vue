<template>
	<view>
		<view class="tabr" :style="{top:headerTop}">
			<view :class="{on:typeClass=='valid'}" @tap="switchType('valid')">可用({{validCount}})</view><view :class="{on:typeClass=='invalid'}"  @tap="switchType('invalid')">已失效</view>
			<view class="border" :class="typeClass"></view>
		</view>
		<view class="place" ></view>
		<view class="list">
			<!-- 优惠券列表 -->
			<view v-if="tabIndex === 0" class="sub-list valid" :class="subState">
				
				<view class="row" v-for="(row,index) in couponValidList" :key="index" >
					<!-- 删除按钮 -->
					<view class="menu" @tap.stop="deleteCoupon(row.goodsUserCouponId, couponValidList)">
						<view class="icon shanchu"></view>
					</view>
					<!-- content -->
					<view class="carrier" :class="[typeClass=='valid'?theIndex==index?'open':oldIndex==index?'close':'':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
						<view class="left">
							<view class="title">
								{{row.goodsCouponTitle}}
								<text class="zy-tag-activity">
									{{row.goodsCouponCouponType === 0 ? '现金' : row.goodsCouponCouponType === 1 ? '折扣' : '积分'}}
								</text>
							</view>
							<view class="term">
								{{row.goodsCouponCouponUsableRange === 0 ? '平台优惠券' : row.goodsCouponCouponUsableRange === 1 ? '类目优惠券' : row.goodsCouponCouponUsableRange === 2 ? '店铺优惠券' : row.goodsCouponCouponUsableRange === 3 ? '商品优惠券' : '单品优惠券'}}
							</view>
							<view class="term">
								{{row.goodsCouponStartTime.split(' ')[0]}} ~ {{row.goodsCouponDueTime.split(' ')[0]}}
							</view>
							<view class="gap-top"></view>
							<view class="gap-bottom"></view>
						</view>
						<view class="right" @click="useCoupon(row)">
							<view class="ticket" v-if="row.goodsCouponCouponType === 0">
								<!-- 现金券 -->
								<view class="num">
									{{row.goodsCouponDiscountAmount}}
								</view>
								<view class="unit">
									元
								</view>
							</view>
							<view class="ticket" v-if="row.goodsCouponCouponType === 1">
								<!-- 折扣券 -->
								<view class="num">
									{{row.goodsCouponDiscountPercent}}
								</view>
								<view class="unit">
									折
								</view>
							</view>
							<view class="ticket" v-if="row.goodsCouponCouponType === 2">
								<!-- 积分券 -->
								<view class="num">
									{{row.goodsCouponIntegralAmount}}
								</view>
								<view class="unit">
									个
								</view>
							</view>
							<view class="criteria">
								满{{row.goodsCouponUseMinAmount}}元使用
							</view>
							<view class="use">
								去使用
							</view>
						</view>
						
					</view>
				</view>
				<view class="tis">
					<uni-load-more :status="loadingType"></uni-load-more>
				</view>
			</view>
			<view v-else-if="tabIndex === 1" class="sub-list invalid" :class="subState">
				
				<view class="row" v-for="(row,index) in couponinvalidList" :key="index" >
					<!-- 删除按钮 -->
					<view class="menu" @tap.stop="deleteCoupon(row.goodsUserCouponId, couponinvalidList)">
						<view class="icon shanchu"></view>
					</view>
					<!-- content -->
					<view class="carrier" :class="[typeClass=='invalid'?theIndex==index?'open':oldIndex==index?'close':'':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
						<view class="left">
							<view class="title">
								{{row.goodsCouponTitle}}
								<text class="zy-tag-activity" style="color: #6D6D6D;border-color:#6D6D6D;">
									{{row.goodsCouponCouponType === 0 ? '现金' : row.goodsCouponCouponType === 1 ? '折扣' : '积分'}}
								</text>
							</view>
							<view class="term">
								{{row.goodsCouponCouponUsableRange === 0 ? '平台优惠券' : row.goodsCouponCouponUsableRange === 1 ? '类目优惠券' : row.goodsCouponCouponUsableRange === 2 ? '店铺优惠券' : row.goodsCouponCouponUsableRange === 3 ? '商品优惠券' : '单品优惠券'}}
							</view>
							<view class="term">
								{{row.goodsCouponStartTime.split(' ')[0]}} ~ {{row.goodsCouponDueTime.split(' ')[0]}}
							</view>
							<view v-if="row.status === 2" class="iconfont iconyiguoqi zy-icon"></view>
							<view v-else-if="row.status === 1" class="iconfont iconyishiyong zy-icon"></view>
							<view v-else class="iconfont iconyishixiao zy-icon"></view>
							<view class="gap-top"></view>
							<view class="gap-bottom"></view>
						</view>
						<view class="right invalid">
							<view class="ticket" v-if="row.goodsCouponCouponType === 0">
								<!-- 现金券 -->
								<view class="num">
									{{row.goodsCouponDiscountAmount}}
								</view>
								<view class="unit">
									元
								</view>
							</view>
							<view class="ticket" v-if="row.goodsCouponCouponType === 1">
								<!-- 折扣券 -->
								<view class="num">
									{{row.goodsCouponDiscountPercent}}
								</view>
								<view class="unit">
									折
								</view>
							</view>
							<view class="ticket" v-if="row.goodsCouponCouponType === 2">
								<!-- 积分券 -->
								<view class="num">
									{{row.goodsCouponIntegralAmount}}
								</view>
								<view class="unit">
									个
								</view>
							</view>
							<view class="criteria">
								满{{row.goodsCouponUseMinAmount}}元使用
							</view>
						</view>
					</view>
				</view>
				<view class="tis">
					<uni-load-more :status="loadingType"></uni-load-more>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import {
		doGet,
		doPostJson,
		showInfoToast,
		showSuccessToast,
		nullToStr,
		getCurrentDate
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				loadingType: 'more',
				urls: {
					searchUrl: '/user-goods-coupon/user/pager-cond',
					removeUrl: '/goods-user-coupon/user/remove/',
					oneCategoryUrl: '/goods-category/any/level3-info/'
				},
				pager: {
					pageNo: 1,
					pageSize: 10,
					goodsUserCouponIsActive: 0,
					sortColumn: 'goodsUserCouponCreateTime',
					sortOrder: 'desc',
					goodsCouponDueTimeMin: null,
					goodsCouponDueTimeMax: null,
					goodsUserCouponCouponStatusMin: null,
					goodsUserCouponCouponStatusMax: null
				},
				couponValidList:[],
				couponinvalidList:[],
				headerTop:0,
				//控制滑动效果
				typeClass:'valid',
				subState:'',
				theIndex:null,
				oldIndex:null,
				isStop:false,
				tabIndex: 0,
				validCount: 0,
				invalidCount: 0,
			}
		},
		onPageScroll(e){
			
		},
		//下拉刷新
		onPullDownRefresh() {
			this.pager.pageNo = 1
		    this.loadData('pullDown')
		},
		onLoad() {
			this.loadData('init')
		},
		//加载更多
		onReachBottom() {
			this.loadData('reachBottom');
		},
		methods: {
			/**
			 * 加载数据
			 * @param {Object} type
			 */
			loadData(type) {
				if (this.loadingType === 'loading') {
					//防止重复加载
					return
				}
				if (this.loadingType === 'nomore' && type !== 'init') {
					return
				}
				if (type === 'reachBottom') {
					this.pager.pageNo += 1
				} else {
					this.pager.pageNo = 1
				}
				
				this.loadingType = 'loading';
				let currDate = getCurrentDate();
				if (this.tabIndex == 0) {
					// 可用
					this.pager.goodsCouponDueTimeMin = currDate + ' 0:0:0';
					this.pager.goodsCouponDueTimeMax = null;
					// 查询待使用的
					this.pager.goodsUserCouponCouponStatusMin = this.pager.goodsUserCouponCouponStatusMax = 0;
				} else if (this.tabIndex == 1) {
					// 失效
					this.pager.goodsCouponDueTimeMax = currDate + ' 23:59:59';
					this.pager.goodsCouponDueTimeMin = null;
					// 查询已过期和已使用的
					this.pager.goodsUserCouponCouponStatusMin = this.pager.goodsUserCouponCouponStatusMax = null;
				}
				doPostJson(this.urls.searchUrl, this.pager, {}, true).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						// 判断是否还有数据， 有改为 more， 没有改为noMore 
						this.loadingType = this.pager.pageNo * this.pager.pageSize >= res.data.data.total ? 'nomore' : 'more'
						if (this.tabIndex == 0) {
							this.validCount = res.data.data.total;
						} else if (this.tabIndex == 1) {
							this.invalidCount = res.data.data.total;
						}
						let tempRows = nullToStr(res.data.data.rows);
						if (type === 'init') {
							if (this.tabIndex == 0) {
								// 可用
								this.couponValidList = tempRows
							} else if (this.tabIndex == 1) {
								// 失效
								this.couponinvalidList = tempRows
							}
						} else if (type === 'pullDown') {
							if (this.tabIndex == 0) {
								// 可用
								this.couponValidList = tempRows
							} else if (this.tabIndex == 1) {
								// 失效
								this.couponinvalidList = tempRows
							}
							uni.stopPullDownRefresh();
						} else if (type === 'reachBottom') {
							if (tempRows.length > 0) {
								if (this.tabIndex == 0) {
									this.couponValidList = this.couponValidList.concat(tempRows)
								} else if (this.tabIndex == 1) {
									this.couponinvalidList = this.couponinvalidList.concat(tempRows)
								}
							}
						}
					} else {
						showInfoToast(res.data.message);
					}
				}).catch(err => {
					console.log(err);
				})
			},
			switchType(type){
				if(this.typeClass==type){
					return ;
				}
				uni.pageScrollTo({
					scrollTop:0,
					duration:0
				})
				this.typeClass = type;
				this.subState = this.typeClass==''?'':'show'+type;
				setTimeout(()=>{
					this.oldIndex = null;
					this.theIndex = null;
					this.subState = this.typeClass=='valid'?'':this.subState;
				},200)
				if (type === 'valid') {
					// 可用
					this.tabIndex = 0;
				} else if (type === 'invalid') {
					// 失效
					this.tabIndex = 1;
				}
				this.loadData('init')
			},
			//控制左滑删除效果-begin
			touchStart(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				this.oldIndex = this.theIndex;
				this.theIndex = null;
				//初始坐标
				this.initXY = [event.touches[0].pageX,event.touches[0].pageY];
			},
			touchMove(index,event){
				//多点触控不触发
				if(event.touches.length>1){
					this.isStop = true;
					return ;
				}
				let moveX = event.touches[0].pageX - this.initXY[0];
				let moveY = event.touches[0].pageY - this.initXY[1];
				
				if(this.isStop||Math.abs(moveX)<5){
					return ;
				}
				if (Math.abs(moveY) > Math.abs(moveX)){
					// 竖向滑动-不触发左滑效果
					this.isStop = true;
					return;
				}
				
				if(moveX<0){
					this.theIndex = index;
					this.isStop = true;
				}else if(moveX>0){
					if(this.theIndex!=null&&this.oldIndex==this.theIndex){
						this.oldIndex = index;
						this.theIndex = null;
						this.isStop = true;
						setTimeout(()=>{
							this.oldIndex = null;
						},150)
					}
				}
			},
			
			touchEnd(index,$event){
				//解除禁止触发状态
				this.isStop = false;
			},
			
			//删除优惠券
			deleteCoupon(id, List){
				uni.showModal({
					title: '确定删除优惠券？',
					success: (e) => {
						if(e.confirm){
							uni.showLoading({
								title: '删除中...'
							})
							doGet(this.urls.removeUrl + id, {}, true).then(response => {
								uni.hideLoading();
								let [error, res] = response
								if (ResponseStatus.OK === res.data.code) {
									let len = List.length;
									for(let i=0;i<len;i++){
										if(id==List[i].id){
											List.splice(i, 1);
											break;
										}
									}
									this.oldIndex = null;
									this.theIndex = null;
									if (this.tabIndex === 0) {
										this.validCount--
									} else if (this.tabIndex === 1) {
										this.invalidCount--
									}
									showSuccessToast(res.data.message)
								} else {
									showInfoToast(res.data.message)
								}
							}).catch(err => {
								console.log(err)
							})
						}
					}
				})
				
			},
			
			discard() {
				//丢弃
			},
			/**
			 * 使用优惠券
			 * @param {Object} item
			 */
			useCoupon(item) {
				let type = item.goodsCouponCouponUsableRange;
				if (type === 0) {
					// 平台优惠券
					uni.switchTab({
						url: '/pages/category/category'
					})
				} else if (type === 1) {
					// 类目优惠券
					doGet(this.urls.oneCategoryUrl + item.goodsCouponCategoryId, {}, false).then(response => {
						let [error, res] = response
						if (ResponseStatus.OK === res.data.code) {
							let row = res.data.data
							uni.navigateTo({
								url: `/pages/product/list?fid=${row.topId}&sid=${row.parentId}&tid=${row.id}&pageTitle=${row.title}`
							})
						}
					}).catch(err => {
						console.log(err)
					})
					
				} else if (type === 2) {
					// 店铺优惠券 - 先跳转到分类页面，后期完善了店铺再跳转到店铺的商品列表
					uni.switchTab({
						url: '/pages/category/category'
					})
				} else if (type === 3) {
					// 商品优惠券
					let goodsInfoId = item.goodsCouponGoodsId
					uni.navigateTo({
						url: `/pages/product/product?gi=${goodsInfoId}`
					})
				} else if (type === 4) {
					// 单品优惠券
					let goodsInfoId = item.goodsCouponGoodsId
					let goodsSkuId = item.goodsCouponGoodsSkuId
					uni.navigateTo({
						url: `/pages/product/product?gi=${goodsInfoId}&si=${goodsSkuId}`
					})
				}
			}
			
		}
	}
</script>
<style lang="scss">
	view{
		display: flex;
		flex-wrap: wrap;
		
	}
	page{position: relative;background-color: #f5f5f5;}
	@font-face {font-family:"HMfont-home";src:url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2');}
	.icon {
		font-family:"HMfont-home" !important;
		font-size:60upx;
		font-style:normal;
		color:#000000;
		&.jia {
			&:before{content:"\e641";}
		}
		&.jian {
			&:before{content:"\e643";}
		}
		&.shanchu {
			&:before{content:"\e6a4";}
		}
		&.shixiao {
			&:before{content:"\e669";}
		}
		
	}
	.hidden{
		display: none !important;
	}
	.place{
		width: 100%;
		height: 95upx;
	}
	.tabr{
		background-color: #fff;
		width: 100%;
		height: 95upx;
		padding: 0 3%;
		border-bottom: solid 1upx #dedede;
		position: fixed;
		top: 0;
		z-index: 10;
		view{
			width: 50%;
			height: 90upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
			color: #999;
		}
		.on{
			color: #f06c7a;
		}
		.border{
			height: 4upx;
			background-color: #f06c7a;
			transition: all .3s ease-out;
			&.invalid{
				transform: translate3d(100%,0,0);
			}
		}
		
	}
	.list{
		width: 100%;
		display: block;
		position: relative;
	}
	@keyframes showValid {
		0% {transform: translateX(-100%);}100% {transform: translateX(0);}
	}
	@keyframes showInvalid {
		0% {transform: translateX(0);}100% {transform: translateX(-100%);}
	}
	.sub-list{
		&.invalid{
			position: absolute;
			top: 0;
			left:100%;
			display: none;
		}
		&.showvalid{
			display: flex;
			animation: showValid 0.20s linear both;
		}
		&.showinvalid{
			display: flex;
			animation: showInvalid 0.20s linear both;
		}
		width: 100%;
		padding: 20upx 0 120upx 0;
		.tis{
			width: 100%;
			height: 60upx;
			justify-content: center;
			align-items: center;
			font-size: 32upx;
		}
		.row{
			width: 92%;
			height: 24vw; 
			margin: 20upx auto 10upx auto;
			border-radius: 8upx;
			// box-shadow: 0upx 0 10upx rgba(0,0,0,0.1);
			align-items: center;
			position: relative;
			overflow: hidden;
			z-index: 4;
			border: 0;
			.menu{
				.icon{
					color: #fff;
					font-size:50upx;
				}
				position: absolute;
				width: 28%;
				height: 100%;
				right: 0;
				justify-content: center;
				align-items: center;
				background-color: red;
				color: #fff;
				z-index: 2;
			}
			.carrier{
				@keyframes showMenu {
					0% {transform: translateX(0);}100% {transform: translateX(-28%);}
				}
				@keyframes closeMenu {
					0% {transform: translateX(-28%);}100% {transform: translateX(0);}
				}
				&.open{
					animation: showMenu 0.25s linear both;
				}
				&.close{
					animation: closeMenu 0.15s linear both;
				}
				background-color: #fff;
				position: absolute;
				width: 100%;
				padding: 0 0;
				height: 100%;
				z-index: 3;
				flex-wrap: nowrap;
				.left{
					width: 100%;
					.title{
						padding-top: 3vw;
						width: 90%;
						margin: 0 5%;
						font-size: 36upx;
					}
					.term{
						width: 90%;
						margin: 0 5%;
						font-size: 26upx;
						color: #999;
					}
					position: relative;
					.gap-top,.gap-bottom{
						position: absolute;
						width: 20upx;
						height: 20upx;
						right: -10upx;
						border-radius: 100%;
						background-color: #f5f5f5;
					}
					.gap-top{
						top: -10upx;
					}
					.gap-bottom{
						bottom: -10upx;
					}
					.shixiao{
						position: absolute;
						right: 20upx;
						font-size: 150upx;
						z-index: 6;
						color: rgba(153,153,153,0.2)
					}
				}
				.right{
					flex-shrink: 0;
					width: 28%;
					color: #fff;
					background:linear-gradient(to right,#ec625c,#ee827f);
					&.invalid{
						background:linear-gradient(to right,#aaa,#999);
						.use{
							color: #aaa;
						}
					}
					justify-content: center;
					.ticket,.criteria{width: 100%;}
					.ticket{
						padding-top: 1vw;
						justify-content: center;
						align-items: baseline;
						height: 6vw;
						.num{
							font-size: 42upx;
							font-weight: 600;
						}
						.unit{
							font-size: 24upx;
						}
					}
					.criteria{
						justify-content: center;
						
						font-size: 28upx;
					}
					.use{
						width: 50%;
						height: 40upx;
						justify-content: center;
						align-items: center;
						font-size: 24upx;
						background-color: #fff;
						color: #ee827f;
						border-radius: 40upx;
						padding: 0 10upx;
					}
				}
			}
			/*
			<view class="carrier" :class="[theIndex==index?'open':oldIndex==index?'close':'']" @touchstart="touchStart(index,$event)" @touchmove="touchMove(index,$event)" @touchend="touchEnd(index,$event)">
				<view class="left">
					<view class="title">
						10元日常用品类
					</view>
					<view class="term">
						2019-04-01~2019-05-30
					</view>
				</view>
				<view class="right">
					<view class="ticket">
						<view class="num">
							10
						</view>
						<view class="unit">
							元
						</view>
					</view>
					<view class="criteria">
						满50使用
					</view>
					<view class="use">
						去使用
					</view>
				</view>
			</view>
			* 
			* */
		}
	}
	.tis{
		width: 100%;
		height: 60upx;
		justify-content: center;
		align-items: center;
		font-size: 32upx;
	}
	.zy-icon {
		position: absolute;
		top: 10upx;
		right: 25upx;
		color: #dedede;
		font-size: 140upx;
	} 
	.zy-tag-activity {
		color: #fa436a;
		font-size: 23upx;
		width: 70upx;
		height: 45upx;
		line-height: 40upx;
		text-align: center;
		border: 1upx solid #fa436a;
		border-radius: 20upx;
		margin-left: 10upx;
	}
</style>

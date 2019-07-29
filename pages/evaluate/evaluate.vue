<template>
	<view>
		<view class="zy-evaluate-type">
			<uni-tag class="zy-evaluate-type-tag" text="全部" :inverted="true" :circle="true" :type="pager.goodsCommentCommentLevel === '' ? 'error' : 'default'" @click="switchType('')" />
			<uni-tag class="zy-evaluate-type-tag" text="好评" :inverted="true" :circle="true" :type="pager.goodsCommentCommentLevel === 0 ? 'error' : 'default'" @click="switchType(0)" />
			<uni-tag class="zy-evaluate-type-tag" text="中评" :inverted="true" :circle="true" :type="pager.goodsCommentCommentLevel === 1 ? 'error' : 'default'" @click="switchType(1)" />
			<uni-tag class="zy-evaluate-type-tag" text="差评" :inverted="true" :circle="true" :type="pager.goodsCommentCommentLevel === 2 ? 'error' : 'default'" @click="switchType(2)" />
		</view>
		<uni-evaluate :list-data="evaluateListData" :total-data="evaluateTotal" :rate="5"/>
		<uni-load-more v-if="evaluateListData.length > 0" :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniEvaluate from '@/components/xiujun-evaluate/uni-evaluate.vue';
	import uniTag from '@/components/uni-tag/uni-tag.vue';
	import {
		showInfoToast,
		doPostJson
	} from '@/common/util.js'
	import * as ResponseStatus from '@/common/response-status.js'
	export default {
		components: {
			uniEvaluate,
			uniTag,
			uniLoadMore
		},
		data() {
			return {
				pager: {
					pageNo: 1,
					pageSize: 10,
					sortColumn: 'goodsCommentCreateTime',
					sortOrder: 'desc',
					goodsCommentIsActive: 0,
					goodsCommentShopId: 0,
					goodsCommentGoodsId: 0,
					goodsCommentCommentLevel: ''
				},
				evaluateTotal: 0,
				evaluateListData: [],
				loadingType: 'more'
			};
		},
		onLoad(option){
			this.pager.goodsCommentShopId = option.shopId;
			this.pager.goodsCommentGoodsId = option.goodsId;
			this.loadData('init');
		},
		onPullDownRefresh() {
			this.loadData('pullDown');
		},
		//加载更多
		onReachBottom() {
			this.loadData('reachBottom');
		},
		methods: {
			// 请求数据
			async loadData(type){
				if (this.loadingType === 'loading') {
					//防止重复加载
					return
				}
				if (this.loadingType === 'nomore' && type !== 'init') {
					return
				}
				if (type === 'reachBottom') {
					this.pager.pageNo += 1
				}
				this.loadingType = 'loading';
				let url = '/user-goods-comment/any/pager-cond'
				doPostJson(url, this.pager, {}, false).then(response => {
					let [error, res] = response;
					if (res.data.code === ResponseStatus.OK) {
						this.loadingType = this.pager.pageNo * this.pager.pageSize >= res.data.data.total ? 'nomore' : 'more'
						let rows = res.data.data.rows;
						this.evaluateTotal = res.data.data.total;
						if (type === 'init') {
							this.evaluateListData = []
						} else if (type === 'pullDown') {
							this.evaluateListData = []
							uni.stopPullDownRefresh();
						}
						rows.forEach(item => {
							this.evaluateListData.push({
								header_img: item.userDetailHeadicon,
								user_name: item.userDetailNickname,
								rate: item.goodsCommentCommentRate,
								create_time: item.goodsCommentCreateTime,
								content: item.goodsCommentComments,
								imgs: item.imageList
							})
						})
					} else {
						showInfoToast('获取评论信息失败')
					}
				}).catch(err => {
					console.log(err);
				})
			},
			/**
			 * 切换评论类型
			 */
			switchType(type) {
				if (this.pager.goodsCommentCommentLevel !== type) {
					this.pager.goodsCommentCommentLevel = type;
					// 请求后端获取到对应类型的数据
					this.loadData('init');
				}
			}
		}
	}
</script>

<style lang='scss'>
	/* 评论类型 */
	.zy-evaluate-type {
		padding: 6%;
		.zy-evaluate-type-tag {
			margin: 3%;
		}
	}
</style>

<template>
	<view>
		<view class="zy-evaluate-type">
			<uni-tag class="zy-evaluate-type-tag" text="全部" :inverted="true" :circle="true" :type="pager.type === '' ? 'error' : 'default'" @click="switchType('')" />
			<uni-tag class="zy-evaluate-type-tag" text="好评" :inverted="true" :circle="true" :type="pager.type === 0 ? 'error' : 'default'" @click="switchType(0)" />
			<uni-tag class="zy-evaluate-type-tag" text="中评" :inverted="true" :circle="true" :type="pager.type === 1 ? 'error' : 'default'" @click="switchType(1)" />
			<uni-tag class="zy-evaluate-type-tag" text="差评" :inverted="true" :circle="true" :type="pager.type === 2 ? 'error' : 'default'" @click="switchType(2)" />
		</view>
		<uni-evaluate :list-data="evaluateListData" :rate="6"/>
	</view>
</template>

<script>
	import uniEvaluate from '@/components/xiujun-evaluate/uni-evaluate.vue';
	import uniTag from '@/components/uni-tag/uni-tag.vue'
	export default {
		components: {
			uniEvaluate,
			uniTag
		},
		data() {
			return {
				pager: {
					pageNo: 1,
					pageSize: 10,
					isActive: 0,
					type: ''
				},
				evaluateListData: []
			};
		},
		onLoad(){
			this.loadData();
		},
		onPullDownRefresh() {
			this.loadData();
		},
		methods: {
			// 请求数据
			async loadData(){
				let list = await this.$api.json('evaluateListData'); 
				this.evaluateListData = list;
				
			},
			/**
			 * 切换评论类型
			 */
			switchType(type) {
				if (this.pager.type !== type) {
					this.pager.type = type;
					// 请求后端获取到对应类型的数据
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

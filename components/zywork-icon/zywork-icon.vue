<template>
	<view>
		<view class="iconfont" :class="[type]" :style="{color:color,'font-size':fontSize}" @click="onClick()"></view>
		<view class="reddot" v-if="reddot"></view>
	</view>
</template>

<script>
	export default {
		name: 'zywork-icon',
		props: {
			/**
			 * 图标类型
			 */
			type: String,
			/**
			 * 图标颜色
			 */
			color: String,
			/**
			 * 图标大小
			 */
			size: [Number, String],
			reddot: false
		},
		computed: {
			fontSize() {
				return `${this.size}px`
			}
		},
		methods: {
			onClick() {
				// this.$emit('click')
			}
		}
	}
</script>

<style>
	@import '../../common/iconfont.css';
	.reddot {
		width: 20upx;
		height: 20upx;
		border-radius: 10upx;
		background-color: #FF0000;
		position: absolute;
		top: -10upx;
		right: 5upx;
	}
</style>
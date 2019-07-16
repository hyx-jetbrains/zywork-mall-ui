<template>
	<view class="zy-no-data">{{text}}</view>
</template>

<script>
	export default {
		name: 'zywork-no-data',
		props: {
			text: String
		},
		computed: {
			
		},
		methods: {
		}
	}
</script>

<style>
	.zy-no-data {
		width: 100;
		padding: 20upx;
		text-align: center;
	}
</style>
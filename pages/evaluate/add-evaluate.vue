<template>
	<view>
		<my-issue key="1" @submit="submit" />
	</view>
</template>

<script>
	import myIssue from '@/components/my-issue/my-issue.vue'
	import {
		showInfoToast
	} from '@/common/util.js'
	export default {
		components: {
			myIssue
		},
		data() {
			return {
				
			};
		},
		onLoad(){
		},
		methods: {
			submit(formData) {
				console.log(formData);
				showInfoToast('暂未实现')
			}
		}
	}
</script>

<style lang='scss'>
</style>

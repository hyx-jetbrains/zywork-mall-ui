<template>
	<view class="uni-numbox">
		<view class="uni-numbox-minus" 
			@click="_calcValue('subtract')"
		>
			<text class="iconfont iconjian" :class="disableMin?'uni-numbox-disabled': ''" ></text>
		</view>
		<input 
			class="uni-numbox-value" 
			type="number" 
			:disabled="disabled"
			v-model="inputValue" 
			@blur="_onBlur"
		>
		<view 
			class="uni-numbox-plus" 
			@click="_calcValue('add')"
		>
			<text class="iconfont iconjia" :class="disableMax?'uni-numbox-disabled': ''" ></text>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'uni-number-box',
		props: {
			index: {
				type: Number,
				default: 0
			},
			index_: {
				type: Number,
				default: 0
			},
			value: {
				type: Number,
				default: 0
			},
			min: {
				type: Number,
				default: -Infinity
			},
			max: {
				type: Number,
				default: Infinity
			},
			step: {
				type: Number,
				default: 1
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				inputValue: this.value,
				disableMin: false,
				disableMax: false
			}
		},
		created(){
			if (this.min === this.inputValue) {
				this.disableMin = true
			}
			if (this.max != 0 && this.inputValue >= this.max) {
				this.disableMax = true
				this.inputValue = this.max
			}
		},
		computed: {
		},
		watch: {
			inputValue(number) {
				const data = {
					number: number,
					index: this.index,
					index_: this.index_
				}
				this.$emit('eventChange', data)
			},
			value(number) {
				this.inputValue = number
			}
		},
		methods: {
			_calcValue(type) {
				const scale = this._getDecimalScale();
				let value = this.inputValue * scale;
				let newValue = 0;
				let step = this.step * scale;
				
				if(type === 'subtract'){
					newValue = value - step;
					if (newValue <= this.min){
						this.disableMin = true
					}
					if(newValue < this.min){
						newValue = this.min
					}
					if(newValue < this.max){
						this.disableMax = false
					}
				}else if(type === 'add'){
					newValue = value + step;
					if (newValue >= this.max){
						this.disableMax = true
					}
					if(newValue > this.max){
						newValue = this.max
					}
					if(newValue > this.min){
						this.disableMin = false
					}
				}
				if(newValue === value){
					return;
				}
				this.inputValue = newValue / scale;
			},
			_getDecimalScale() {
				let scale = 1;
				// 浮点型
				if (~~this.step !== this.step) {
					scale = Math.pow(10, (this.step + '').split('.')[1].length);
				}
				return scale;
			},
			_onBlur(event) {
				let value = event.detail.value
				if (!value) {
					this.inputValue = 0
					return
				}
				value = +value
				if (value > this.max) {
					value = this.max
				} else if (value < this.min) {
					value = this.min
				}

				this.inputValue = value
			}
		}
	}
</script>
<style>
	.uni-numbox {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width:230upx;
		height: 70upx;
		background:#f5f5f5;
	}

	.uni-numbox-minus,
	.uni-numbox-plus {
		margin: 0;
		background-color: #f5f5f5;
		width: 70upx;
		height: 100%;
		line-height: 70upx;
		text-align: center;
		position: relative;
	}
	.uni-numbox-minus .iconfont,
	.uni-numbox-plus .iconfont{
		font-size: 36upx;
		color: #555;
	}

	.uni-numbox-minus {
		border-right: none;
		border-top-left-radius: 6upx;
		border-bottom-left-radius: 6upx;
	}

	.uni-numbox-plus {
		border-left: none;
		border-top-right-radius: 6upx;
		border-bottom-right-radius: 6upx;
	}

	.uni-numbox-value {
		position: relative;
		background-color: #f5f5f5;
		width: 90upx;
		height: 50upx;
		text-align: center;
		padding: 0;
		font-size: 30upx;
	}

	.uni-numbox-disabled.iconfont {
		color: #d6d6d6;
	}
</style>

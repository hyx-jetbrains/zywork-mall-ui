<template>
	 <!-- 海报(想让海报显示隐藏要用hidden，v-if关闭后没办法在完整的出来海报) 保存海报按钮和关闭按钮 在html代码中写出来 绑定点击方法然后透明 再用canvas 覆盖 -->
	<view class="canvas_box" :hidden="theCanvasFlag">
		<view class="canvas_box_mask"></view><!-- 遮罩 -->
		<view class="button-wrapper"><!-- 保存海报按钮 -->
			<cover-view class="save_btn" @tap="saveCanvasImage"></cover-view>
			<cover-view class="save_btn" @tap="canvasCancelEvn"></cover-view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			theCanvasFlag:{
				type:Boolean,
				default:true,
			},
			posterObj:{
				type:Object,
				default:{
					url:'https://img0.zuipin.cn/mp_zuipin/poster/hch-pro.jpg',//商品主图
					xcxTitle:'小程序标题',//小程序标题
					title:"诗酒茶系列 武夷大红袍 2018年 花香型中火 一级 体验装 16g",//标题
					discountPrice:"250.00",//折后价格
					orignPrice:"300.00",//原价
					code:'https://img0.zuipin.cn/mp_zuipin/poster/hch-code.png',//小程序码
				}
			}
		},
		data() {
			return {
				canvasFlag: this.theCanvasFlag,
				isProductImgOk: false,
				isXcxCodeOk: false
			}
		},
		methods:{
			// 海报
			// 画圆角矩形 ctx、x起点、y起点、w宽度、h高度、r圆角半径、fillColor填充颜色、strokeColor边框颜色
			roundRect(ctx, x, y, w, h, r, fillColor, strokeColor,btn) {
				// 开始绘制
				ctx.beginPath()
				// 绘制左上角圆弧 Math.PI = 180度
				// 圆心x起点、圆心y起点、半径、以3点钟方向顺时针旋转后确认的起始弧度、以3点钟方向顺时针旋转后确认的终止弧度
				ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
				// 绘制border-top
				// 移动起点位置 x终点、y终点
				ctx.moveTo(x + r, y)
				// 画一条线 x终点、y终点
				ctx.lineTo(x + w - r, y)
				// 绘制右上角圆弧
				ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
				// 绘制border-right
				ctx.lineTo(x + w, y + h - r)
				// 绘制右下角圆弧
				
				ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
			
				// 绘制左下角圆弧
				
				ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
				
				// 绘制border-left
				ctx.lineTo(x, y + r)
				if(btn=='btn'){
					const grd = ctx.createLinearGradient(0, 0, 200, 0)//渐变色
					grd.addColorStop(0, fillColor)
					grd.addColorStop(1, strokeColor)
					// 因为边缘描边存在锯齿，最好指定使用 transparent 填充
					ctx.setFillStyle(grd)
					// 对绘画区域填充
					ctx.fill()
				}else{
			
					if (fillColor) {
					// 因为边缘描边存在锯齿，最好指定使用 transparent 填充
					ctx.setFillStyle(fillColor)
					// 对绘画区域填充
					ctx.fill()
					}
					if (strokeColor) {
					// 因为边缘描边存在锯齿，最好指定使用 transparent 填充
					ctx.setStrokeStyle(strokeColor)
					// 画出当前路径的边框
					ctx.stroke()
					}
				}
				// 关闭一个路径
				ctx.closePath()
				// 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore 这个很重要 不然没办法保存
				ctx.clip()
			},
			
			/**
			* canvas绘图相关，把文字转化成只能行数，多余显示省略号
			* ctx: 当前的canvas
			* text: 文本
			* contentWidth: 文本最大宽度
			* lineNumber: 显示几行
			*/
			canvasMultiLineText(ctx, text, contentWidth, lineNumber) {
				var textArray = text.split(""); // 分割成字符串数组
				var temp = "";
				var row = [];
				for (let i = 0; i < textArray.length; i++) {
					if (ctx.measureText(temp).width < contentWidth) {
					temp += textArray[i];
					} else {
					i--; // 这里添加i--是为了防止字符丢失
					row.push(temp);
					temp = "";
					}
				}
				row.push(temp);
			
				// 如果数组长度大于2，则截取前两个
				if (row.length > lineNumber) {
					var rowCut = row.slice(0, lineNumber);
					var rowPart = rowCut[1];
					var test = "";
					var empty = [];
					for (var a = 0; a < rowPart.length; a++) {
					if (ctx.measureText(test).width < contentWidth) {
						test += rowPart[a];
					} else {
						break;
					}
					}
					empty.push(test); // 处理后面加省略号
					var group = empty[0] + '...'
					rowCut.splice(lineNumber - 1, 1, group);
					row = rowCut;
				}
				return row;
			},
			// 获取海报的小程序码
			codeImg(){
				return new Promise((resolve,reject)=>{
					request({
						method: 'get',
						url:'/spSupport/getwxacodeunlimit',
						header: { 'Content-Type': 'application/x-www-form-urlencoded' },
						data: {
							version:this.$parent.globalData.version,
							scene:`sku=${this.sku}`,
							page:"pages/product/detail",
							width:"128px",
						},
					}).then((res)=>{
						if (res.data.code==0) {
						const fsm = wx.getFileSystemManager();
							const FILE_BASE_NAME = 'tmp_img_src';
							let filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.jpg`;
							fsm.writeFile({
								filePath,
								data: res.data.data,
								encoding: 'binary',
								success() {
									resolve(filePath)
								},
								fail() {
									this.canvasFlag=true;
									uni.showToast({title:'海报生成失败',duration:2000,icon:'none'});
								},
							});
						} else {
							uni.showToast({title: res.data.message, icon: 'none',duration: 2000,icon:'none'})
						}
					}).catch(()=>{
						this.canvasFlag=true;
						uni.showToast({title:'海报生成失败',duration:2000,icon:'none'});
					})
				})
			},
			
			
			// 生成海报
			createCanvasImage() {
				console.log(this.posterObj,'posterObj')
				// this.canvasFlag=false;
				// this.deliveryFlag = false;//关闭分享的弹窗
				console.log("海报生成中")
				wx.showLoading({
					title: '海报生成中...'
				})
				let _this = this;
				let phoneData = wx.getSystemInfoSync();
				this.phoneH = phoneData.windowHeight;
				this.phoneW = phoneData.windowWidth;
				let scaleW = this.phoneW/375;//按照苹果留 375*667比例 其他型号手机等比例缩放 显示
				let scaleH = this.phoneH/667;//按照苹果留 375*667比例 其他型号手机等比例缩放 显示
				console.log(this.phoneH,this.phoneW)
				const ctx = wx.createCanvasContext('myCanvas');
				let url=this.posterObj.url;//商品主图
				let zpPriceIcon=this.posterObj.icon//图标
				let code=this.posterObj.code

				ctx.draw()//清空原来的画图内容
				ctx.save();
				this.roundRect(ctx,50,40,(this.phoneW-100), (this.phoneH-120),10,'#fff','#fff');//绘制海报圆角背景白色的
				ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
				ctx.save();
				this.roundRect(ctx,50,40,(this.phoneW-100), (370)*scaleH,10,'#f7f7f7','#f7f7f7');//绘制海报圆角背景 上半截灰色的
				ctx.restore();
				//将网络图片转成本地路径 商品图片
			    wx.getImageInfo({
			       src: url,
			       success(res) {
						ctx.save();
						//覆盖绘制
						//问题：在微信小程序使用canvas绘制圆角图片时，微信调试工具正常显示，android真机都不显示。
						// 原因：因为ctx.clip()剪切区域使用的填充颜色是透明的，所以图片没出来。
						// 解决方案：将剪切区域设置成实体颜色就好了。
						_this.roundRect(ctx,(_this.phoneW-((_this.phoneW-130)))/2,55,(_this.phoneW-130), 250*scaleH,5,'#f7f7f7','#f7f7f7')//绘制图片圆角背景
						ctx.drawImage(res.path, (_this.phoneW-((_this.phoneW-130)))/2,55,(_this.phoneW-130), 250*scaleH,5);//绘制图
						ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
						ctx.draw(true)
						_this.isProductImgOk = true
				   } ,
					fail(){
						_this.canvasFlag=true;
						uni.showToast({title:'商品图片绘制错误',duration:2000,icon:'none'});
					}
				})
				// 海报商品title
				setTimeout(()=>{
					ctx.setGlobalAlpha(1)//不透明
					ctx.setFillStyle('#1c1c1c')//文字颜色：默认黑色
					ctx.setFontSize(14)//设置字体大小，默认10
					ctx.font = 'normal bold 14px sans-serif';
					let text =this.posterObj.title;
					let row = this.canvasMultiLineText(ctx,text,(this.phoneW-130),2);//计算绘制的2行文本
					let contentTextY = 360; // 这段文字起始的y位置
					let leftSpace = 65; // 这段文字起始的X位置
					let textLineHeight = 18; // 一行文字加一行行间距
					for (let b = 0; b < row.length; b++) {//一行一行绘制文本
						ctx.fillText(row[b], leftSpace, (contentTextY+ textLineHeight * b-15)*scaleH, (this.phoneW-130));
						ctx.draw(true)
					}
				},500)
				// 海报商品title end
				//绘制价格
				ctx.setFontSize(12)//设置字体大小，默认10
				ctx.setFillStyle('#fa436a')//文字颜色：默认黑色
				ctx.font = 'normal 12px sans-serif';
				ctx.fillText('￥', 65, 396*scaleH,60);
				ctx.setFontSize(16)//设置字体大小，默认10
				let zpPrice = this.posterObj.discountPrice;//会员价格
				let orignPrice = this.posterObj.orignPrice;//市场价
				
				let zpPriceW = ctx.measureText(zpPrice).width;//文本的宽度
				ctx.fillText(zpPrice, 75, 396*scaleH,zpPriceW);
			
				ctx.beginPath();//开始一个新的路径
				ctx.setFontSize(10)//设置字体大小，默认10
				ctx.setFillStyle('#fa436a')//文字颜色：默认黑色
				if (orignPrice) {
					let orignPriceW = ctx.measureText(orignPrice).width//去掉市场价
					ctx.fillText(`￥${orignPrice}`, 85+zpPriceW+5, 395*scaleH,orignPriceW); //5价格间距
					ctx.moveTo(85+zpPriceW+5,392*scaleH);//设置线条的起始路径坐标
					ctx.lineTo(85+zpPriceW+5+orignPriceW,392*scaleH);//设置线条的终点路径坐标
					ctx.setStrokeStyle('#999')
				}
				
				ctx.stroke();//对当前路径进行描边
				ctx.closePath();//关闭当前路径
				//绘制价格 end
				// this.codeImg().then((res)=>{
					// 小程序码
					wx.getImageInfo({
				       src: code,
				       success(res) {
						ctx.drawImage(res.path,(_this.phoneW-70)/2,430*scaleH, 70,70)
						ctx.draw(true)
						_this.isXcxCodeOk = true
				      },
						fail(){
							_this.canvasFlag=true;
							//uni.showToast({title:'小程序码绘制错误',duration:2000,icon:'none'});
							
						}
					})
				// });
				
				// 小程序码end
				// 小程序的名称
				ctx.setFontSize(14)
				ctx.setFillStyle('#2f1709')//文字颜色：默认黑色
				ctx.font = 'normal bold 14px sans-serif';
				ctx.fillText(_this.posterObj.xcxTitle, (_this.phoneW-70)/2, 530*scaleH,90);
				// 小程序的名称end
				// 长按/扫描识别查看商品
				ctx.setFontSize(14)
				ctx.setFillStyle('#fa436a')//文字颜色：默认黑色
				ctx.font = 'normal 14px sans-serif';
				ctx.fillText('长按并识别小程序码查看商品', (_this.phoneW-140)/2, 550*scaleH,140);
				// 长按/扫描识别查看商品end
				//绘制保存按钮
				ctx.save(); 
				this.roundRect(ctx,(this.phoneW-210)/2,(this.phoneH-55),95, 33,18,'#fa436a','#fa436a','btn')
				ctx.restore(); 
				ctx.setFontSize(14)
				ctx.setFillStyle('#fff')//文字颜色：默认黑色
				ctx.font = 'normal bold 14px sans-serif';
				ctx.fillText('保存图片', (_this.phoneW-168)/2, (this.phoneH-33),58);
				ctx.save();
				this.roundRect(ctx,(this.phoneW + 15)/2,(this.phoneH-55),95, 33,18,'#f7f7f7','#f7f7f7','btn')
				ctx.restore(); 
				ctx.setFontSize(14)
				ctx.setFillStyle('#fa436a')//文字颜色：默认黑色
				ctx.font = 'normal bold 14px sans-serif';
				ctx.fillText('关闭', (_this.phoneW + 85)/2, (this.phoneH-33),58);
				//绘制保存按钮 end
				wx.hideLoading();
			},
			
			// 保存到系统相册
			saveCanvasImage(){
				console.log('点击了保存')
				if (!this.isProductImgOk || !this.isXcxCodeOk) {
					showInfoToast('还在生成海报哦')
					return
				}
				wx.showLoading({
					title: '保存中...'
				})
				let _this = this;
				// 1-把画布转化成临时文件
				uni.canvasToTempFilePath({
				x: 50,
				y: 40,
				width:(this.phoneW-100),    // 画布的宽
				height: (this.phoneH-120),   // 画布的高
				destWidth: (this.phoneW-100)*5,
				destHeight: (this.phoneH-120)*5,
				canvasId: 'myCanvas',
				success(res) {
					// 2-保存图片至相册
					uni.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success(res2) {
						wx.hideLoading();
						uni.showToast({title: '图片保存成功，可以去分享啦~', duration: 2000, icon: 'none'})
						_this.canvasCancelEvn();
					},
					fail() {
						uni.showToast({title: '保存失败，稍后再试', duration: 2000,icon:'none'})
						wx.hideLoading();
					}
					})
				},
				fail() {
					uni.showToast({title: '保存失败，稍后再试',duration: 2000,icon:'none'})
					wx.hideLoading();
				}
				})
			},
			// 取消海报
			canvasCancelEvn(){
				console.log()
				this.$emit('cancel',true)
			}
		}
	}
</script>

<style lang="scss">
	.content {
		text-align: center;
		height: 100%;
	}
	.canvas_box{
	    .canvas_box_mask{
	        width: 100%;
	        height: 100%;
	        position: fixed;
	        top: 0;
	        right: 0;
	        bottom: 0;
	        left: 0;
	        background: rgba(0, 0, 0, 0.5);
	        z-index:9;
	    }
	    .canvas{
	        position: fixed !important;
	        top: 0 !important;
	        left: 0 !important;
	        display: block !important;
	        width: 100% !important;
	        height: 100% !important;
	        z-index: 9;
	    }
	    .button-wrapper {
	        width: 70%;
	        height: 90rpx;
	        position: absolute;
	        bottom: 40rpx;
			left: 12%;
			z-index: 16;
			display: flex;
			justify-content: space-between;
	    }
	    
	    .save_btn{
	        font-size: 30rpx;
	        line-height: 66rpx;
	        color: #fff;
	        width:100%;
	        height:100%;
	        text-align: center;
	        border-radius: 45rpx;
	        border-radius: 36rpx;
	        z-index: 10;
	    }
	    .canvas_close_btn{
	        position: fixed;
	        top:30rpx;
	        right:0;
	        z-index:12;
	
	    }
	}
</style>

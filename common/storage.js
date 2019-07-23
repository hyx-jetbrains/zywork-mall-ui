/**
 * 浏览历史-key
 */
export const PRODUCT_HISTORY = 'productHistory'


/**
 * 保存浏览历史
 */
export const setProductHistory = (goodsId, imgSrc) => {
	let product = {
		goodsId: goodsId,
		imgSrc: imgSrc
	}
	uni.getStorage({
		key: PRODUCT_HISTORY,
		success: (res) => {
			let productList = res.data
			let hasFlag = false
			let index = 0
			for (let pro of productList) {
				if (pro.goodsId === goodsId) {
					productList.splice(index, 1)
					productList.unshift(product)
					hasFlag = true
					break
				}
				index++
			}
			if (!hasFlag) {
				productList.unshift(product)
			}
			//最多10个纪录
			productList.length > 10 && productList.pop();
			uni.setStorage({
				key: PRODUCT_HISTORY,
				data: productList
			});
		},
		fail: (e) => {
			let productList = [product];
			uni.setStorage({
				key: PRODUCT_HISTORY,
				data: productList
			});
		}
	});
}
/**
 * 获取缓存中的浏览历史
 */
export const getProductHistory = () => {
	let productHis = uni.getStorageSync(PRODUCT_HISTORY)
	return  productHis ? productHis : []
}

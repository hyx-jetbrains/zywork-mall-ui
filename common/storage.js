/**
 * 浏览历史-key
 */
export const PRODUCT_HISTORY = 'productHistory'


/**
 * 保存浏览历史
 */
export const setProductHistory = (goodsId, imgSrc) => {
	let product = goodsId + '#' + imgSrc;
	uni.getStorage({
		key: PRODUCT_HISTORY,
		success: (res) => {
			let OldProduct = JSON.parse(res.data);
			let findIndex = OldProduct.indexOf(product);
			if (findIndex == -1) {
				OldProduct.unshift(product);
			} else {
				OldProduct.splice(findIndex, 1);
				OldProduct.unshift(product);
			}
			//最多10个纪录
			OldProduct.length > 10 && OldProduct.pop();
			uni.setStorage({
				key: PRODUCT_HISTORY,
				data: JSON.stringify(OldProduct)
			});
		},
		fail: (e) => {
			let OldProduct = [product];
			uni.setStorage({
				key: PRODUCT_HISTORY,
				data: JSON.stringify(OldProduct)
			});
		}
	});
}
/**
 * 获取缓存中的浏览历史
 */
export const getProductHistory = () => {
	let productHis = uni.getStorageSync(PRODUCT_HISTORY)
	return  productHis ? JSON.parse(productHis) : []
}

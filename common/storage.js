/**
 * 浏览历史-key
 */
export const BROWSE_HISTORY = 'browseHistory'


/**
 * 保存浏览历史
 */
export const setBrowseHistory = (id, imgSrc) => {
	var product = id + "#" + imgSrc;
	uni.getStorage({
		key: BROWSE_HISTORY,
		success: (res) => {
			var OldProduct = JSON.parse(res.data);
			var findIndex = OldProduct.indexOf(product);
			if (findIndex == -1) {
				OldProduct.unshift(product);
			} else {
				OldProduct.splice(findIndex, 1);
				OldProduct.unshift(product);
			}
			//最多10个纪录
			OldProduct.length > 10 && OldProduct.pop();
			uni.setStorage({
				key: BROWSE_HISTORY,
				data: JSON.stringify(OldProduct)
			});
		},
		fail: (e) => {
			var OldProduct = [product];
			uni.setStorage({
				key: BROWSE_HISTORY,
				data: JSON.stringify(OldProduct)
			});
		}
	});
}
/**
 * 获取缓存中的浏览历史
 */
export const getBrowseHistory = () => {
	var OldProduct = [];
	uni.getStorage({
		key: BROWSE_HISTORY,
		success: (res) => {
			OldProduct = JSON.parse(res.data);
		}
	});
	return OldProduct;
}

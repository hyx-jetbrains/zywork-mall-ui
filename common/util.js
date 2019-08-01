// export const BASE_URL = 'https://gnmymall.com/api'
export const BASE_URL = 'http://127.0.0.1:8088'
export const FRONT_BASE_URL = 'https://gnmymall.com/'
export const DOCUMENT_BASE_URL = 'https://gnmymall.com'
export const SHARE_TITLE = '赣南名优网'
export const USER_TOKEN_KEY = 'userToken'
export const USER_OPENID = 'openid'
export const SHARE_CODE = 'shareCode'
export const MY_SHARE_CODE = 'myShareCode'
export const USER_ID = 'userId'
export const USER_ROLES = 'userRoles'
export const USER_PHONE = 'userPhone'
export const HAS_USER_INFO = 'hasUserInfo'
export const DEFAULT_HEADICON = '/static/missing-face.png'
export const SHARE_CODE_PAGE_IMG = '/static/share/share.jpg'
export const REFRESH_CART = 'refreshCart'
export const REFRESH_PRODUCT = 'refreshProduct'
export const REFRESH_ORDER = 'refreshOrder'
export const MALL_DISTRIBUTOR_FLAG = 'mallDistributorFlag'

export const LOCAL_FILE_STORAGE = true
/**
 * 判断是否为空（null, '', undefined）
 */
export const isEmpty = (data) => {
	return !data
}

/**
 * 判断是否不为空（null, '', undefined）
 */
export const isNotEmpty = (data) => {
	return !isEmpty(data)
}

/**
 * 清除表单
 */
export const clearForm = (form) => {
	for (let key in form) {
		form[key] = null
	}
}
/**
 * token失效
 */
export const invalidToken = () => {
	removeUserToken()
	showInfoToast('登录已失效，请重新登录')
}
/**
 * 网络异常
 */
export const networkError = () => {
	showInfoToast('网络有问题哦~')
}
/**
 * 显示提示信息
 */
export const showInfoToast = (title) => {
	uni.showToast({
		title: title,
		icon: 'none',
		duration: 3000
	})
}
/**
 * 显示成功的信息
 */
export const showSuccessToast = (title) => {
	uni.showToast({
		title: title,
		duration: 3000
	})
}
/**
 * 获取日历日期
 */
export const getCalendarDate = (date) => {
	if (typeof date !== 'object') {
		date = date.replace(/-/g, '/')
	}
	let dd = new Date(date);
	let y = dd.getFullYear();
	let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1
	let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
	return y + '-' + m + '-' + d
}
/**
 * 格式化日历日期
 */
export const formatCalendarDate = (date) => {
	if (typeof date !== 'object') {
		date = date.replace(/-/g, '/')
	}
	let dd = new Date(date);
	let y = dd.getFullYear();
	let m = dd.getMonth() + 1
	let d = dd.getDate()
	let w = dd.getDay()
	let week = '星期'
	switch (w) {
		case 0:
			week = week + '日';
			break;
		case 1:
			week = week + '一';
			break;
		case 2:
			week = week + '二';
			break;
		case 3:
			week = week + '三';
			break;
		case 4:
			week = week + '四';
			break;
		case 5:
			week = week + '五';
			break;
		case 6:
			week = week + '六';
			break;
		default:
			break;
	}
	return y + '-' + m + '-' + d + ' ' + week
}
/**
 * 获取时间
 */
export const getDate = (type) => {
	const date = new Date();

	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();

	if (type === 'start') {
		year = year - 60;
	} else if (type === 'end') {
		year = year + 2;
	}
	month = month > 9 ? month : '0' + month;
	day = day > 9 ? day : '0' + day;

	return `${year}-${month}-${day}`;
}
/**
 * 获取当前时间
 */
export const getCurrentDate = () => {
	let date = new Date()
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	month = month > 9 ? month : '0' + month
	day = day > 9 ? day : '0' + day
	return year + '-' + month + '-' + day
}

/**
 * null转成空字符串
 */
export const nullToStr = (data) => {
	for (let x in data) {
		if (data[x] === null) { // 如果是null 把直接内容转为 ''
			data[x] = '';
		} else {
			if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
				data[x] = data[x].map(z => {
					return nullToStr(z);
				});
			}
			if (typeof(data[x]) === 'object') { // 是json 递归继续处理
				data[x] = nullToStr(data[x])
			}
		}
	}
	return data;
}

/**
 * 取指定的日期
 * @param {type} 7：上周开始时间 1：上周结束时间 0：本周开始时间 -6：本周结束时间 -7：下周开始时间 -13：下周结束时间  
 */
export const getAppointWeekDate = (n) => {
	var now = new Date();
	var year = now.getFullYear();
	//因为月份是从0开始的,所以获取这个月的月份数要加1才行
	var month = now.getMonth() + 1;
	var date = now.getDate();
	var day = now.getDay();
	//判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
	if (day !== 0) {
		n = n + (day - 1);
	} else {
		n = n + day;
	}
	if (day) {
		//这个判断是为了解决跨年的问题
		if (month > 1) {
			month = month;
		}
		//这个判断是为了解决跨年的问题,月份是从0开始的
		else {
			year = year - 1;
			month = 12;
		}
	}
	now.setDate(now.getDate() - n);
	year = now.getFullYear();
	month = now.getMonth() + 1;
	date = now.getDate();
	// console.log(n);
	var s = year + "-" + (month < 10 ? ('0' + month) : month) + "-" + (date < 10 ? ('0' + date) : date);
	return s;
}

/**
 * 获取本月第一天或最后一天的日期
 * @param type 默认是获取本月第一天的日期，传入1:获取本月最后一天的日期
 */
export const showMonthFirstOrLastDay = (type) => {
	var nowDate = new Date();
	var monthFirstDay = new Date(nowDate.getYear(), nowDate.getMonth() + 1, 1);
	var monthLastDay = new Date(monthFirstDay - 86400000);
	var month = Number(monthFirstDay.getMonth())
	if (month === 0) {
		month = 12
	}
	var day = monthFirstDay.getDate();
	if (1 === type) {
		month = Number(monthLastDay.getMonth()) + 1
		day = Number(monthLastDay.getDate());
	}
	month = month < 10 ? '0' + month : month;
	day = day < 10 ? '0' + day : day;
	return nowDate.getFullYear() + "-" + month + "-" + day;
}

/**
 * 获取下月第一天或最后一天的日期
 * @param type 默认是获取下月第一天的日期，传入1:获取下月最后一天的日期
 */
export const showNextMonthFirstOrLastDay = (type) => {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var date = now.getDate();
	// 解决跨年的问题
	if (12 === month) {
		// 当前是12月，则下月是1月
		month = 1;
		year = year + 1;
	} else {
		// 获取下个月的月份
		month = month + 1;
	}
	var monthFirstDay = new Date(year, month, 1);
	var monthLastDay = new Date(year, month, 0);
	var tempMonth = Number(monthFirstDay.getMonth())
	var tempDay = monthFirstDay.getDate();
	if (1 === type) {
		tempMonth = Number(monthLastDay.getMonth()) + 1
		tempDay = Number(monthLastDay.getDate());
	}
	tempMonth = tempMonth < 10 ? '0' + tempMonth : tempMonth;
	tempDay = tempDay < 10 ? '0' + tempDay : tempDay;
	return year + "-" + tempMonth + "-" + tempDay;
}

/**
 * 判断是否是手机号
 */
export const isPhone = (phone) => {
	var phoneExp = /^[1][3,4,5,7,8,9][0-9]{9}$/;
	return phoneExp.test(phone);
}
/**
 * 页面跳转,保留当前页面
 * @param {Object} url 跳转的url
 * @param {Object} isLogin 是否需要验证登入
 */
export const navTo = (url, isLogin) => {
	if (isLogin) {
		// 需要验证是否有登入,后面完成，暂时不验证
	}
	uni.navigateTo({
		url: url
	})
}
/**
 * 页面跳转，不保留当前页面
 * @param {Object} url 跳转的url
 * @param {Object} isLogin 是否需要验证登入
 */
export const redTo = (url, isLogin) => {
	if (isLogin) {
		// 需要验证是否有登入,后面完成，暂时不验证
	}
	uni.redirectTo({
		url: url
	})
}

/**
 * post请求，application/json
 * @param {*} url 请求url
 * @param {*} data json对象
 * @param {*} headers 如headers: {
                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                          'Authorization': 'Bearer ' + getLocalStorageToken()
                        }
                      如果不需要传递headers，则直接使用{}
 * @param {*} token 如传true：需要token，传false：不需要token
 */
export const doPostJson = (url, data, headers, token) => {
	if (token) {
		const userToken = uni.getStorageSync(USER_TOKEN_KEY)
		headers['Authorization'] = 'Bearer ' + userToken
	}
	return uni.request({
		url: BASE_URL + url,
		method: 'POST',
		data: data,
		header: headers
	})
}

/**
 * post请求，application/x-www-form-urlencoded
 * @param {*} url 请求url
 * @param {*} data json对象
 * @param {*} headers 如headers: {
                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                          'Authorization': 'Bearer ' + getLocalStorageToken()
                        }
                      如果不需要传递headers，则直接使用{}
 * @param {*} token 如传true：需要token，传false：不需要token
 */
export const doPostForm = (url, data, headers, token) => {
	headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
	if (token) {
		const userToken = uni.getStorageSync(USER_TOKEN_KEY)
		headers['Authorization'] = 'Bearer ' + userToken
	}
	return uni.request({
		url: BASE_URL + url,
		method: 'POST',
		data: data,
		header: headers
	})
}

/**
 * get请求
 * @param {*} url 请求url，包含请求参数
 * @param {*} headers 如headers: {
                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                          'Authorization': 'Bearer ' + getLocalStorageToken()
                        }
                      如果不需要传递headers，则直接使用{}
 * @param {*} token 如传true：需要token，传false：不需要token
 */
export const doGet = (url, headers, token) => {
	if (token) {
		const userToken = uni.getStorageSync(USER_TOKEN_KEY)
		headers['Authorization'] = 'Bearer ' + userToken
	}
	return uni.request({
		url: BASE_URL + url,
		method: 'GET',
		header: headers
	})
}

/**
 * 带参数的get请求
 * @param {*} url 请求url，可以包含请求参数
 * @param {*} data 请求的参数
 * @param {*} headers 如headers: {
                          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                          'Authorization': 'Bearer ' + getLocalStorageToken()
                        }
                      如果不需要传递headers，则直接使用{}
 * @param {*} token 如传true：需要token，传false：不需要token
 */
export const doGetForm = (url, data, headers, token) => {
	headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
	if (token) {
		const userToken = uni.getStorageSync(USER_TOKEN_KEY)
		headers['Authorization'] = 'Bearer ' + userToken
	}
	return uni.request({
		url: BASE_URL + url,
		method: 'GET',
		data: data,
		header: headers
	})
}

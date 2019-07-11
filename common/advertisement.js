import {BASE_URL, doPostJson} from './util.js'

export const advertisement = (pageNo, pageSize, advertisementTypeCode) => {
	return doPostJson(BASE_URL + '/adtype-ads/any/pager-cond', {
		pageNo: pageNo,
		pageSize: pageSize,
		advertisementTypeCode: advertisementTypeCode,
		sortColumn: 'advertisementAdOrder',
		sortOrder: 'asc',
		isActive: 0
	}, {})
}
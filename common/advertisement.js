import {doPostJson} from './util.js'

export const advertisement = (pageNo, pageSize, advertisementTypeCode) => {
	return doPostJson('/adtype-ads/any/pager-cond', {
		pageNo: pageNo,
		pageSize: pageSize,
		advertisementTypeCode: advertisementTypeCode,
		sortColumn: 'advertisementAdOrder',
		sortOrder: 'asc',
		isActive: 0
	}, {})
}
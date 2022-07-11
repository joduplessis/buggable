import { API_HOST, JWT } from '../constants'
import { createURLQueryString, returnParser } from '../helpers/util'

export class OptimizedSpendsService {
    static async getData(token, accountId, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(`${API_HOST}/accounts/${accountId}/report/optimised/data?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }
    static async getFilterChannel(token, accountId, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(`${API_HOST}/accounts/${accountId}/report/optimised/filter/source?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }
    static async getTotals(token, accountId, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(`${API_HOST}/accounts/${accountId}/report/optimised/totals/data?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }
}

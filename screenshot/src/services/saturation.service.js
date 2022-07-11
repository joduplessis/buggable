import { API_HOST, JWT } from '../constants'
import { createURLQueryString, returnParser } from '../helpers/util'

export class SaturationService {
    static async getData(token, accountId, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(`${API_HOST}/accounts/${accountId}/report/saturation_curve/data?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async getFilterSource(token, accountId, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(
            `${API_HOST}/accounts/${accountId}/report/saturation_curve/filter/source?${queryString}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
            }
        )
        return await returnParser(result)
    }
}

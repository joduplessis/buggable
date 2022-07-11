import { API_HOST, JWT } from '../constants'
import { createURLQueryString, returnParser } from '../helpers/util'

export class BaselineService {
    static async getData(token, accountId, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(`${API_HOST}/accounts/${accountId}/report/baseline/data?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }
}

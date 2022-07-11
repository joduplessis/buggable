import { API_HOST, JWT } from '../constants'
import { createURLQueryString, returnParser } from '../helpers/util'

export class FilterService {
    static async getBrands(token, accountId) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/filter/brands`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async getConversionEvents(token, accountId) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/filter/conversion_events`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async getCountries(token, accountId) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/filter/countries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async getDeviceTypes(token, accountId) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/filter/device_types`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }
}

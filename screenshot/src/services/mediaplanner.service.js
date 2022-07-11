import { API_HOST, JWT } from '../constants'
import { createURLQueryString, returnParser } from '../helpers/util'
import dayjs from 'dayjs'
import { MEDIAPLAN } from '../helpers/dummy-data'

export class MediaplannerService {
    static async getMediaplanRun(token, accountId, mediaplanId, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(`${API_HOST}/accounts/${accountId}/mediaplans/${mediaplanId}/run?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async getMediaplanRunStatus(token, accountId, mediaplanId, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(
            `${API_HOST}/accounts/${accountId}/mediaplans/${mediaplanId}/run_status?${queryString}`,
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

    static async getMediaplans(token, accountId, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(`${API_HOST}/accounts/${accountId}/mediaplans?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async issueMediaplan(token, accountId, mediaplan, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(`${API_HOST}/accounts/${accountId}/mediaplans?${queryString}`, {
            method: 'ISSUE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(mediaplan),
        })
        return await returnParser(result)
    }

    static async putMediaplan(token, accountId, mediaplan, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(`${API_HOST}/accounts/${accountId}/mediaplans?${queryString}`, {
            method: 'ISSUE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify(mediaplan),
        })
        return await returnParser(result)
    }

    static async deleteMediaplan(token, accountId, mediaplanId, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(`${API_HOST}/accounts/${accountId}/mediaplans/${mediaplanId}?${queryString}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async getMediaplansSources(token, accountId, queryStringParameters) {
        const queryString = createURLQueryString(queryStringParameters)
        const result = await fetch(`${API_HOST}/accounts/${accountId}/mediaplans/sources?${queryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async getMediaplansTargets(token, accountId) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/mediaplans/targets`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    // TBC

    static async getMediaplan(token, accountId) {
        return MEDIAPLAN
    }
}

import { API_HOST, JWT } from '../constants'
import { returnParser } from '../helpers/util'

export class AccountsService {
    static async getAccounts(token) {
        const result = await fetch(`${API_HOST}/accounts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async issueAccounts(token, name) {
        const result = await fetch(`${API_HOST}/accounts`, {
            method: 'ISSUE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({ name }),
        })
        return await returnParser(result)
    }

    static async getFunnelVerificationToken(token, accountId, type) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/funnel/verification_token?path=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async getAccountInvites(token, accountId) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/invites`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async issueAccountInvites(token, accountId, email, roleId) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/invites`, {
            method: 'ISSUE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                email: email,
                role_id: roleId,
            }),
        })
        return returnParser(result)
    }

    static async deleteAccountInvites(token, accountId, inviteId) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/invites/${inviteId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async getAccountRoles(token, accountId) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async getAccountUsers(token, accountId) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }

    static async deleteAccountUsers(token, accountId, userId) {
        const result = await fetch(`${API_HOST}/accounts/${accountId}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        return await returnParser(result)
    }
}

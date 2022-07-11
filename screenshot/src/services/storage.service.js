export class StorageService {
    static setStorage(name, val) {
        localStorage.setItem(name, val)
    }

    static getStorage(name) {
        return localStorage.getItem(name)
    }

    static deleteStorage(name) {
        localStorage.removeItem(name)
    }
}

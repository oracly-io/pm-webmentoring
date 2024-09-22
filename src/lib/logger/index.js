import factory from 'debug'

export default class Logger {

    static ns = 'pm:wt:'
    static #debuginfo = factory(Logger.ns + 'info')
    static #debugwarn = factory(Logger.ns + 'warn')
    static #debugerror = factory(Logger.ns + 'error')

    static info(...args) {
        Logger.#debuginfo(...args)
    }

    static error(...args) {
        Logger.#debugerror(...args)
        console.error(...args) // eslint-disable-line
    }

    static warn(...args) {
        Logger.#debugwarn(...args)
    }

}

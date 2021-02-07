import Vuex from 'vuex'
import AuthStore from './auth'

export default function () {
    const Store =  new Vuex.Store({
        modules: {
            AuthStore
        }
    })
    return Store
}
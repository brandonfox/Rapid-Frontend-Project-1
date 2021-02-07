import Firebase from '../plugins/firebase'

export default {
    state: {
        user: Firebase.firebase.auth().currentUser,
    },
    mutations: {
        setUser(state, user){
            state.user = user
        }
    },
    actions: {
        setAuthenticatedUser(context, user) {
            context.commit('setUser',user)
        }
    },
    getters: {
        authenticated(state, getters) {
            return getters.currentUser != null
        },
        currentUser(state) {
            return state.user
        }
    }
}
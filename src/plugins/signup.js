export default {
    isValidEmail(email) {
        // The one on emailregex.com is so overkill ill just use this (for this project anyways)
        return /[\w\d_-]+@[\w\d_-]+(\.[\w\d_-]+)+/.test(email)
    },
    isValidPassword(password) {
        return password.length >= 8
    }
}
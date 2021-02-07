export default {
    newTodoRules: [
        v => v.length > 0 || 'Todo name cannot be empty'
    ],
    firebasePath (uid) {
        return 'todos/' + uid
    }
}
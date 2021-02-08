export default {
    newTodoRules: [
        v => v.length > 0 || 'Todo name cannot be empty'
    ],
    firebasePath (uid) {
        return 'todos/' + uid
    },
    isComplete (todo) {
        let completed = todo.completed
        if(todo.subtasks){
            completed = Object.values(todo.subtasks).reduce((ac,current) => ac && current.completed,true)
        }
        return completed
    }
}
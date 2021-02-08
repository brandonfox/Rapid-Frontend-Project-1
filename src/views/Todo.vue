<template>
  <div>
    <v-btn-toggle v-model="sortGroup" class="mb-2">
      <v-btn>All</v-btn>
      <v-btn>Incomplete</v-btn>
      <v-btn>Completed</v-btn>
    </v-btn-toggle>
    <v-card class="py-4 px-6" width="40%" style="min-width: 600px">
      <div class="row flex-row-reverse pa-1">
        <v-btn depressed color="white" @click="clearCompleted">Clear Completed</v-btn>
      </div>
      <v-card-title class="headline">
        <div class="flex-grow-1 text-center">
          Vue Todo
        </div>
      </v-card-title>
      <v-card-title class="row flex-nowrap align-baseline py-1">
        <v-checkbox v-model="allCompleted" class="pl-2 pr-10"/>
        <v-form ref="todoForm" @submit="addTodo" class="row flex-nowrap align-baseline">
          <v-text-field class="col-3" :rules="todoRules" v-model="newTodo" label="New Todo"></v-text-field>
          <v-menu class="col-3" v-model="dateMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{on, attrs}">
              <v-text-field class="col-3" v-model="newTodoDate" label="Complete by date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="newTodoDate" @input="dateMenu = false"></v-date-picker>
          </v-menu>
          <v-btn depressed fab right small color="white" type="submit">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-form>
      </v-card-title>
      <v-divider class="my-4"></v-divider>
      <v-list v-if="todos.length > 0" class="pr-4">
        <TodoItem ref="todos" v-for="todo in shownTodos" v-bind:key="todo.key" :todo="todo"></TodoItem>
      </v-list>
      <v-card-text v-else>
        Looks like there are no todos here
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
//TODO If i want the subgroup to stop refreshing on edit completion only listen for child added / removed events
//TODO a lot of refactoring
import TodoThings from '@/plugins/todo'
import TodoItem from "@/components/TodoItem";
export default {
  name: "Todo",
  components: {TodoItem},
  mounted() {
    this.$database.ref(this.firebasePath).on('value', (snapshot) => {
      this.todos = []
      snapshot.forEach(child => {
          this.todos.push(child)
      })
    })
  },
  computed: {
    allCompleted: {
      get: function () {
        return this.todos.reduce((acc,current) => acc && current.val().completed, true)
      },
      set: function (newValue) {
        this.$refs.todos.forEach(t => t.setCompleted(newValue))
      }
    },
    shownTodos() {
      if(this.sortGroup === 0) return this.todos
      else if(this.sortGroup === 1) return this.todos.filter(t => !TodoThings.isComplete(t.val()))
      else return this.todos.filter(t => TodoThings.isComplete(t.val()))
    }
  },
  data () {
    return {
      todos: [],
      firebasePath: TodoThings.firebasePath(this.$store.getters.currentUser.uid),
      newTodo: '',
      newTodoDate: null,
      dateMenu: false,
      editTodo: null,
      editText: '',
      editTodoDate: null,
      editDateMenu: false,
      dialog: false,

      sortGroup: 0,

      todoRules: TodoThings.newTodoRules
    }
  },
  methods: {
    addTodo () {
      this.$refs.todoForm.validate()
      if(this.newTodo){
        const newTodoListing = this.$database.ref(this.firebasePath).push()
        newTodoListing.set({
          title: this.newTodo,
          completeBy: this.newTodoDate,
          completed: false
        })
        this.newTodo = ''
        this.newTodoDate = null
        this.$refs.todoForm.resetValidation()
        document.activeElement.blur()
      }
    },
    setCompleted(todo,value) {
      this.$database.ref(this.firebasePath).child(todo.key).update({completed: value})
    },
    clearCompleted() {
      this.$refs.todos.forEach(t => t.clearIfCompleted())
    }
  }
}
</script>

<style scoped>

</style>
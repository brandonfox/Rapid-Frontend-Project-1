<template>
  <v-list-group no-action :ripple="false">
    <template v-slot:activator>
      <div class="column flex-grow-1">
        <TodoData ref="todo" :todo-key="todo.key" :todo-data="todo.val()"></TodoData>
        <v-progress-linear v-model="progress"></v-progress-linear>
      </div>
    </template>
    <v-list-item>
      <v-list-item-content>
        <v-form class="row flex-nowrap align-baseline" v-on:submit="addSubtask">
          <v-text-field class="col-3" label="Add Subtask" v-model="addSubtaskTitle"/>
          <v-menu class="col-3" v-model="dateMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{on, attrs}">
              <v-text-field class="col-3" ref="subtaskDateBox" v-model="subtaskTodoDate" label="Complete by date" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="subtaskTodoDate" @input="dateMenu = false; $refs.subtaskDateBox.focus()"></v-date-picker>
          </v-menu>
          <v-btn class="d-none" type="submit"></v-btn>
        </v-form>
      </v-list-item-content>
    </v-list-item>
    <TodoData ref="subtasks" v-for="(subtask,key) of this.todo.val().subtasks" :todo-key="key" :todo-data="subtask" :parent-key="todo.key" v-bind:key="key"></TodoData>
  </v-list-group>
</template>

<script>
import TodoThings from '@/plugins/todo'
import TodoData from "@/components/TodoData";
export default {
  name: "TodoItem",
  components: {TodoData},
  props: ['todo'],
  data () {
    return {
      addSubtaskTitle: '',
      subtaskTodoDate: null,
      dateMenu: false,

      firebasePath: TodoThings.firebasePath(this.$store.getters.currentUser.uid)
    }
  },
  computed: {
    progress() {
      if(this.todo.val().completed) return 100
      else if(!this.todo.val().subtasks) return 0
      else {
        const noCompleted = Object.values(this.todo.val().subtasks).reduce((ac, cur) => ac + cur.completed,0)
        return Math.round((noCompleted/Object.values(this.todo.val().subtasks).length) * 100)
      }
    }
  },
  methods: {
    addSubtask() {
      const newSubtask = this.$database.ref(this.firebasePath).child(this.todo.key).child('subtasks').push()
      newSubtask.set({
        title: this.addSubtaskTitle,
        completeBy: this.subtaskTodoDate,
        completed: false
      })
      this.$database.ref(this.firebasePath).child(this.todo.key).update({completed: false})
      this.addSubtaskTitle = ''
      this.subtaskTodoDate = null
    },
    setCompleted (value) {
      this.$refs.todo.setCompleted(value)
    },
    clearIfCompleted() {
      if(TodoThings.isComplete(this.todo.val())){
        this.$database.ref(this.firebasePath).child(this.todo.key).remove()
      }
    }
  }
}
</script>

<style scoped>

</style>
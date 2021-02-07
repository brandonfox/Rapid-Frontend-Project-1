<template>
  <v-list-group no-action :ripple="false">
    <template v-slot:activator>
      <v-list-item-action>
        <v-checkbox v-model="todo.val().completed" v-on:click.stop="toggleTodo"/>
      </v-list-item-action>
      <v-list-item-content class="overflow-visible">
        <v-form class="row flex-nowrap align-baseline" v-if="editing" v-on:click.stop="" v-on.stop="" v-on:submit.stop="finaliseEdit">
          <v-text-field v-model="editText"  v-on:click.stop="" ref="editbox"/>
          <v-menu v-model="editDateMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{on, attrs}">
              <v-text-field ref="editDate" v-model="editTodoDate" label="Complete by" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="editTodoDate" @input="editDateMenu = false; $refs.editDate.focus()"></v-date-picker>
          </v-menu>
          <!--          Need this button so that enter will submit the form (weird design)     -->
          <v-btn class="d-none" depressed fab small color="white" type="submit">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-form>
        <div class="row flex-nowrap align-baseline" v-else>
          <v-list-item-title class="flex-grow-1" v-on:click.stop="startEdit" :style="{'text-decoration': todo.val().completed ? 'line-through' : ''}" style="cursor: pointer">{{todo.val().title}}</v-list-item-title>
          <div>
            <v-text-field prepend-icon="mdi-calendar" label="Complete by" disabled v-model="todo.val().completeBy"/>
          </div>
        </div>
      </v-list-item-content>
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
    <TodoItem v-for="subtask in subtasks" :todo="subtask" v-bind:key="subtask.key"></TodoItem>
  </v-list-group>
</template>

<script>
import TodoThings from '@/plugins/todo'
export default {
  name: "TodoItem",
  props: ['todo'],
  mounted() {
    console.log(this.todo)
  },
  data () {
    return {
      editText: this.todo.title,
      editTodoDate: null,
      editDateMenu: false,
      editing: false,
      expand: false,

      addSubtaskTitle: '',
      subtaskTodoDate: null,
      dateMenu: false,

      subtasks: this.todo.val().subtasks,

      firebasePath: TodoThings.firebasePath(this.$store.getters.currentUser.uid)
    }
  },
  methods: {
    toggleTodo() {
      this.setCompleted(!this.todo.val().completed)
    },
    setCompleted(value){
      this.$database.ref(this.firebasePath).child(this.todo.key).update({completed: value})
    },
    startEdit() {
      this.editing = true
      this.editText = this.todo.val().title
      this.$nextTick(this.setFocusEditBox)
    },
    setFocusEditBox() {
      this.$refs.editbox.focus()
    },
    finaliseEdit() {
      if (this.editText){
        this.$database.ref(this.firebasePath).child(this.todo.key).update({title: this.editText, completeBy: this.editTodoDate})
      }
      this.editDateMenu = false
      this.editTodoDate = null
      this.editing = false
    },
    addSubtask() {
      const newSubtask = this.$database.ref(this.firebasePath).child(this.todo.key).child('subtasks').push()
      newSubtask.set({
        title: this.addSubtaskTitle,
        completeBy: this.subtaskTodoDate,
        completed: false
      })
      this.addSubtaskTitle = ''
      this.subtaskTodoDate = null

    }
  }
}
</script>

<style scoped>
  .subtask-expand {
    transform: rotateZ(-180deg);
  }
</style>
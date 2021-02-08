<template>
  <v-list-item>
    <v-list-item-action>
      <v-checkbox v-model="isComplete" v-on:click.stop=""/>
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
        <v-list-item-title class="flex-grow-1" v-on:click.stop="startEdit" :style="{'text-decoration': this.isComplete ? 'line-through' : ''}" style="cursor: pointer">{{todoData.title}}</v-list-item-title>
        <div>
          <v-text-field prepend-icon="mdi-calendar" label="Complete by" disabled v-model="todoData.completeBy"/>
        </div>
        <v-btn :icon="true" v-if="parentKey" @click="removeSubtask">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import TodoData from '../plugins/todo'
export default {
  name: "TodoData",
  props: {
    todoKey: {
      type: String,
      required: true
    },
    todoData: {
      type: Object,
      required: true
    },
    parentKey: {
      type: String
    }
  },
  computed: {
    isComplete: {
      get: function() {
        return TodoData.isComplete(this.todoData)
      },
      set: function(newValue) {
        this.setCompleted(newValue)
      }
    }
  },
  data () {
    return {
      editing: false,
      editText: '',
      editTodoDate: null,
      editDateMenu: false,
      firebasePath: TodoData.firebasePath(this.$store.getters.currentUser.uid)
    }
  },
  methods: {
    setCompleted(value){
      if(this.parentKey) this.$database.ref(this.firebasePath).child(this.parentKey).child('subtasks').child(this.todoKey).update({completed: value})
      else {
        this.$database.ref(this.firebasePath).child(this.todoKey).update({completed: value})
        for(const st in this.todoData.subtasks){
          this.$database.ref(this.firebasePath).child(this.todoKey).child('subtasks').child(st).update({completed: value})
        }
      }
      this.$emit('taskComplete',this.todoKey,value)
    },
    startEdit() {
      this.editing = true
      this.editText = this.todoData.title
      this.$nextTick(this.setFocusEditBox)
    },
    setFocusEditBox() {
      this.$refs.editbox.focus()
    },
    finaliseEdit() {
      if (this.editText){
        if (this.parentKey) this.$database.ref(this.firebasePath).child(this.parentKey).child('subtasks').child(this.todoKey).update({title: this.editText, completeBy: this.editTodoDate})
        else this.$database.ref(this.firebasePath).child(this.todoKey).update({title: this.editText, completeBy: this.editTodoDate})
      }
      this.editDateMenu = false
      this.editTodoDate = null
      this.editing = false
    },
    removeSubtask() {
      this.$database.ref(this.firebasePath).child(this.parentKey).child('subtasks').child(this.todoKey).remove()
    }
  }
}
</script>

<style scoped>

</style>
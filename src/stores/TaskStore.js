import { defineStore } from "pinia";
import axios from "axios";

const url = 'http://localhost:3000/tasks';

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [],
    loading: false,
  }),

  getters: {
    favs() {
      return this.tasks.filter(t => t.isFav)
    },
    favCount() {
      return this.tasks.reduce((p,c) => {
        return c.isFav ? p+1 : p
      }, 0)
    },
    totalCount: (state) => {
      return state.tasks.length
    }
  },

  actions: {
    async getTasks() {
      try {
        this.loading = true;
        const res = await axios.get(url);
        this.tasks = res.data;
        this.loading = false
      } catch (error) {
        console.log(error);
      }
    },
    addTask (task) {
      this.tasks.push(task)
    },
    deleteTask(id) {
      this.tasks = this.tasks.filter( t => {
        return t.id !== id
      })
    },
    toggleFav(id) {
       const task = this.tasks.find(t => t.id === id)
       task.isFav = !task.isFav
    }
  }
})
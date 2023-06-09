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
      return this.tasks.reduce((p, c) => {
        return c.isFav ? p + 1 : p
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
    async addTask(task) {
      try {
        const res = await axios.post(url, task);
        console.log("Added succefully");
      } catch (error) {
        console.log(error);
      }
      this.tasks.push(task)
    },
    async deleteTask(id) {
      try {
        await axios.delete(`${url}/${id}`)
        console.log("Deleted succesfully");
      } catch (error) {
        console.log(error);
      }
      this.tasks = this.tasks.filter(t => {
        return t.id !== id
      })
    },
    async toggleFav(id) {
      try {
        const task = this.tasks.find(t => t.id === id)
        task.isFav = !task.isFav
        await axios.patch(`${url}/${id}`, task)
        if (task.isFav) {
          console.log('Favourite');
        } else {
          console.log('Removed from favourite');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
})
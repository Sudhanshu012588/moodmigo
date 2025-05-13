import { de } from 'date-fns/locale/de';
import {create} from 'zustand';

 export const useStore = create((set) => ({
  User: {  // Change 'user' to 'User'
    id: "",
    name: "",
    email: "",
    password: "",
    isLoggedIn: false,
  },
  setUser: (newUser) => set((state) => ({ User: { ...state.User, ...newUser } })), // Change 'user' to 'User'
}));

export const useBlog = create((set) => ({
  blog: [{
    title: "",
    content: "",
  }],
  setBlog: (newBlog) => set((state) => ({ blog: { ...state.blog, ...newBlog } })),
  addBlog: (newBlog) => set((state) => ({ blog: [...state.blog, newBlog] })), // Add this line
}));
// export default {useStore, useBlog};


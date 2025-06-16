import { de } from 'date-fns/locale/de';
import {create} from 'zustand';

 export const useStore = create((set) => ({
  User: {  // Change 'user' to 'User'
    id: "",
    name: "",
    email: "",
    password: "",
    isLoggedIn: false,
    profilepicture:"",
    coverimage:""
  },
  score: 0,
  type:"Client",
  paymentState:false,
  mentorId:"",
  setScore: (newScore) => set((state) => ({ score: newScore })), // Add this line
  setMentorId: (newmentorId) => set((state) => ({ mentorId: newmentorId })), // Add this line

  setpaymentstate: (newState)=>set((state)=>({paymentState:newState})),
  setUser: (newUser) => set((state) => ({ User: { ...state.User, ...newUser } })), // Change 'user' to 'User'
setType: (newType) => set((state) => ({ ...state, type: newType }))
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


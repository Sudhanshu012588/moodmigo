import {create} from 'zustand';

const useStore = create((set) => ({
  User: {  // Change 'user' to 'User'
    id: "",
    name: "",
    email: "",
    password: "",
  },
  setUser: (newUser) => set((state) => ({ User: { ...state.User, ...newUser } })), // Change 'user' to 'User'
}));

export default useStore;
// store/homeStore.js
import { create } from 'zustand';
import SelectedCategory from '../components/SelectedCategory';

const useHomeStore = create((set) => ({
  BATCH_SIZE: 5,
  questions: [],
  // setQuestions: (qs) => set((state)=> ({ questions: [...state.questions,qs] })),
  setQuestions: (qs) => set({ questions: qs }),
  maxReached: false,
  setMaxReached: (val) => set({ maxReached: val }),
  answers: [],
  setAnswers: (ans) => set({ answers: ans }),
  hintVisible: false,
  setHintVisible: (val) => set({ hintVisible: val }),
  currentHint: "no hint",
  setCurrentHint: (hint) => set({ currentHint: hint }),
  userLikes: [],
  setUserLikes: (updater) =>
    set((state) => ({
      userLikes: typeof updater === 'function' ? updater(state.userLikes) : updater,
    })),
  user: {},
  setUser: (userData => set({ user: userData })),
  
  //for explore page
  // isSelected:false,
  // setIsSelected:(a)=> set({isSelected:a}),
  // SelectedCategory:"",
  // setSelectedCategory:(cat)=> set({SelectedCategory:cat})

  //category
  category:{isCategory:false,value:null},
  setCategory:(v)=> set({category:v})

}));

export default useHomeStore;

// store/homeStore.js
import { create } from 'zustand';
import SelectedCategory from '../components/SelectedCategory';

const useHomeStore = create((set) => ({
  BATCH_SIZE: 5,

  //questions
  questions: [],
  setQuestions: (qs) => set({ questions: qs }),

  //max reached
  maxReached: false,
  setMaxReached: (val) => set({ maxReached: val }),


  //categories
  categories: [],
  // setCategories,


  //User answers
  answers: [],
  setAnswers: (ans) => set({ answers: ans }),

  hintVisible: false,
  setHintVisible: (val) => set({ hintVisible: val }),
  currentHint: "no hint",
  setCurrentHint: (hint) => set({ currentHint: hint }),

  //User likes
  userLikes: [],
  setUserLikes: (updater) =>
    set((state) => ({
      userLikes: typeof updater === 'function' ? updater(state.userLikes) : updater,
    })),

  //Auth user
  user: {},
  setUser: (userData => set({ user: userData })),


  //Explore page category selection
  isCategorySelected:false,
  setIsCategorySelected:(v)=> set({isCategorySelected:v}),
  selectedCategory:null,
  setSelectedCategory:(v)=> set({selectedCategory:v}),

  //Current Category
  category: { isCategory: false, value: null },
  setCategory: (v) => set({ category: v })

}));

export default useHomeStore;

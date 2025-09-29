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
  
  // categories: [],
  // addNewCategories:(c)=> set([...categories,c]),
  // updateCategoryQuestions:(q)=> set([...categories,q]),

  categories: {}, // store categories here
  addCategory: (categoryName, questions = []) =>
    set((state) => ({
      categories: {
        ...state.categories,
        [categoryName]: questions,
      },
    })),

  // Add multiple questions to a specific category
  addQuestions: (categoryName, questionsArray) =>
    set((state) => ({
      categories: {
        ...state.categories,
        [categoryName]: [
          ...(state.categories[categoryName] || []),
          ...questionsArray,
        ],
      },
    })),


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
  isCategorySelected: false,
  setIsCategorySelected: (v) => set({ isCategorySelected: v }),
  selectedCategory: null,
  setSelectedCategory: (v) => set({ selectedCategory: v }),

  //tabs
  activeTab: "home",
  setActiveTab: (t) => set({ activeTab: t })

}));

export default useHomeStore;

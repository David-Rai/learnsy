// store/homeStore.js
import { create } from 'zustand';
import SelectedCategory from '../components/SelectedCategory';

const useHomeStore = create((set) => ({
  BATCH_SIZE: 5,

  //Holds all the categories
  categories: [],

  //Add a new category if not exist here
  addNewCategory: (name, questions = []) =>
    set((state) => {
      if (state.categories.some((c) => c.name === name)) return {};
      return {
        categories: [
          ...state.categories,
          { name, questions, maxReached: false },
        ],
      };
    }),  

    //Update the questions of particular category basis of category.name
  updateCategoryQuestions: (name, newQuestions) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.name === name
          ? { ...c, questions: [...c.questions, ...newQuestions] }
          : c
      ),
    })),

    //Completely overriding the questions of particular category
  updateCategoryQuestionsCompletely: (name, newQuestions) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.name === name
          ? { ...c, questions: newQuestions }
          : c
      ),
    })),

    //Updating the maxReached of particular category
  updateCategoryMaxReached: (name, status) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.name === name
          ? { ...c, maxReached: status }  // update maxReached
          : c
      ),
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

  
  //explore page category
  explorePageCategory: { isOpen: false, value: null },
  setExplorePageCategory: (c) => set({ explorePageCategory: c }),

  //tabs
  activeTab: "home",
  setActiveTab: (t) => set({ activeTab: t })

}));

export default useHomeStore;

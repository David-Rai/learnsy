// store/homeStore.js
import { create } from 'zustand';

const useHomeStore = create((set) => ({
  BATCH_SIZE: 5,

  //Holds all the categories
  categories: [],
  setCategories: (c) => set({ categories: c }),

  isIntroDone: localStorage.getItem("isIntroDone") === "true",
  setIsIntroDone: (t) =>
    set(() => {
      localStorage.setItem("isIntroDone", t);
      return { isIntroDone: t };
    }),

  //****Lessons container**** */
  lessons: [],

  //Add a new category if not exist here
  addNewLesson: (name, questions = [], c) =>
    set((state) => {
      if (state.lessons.some((c) => c.name === name)) return {};
      return {
        lessons: [
          ...state.lessons,
          { name, questions, maxReached: false, category: c },
        ],
      };
    }),

  //Update the questions of particular category basis of category.name
  updateLessonQuestions: (name, newQuestions) =>
    set((state) => ({
      lessons: state.lessons.map((c) =>
        c.name === name
          ? { ...c, questions: [...c.questions, ...newQuestions] }
          : c
      ),
    })),

  //Completely overriding the questions of particular category
  updateLessonQuestionsCompletely: (name, newQuestions) =>
    set((state) => ({
      lessons: state.lessons.map((c) =>
        c.name === name
          ? { ...c, questions: newQuestions }
          : c
      ),
    })),

  //Updating the maxReached of particular category
  updateLessonMaxReached: (name, status) =>
    set((state) => ({
      lessons: state.lessons.map((c) =>
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

  //Current selected options state here
  currentLesson: {
    isSelected: false,
    name: null
  },
  setCurrentLesson: (s) => set({ currentLesson: s }),

  //Selected category state here
  currentCategory: {
    isSelected: false,
    name: null,
    lessonOptions: []
  },
  setCurrentCategory: (s) => set({ currentCategory: s }),

  //tabs
  activeTab: "home",
  setActiveTab: (t) => set({ activeTab: t })


}));


//Leader store
export const useLeaderStore = create((set) => ({
  leaders: [],
  loading: true,
  setLeaders: (data) => set({ leaders: data }),
  setLoading: (value) => set({ loading: value }),

}))

//Admin datas
export const useAdminStore = create((set) => ({
  //Admin data
  isAdmin: false,
  setIsAdmin: (v) => set({ isAdmin: v })
}))

export default useHomeStore;

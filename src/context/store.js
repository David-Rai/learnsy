import { create } from "zustand";

///********MAIN STORE********* */
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
          {
            name,
            questions,
            maxReached: false,
            category: c,
            isAnsweredAll: false,
          },
        ],
      };
    }),

  //set isAnsweredAll
  updateIsAnsweredAllQuestions: (name, status) =>
    set((state) => ({
      lessons: state.lessons.map((c) =>
        c.name === name
          ? { ...c, isAnsweredAll: status } // update isAnsweredAll
          : c
      ),
    })),

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
        c.name === name ? { ...c, questions: newQuestions } : c
      ),
    })),

  //Updating the maxReached of particular category
  updateLessonMaxReached: (name, status) =>
    set((state) => ({
      lessons: state.lessons.map((c) =>
        c.name === name
          ? { ...c, maxReached: status } // update maxReached
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
      userLikes:
        typeof updater === "function" ? updater(state.userLikes) : updater,
    })),

  //Auth user
  user: null,
  setUser: (userData) => set({ user: userData }),

  //Current selected options state here
  currentLesson: {
    isSelected: false,
    name: null,
  },
  setCurrentLesson: (s) => set({ currentLesson: s }),

  //Selected category state here
  currentCategory: {
    isSelected: false,
    name: null,
    lessonOptions: [],
  },
  setCurrentCategory: (s) => set({ currentCategory: s }),

  //tabs
  activeTab: "home",
  setActiveTab: (t) => set({ activeTab: t }),
}));

//********LEADER STORE**********
export const useLeaderStore = create((set) => ({
  leaders: [],
  loading: true,
  setLeaders: (data) => set({ leaders: data }),
  setLoading: (value) => set({ loading: value }),
  FETCH_LIMIT: 0,
  increaseFetchLimit: () =>
    set((state) => ({ FETCH_LIMIT: state.FETCH_LIMIT + 5 })),
}));

//******ADMIN DATA STORE********* */
export const useAdminStore = create((set) => ({
  //Admin data
  isAdminChecked: false,
  setIsAdminChecked: (v) => set({ isAdminChecked: v }),
  isAdmin: false,
  setIsAdmin: (v) => set({ isAdmin: v }),
}));


//******MEMBER STORE******* */
export const useMemberStore = create((set) => ({
  //Admin data
  isMemberChecked: false,
  setIsMemberChecked: (v) => set({ isMemberChecked: v }),
  isMember: false,
  setIsMember: (v) => set({ isMember: v }),

  //questions count
  question_count: 0,
  setQuestionCount: (c) => set({ question_count: c }),

  //Your uploads
  uploads: [],
  setUploads: (u) => set({ uploads: u }),
}));

//****CLASS STORE**** */
export const useClassStore=create((set)=>({
  allClasses:[],
  setClasses:(nc)=> set({allClasses:nc}),
  currentClass:{
    name:null,
    isSelected:false,
    categories:[]
  },
  setCurrentClass:(n)=> set({currentClass:n})
}))
export default useHomeStore;

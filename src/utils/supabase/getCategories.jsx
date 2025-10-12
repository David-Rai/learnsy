import useHomeStore from "../../context/store";
import supabase from "../../config/supabase";

// ✅ Get categories with questions count
const getCategories = async () => {
    const setCategories = useHomeStore.getState().setCategories
    const { error, data } = await supabase.rpc('get_categories_with_count');
    if (error) {
        console.error('Error fetching categories:', error);
        return setCategories([]);
    }
    setCategories(data);
};


export default getCategories
import supabase from "../../config/supabase";

// ✅ Get lessons when category changes
const getLessons = async (category, setLessons) => {
    if (!category || category === 'new') {
        setLessons([]);
        return;
    }
    const { data, error } = await supabase
        .from('questions')
        .select('lesson')
        .eq('category', category);

    if (error) {
        console.error('Error fetching lessons:', error);
        setLessons([]);
    } else {

        const newLessons = [...new Set(data.map(item => item.lesson.trim()))];
        setLessons(newLessons || []);
    }
};

export default getLessons
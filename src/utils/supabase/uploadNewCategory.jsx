import supabase from "../../config/supabase"
import { toast } from 'react-toastify'

const uploadNewCategory = async (category, image) => {
    if (!category) return

    //Inserting into database
    const { error } = await supabase.from('category')
        .insert({ name: category, image: image.trim() })

    if (error) {
        return toast.error(error.message)
    }
}

export default uploadNewCategory
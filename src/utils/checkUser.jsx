import supabase from "../config/supabase";

// Accept setUser as a parameter
export async function checkUser(setUser) {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log("Error fetching user:", error);
    return false;
  }

  if (data.user) {
    setUser(data.user); // update user in context
    console.log("User exists");
    return {user:data.user,exist:true}
  } else {
    console.log("User does not exist");
    return {exist:false}
  }
}

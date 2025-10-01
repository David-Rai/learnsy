import supabase from "../config/supabase";

//signup with google
const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:5173`, // page after login
      },
    });

    if (error) {
      console.error("Error logging in with Google:", error.message);
    } else {
      console.log("Redirecting to Google...");
    }

  };

  export default handleGoogleLogin
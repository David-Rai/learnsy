import supabase from "../config/supabase";
const avatars = [
  '/profiles/1.jpg',
  '/profiles/2.jpg',
  '/profiles/3.jpg',
  '/profiles/4.jpg',
  '/profiles/5.jpg',
];

const randomAvatar = getRandomAvatar();

//random images
function getRandomAvatar() {
  const num = Math.floor(Math.random() * 5) + 1; // generates 1 to 5
  return avatars[num - 1];
}


const setUserBoard = async (id, username) => {
  const res = await supabase.from("board")
    .insert({ user_id: id, avatar: randomAvatar, username })
    console.log('user board added')
}

export default setUserBoard
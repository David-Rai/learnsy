import { defineConfig } from 'vite'
// import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
server:{
host:true,
port:5173
},
  plugins: [
    tailwindcss(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   injectRegister: 'auto',
    //   manifest: {
    //     name: "Learnsy",
    //     short_name: "Learnsy",
    //     description: "Learn and scroll with Learnsy",
    //     start_url: "/",
    //     display: "standalone",
    //     background_color: "#121212", // dark theme
    //     theme_color: "#121212",
    //     icons: [] // you can add icons later
    //   },
    //   devOptions: { enabled: true }
    // })    
  ],
})

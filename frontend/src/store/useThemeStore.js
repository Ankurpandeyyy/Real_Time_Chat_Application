import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export const useThemeStore = create(
//   persist(
//     (set) => ({
//       theme: "coffee", // default fallback theme
//       setTheme: (theme) => set({ theme }),
//     }),
//     {
//       name: "chat-theme", // localStorage key
//     }
//   )
// );

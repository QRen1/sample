/** @type {import('tailwindcss').Config} */

import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      first: "1800px",
      second: "1550px",
      third: "1350px",
      fourth: "1080px",
      fourthh: "985px",
      fifthhh: "680px",
      fifthh: "545px",
      fifth: "545px",
    },
  },
  plugins: [
    scrollbarHide, // Use the imported scrollbar-hide plugin
  ],
};

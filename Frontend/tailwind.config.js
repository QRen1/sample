/** @type {import('tailwindcss').Config} */

module.exports = {
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
    require("tailwind-scrollbar-hide"), // Add this plugin
  ],
};

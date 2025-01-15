/ @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3972F0",
        secondary: "#3E3B5B",
        background: "#F8F8F8",
        card: "#FFFFFF",
        normal: "#2ED74D",
        warning: "#FFD444",
        abnormal: "#FE5757", // For Unsuccess Status And Risk Status
        unread: "#D6E3FF",
      },
      fontFamily: {
        sans: ["K2D-Regular", "K2D-Medium", "K2D-Bold"],
      },
      fontSize: {
        display: ["28px", { lineHeight: "1.75rem", fontWeight: "700" }],
        title: ["24px", { lineHeight: "1.5rem", fontWeight: "700" }],
        headline: ["20px", { lineHeight: "1.125rem", fontWeight: "500" }],
        description: ["14px", { lineHeight: "0.875rem", fontWeight: "400" }],
        tag: ["12px", { lineHeight: "0.75rem", fontWeight: "500" }],
        button: ["14px", { lineHeight: "0.875rem", fontWeight: "700" }],
        "sub-button": ["12px", { lineHeight: "0.875rem", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
};
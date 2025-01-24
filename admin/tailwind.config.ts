import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3972F0",
        hoverPrimary: "#386de3",
        secondary: "#3E3B5B",
        card: "#FFFFFF",
        normal: "#2ED74D",
        warning: "#FFD444",
        abnormal: "#FE5757", 
        hoverRead: "#F5F5F5",
        unread: "#D6E3FF",
        hoverUnread:"#C9DAFF",
      },
      fontFamily: {
        K2D: ["K2D", "serif"],
      },
      fontSize: {
        display: [
          "24px", 
          {
            lineHeight: "36px",
            fontWeight: "700",
          },
        ],
        title: [
          "20px", 
          {
            lineHeight: "30px",
            fontWeight: "700",
          },
        ],
        headline: [
          "18px",
          {
            lineHeight: "27px",
            fontWeight: "500",
          },
        ],
        description: [
          "16px", 
          {
            lineHeight: "24px",
            fontWeight: "400",
          },
        ],
        tag: [
          "14px", 
          {
            lineHeight: "21px",
            fontWeight: "500",
          },
        ],
        button: [
          "16px", 
          {
            lineHeight: "24px",
            fontWeight: "700",
          },
        ],
        "sub-button": [
          "14px", 
          {
            lineHeight: "21px",
            fontWeight: "500",
          },
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;

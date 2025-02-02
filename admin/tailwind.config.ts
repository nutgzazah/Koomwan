import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

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
        secondary: "#3E3B5B",
        background: "#F8F8F8",
        card: "#FFFFFF",
        normal: "#2ED74D",
        warning: "#FFD444",
        abnormal: "#FE5757", 
        unread: "#D6E3FF",
        ourGray: "#DBDBDB",
        
        hoverPrimary: "#386de3",
        hoverCard: "#F5F5F5",
        hoverUnread:"#C9DAFF",
        hoverNormal:"#0CB82C",
        hoverAbnormal:"#F74141",
      },
      fontFamily: {
        K2D: ["K2D", "serif"],
      },
      fontSize: {
        title: [
          "48px", 
          {
            lineHeight: "36px",
            fontWeight: "600",
          },
        ],
        headline_1: [
          "32px", 
          {
            lineHeight: "36px",
            fontWeight: "500",
          },
        ],
        headline_2: [
          "24px", 
          {
            lineHeight: "36px",
            fontWeight: "500",
          },
        ],
        headline_3: [
          "20px", 
          {
            lineHeight: "36px",
            fontWeight: "500",
          },
        ],
        detail_1: [
          "18px", 
          {
            lineHeight: "36px",
            fontWeight: "300",
          },
        ],
        detail_2: [
          "16px", 
          {
            lineHeight: "36px",
            fontWeight: "300",
          },
        ],
        detail_3: [
          "14px", 
          {
            lineHeight: "36px",
            fontWeight: "300",
          },
        ],
        bold_detail: [
          "16px", 
          {
            lineHeight: "36px",
            fontWeight: "600",
          },
        ],
      },
    },
  },
  plugins: [
    function ({ addBase, theme }: PluginAPI) {
      addBase({
        ":root": {
          "--color-primary": theme("colors.primary"),
          "--color-secondary": theme("colors.secondary"),
          "--color-background": theme("colors.background"),
          "--color-card": theme("colors.card"),
          "--color-normal": theme("colors.normal"),
          "--color-warning": theme("colors.warning"),
          "--color-abnormal": theme("colors.abnormal"),
          "--color-unread": theme("colors.unread"),
          "--color-our-gray": theme("colors.ourGray"),
          "--color-hover-primary": theme("colors.hoverPrimary"),
          "--color-hover-card": theme("colors.hoverCard"),
          "--color-hover-unread": theme("colors.hoverUnread"),
          "--color-hover-Normal": theme("colors.hoverNormal"),
          "--color-hover-abnormal": theme("colors.hoverAbnormal"),
        },
      });
    },
  ],
} satisfies Config;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "fade-in-delayed": "fadeIn 0.8s ease-out 0.2s both",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-up-delayed": "slideUp 0.8s ease-out 0.4s both",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
        "pulse-slow": "pulse 3s infinite",
        gradient: "gradient 3s ease infinite",
        float: "float 3s ease-in-out infinite",
        "scale-in": "scaleIn 0.3s ease-out",
        wiggle: "wiggle 1s ease-in-out infinite",
        "tilt-3d": "tilt3d 6s ease-in-out infinite",
        "rotate-3d": "rotate3d 8s linear infinite",
        "flip-3d": "flip3d 1s ease-in-out",
        "cube-rotate": "cubeRotate 4s ease-in-out infinite",
        "depth-float": "depthFloat 4s ease-in-out infinite",
        "perspective-bounce": "perspectiveBounce 2s ease-in-out infinite",
        "card-flip": "cardFlip 0.6s ease-in-out",
        "morph-3d": "morph3d 3s ease-in-out infinite",
      },
      perspective: {
        100: "100px",
        200: "200px",
        500: "500px",
        1000: "1000px",
        2000: "2000px",
      },
      transformStyle: {
        "3d": "preserve-3d",
      },
      backfaceVisibility: {
        hidden: "hidden",
        visible: "visible",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        tilt3d: {
          "0%, 100%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "25%": { transform: "rotateX(5deg) rotateY(5deg)" },
          "50%": { transform: "rotateX(-2deg) rotateY(8deg)" },
          "75%": { transform: "rotateX(3deg) rotateY(-5deg)" },
        },
        rotate3d: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        flip3d: {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(90deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        cubeRotate: {
          "0%, 100%": {
            transform: "rotateX(0deg) rotateY(0deg) rotateZ(0deg)",
          },
          "33%": { transform: "rotateX(90deg) rotateY(180deg) rotateZ(0deg)" },
          "66%": {
            transform: "rotateX(180deg) rotateY(180deg) rotateZ(90deg)",
          },
        },
        depthFloat: {
          "0%, 100%": { transform: "translateZ(0px) translateY(0px)" },
          "50%": { transform: "translateZ(50px) translateY(-20px)" },
        },
        perspectiveBounce: {
          "0%, 100%": {
            transform: "perspective(1000px) rotateX(0deg) translateY(0px)",
          },
          "50%": {
            transform: "perspective(1000px) rotateX(15deg) translateY(-10px)",
          },
        },
        cardFlip: {
          "0%": { transform: "perspective(1000px) rotateY(0deg)" },
          "50%": { transform: "perspective(1000px) rotateY(-90deg)" },
          "100%": { transform: "perspective(1000px) rotateY(0deg)" },
        },
        morph3d: {
          "0%, 100%": {
            transform:
              "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
          },
          "25%": {
            transform:
              "perspective(1000px) rotateX(10deg) rotateY(10deg) scale(1.05)",
          },
          "50%": {
            transform:
              "perspective(1000px) rotateX(-5deg) rotateY(20deg) scale(0.95)",
          },
          "75%": {
            transform:
              "perspective(1000px) rotateX(15deg) rotateY(-10deg) scale(1.02)",
          },
        },
      },
    },
  },
  plugins: [],
};

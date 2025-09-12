"use client";
import Link from "next/link";
import { useTheme } from "../contexts/ThemeContext";
import DarkModeToggle from "../components/DarkModeToggle";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scroll-based transforms for parallax effect
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Navbar scroll animations
  const navbarY = useTransform(scrollYProgress, [0, 0.1], [0, 0]);
  const navbarOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.1],
    [0.95, 0.98, 1]
  );
  const navbarBlur = useTransform(scrollYProgress, [0, 0.1], [8, 16]);
  const navbarScale = useTransform(scrollYProgress, [0, 0.05], [0.98, 1]);

  const navigationItems = [
    { name: "Home", href: "#hero" },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="min-h-screen  bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 transition-all duration-500"
      style={{
        overflowX: "hidden",
        scrollbarWidth: "none" /* Firefox */,
        msOverflowStyle: "none" /* Internet Explorer 10+ */,
        WebkitOverflowScrolling: "touch" /* Smooth scrolling on iOS */,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      {/* Header */}
      <motion.header
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-purple-200/30 dark:border-purple-700/30 fixed top-0 left-0 right-0 z-[100] transition-all duration-500 shadow-lg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          y: navbarY,
          opacity: navbarOpacity,
          backdropFilter: `blur(${navbarBlur}px)`,
          scale: navbarScale,
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.95 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Floating elements that respond to scroll */}
          <motion.div
            className="absolute top-2 right-20 w-1 h-1 bg-purple-400 rounded-full opacity-40"
            style={{
              y: useTransform(scrollYProgress, [0, 0.2], [0, -10]),
              opacity: useTransform(scrollYProgress, [0, 0.1], [0.4, 0.8]),
            }}
          />
          <motion.div
            className="absolute top-4 right-32 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-30"
            style={{
              y: useTransform(scrollYProgress, [0, 0.2], [0, 8]),
              x: useTransform(scrollYProgress, [0, 0.2], [0, -5]),
              opacity: useTransform(scrollYProgress, [0, 0.1], [0.3, 0.7]),
            }}
          />

          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </motion.div>
              <motion.span
                className="text-xl font-bold bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Civic Reports
              </motion.span>
            </motion.div>

            <motion.div
              className="flex items-center space-x-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center space-x-6">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="text-gray-600 dark:text-gray-300 hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:bg-clip-text font-medium transition-all duration-300 cursor-pointer relative"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      y: useTransform(scrollYProgress, [0, 0.1], [0, -2]),
                    }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden text-gray-600 dark:text-gray-300 p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </motion.button>

              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              <motion.div>
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
                >
                  Admin Login
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-purple-200/30 dark:border-purple-700/30 z-[99] shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-4 space-y-3">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className="block w-full text-left px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Scroll Progress Indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"
          style={{
            scaleX: scrollYProgress,
            transformOrigin: "0%",
          }}
          initial={{ scaleX: 0 }}
        />
      </motion.header>

      {/* Hero Section */}
      <main id="hero" className="relative overflow-hidden pt-16">
        {/* Enhanced Darker Hero Background with Multiple Layers */}
        <motion.div className="absolute inset-0 z-0" style={{ y, opacity }}>
          <div className="relative h-screen w-full">
            {/* Primary Darker Background with Rich Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-black z-0" />

            {/* Secondary Darker Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-indigo-950/30 to-slate-950/50 z-1" />

            {/* Third Gradient Layer with Animation */}
            <motion.div
              className="absolute inset-0 z-2"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)",
                  "radial-gradient(circle at 60% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 40%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Overlay with Dynamic Color Gradients */}
            <motion.div
              className="absolute inset-0 z-3"
              animate={{
                background: [
                  "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.15) 25%, rgba(236, 72, 153, 0.1) 50%, rgba(59, 130, 246, 0.15) 75%, rgba(168, 85, 247, 0.1) 100%)",
                  "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.1) 25%, rgba(99, 102, 241, 0.15) 50%, rgba(139, 92, 246, 0.1) 75%, rgba(59, 130, 246, 0.15) 100%)",
                  "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.15) 25%, rgba(168, 85, 247, 0.1) 50%, rgba(236, 72, 153, 0.15) 75%, rgba(139, 92, 246, 0.1) 100%)",
                ],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />

            {/* Animated Mesh Gradient Background */}
            <motion.div
              className="absolute inset-0 z-4 opacity-20"
              animate={{
                background: [
                  "conic-gradient(from 0deg at 50% 50%, #8b5cf6 0deg, #ec4899 90deg, #3b82f6 180deg, #10b981 270deg, #8b5cf6 360deg)",
                  "conic-gradient(from 90deg at 50% 50%, #ec4899 0deg, #3b82f6 90deg, #10b981 180deg, #8b5cf6 270deg, #ec4899 360deg)",
                  "conic-gradient(from 180deg at 50% 50%, #3b82f6 0deg, #10b981 90deg, #8b5cf6 180deg, #ec4899 270deg, #3b82f6 360deg)",
                  "conic-gradient(from 270deg at 50% 50%, #10b981 0deg, #8b5cf6 90deg, #ec4899 180deg, #3b82f6 270deg, #10b981 360deg)",
                ],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                filter: "blur(60px)",
                transform: "scale(1.5)",
              }}
            />

            {/* Animated SVG Background with Enhanced Gradients */}
            <motion.div
              className="absolute inset-0 z-5"
              animate={{ rotate: 360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-full h-full opacity-30" viewBox="0 0 1000 1000">
                <defs>
                  <linearGradient
                    id="gradient1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#ec4899" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient
                    id="gradient2"
                    x1="100%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                  </linearGradient>
                  <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                  </radialGradient>
                </defs>
                <circle cx="200" cy="200" r="100" fill="url(#gradient1)" />
                <circle cx="800" cy="300" r="150" fill="url(#gradient2)" />
                <circle cx="500" cy="700" r="120" fill="url(#radialGradient)" />
                <polygon
                  points="100,800 300,600 500,800 300,1000"
                  fill="url(#gradient1)"
                />
                <polygon
                  points="700,100 900,300 700,500 500,300"
                  fill="url(#gradient2)"
                />
              </svg>
            </motion.div>

            {/* Additional Floating Gradient Orbs */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-20"
              style={{
                background:
                  "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full opacity-25"
              style={{
                background:
                  "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)",
              }}
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.25, 0.5, 0.25],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center">
          {/* Floating Animation Elements */}
          <motion.div
            className="absolute top-20 left-10 w-4 h-4 bg-purple-900 rounded-full opacity-30"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-6 h-6 bg-blue-500 rounded-full opacity-40"
            animate={{
              y: [0, 30, 0],
              x: [0, 10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-40 left-20 w-3 h-3 bg-pink-500 rounded-full opacity-50"
            animate={{
              y: [0, -15, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.span
                  className="block relative"
                  whileHover={{
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.span
                    className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    Civic Reports
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-20 blur-xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.span>
                <motion.span
                  className="block mt-2 relative"
                  whileHover={{
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.span
                    className="bg-gradient-to-r from-gray-400 via-blue-400 to-purple-600 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    Admin Dashboard
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 opacity-20 blur-xl"
                    animate={{
                      scale: [1.1, 1, 1.1],
                      opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                </motion.span>
                <motion.span>Admin Dashboard</motion.span>
              </motion.h1>
              <motion.p
                className="text-lg lg:text-xl text-gray-300 mb-6 leading-relaxed max-w-2xl"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                Streamline civic issue management with our powerful admin
                dashboard. Track, manage, and resolve community reports
                efficiently across departments.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <motion.div
                  className="relative group"
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"
                    animate={{
                      background: [
                        "linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6)",
                        "linear-gradient(45deg, #3b82f6, #ec4899, #8b5cf6)",
                        "linear-gradient(45deg, #8b5cf6, #3b82f6, #ec4899)",
                        "linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6)",
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <Link
                    href="/login"
                    className="relative inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-lg hover:shadow-2xl"
                  >
                    <motion.svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ rotate: 15 }}
                      transition={{ duration: 0.3 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </motion.svg>
                    Admin Login
                  </Link>
                </motion.div>
                <motion.div
                  className="relative group"
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                    animate={{
                      background: [
                        "linear-gradient(45deg, #10b981, #06b6d4, #3b82f6)",
                        "linear-gradient(45deg, #3b82f6, #10b981, #06b6d4)",
                        "linear-gradient(45deg, #06b6d4, #3b82f6, #10b981)",
                        "linear-gradient(45deg, #10b981, #06b6d4, #3b82f6)",
                      ],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <Link
                    href="/login"
                    className="relative inline-flex items-center justify-center px-8 py-4 border-2 border-gradient-to-r from-emerald-300 to-blue-300 text-lg font-medium rounded-lg bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-700/90 hover:from-emerald-50 hover:to-blue-50 dark:hover:from-emerald-900/20 dark:hover:to-blue-900/20 text-gray-700 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 shadow-md hover:shadow-xl backdrop-blur-sm"
                  >
                    <motion.svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      transition={{ duration: 0.5 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </motion.svg>
                    Create Authority Account
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Side - Dashboard Illustration */}
            <motion.div
              className="hidden lg:block relative"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.8 }}
            >
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.6 }}
                style={{ perspective: "1000px" }}
              >
                {/* Dashboard Mockup */}
                <div className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/30">
                  <motion.div
                    className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-4 mb-4"
                    animate={{
                      background: [
                        "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)",
                        "linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)",
                        "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <motion.div
                        className="h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                        animate={{ width: ["60%", "80%", "60%"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <motion.div
                        className="h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                        animate={{ width: ["40%", "90%", "40%"] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: 0.5,
                        }}
                      />
                      <motion.div
                        className="h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                        animate={{ width: ["70%", "50%", "70%"] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                  </motion.div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <motion.div
                      className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg p-3 border border-purple-200/20"
                      whileHover={{ scale: 1.05, y: -2 }}
                      animate={{
                        boxShadow: [
                          "0 4px 20px rgba(139, 92, 246, 0.1)",
                          "0 8px 25px rgba(139, 92, 246, 0.2)",
                          "0 4px 20px rgba(139, 92, 246, 0.1)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="text-xs text-purple-300 mb-1">
                        Reports
                      </div>
                      <motion.div
                        className="text-lg font-bold text-purple-600 dark:text-purple-400"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        247
                      </motion.div>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-lg p-3 border border-blue-200/20"
                      whileHover={{ scale: 1.05, y: -2 }}
                      animate={{
                        boxShadow: [
                          "0 4px 20px rgba(59, 130, 246, 0.1)",
                          "0 8px 25px rgba(59, 130, 246, 0.2)",
                          "0 4px 20px rgba(59, 130, 246, 0.1)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <div className="text-xs text-blue-300 mb-1">Resolved</div>
                      <motion.div
                        className="text-lg font-bold text-blue-600 dark:text-blue-400"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5,
                        }}
                      >
                        186
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Chart Representation */}
                  <motion.div
                    className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg p-3 border border-indigo-200/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-end space-x-1 h-16">
                      {[40, 60, 80, 45, 70, 55, 90].map((height, index) => (
                        <motion.div
                          key={index}
                          className="bg-gradient-to-t from-purple-500 to-blue-500 rounded-sm flex-1"
                          style={{ height: `${height}%` }}
                          animate={{
                            height: [
                              `${height}%`,
                              `${height + 20}%`,
                              `${height}%`,
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full shadow-lg"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full shadow-lg"
                  animate={{
                    y: [0, 10, 0],
                    rotate: [0, -180, -360],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Down Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                const element = document.querySelector("#features");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <motion.div
                className="w-1 h-3 bg-white/50 rounded-full mt-2"
                animate={{
                  y: [0, 12, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Content Section */}
        <motion.div className="relative z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                  Real-time Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Monitor report trends, track resolution times, and get
                  insights with comprehensive analytics and charts.
                </p>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                  Department Management
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Organize reports by departments, assign tasks to staff, and
                  ensure proper workflow management.
                </p>
              </motion.div>

              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                  Status Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Track report progress from submission to resolution with
                  automated status updates and notifications.
                </p>
              </motion.div>
            </div>

            {/* Stats Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-16 transition-all duration-300">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  Empowering Local Governments
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
                  Join municipalities nationwide who are already using our
                  platform to improve civic engagement and streamline issue
                  resolution.
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-300">
                    500+
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    Reports Managed
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2 transition-colors duration-300">
                    95%
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    Resolution Rate
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2 transition-colors duration-300">
                    24h
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    Avg Response Time
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2 transition-colors duration-300">
                    50+
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    Departments
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-12 text-white transition-all duration-300">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Access your admin dashboard or create a new authority account to
                begin managing civic reports.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                >
                  Access Dashboard
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
                >
                  Create Authority Account
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          id="features"
          className="relative bg-gray-900 py-16 mt-16 overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-20">
            <div className="absolute inset-[2px] bg-gray-900"></div>
          </div>

          {/* Top Gradient Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>

          {/* Bottom Gradient Border */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.h2
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Powerful Features for Modern Governance
              </motion.h2>
              <motion.p
                className="text-xl text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Comprehensive tools designed to streamline civic management and
                enhance community engagement
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "📊",
                  title: "Real-time Analytics",
                  description:
                    "Track report trends, department performance, and citizen satisfaction with detailed analytics and insights.",
                },
                {
                  icon: "🚨",
                  title: "Priority Management",
                  description:
                    "Automatically categorize and prioritize reports based on urgency, location, and department capacity.",
                },
                {
                  icon: "📱",
                  title: "Mobile Integration",
                  description:
                    "Seamless mobile app integration allows citizens to report issues directly from their smartphones.",
                },
                {
                  icon: "🔄",
                  title: "Workflow Automation",
                  description:
                    "Streamline processes with automated routing, notifications, and status updates.",
                },
                {
                  icon: "🗺️",
                  title: "GIS Mapping",
                  description:
                    "Visual mapping integration to track issues geographically and identify problem areas.",
                },
                {
                  icon: "👥",
                  title: "Multi-Department",
                  description:
                    "Coordinate across departments with role-based access and collaborative tools.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          id="how-it-works"
          className="relative bg-gradient-to-br from-slate-900 to-gray-950 py-16 overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Animated Gradient Border */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px]"
            animate={{
              background: [
                "linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6, #ec4899)",
                "linear-gradient(90deg, #3b82f6, #ec4899, #8b5cf6, #3b82f6)",
                "linear-gradient(90deg, #8b5cf6, #3b82f6, #ec4899, #8b5cf6)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.h2
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                How It Works
              </motion.h2>
              <motion.p
                className="text-xl text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Simple, efficient workflow that connects citizens with their
                local government
              </motion.p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Report Submitted",
                  description:
                    "Citizens submit reports via mobile app or web portal with photos and location data",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  step: "02",
                  title: "Auto-Routing",
                  description:
                    "System automatically routes to appropriate department based on category and location",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  step: "03",
                  title: "Department Action",
                  description:
                    "Assigned department reviews, prioritizes, and takes action on the reported issue",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  step: "04",
                  title: "Resolution & Feedback",
                  description:
                    "Citizens receive updates and can provide feedback on the resolution process",
                  color: "from-orange-500 to-red-500",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {step.step}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">{step.description}</p>
                  {index < 3 && (
                    <motion.div
                      className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-600 to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.2 + 0.4 }}
                      viewport={{ once: true }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          id="testimonials"
          className="relative bg-gray-900 py-16 overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Side Gradient Borders */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-cyan-500"></div>

          {/* Corner Gradient Effects */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-br-full"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-tr-full"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-tl-full"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.h2
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Trusted by Local Governments
              </motion.h2>
              <motion.p
                className="text-xl text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                See what municipal leaders are saying about our platform
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "This platform has revolutionized how we handle citizen complaints. Response times are down 60% and citizen satisfaction is at an all-time high.",
                  author: "Sarah Johnson",
                  title: "City Manager, Springfield",
                  avatar: "👩‍💼",
                },
                {
                  quote:
                    "The real-time analytics help us identify patterns and allocate resources more effectively. It's like having a crystal ball for municipal planning.",
                  author: "Michael Chen",
                  title: "Public Works Director, Riverside",
                  avatar: "👨‍💻",
                },
                {
                  quote:
                    "Citizens love the transparency and quick responses. We've seen a 40% increase in civic engagement since implementing this system.",
                  author: "Elena Rodriguez",
                  title: "Mayor, Greenfield",
                  avatar: "👩‍🎓",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="mb-4">
                    <div className="text-yellow-400 text-xl mb-2">★★★★★</div>
                    <p className="text-gray-300 italic">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {testimonial.title}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          id="faq"
          className="bg-gradient-to-br from-gray-900 to-slate-800 py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <motion.h2
                className="text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p
                className="text-xl text-gray-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Get answers to common questions about our civic reporting
                platform
              </motion.p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How secure is the platform?",
                  answer:
                    "We use enterprise-grade security with end-to-end encryption, secure data centers, and regular security audits to protect citizen data and municipal information.",
                },
                {
                  question: "Can it integrate with existing municipal systems?",
                  answer:
                    "Yes, our platform offers API integration with most popular municipal management systems, GIS platforms, and existing databases.",
                },
                {
                  question: "What kind of support do you provide?",
                  answer:
                    "We provide 24/7 technical support, dedicated account management, training sessions, and comprehensive documentation for all users.",
                },
                {
                  question: "How quickly can we get started?",
                  answer:
                    "Most municipalities can be up and running within 2-4 weeks, including data migration, staff training, and system customization.",
                },
                {
                  question: "Is there a mobile app for citizens?",
                  answer:
                    "Yes, we provide both iOS and Android apps for citizens to submit reports, track progress, and receive notifications about their submissions.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          id="contact"
          className="bg-slate-800 py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">
                  Ready to Transform Your Municipality?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join hundreds of cities already using our platform to improve
                  civic engagement and streamline operations.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span>30-day free trial</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span>No setup fees</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span>Dedicated support team</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">
                  Get a Demo
                </h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Municipality Name"
                      className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <select className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Select Municipality Size</option>
                      <option>Small (Under 10,000)</option>
                      <option>Medium (10,000 - 100,000)</option>
                      <option>Large (100,000+)</option>
                    </select>
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Schedule Demo
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold">Civic Reports</span>
            </div>
            <p className="text-gray-400 dark:text-gray-500 mb-4 transition-colors duration-300">
              Streamlining civic engagement through technology
            </p>
            <p className="text-gray-500 dark:text-gray-600 transition-colors duration-300">
              © 2025 Civic Reports Dashboard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

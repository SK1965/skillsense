import React from 'react'

export const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
        <h1 className="text-lg font-bold md:text-2xl text-black dark:text-white">
          SkillSense
        </h1>
      </div>
      <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
        Login
      </button>
    </nav>
  )
}
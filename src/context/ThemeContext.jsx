import { useState,createContext,useContext, useEffect } from "react";
const ThemeContext=createContext(null);
export const ThemeProvider=({children})=>{
  const [theme,setTheme]=useState(()=>(
    localStorage.getItem("theme")||"light"
  ));
  const toggleTheme=()=>{
    setTheme(prev=>{
      return prev==='light'?'dark':'light';
    })
  }
  useEffect(()=>{
    const root=document.documentElement;
    if(theme==='dark')
      root.classList.add('dark');
    else
      root.classList.remove('dark');

    localStorage.setItem('theme',theme);
  },[theme]);
  return(
    <ThemeContext.Provider value={{theme,toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}
export const useTheme=()=>{
  return useContext(ThemeContext);
}
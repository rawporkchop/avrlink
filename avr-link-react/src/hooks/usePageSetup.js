import { useEffect } from 'react';

// Sets the browser tab title and swaps the <body> theme class
// ("dark" for the home page, "light" for support/privacy).
export function usePageSetup({ title, theme }) {
  useEffect(() => {
    document.title = title;
    const cls = `theme-${theme}`;
    document.body.classList.add(cls);
    return () => document.body.classList.remove(cls);
  }, [title, theme]);
}

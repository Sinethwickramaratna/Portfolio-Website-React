import { useCallback, useState } from 'react'

const read = () =>
  document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'

/** Light/dark theme. The attribute is set before first paint by index.html. */
export default function useTheme() {
  const [theme, setTheme] = useState(read)
  const toggle = useCallback(() => {
    const next = read() === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* storage blocked: the choice simply lasts for this visit */
    }
    setTheme(next)
  }, [])
  return [theme, toggle]
}

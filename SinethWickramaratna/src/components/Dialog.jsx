import { useEffect, useRef } from 'react'

/** Thin wrapper over the native <dialog>: focus trap, Esc and backdrop come free. */
export default function Dialog({ open, onClose, className, label, children, onKeyDown }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={className}
      aria-label={label}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      {open ? children : null}
    </dialog>
  )
}

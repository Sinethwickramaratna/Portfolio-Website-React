import Dialog from './Dialog.jsx'
import Icon from './Icons.jsx'

/** Image viewer with prev/next. `index` of null means closed. */
export default function Lightbox({ items, index, onIndex, onClose }) {
  const open = index !== null && index !== undefined
  const item = open ? items[index] : null
  const go = (d) => onIndex((index + d + items.length) % items.length)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="lightbox"
      label={item ? item.title : 'Image viewer'}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      {item && (
        <>
          <img src={item.src} alt={item.title} />
          <div className="lightbox-bar">
            <div>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
            <div className="lightbox-ctrl">
              <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous">
                <Icon name="left" />
              </button>
              <button className="icon-btn" onClick={() => go(1)} aria-label="Next">
                <Icon name="right" />
              </button>
              <button className="icon-btn" onClick={onClose} aria-label="Close">
                <Icon name="close" />
              </button>
            </div>
          </div>
        </>
      )}
    </Dialog>
  )
}

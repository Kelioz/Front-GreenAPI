import { ChatAvatarProps } from './types'
import styles from './ChatAvatar.module.scss'

export function ChatAvatar({ initials, isLarge = false }: ChatAvatarProps) {
  return (
    <span className={`${styles.root} ${isLarge ? styles.root__large : ''}`}>
      {initials}
      <i />
    </span>
  )
}

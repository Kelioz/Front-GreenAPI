import { TelegramMessenger } from '@/widgets/TelegramMessenger/TelegramMessenger'
import { useTaskSyncPageModel } from './model/useTaskSyncPageModel'

export default function MainPage() {
  const model = useTaskSyncPageModel()

  return <TelegramMessenger {...model} />
}

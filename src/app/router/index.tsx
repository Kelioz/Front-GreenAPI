import MainPage from '@/pages/TaskSyncPage'
import { Routes, Route } from 'react-router-dom'

export function Router() {
  return (
    <Routes>
      <Route path='/' element={<MainPage />} />
    </Routes>
  )
}

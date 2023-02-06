import { useAppStore } from '@/stores/app'
import Garfish from 'garfish'

export default function preloadApp() {
  const { apps } = useAppStore()

  console.log('meta mode', import.meta.env.MODE)
  console.log('meta', JSON.stringify(import.meta))
  apps.forEach((item) => {
    Garfish.registerApp({
      name: item.name,
      entry: item.entry,
    })
    Garfish.preloadApp(item.name)
  })
}

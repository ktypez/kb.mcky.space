import DefaultTheme from 'vitepress/theme'
import './custom.css'
import SyncTimeline from './components/SyncTimeline.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SyncTimeline', SyncTimeline)
  },
}

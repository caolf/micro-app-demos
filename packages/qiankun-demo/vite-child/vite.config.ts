import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import vitePluginImp from 'vite-plugin-imp'
import qiankun from 'vite-plugin-qiankun'

const useDevMode = true

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? loadEnv('production', process.cwd()).VITE_BASE_URL : '',
  server: {
    port: 8093,
    cors: true,
  },
  plugins: [
    // https://github.com/tengmaoqing/vite-plugin-qiankun
    react({
      fastRefresh: !useDevMode
    }),
    qiankun('viteApp', {
      useDevMode
    }),
    vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: (name) => `antd/es/${name}/style`,
        },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'ant-prefix': 'arv4',
        },
        javascriptEnabled: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}))

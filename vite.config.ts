import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    dts({ 
      tsconfigPath: './tsconfig.app.json',
      rollupTypes: true, // This will now be recognized
      insertTypesEntry: true,
    }) 
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'KewtiComponents',
      fileName: (format) => `kewti.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        },
      },
    },
  },
})
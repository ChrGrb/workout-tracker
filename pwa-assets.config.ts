import {
    defineConfig,
    minimalPreset
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
    preset: {
        ...minimalPreset,
        apple: {
            sizes: [180],
            padding: 0
        }
    },
    images: ['static/favicon.png']
})
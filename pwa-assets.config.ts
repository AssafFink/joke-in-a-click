import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Generates the PWA icons into public/ (run with `npm run icons`).
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    // The source is already full-bleed brand pink with the face centred, so no extra padding.
    maskable: { ...minimal2023Preset.maskable, padding: 0, resizeOptions: { background: '#F7AEB8' } },
    apple: { ...minimal2023Preset.apple, padding: 0, resizeOptions: { background: '#F7AEB8' } },
  },
  images: ['public/app-icon.png'],
});

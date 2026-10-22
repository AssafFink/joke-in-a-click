import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Generates the PWA icons into public/ (run with `npm run icons`).
// TODO: switch the source to public/app-icon.png once spec/assets/app-icon.png is supplied.
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    // Fill the padding of maskable and Apple icons with the brand pink instead of white.
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#F7AEB8' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#F7AEB8' } },
  },
  images: ['public/app-icon-placeholder.svg'],
});

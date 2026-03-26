import type { CapacitorConfig } from '@capacitor/cli';

// Placeholder: set appId to your Apple-registered Bundle ID before TestFlight.
// Run `npm run build:export` so `out/` exists before `npx cap sync`. See
// KURIOSA_STATIC_EXPORT_ENABLEMENT.md

const config: CapacitorConfig = {
  appId: 'com.yourname.kuriosa',
  appName: 'Kuriosa',
  webDir: 'out'
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

// Placeholder: set appId to your Apple-registered Bundle ID before TestFlight.
// webDir must be the Next static export directory (e.g. out/), not public/ — see
// KURIOSA_CAPACITOR_TESTFLIGHT_READINESS_AUDIT.md

const config: CapacitorConfig = {
  appId: 'com.yourname.kuriosa',
  appName: 'Kuriosa',
  webDir: 'public'
};

export default config;

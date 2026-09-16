import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'vzneqxsx',
    dataset: 'production',
  },
  studioHost: 'foundsm',
  deployment: {
    // Without this, `sanity deploy` prompts for the application id, which would
    // hang any non-interactive (CI) deploy.
    appId: 'w4wzdqnigfr0qap2vkfzqsy5',
    // Off deliberately: the Studio changes only when someone builds and deploys
    // it, not on Sanity's release schedule. Flip to true to opt into automatic
    // patch/minor updates.
    autoUpdates: false,
  },
});

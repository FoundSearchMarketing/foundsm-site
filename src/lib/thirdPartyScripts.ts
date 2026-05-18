const explicitThirdPartyScripts = import.meta.env.PUBLIC_ENABLE_THIRD_PARTY_SCRIPTS;
const vercelEnvironment = import.meta.env.VERCEL_ENV;

// The OneTrust tenant is scoped to foundsm.com, so preview hosts should not load it by default.
export const enableThirdPartyScripts =
  explicitThirdPartyScripts !== undefined
    ? explicitThirdPartyScripts === 'true'
    : import.meta.env.PROD && (!vercelEnvironment || vercelEnvironment === 'production');

import createCache from "@emotion/cache";

export function createEmotionCache() {
  return createCache({ key: "chakra-emotion-css" });
}

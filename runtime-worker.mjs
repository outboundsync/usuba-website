import { handleRuntimeRequest } from './src/lib/runtime.ts';

export default {
  async fetch(request, env) {
    return handleRuntimeRequest(request, {
      fetchAsset: (assetRequest) => env.ASSETS.fetch(assetRequest),
    });
  },
};

import { handleRuntimeRequest } from './src/lib/runtime.ts';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.usuba.dev') {
      url.hostname = 'usuba.dev';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    return handleRuntimeRequest(request, {
      fetchAsset: (assetRequest) => env.ASSETS.fetch(assetRequest),
    });
  },
};

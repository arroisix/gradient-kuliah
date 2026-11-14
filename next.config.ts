import { withMotionwind } from "motionwind-react/next";

const nextConfig = {
  /* config options here */
};

export default withMotionwind(nextConfig);

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());

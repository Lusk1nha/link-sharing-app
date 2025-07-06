import type { NextConfig } from 'next';

import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJSON = require('./package.json');

const transpilePackages = Object.keys(packageJSON.dependencies).filter((it) =>
  it.includes('@link-sharing-app/'),
);

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages,
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, output: 'standalone',
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
};

export default nextConfig;

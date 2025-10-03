/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'rybwefx6jybsfaoy.public.blob.vercel-storage.com',
            port: '',
            pathname: '/**',
        }],
    },
};

export default nextConfig;
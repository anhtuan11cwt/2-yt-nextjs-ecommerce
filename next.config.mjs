/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "res.cloudinary.com",
				protocol: "https",
			},
		],
	},
	transpilePackages: [
		"@ckeditor/ckeditor5-build-classic",
		"@ckeditor/ckeditor5-react",
	],
};

export default nextConfig;

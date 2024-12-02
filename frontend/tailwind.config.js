/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{html,js,jsx,ts,tsx}", // Ensure this matches your file paths
	],
	theme: {
		extend: {
			fontFamily: {
				inter: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [],
};

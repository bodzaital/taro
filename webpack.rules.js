const autoprefixer = require("autoprefixer");

module.exports = [
	// Add support for native node modules
	{
		// We're specifying native_modules in the test because the asset relocator loader generates a
		// "fake" .node file which is really a cjs file.
		test: /native_modules[/\\].+\.node$/,
		use: 'node-loader',
	},
	{
		test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
		parser: { amd: false },
		use: {
			loader: '@vercel/webpack-asset-relocator-loader',
			options: {
				outputAssetBase: 'native_modules',
			},
		},
	},
	{
        test: /\.s[ac]ss$/i,
		// use: [
		// 	"style-loader",
		// 	"css-loader",
		// 	"sass-loader"
		// ]
		use: [
			{ loader: "style-loader" },
			{ loader: "css-loader" },
			{
				loader: "postcss-loader",
				options: { postcssOptions: { plugins: [ autoprefixer ] } }
			},
			{ loader: "sass-loader" }
		]
	}
	// Put your webpack loader rules in this array.  This is where you would put
	// your ts-loader configuration for instance:
	/**
	 * Typescript Example:
	 *
	 * {
	 *   test: /\.tsx?$/,
	 *   exclude: /(node_modules|.webpack)/,
	 *   loaders: [{
	 *     loader: 'ts-loader',
	 *     options: {
	 *       transpileOnly: true
	 *     }
	 *   }]
	 * }
	 */
];

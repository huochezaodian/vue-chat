module.exports = {
	plugins: [
		require('postcss-cssnext')({
			browsers: ['last 5 versions', '> 10%']
		}),
		require('postcss-assets')({
		   loadPaths: ['./src/images']
		})
	]
}
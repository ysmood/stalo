import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import injectProcessEnv from 'rollup-plugin-inject-process-env';

// eslint-disable-next-line no-undef
const entries = process.env.ENTRIES.split(',');

export default entries.map(entry => {
	return {
		input: `src/${entry}.ts`, // Entry file
		output: {
			file: `dist/${entry}.js`, // Output file
			format: 'iife', // Immediately Invoked Function Expression format
			sourcemap: true
		},
		treeshake: true,
		plugins: [
			typescript(), // Compile TypeScript
			resolve(), // Resolve node_modules dependencies
			commonjs({ extensions: ['.js', '.ts'] }), // Convert CommonJS modules to ES6
			injectProcessEnv({
				NODE_ENV: 'production',
			})
		],
	};
})
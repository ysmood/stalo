import { readFileSync, writeFileSync } from 'fs';
import { execSync } from "child_process";

const version = JSON.parse(readFileSync('package.json')).version;

["./devtools-ui/package.json", "./chrome-extension/package.json"].forEach(p => {
	const info = JSON.parse(readFileSync(p, "utf8"))
	info.version = version
	info.dependencies["stalo"] = "^" + version

	writeFileSync(p, JSON.stringify(info, null, 2))
})

execSync(`npm i`, { stdio: 'inherit' })
execSync(`git add .`, { stdio: 'inherit' })

import {puppeteerLauncher} from "@web/test-runner-puppeteer";

export default {
	browsers: [puppeteerLauncher()],
	files: "test/**/*.js",
	nodeResolve: true
};

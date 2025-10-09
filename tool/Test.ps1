Write-Output "Running the test suite..."
npx tsc --build src/tsconfig.json --sourceMap
npx esbuild test/Main.js --bundle --legal-comments=none --log-level=warning --outfile=var/Tests.js
node test/Playwright.js

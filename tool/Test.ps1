Write-Host "Running the test suite..."
npx tsc --build src/tsconfig.json --sourceMap
npx esbuild --bundle --legal-comments=none --log-level=warning --outfile=var/Tests.js test/Main.js
node test/Playwright.js

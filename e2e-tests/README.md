# Post-Deployment Tests

This directory contains end-to-end tests that can be run against a deployed version of the application to verify that critical functionality is working correctly after deployment.

## Prerequisites

Before running the post-deployment tests, you need to install the required dependencies:

```bash
# Install Playwright
npm install --save-dev playwright

# Install Playwright browsers
npx playwright install chromium
```

## Running the Tests

You can run the post-deployment tests using the following command:

```bash
# Run against the default URL
npm run test:post-deploy

# Run against a custom URL
APP_URL=https://your-deployed-app.vercel.app npm run test:post-deploy
```

## Test Coverage

The post-deployment tests verify the following critical functionality:

1. **Home page loads** - Verifies that the home page loads successfully and contains the expected title and content.
2. **Timeline view loads** - Checks that the timeline page loads and displays correctly.
3. **Add event modal works** - Tests that the "Add New Event" modal opens properly.
4. **Local storage functionality** - Confirms that localStorage is available and working.
5. **Export page loads** - Ensures that the export functionality page loads correctly.

## Adding New Tests

To add new tests, simply add additional test cases to the `post-deployment.test.js` file. 

Each test should:
1. Be wrapped in a `runTest` function call
2. Have a descriptive name
3. Use the playwright API to interact with the application
4. Use assertions to verify expected behavior

Example:

```javascript
await runTest('My new test', async () => {
  await page.goto(`${APP_URL}/some-path`);
  await page.click('button:has-text("Some Button")');
  
  const elementText = await page.textContent('.some-selector');
  assert(elementText === 'Expected Text', 'Element text is incorrect');
});
```

## Continuous Integration

These tests can be integrated into a CI/CD pipeline to automatically verify each deployment. For example, in a GitHub Actions workflow:

```yaml
name: Post-Deployment Tests

on:
  deployment_status:
    states: [success]

jobs:
  e2e-tests:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps chromium
      - name: Run post-deployment tests
        run: APP_URL=${{ github.event.deployment_status.target_url }} npm run test:post-deploy
``` 
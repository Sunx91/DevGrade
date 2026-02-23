import { test, expect } from '@playwright/test';

test.describe('DevGrade GitHub Insights Dashboard', () => {

    test('should analyze a user and render the dashboard correctly', async ({ page }) => {
        // 1. Mock the API POST request to return successful predefined data
        await page.route('/api/analyze', async (route) => {
            const payload = {
                username: 'mock-engineer',
                overallScore: 92,
                metrics: {
                    quality: { score: 95 },
                    techStack: { score: 85, languages: ['TypeScript', 'Rust', 'Go'] },
                    documentation: { score: 90 },
                    security: { score: 100 },
                    commits: 1542,
                    mergedPRs: 210,
                },
                roadmap: [
                    { title: 'Test Strategy', description: 'Mock suggestion', category: 'engineering' }
                ]
            };

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(payload)
            });
        });

        // 2. Navigate to the landing page
        await page.goto('/');

        // 3. User types a username and submits
        const searchInput = page.getByPlaceholder('Enter your GitHub username (e.g., octocat)');
        await expect(searchInput).toBeVisible();
        await searchInput.fill('mock-engineer');

        const analyzeButton = page.getByRole('button', { name: /Analyze/i });
        await expect(analyzeButton).toBeEnabled();
        await analyzeButton.click();

        // 4. Wait for navigation to complete
        await page.waitForURL('**/dashboard?user=mock-engineer');

        // 5. Verify the Skeleton Loader appears initially (depends on timing, might be quick)
        // await expect(page.getByLabel('Loading dashboard data')).toBeVisible();

        // 6. Verify the Dashboard renders the mocked metrics
        // Checking the Core Header Score Overview
        await expect(page.getByRole('heading', { name: 'Engineering Readiness Score' })).toBeVisible();
        await expect(page.getByText('92').first()).toBeVisible();

        // Checking the Metrics Grid titles and scores
        await expect(page.getByRole('heading', { name: 'Project Quality' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Tech Diversity' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Documentation' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Security' })).toBeVisible();

        // Verify stats bar data mapping
        await expect(page.getByText('1,542')).toBeVisible(); // Commits formatted
        await expect(page.getByText('210', { exact: true })).toBeVisible(); // Merged PRs

        // Verify Radar Chart presence (via aria-label on the container)
        const radarChart = page.getByLabel('Radar chart showing distribution of specific metrics');
        await expect(radarChart).toBeVisible();

        // Verify AI Roadmap renders
        await expect(page.getByRole('heading', { name: 'AI Engineering Roadmap' })).toBeVisible();
        await expect(page.getByText('Test Strategy')).toBeVisible();
    });
});

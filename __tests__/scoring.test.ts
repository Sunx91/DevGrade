import {
    calculateQualityScore,
    analyzeTechStack,
    rateDocumentation,
    checkSecurity
} from '../src/lib/scoring';

describe('Scoring Engine', () => {

    describe('calculateQualityScore', () => {
        it('returns 0 for empty arrays or invalid input', () => {
            expect(calculateQualityScore([])).toBe(0);
            expect(calculateQualityScore(null as any)).toBe(0);
        });

        it('calculates a high score for recent repos with descriptions and few issues', () => {
            const mockRepos = [
                {
                    pushed_at: new Date().toISOString(), // Just now
                    description: 'A great project',
                    open_issues_count: 2
                }
            ];
            // Base(50) + Recency(30) + Desc(20) = 100
            expect(calculateQualityScore(mockRepos)).toBe(100);
        });

        it('penalizes repos with too many open issues', () => {
            const oldDate = new Date();
            oldDate.setMonth(oldDate.getMonth() - 12);
            const mockRepos = [
                {
                    pushed_at: oldDate.toISOString(), // 1 year ago
                    description: '', // No description
                    open_issues_count: 50 // Too many issues penalty (-10)
                }
            ];
            // Base(50) + Recency(0) + Desc(0) - Issues(10) = 40
            expect(calculateQualityScore(mockRepos)).toBe(40);
        });
    });

    describe('analyzeTechStack', () => {
        it('returns 0 score and empty languages for invalid inputs', () => {
            const res = analyzeTechStack([]);
            expect(res.score).toBe(0);
            expect(res.languages).toEqual([]);
        });

        it('correctly aggregates top languages up to 5', () => {
            const mockRepos = [
                { language: 'TypeScript' },
                { language: 'TypeScript' },
                { language: 'TypeScript' },
                { language: 'Rust' },
                { language: 'Rust' },
                { language: 'Go' },
                { language: 'Python' },
                { language: 'JavaScript' },
                { language: 'C++' }
            ];

            const res = analyzeTechStack(mockRepos);

            // Should be 5 languages maximum * 20 = 100
            expect(res.score).toBe(100);
            expect(res.languages).toHaveLength(5);
            expect(res.languages[0]).toBe('TypeScript'); // Most frequent
            expect(res.languages).not.toContain('C++'); // 6th language dropped
        });

        it('handles repos with null or missing languages', () => {
            const mockRepos = [
                { language: 'Python' },
                { language: null },
                {} // missing entirely
            ];

            const res = analyzeTechStack(mockRepos);
            expect(res.score).toBe(20); // 1 language = 20 score
            expect(res.languages).toEqual(['Python']);
        });
    });

    describe('rateDocumentation', () => {
        it('returns 0 for empty arrays', () => {
            expect(rateDocumentation([])).toBe(0);
        });

        it('calculates perfect score if top repos have description and homepage', () => {
            const mockRepos = [
                { stargazers_count: 100, description: 'Yes', homepage: 'https://demo.com' },
                { stargazers_count: 50, description: 'Yes', homepage: 'https://demo.com' }
            ];
            // Each gets 50+50=100
            expect(rateDocumentation(mockRepos)).toBe(100);
        });

        it('only evaluates top 5 starred repos', () => {
            const mockRepos = [
                { stargazers_count: 10, description: 'Yes', homepage: '' }, // 50
                { stargazers_count: 20, description: 'Yes', homepage: '' }, // 50
                { stargazers_count: 30, description: 'Yes', homepage: '' }, // 50
                { stargazers_count: 40, description: 'Yes', homepage: '' }, // 50
                { stargazers_count: 50, description: 'Yes', homepage: '' }, // 50
                // This 6th one, despite having a perfect score (100), won't be counted because it has 0 stars
                { stargazers_count: 0, description: 'Yes', homepage: 'https://demo.com' }
            ];

            expect(rateDocumentation(mockRepos)).toBe(50);
        });
    });

    describe('checkSecurity', () => {
        it('returns 0 for empty arrays', () => {
            expect(checkSecurity([])).toBe(0);
        });

        it('awards maximum score for issues enabled and license present', () => {
            const mockRepos = [
                { has_issues: true, license: { key: 'mit' } }
            ];
            expect(checkSecurity(mockRepos)).toBe(100);
        });

        it('calculates average score across multiple repos', () => {
            const mockRepos = [
                { has_issues: true, license: { key: 'mit' } }, // 100
                { has_issues: false, license: null }          // 0
            ];
            expect(checkSecurity(mockRepos)).toBe(50);
        });
    });
});

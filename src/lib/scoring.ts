export function calculateQualityScore(repos: any[]): number {
    if (!repos || !Array.isArray(repos) || repos.length === 0) return 0;

    let score = 0;
    const now = new Date();

    repos.forEach((repo) => {
        let repoScore = 50; // Base score

        if (repo.pushed_at) {
            const pushedDate = new Date(repo.pushed_at);
            const monthsDiff = (now.getTime() - pushedDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
            if (monthsDiff < 3) repoScore += 30; // High recency
            else if (monthsDiff < 6) repoScore += 15;
        }

        if (repo.description && repo.description.trim() !== '') {
            repoScore += 20; // Has description
        }

        if (repo.open_issues_count > 10) {
            repoScore -= 10; // Open issues penalty
        }

        score += Math.max(0, Math.min(100, repoScore));
    });

    return Math.round(score / repos.length);
}

export function analyzeTechStack(repos: any[]): { score: number; languages: string[]; details: string } {
    if (!repos || !Array.isArray(repos) || repos.length === 0) {
        return { score: 0, languages: [], details: 'No repositories found.' };
    }

    const languageCounts: Record<string, number> = {};

    repos.forEach((repo) => {
        if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        }
    });

    const sortedLanguages = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([lang]) => lang);

    const topLanguages = sortedLanguages.slice(0, 5);
    const score = Math.min(100, topLanguages.length * 20); // 20 points per language up to 100

    return {
        score,
        languages: topLanguages,
        details: `Detected ${topLanguages.length} main languages across repositories.`,
    };
}

export function rateDocumentation(repos: any[]): number {
    if (!repos || !Array.isArray(repos) || repos.length === 0) return 0;

    // Sort by stars descending to check top repos
    const topRepos = [...repos]
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, 5);

    if (topRepos.length === 0) return 0;

    let totalScore = 0;
    topRepos.forEach((repo) => {
        let repoScore = 0;
        if (repo.description && repo.description.trim().length > 0) {
            repoScore += 50;
        }
        if (repo.homepage && repo.homepage.trim() !== '') {
            repoScore += 50;
        }
        totalScore += repoScore;
    });

    return Math.round(totalScore / topRepos.length);
}

export function checkSecurity(repos: any[]): number {
    if (!repos || !Array.isArray(repos) || repos.length === 0) return 0;

    let totalScore = 0;
    repos.forEach((repo) => {
        let repoScore = 0;
        if (repo.has_issues) {
            repoScore += 50;
        }
        if (repo.license && repo.license.key) {
            repoScore += 50;
        }
        totalScore += repoScore;
    });

    return Math.round(totalScore / repos.length);
}

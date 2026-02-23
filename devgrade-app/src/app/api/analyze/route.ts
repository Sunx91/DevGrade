import { NextResponse } from 'next/server';
import { calculateQualityScore, analyzeTechStack, rateDocumentation, checkSecurity } from '../../../lib/scoring';
import { generateRoadmap } from '../../../lib/llm';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);

        if (!body || typeof body !== 'object') {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { githubUrl } = body;

        if (!githubUrl || typeof githubUrl !== 'string') {
            return NextResponse.json({ error: 'Missing or invalid githubUrl' }, { status: 400 });
        }

        // Extract username from GitHub URL
        let username = '';
        try {
            const url = new URL(githubUrl);
            if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') {
                throw new Error('Not a GitHub URL');
            }
            const pathParts = url.pathname.split('/').filter(Boolean);
            if (pathParts.length === 0) {
                throw new Error('No username found in URL');
            }
            username = pathParts[0];
        } catch (e) {
            return NextResponse.json({ error: 'Invalid GitHub URL format. Expected format: https://github.com/username' }, { status: 400 });
        }

        const token = process.env.GITHUB_TOKEN;
        const baseHeaders: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
        };

        if (token) {
            baseHeaders['Authorization'] = `Bearer ${token}`;
        }

        // Prepare GitHub API requests
        const profileUrl = `https://api.github.com/users/${username}`;
        const reposUrl = `https://api.github.com/users/${username}/repos?sort=pushed&per_page=30`;

        // search/commits requires specific headers
        const commitsUrl = `https://api.github.com/search/commits?q=${encodeURIComponent(`author:${username}`)}`;
        const commitsHeaders = {
            ...baseHeaders,
            'Accept': 'application/vnd.github.cloak-preview',
        };

        const issuesUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(`author:${username} type:pr is:merged`)}`;

        const fetchOptions = { headers: baseHeaders };

        // Execute multiple fetch requests in parallel
        const [profileRes, reposRes, commitsRes, issuesRes] = await Promise.all([
            fetch(profileUrl, fetchOptions),
            fetch(reposUrl, fetchOptions),
            fetch(commitsUrl, { headers: commitsHeaders }),
            fetch(issuesUrl, fetchOptions)
        ]);

        // Robust error handling
        const responses = [
            { name: 'Profile', res: profileRes },
            { name: 'Repositories', res: reposRes },
            { name: 'Commits', res: commitsRes },
            { name: 'Issues', res: issuesRes }
        ];

        for (const { name, res } of responses) {
            if (!res.ok) {
                if (res.status === 404) {
                    return NextResponse.json(
                        { error: `User not found processing ${name}: The GitHub user "${username}" does not exist, or you don't have permission to see it.` },
                        { status: 404 }
                    );
                }
                if (res.status === 403 || res.status === 429) {
                    // It could be rate limit exceeded
                    return NextResponse.json(
                        { error: `GitHub API rate limit exceeded when fetching ${name}. Please try again later or provide a valid GitHub Token.` },
                        { status: res.status } // Either 403 or 429
                    );
                }

                // Catch-all for other GitHub API errors
                return NextResponse.json(
                    { error: `GitHub API error (${name}): ${res.statusText}` },
                    { status: res.status }
                );
            }
        }

        // Parse JSON
        const [profileData, reposData, commitsData, issuesData] = await Promise.all([
            profileRes.json(),
            reposRes.json(),
            commitsRes.json(),
            issuesRes.json()
        ]);

        const qualityScore = calculateQualityScore(reposData);
        const techStack = analyzeTechStack(reposData);
        const documentationScore = rateDocumentation(reposData);
        const securityScore = checkSecurity(reposData);

        const overallScore = Math.round((qualityScore + techStack.score + documentationScore + securityScore) / 4);

        const roadmap = await generateRoadmap(
            {
                quality: { score: qualityScore },
                techStack: techStack,
                documentation: { score: documentationScore },
                security: { score: securityScore },
            },
            techStack.languages
        );

        // Aggregate into a single response
        const aggregatedData = {
            username: profileData.login || username,
            overallScore,
            metrics: {
                quality: { score: qualityScore },
                techStack: techStack,
                documentation: { score: documentationScore },
                security: { score: securityScore },
                commits: commitsData.total_count ?? 0,
                mergedPRs: issuesData.total_count ?? 0,
            },
            roadmap
        };

        return NextResponse.json(aggregatedData, { status: 200 });
    } catch (error: any) {
        console.error('Error in /api/analyze:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred while analyzing the user. Please try again later.' },
            { status: 500 }
        );
    }
}

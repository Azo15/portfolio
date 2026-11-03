const username = 'Azo15';
const cacheKey = 'azo-os.github.v2';
const cacheDuration = 10 * 60 * 1000;

const fallback = {
  publicRepos: 79,
  followers: 5,
  recentRepos: [],
  repoIndex: {},
  source: 'fallback',
  updatedAt: null
};

function readCache() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey));
    return cached?.expiresAt > Date.now() ? cached.value : null;
  } catch {
    return null;
  }
}

function saveCache(value) {
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ value, expiresAt: Date.now() + cacheDuration }));
  } catch {
    // Storage can be unavailable in private browsing; live data is still usable.
  }
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
  return response.json();
}

export async function getGitHubStats({ refresh = false } = {}) {
  const cached = readCache();
  if (!refresh && cached) return { ...cached, source: 'session cache' };

  try {
    const [user, repos] = await Promise.all([
      fetchJson(`https://api.github.com/users/${username}`),
      fetchJson(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    ]);
    const repoIndex = Object.fromEntries(
      repos.map((repo) => [
        repo.name.toLowerCase(),
        {
          name: repo.name,
          url: repo.html_url,
          stars: repo.stargazers_count ?? 0,
          forks: repo.forks_count ?? 0,
          language: repo.language || null,
          updatedAt: repo.updated_at || repo.pushed_at || null
        }
      ])
    );
    const value = {
      publicRepos: user.public_repos,
      followers: user.followers,
      recentRepos: repos.slice(0, 5).map(({ name, html_url, updated_at, language }) => ({ name, url: html_url, updatedAt: updated_at, language })),
      repoIndex,
      source: 'live',
      updatedAt: new Date().toISOString()
    };
    saveCache(value);
    return value;
  } catch (error) {
    if (cached) return { ...cached, source: 'stale cache', error: error.message };
    return { ...fallback, error: error.message };
  }
}

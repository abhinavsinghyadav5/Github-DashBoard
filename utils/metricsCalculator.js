function calculateMetrics(repos) {
  const totalRepos = repos.length;

  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  const totalForks = repos.reduce(
    (sum, repo) => sum + repo.forks_count,
    0
  );

  const languageCount = {};

  repos.forEach(repo => {
    if (repo.language) {
      languageCount[repo.language] =
        (languageCount[repo.language] || 0) + 1;
    }
  });

  let topLanguage = "None";

  if (Object.keys(languageCount).length > 0) {
    topLanguage = Object.keys(languageCount).reduce((a, b) =>
      languageCount[a] > languageCount[b] ? a : b
    );
  }

  //  Top 5 repositories by stars
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map(repo => ({
      name: repo.name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url
    }));

  return {
    totalRepos,
    totalStars,
    totalForks,
    topLanguage,
    languageDistribution: languageCount,
    topRepos
  };
}

module.exports = calculateMetrics;
module.exports = function extractRepository(repository) {
  let repo = (repository || {}).url || repository || ''
  repo = repo.split('github.com')[1] || ''
  repo = repo.substring(1).replace(/\.git$/, '')
  return repo
}

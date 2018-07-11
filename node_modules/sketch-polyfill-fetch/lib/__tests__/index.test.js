const fetch = require('../index')

test('should be a function', () => {
  expect(typeof fetch).toBe('function')
})

test('should fetch a url', () => {
  return fetch('https://jsonplaceholder.typicode.com/posts/1', {
    headers: { a: 'b' }
  }).then(res => {
    expect(res.ok).toBe(true)
    expect(res.status).toBe(200)
    expect(res.url).toBe('https://jsonplaceholder.typicode.com/posts/1')
    return res.json()
  })
  .then(res => {
    expect(res.id).toBe(1)
  })
})

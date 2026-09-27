const dummy = (blogs) => {
  return 1
}

// 4.4: total likes
const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes

  return blogs.reduce(reducer, 0)
}

// 4.5: favorite blog (most likes)
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const reducer = (favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite

  const winner = blogs.reduce(reducer, blogs[0])

  return {
    title: winner.title,
    author: winner.author,
    likes: winner.likes,
  }
}

// 4.6: author with the most blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = {}
  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  let topAuthor = null
  let topCount = 0

  for (const author in counts) {
    if (counts[author] > topCount) {
      topAuthor = author
      topCount = counts[author]
    }
  }

  return {
    author: topAuthor,
    blogs: topCount,
  }
}

// 4.7: author with the most total likes
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = {}
  blogs.forEach(blog => {
    likesByAuthor[blog.author] = (likesByAuthor[blog.author] || 0) + blog.likes
  })

  let topAuthor = null
  let topLikes = -1

  for (const author in likesByAuthor) {
    if (likesByAuthor[author] > topLikes) {
      topAuthor = author
      topLikes = likesByAuthor[author]
    }
  }

  return {
    author: topAuthor,
    likes: topLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
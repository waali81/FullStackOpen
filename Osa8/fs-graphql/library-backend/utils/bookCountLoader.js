const DataLoader = require('dataloader')
const Book = require('../models/book')

const bookCountLoader = new DataLoader(async (authorIds) => {
  const books = await Book.find({
    author: { $in: authorIds },
  })

  const counts = authorIds.map(
    (authorId) =>
      books.filter(
        (book) => book.author.toString() === authorId.toString()
      ).length
  )

  return counts
})

module.exports = bookCountLoader
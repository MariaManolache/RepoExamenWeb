const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const cors = require('cors')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'sample.db',
  define: {
    timestamps: false
  }
})

const VirtualShelf = sequelize.define('virtualShelf', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: Sequelize.STRING,
    validate: {
      len: [3, 20]
    }
  },
  date: {
    type: Sequelize.DATE
  }
})

const Book = sequelize.define('book', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    validate: {
      len: [5, 20]
    }
  },
  genre: {
    type: Sequelize.ENUM,
    values: ['COMEDY', 'TRAGEDY', 'HISTORY']
  },
  url: {
    type: Sequelize.STRING,
    validate: {
      isUrl: true
    }
  }
})

VirtualShelf.hasMany(Book)

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/sync', async (req, res) => {
  try {
    await sequelize.sync({ force: true })
    res.status(201).json({ message: 'created' })
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/virtualShelves', async (req, res) => {
  try {
    const query = {}
    let pageSize = 4
    const allowedFilters = ['description', 'date']
    const filterKeys = Object.keys(req.query).filter(e => allowedFilters.indexOf(e) !== -1)
    if (filterKeys.length > 0) {
      query.where = {}
      for (const key of filterKeys) {
        if(key == 'date') {
          let nextData = parseInt(req.query[key]) +1
          query.where[key] = {
            [Op.gte]: `%${req.query[key]}%`,
            [Op.lte]: `%${nextData}%`
        } } else {
        query.where[key] = {
          [Op.like]: `%${req.query[key]}%`
        }
      }
      }
    }

    const sortField = req.query.sortField
    let sortOrder = 'ASC'
    if (req.query.sortOrder && req.query.sortOrder === '-1') {
      sortOrder = 'DESC'
    }

    if (req.query.pageSize) {
      pageSize = parseInt(req.query.pageSize)
    }

    if (sortField) {
      query.order = [[sortField, sortOrder]]
    }

    if (!isNaN(parseInt(req.query.page))) {
      query.limit = pageSize
      query.offset = pageSize * parseInt(req.query.page)
    }

    const records = await VirtualShelf.findAll(query)
    const count = await VirtualShelf.count()
    res.status(200).json({ records, count })
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.post('/virtualShelves', async (req, res) => {
  try {
    if (req.query.bulk && req.query.bulk === 'on') {
      await VirtualShelf.bulkCreate(req.body)
      res.status(201).json({ message: 'created' })
    } else {
      await VirtualShelf.create(req.body)
      res.status(201).json({ message: 'created' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/virtualShelves/:id', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.id)
    if (virtualShelf) {
      res.status(200).json(virtualShelf)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.put('/virtualShelves/:id', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.id)
    if (virtualShelf) {
      await virtualShelf.update(req.body, { fields: ['description', 'date'] })
      res.status(202).json({ message: 'accepted' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.delete('/virtualShelves/:id', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.id, { include: Book })
    if (virtualShelf) {
      await virtualShelf.destroy()
      res.status(202).json({ message: 'accepted' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/virtualShelves/:virtualShelfId/books', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.virtualShelfId)
    if (virtualShelf) {
      const books = await virtualShelf.getBooks()

      res.status(200).json(books)
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.get('/virtualShelves/:virtualShelfId/books/:bookId', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.virtualShelfId)
    if (virtualShelf) {
      const books = await virtualShelf.getBooks({ where: { id: req.params.bookId } })
      res.status(200).json(books.shift())
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.post('/virtualShelves/:virtualShelfId/books', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.virtualShelfId)
    if (virtualShelf) {
      const book = req.body
      book.virtualShelfId = virtualShelf.id
      console.warn(book)
      await Book.create(book)
      res.status(201).json({ message: 'created' })
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.put('/virtualShelves/:virtualShelfId/books/:bookId', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.virtualShelfId)
    if (virtualShelf) {
      const books = await virtualShelf.getBooks({ where: { id: req.params.bookId } })
      const book = books.shift()
      if (book) {
        await book.update(req.body)
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

app.delete('/virtualShelves/:virtualShelfId/books/:bookId', async (req, res) => {
  try {
    const virtualShelf = await VirtualShelf.findByPk(req.params.virtualShelfId)
    if (virtualShelf) {
      const books = await virtualShelf.getBooks({ where: { id: req.params.bookId } })
      const book = books.shift()
      if (book) {
        await book.destroy(req.body)
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } else {
      res.status(404).json({ message: 'not found' })
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
})

// import
app.post('/import', async (req, res, next) => {
  try {
    const registry = {};
    for (let s of req.body) {
      const virtualShelf = await VirtualShelf.create(s);
      for (let b of s.books) {
        const book = await Book.create(b);
        registry[b.key] = book;
        virtualShelf.addBook(book);
      }
      await virtualShelf.save();
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
})

// export
app.get('/export', async (req, res, next) => {
  try {
    const result = [];
    for (let s of await VirtualShelf.findAll()) {
      const virtualShelf = {
        description: s.description,
        date: s.date,
        books: []
      };

      for (let b of await s.getBooks()) {
        virtualShelf.books.push({
          key: b.id,
          title: b.title,
          genre: b.genre,
          url: b.url
        });
      }
      result.push(virtualShelf);
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
});

app.listen(8080)

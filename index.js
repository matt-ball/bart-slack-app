const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (req, res) => {
  const { text } = req.body
  const route = text.split(' ')[0]

  try {
    require(`./routes/${route}`)(req, res)
  } catch (e) {
    res.send('Invalid command!')
  }
})

app.listen(3000, () => console.log(`Running!`))

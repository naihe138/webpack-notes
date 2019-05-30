let express = require('express')
let app = express()

app.get('/test', (req, res) => {
  res.json({
    name: '何文林'
  }) 
})

app.listen(3000,() => {
  console.log('app listen port 3000')
})
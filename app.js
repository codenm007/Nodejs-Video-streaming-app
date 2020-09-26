const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const fs = require('fs');
const cors = require('cors')
const multer = require('multer')
const upload = multer({ dest: 'assets/' })


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// any request coming in, transfer all body into JSON
app.use(express.json())

// allow cross origin from client localhost
app.use(cors())

// creating POST endpoint /file
app.post('/file', upload.single('file'), (req, res) => {
  console.log('body', req.file.length, req.file)

  // here you can do anything that you want for the file
  // ex: you want to save it to database here

  res.json({ success: true })
})

app.get('/video/:something/:filename', function(req, res) {
    if(req.params.something == "1232"){
    
    function videostream(){    
    console.log("Hello")  
    const path = `assets/${req.params.filename}`
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  }
  videostream();
}else{
    res.send("Not allowed!");
}
  });

  app.listen(port, () => {
    console.log(`Server running on  http://localhost:${port}`)
  })
  
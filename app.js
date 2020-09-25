const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fs = require('fs');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/video/:something/:filename', function(req, res) {
    if(req.params.something == "1232"){
    
        
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
}else{
    res.send("Not allowed!");
}
  });

  app.listen(port, () => {
    console.log(`Server running on  http://localhost:${port}`)
  })
  
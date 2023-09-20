require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;


let urlList = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

checkUrl = (req, res, next) => {
  const {url} = req.body;
  dns.lookup(new URL(url).hostname, (err) => {
    if(err){
      res.json({error: 'invalid url'});
      return;
    }
    next();
  })
};


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:code', function(req, res) {
  const {code} = req.params;
  if(code > urlList.length || code < 1){
    res.json({
      error: "No short URL found for the given input"
    })
    return;
  }
  res.redirect(urlList[code]);
});

app.post('/api/shorturl', checkUrl, function(req, res){
  const {url} = req.body; 
  urlList.push(url);
  res.json({
    original_url: url,
    short_url: urlList.length-1
  })
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

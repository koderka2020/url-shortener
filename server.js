const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology:true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', {shortUrls: shortUrls});
});

app.post('/shortUrls', async (req,res)=> {
  await ShortUrl.create({full: req.body.fullUrl});
  res.redirect('/');
});

app.get('/:shortUrl', async (req,res)=> {
  // console.log(req.params.shortUrl)
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  
  if (shortUrl == null) return res.sendStatus(404);
  const count = shortUrl.clicks+1;
  console.log('test');

  ShortUrl.findOneAndUpdate(shortUrl, {clicks: count});
  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 3000);
const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const db = require("../model");

let router = express.Router();

router.get('/', function (req,res) {
  db.Article.find({})
    .populate('comments')
    .then(function (data) {
      res.render('home', {articles: data})
    }).catch(function (err) {
      if (err) throw err;
    })
});

router.get('/saved', function (req,res) {
  db.Article.find({ saved: true })
    .populate('comments')
    .then(function (data) {
      res.render('home', { articles:data });
    }).catch(function (err) {
      if (err) throw err;
    });
});

router.get('/scrape', function (req,res) {
  console.log("scraping");
  const scrapURL = 'https://www.nytimes.com/section/science/space?action=click&contentCollection=science&region=navbar&module=collectionsnav&pagetype=sectionfront&pgtype=sectionfront'
  request(scrapURL, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      $('#latest-panel a.story-link').each(function (i, elem) {
        if (i < 10) {
          let data = {};
          data.headline = $(this).find('h2.headline').text().trim();
          data.url = $(this).attr('href');
          data.summary = $(this).find('p.summary').text().trim();
          data.saved = false;
          db.Article
            .update(data,data, { upsert:true })
            .then(function (articles) {
              res.send();
            })
            .catch(function (err) {
              console.log(err);
              res.send();
            });
        } else {
          return false;
        };
      });
      res.redirect('back');
    }
  });
});


router.post('/save/:id',function (req,res) {
  console.log('asking db to save');
  db.Article.findByIdAndUpdate(
    { _id:req.params.id }
    ,{ $set: { saved:true }})
  .then(function (dbArticle) {
      res.json(dbArticle);
  }).catch(function (err) {
    console.log(err);
  });
});

router.post('/forget/:id', function (req,res) {
  console.log('asking db to forget');
  db.Article.update(
    { _id:req.params.id }
    ,{ $set: { saved:false }})
  .then(function (dbArticle) {
        res.json(dbArticle);
  })
  .catch(function (err) {
      console.log(err);
  });
});


router.post('/addComment/:id',function (req,res) {
  db.Comment.create({"body": req.body.body})
  .then(function (dbComment) {
    return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: { comments: dbComment._id } }, { new: true });
  })
  .then(function (dbArticle) {
    res.json(dbArticle);
  })
  .catch(function (error) {
    res.json(error);
  });
});

router.post('/delComment/:artID/:comID', function (req,res) {
  console.log('forgetting comment');
  db.Comment.remove({
    _id: req.params.comID
  })
  .then(function (dbArticle) {
    console.log('updating article');
    db.Article.update({ _id:req.params.artID }
      ,{ $unset: { note:'' } }
      ,function (err) {
        console.log(err);
        res.send('What comment?');
      });
  });


});


module.exports = router;

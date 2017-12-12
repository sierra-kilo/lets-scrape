const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema ({
  headline: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  articleDate: {
    type: Date,
    default: Date.Now
  }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('They did WHAT to their manager?!', 'In recent news, employers went to work early to set up a suprise birthday party for their manager, Josh', 'Tommy Tran', '9/19/2018');

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for(i = 0; i < requiredFields.length; i++) {
        let field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.log(message);
            return res.status(400).send(message);
        }
    }

    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.date);
    res.status(204).json(item);
});

router.delete('/:id', (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleting the BlogPosts: \`${req.param.id}\``);
    res.status(204).end();
});

router.put(':id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
    for(i = 0; i < requiredFields.length; i++) {
        let field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.log(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = `\`${req.params.id}\` and \`${req.body.id}\` must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log('Updating BlogPosts list...');
    const updateBlogPosts = BlogPosts.update({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.date,
        id: req.params.id
    });
    res.status(204).end();
})

module.exports = router;


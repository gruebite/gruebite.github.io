
var metalsmith = require('metalsmith');
var debug = require("metalsmith-debug");
var dateFormatter = require('metalsmith-date-formatter');
var markdown = require('metalsmith-markdown');
var highlighter = require('highlighter');
var permalinks = require('metalsmith-permalinks');
var layouts = require('metalsmith-layouts');
var collections = require('metalsmith-collections');
var pagination = require('metalsmith-pagination');

var partials = require("./modules/partials");

metalsmith(__dirname)
    .metadata({
        site: {
            name: "gruebite",
            url: "http://gruebite.github.io",
            description: "gruebite's static site",
            feed_update_period: "daily",
            feed_update_frequency: 1,
        },
        generatorname: "Metalsmith",
        generatorurl: "http://metalsmith.io/"
    })
    .source('./source')
    .destination('./build')
    .use(dateFormatter({
        dates: [
            {
                key: "publishedDate",
                format: "YYYY-MM-DD"
            },
            {
                key: "modifiedDate",
                format: "YYYY-MM-DD"
            }
        ]
    }))
    .use(collections({
        articles: {
            pattern: 'articles/**/*.md',
            sortBy: 'publishedDate',
            reverse: true
        }
    }))
    .use(pagination({
        'collections.articles': {
            perPage: 1,
            first: 'index.html',
            path: 'page/:num/index.html',
            layout: 'index.hbs'
        }
    }))
    .use(markdown({
        gfm: true,
        tables: true,
        highlight: highlighter()
    }))
    .use(permalinks({
        relative: false
    }))
    .use(partials())
    .use(layouts({
        directory: 'layouts',
        engineOptions: {
            partials: 'partials'
        }
    }))
    .use(debug())
    .build(function(err) {
        if (err) {
            throw err;
        }
    });
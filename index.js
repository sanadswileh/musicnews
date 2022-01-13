const PORT = 3000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const articles = []

let flag = true

app.get('/', (req, res, next) => {
    res.json('Welcome to my Music News API')
})

if (flag) {

    axios.get('https://www.mtv.com/news/music/')
        .then((response) => {
            // this grabs all of the html from the page
            const html = response.data
            // use cheerio to pick out elements of html
            const $ = cheerio.load(html)

            $('.card ').each((i, el) => {
                const source = 'mtv'

                const title = $(el)
                    .find('.headline')
                    .text()
                const url = $(el)
                    .find('a')
                    .attr('href')

                if (title !== "") {
                    articles.push({
                        title,
                        url,
                        source
                    })
                }
            })
        }).catch((err) => console.log(err))

    axios.get('https://www.rollingstone.com/music/music-news/')
        .then((response) => {

            const html = response.data
            const $ = cheerio.load(html)

            $('.l-river__item').each((i, el) => {
                const source = 'rollingstone'

                const title = $(el)
                    .find('.c-card__heading')
                    .text();
                const url = $(el)
                    .find('.c-card__wrap')
                    .attr('href')

                if (title !== "") {
                    articles.push({
                        title,
                        url,
                        source
                    })
                }
            })

        }).catch((err) => console.log(err))

    axios.get('https://www.billboard.com/c/music/music-news/')
        .then((response) => {

            const html = response.data
            const $ = cheerio.load(html)

            $('.a-story-grid').each((i, el) => {
                const source = 'billboard'
                const title = $(el)
                    .find('.c-title.a-font-primary-l.lrv-u-display-block.lrv-u-margin-b-125')
                    .text();
                const url = $(el)
                    .find('.c-lazy-image__link.lrv-a-unstyle-link')
                    .attr('href')
                if (title !== "") {
                    articles.push({
                        title,
                        url,
                        source
                    })
                }
            })


        }).catch((err) => console.log(err))

    flag = false
}

app.get('/news', (req, res) => {

    // only loads on reload when i send that response here
    res.json(articles)
})

app.get('/news/:outletId', async (req, res) => {

    const outletId = req.params.outletId

    var specifiedArticle = articles.filter(article => article.source == outletId)

    res.json(specifiedArticle)
})

app.listen(PORT, () => console.log(`Server running on port ${3000}`))
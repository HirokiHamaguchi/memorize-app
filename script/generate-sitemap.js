import { SitemapStream, streamToPromise } from 'sitemap'
import { createWriteStream } from 'fs'

const BASE_URL = 'https://hirokihamaguchi.github.io/memorize-app'

const staticRoutes = [
    { url: '/', priority: 1.0 },
    { url: '/select', priority: 0.9 },
    { url: '/study/geography/memo', priority: 0.1 },
]

const datasets = ['english-1', 'english-2', 'geography-1']
const studyTypes = ['geography', 'vocabulary']

const dynamicRoutes = [
    ...datasets.map(id => ({
        url: `/study/vocabulary/listen/${id}`,
        priority: 0.8,
    })),

    ...studyTypes.map(type => ({
        url: `/select/${type}`,
        priority: 0.7,
    })),

    ...studyTypes.flatMap(type =>
        datasets.map(id => ({
            url: `/study/${type}/${id}`,
            priority: 0.7,
        })),
    ),
]

const links = [...staticRoutes, ...dynamicRoutes].map(entry => ({
    ...entry,
    changefreq: 'monthly'
}))

// ==== sitemap.xml を生成 ====
const sitemap = new SitemapStream({ hostname: BASE_URL })
const writeStream = createWriteStream('./public/sitemap.xml')

streamToPromise(sitemap)
    .then(() => console.log('✅ sitemap.xml が生成されました'))
    .catch(console.error)

links.forEach(link => sitemap.write(link))
sitemap.end()
sitemap.pipe(writeStream)

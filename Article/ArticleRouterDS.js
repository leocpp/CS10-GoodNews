const https = require('https')
const Article = require('./Article')
//const urlDs = 'https://lab7goodnews-ds.herokuapp.com/stories'
const urlDs = 'https://lambdaxgoodnews.herokuapp.com/stories'

console.log('ArticleRouterDS')
module.exports = function () {
  return (
    setInterval(
      () => {
      console.log('fetching articles')
      //let newTimestamp = new Date(Date.now() - 1 * 60 * 60 * 1000)
      const now = Date.now()
      // a blanced time gap should be set here for Production purpose, choosing to get news records in the past
      // 24 hours here is to facilitate the development process with sufficient data.
      let gte = now - 24 * 7 * 60 * 60 * 1000 
      let gteDate = new Date(gte)
      let gteOffset = gteDate.getTimezoneOffset() * 60 * 1000
      let newTimestamp = new Date(gte + gteOffset)
      newTimestamp = newTimestamp.toISOString()

      console.log(newTimestamp)
      https.get(`${urlDs}/?timestamp="${newTimestamp}"`, (res) => {
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => {
          rawData += chunk
        })
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData)
            Article
              //.insertMany(parsedData, (err, data) => {
                .insertMany(parsedData, {ordered: false}, (err, data) => {
                if (err) console.log('insertMany error: ', err)
              })
          } catch (e) {
            console.error('catch error: ', e.message)
          }
        })
      }).on('error', (e) => {
        console.error(`Got error: ${e.message}`)
      })
    }, 600000) // 10 minutes, this should be blanced for Production purpose
  )
}

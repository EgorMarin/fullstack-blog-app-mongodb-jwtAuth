const redis = require("redis");
const client = redis.createClient(6379);

const cache = (req, res, next) => {
  try {
    const {index} = req.params

    client.get(index, (err, data) => {
      if (err) return res.json(`Error: ${err}`)

      if (data) {
        res.json(JSON.parse(data))
      } else {
        next()
      }
    })
  } catch (error) {
    res.json(`Error: ${error}`)
  }
}

module.exports = cache

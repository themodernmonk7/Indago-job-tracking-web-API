const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send("<h1> Indago-job-tracking-website API </h2>")
})

// Create a server
const port = 5000 || process.env.PORT
const start = async () => {
    try {
        app.listen(port, () => console.log(`🚀 Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()
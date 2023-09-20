import server from "./server"

const port = process.env.PORT ?? 9000


server.listen(() => {
    console.log(`listening on port ${port}`)
})



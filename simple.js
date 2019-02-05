const post = require('./http_promise').postContent
const process = require('process')
const swapi_utils = require('./swapi_utils')
const cookie = require('cookie')


let graphQLquery = `{
    pokemons(first: 25) {
         name
    }
}
`

// see pretty UI for this: https://graphql-pokemon.now.sh
async function main() {
    let res = await post('https://graphql-pokemon.now.sh', JSON.stringify({"query": graphQLquery}),
            {"Accept": "application/json", 'Content-Type': 'application/json' })
    return res
}

main()
.then( (res) => {
    console.log(res.body)
    process.exit()
})
.catch( (err) => {
    console.error(err)
    process.exit()
})


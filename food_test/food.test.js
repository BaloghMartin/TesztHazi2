const client = require('./client')('localhost', 8000)

/**
 * Food is represented by a json with a following format
 * {'name':'name of the food', 'calories': 10 }
 * When a food is created it will get a randomly generated id 
 * and a food becomes
 * {'name':'name of the food', 'calories': 10, 'id': 'abcd1234' }
 */

describe('Food tests', () => {
    it('test runner works', () => {
        expect(1).toBe(1)
    })

    it('Hiányzó név esetén 400-as választ várunk', async () => {

        const postResponse = await client.post('/api/food', {'name': ''})

        expect(postResponse.code).toBe(400)
    })


    it('Negatív kalória érték esetén 400-as választ várunk', async () => {

        const postResponse = await client.post('/api/food', {'name': 'hambi', 'caloroies': '-100'})

        expect(postResponse.code).toBe(400)
    })

    it('post-tal létrehozott elemeket get-tel tömbként visszaadja', async () => {
        let hambi = {'name': 'hambi', 'calories': 100}
        let wampa = {'name': 'wampa', 'calories': 1000}


        const hambiResponse = await client.post('/api/food', hambi)
        const hambiId = JSON.parse(hambiResponse.body).id
        const wampaResponse = await client.post('/api/food', wampa)
        const wampaId = JSON.parse(wampaResponse.body).id

        const getResponse = await client.get('/api/food')
        expect(getResponse.code).toBe(200)

        const getResponseBody = JSON.parse(getResponse.body)
        hambi.id = hambiId
        wampa.id = wampaId

        expect(getResponseBody).toContainEqual(hambi)
        expect(getResponseBody).toContainEqual(wampa)
    })

    
})
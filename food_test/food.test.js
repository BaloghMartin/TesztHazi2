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

    it('id végpontra küldött get-tel megkapjuk a létrehozott elemet', async () => {
        let hambi = {'name': 'hambi', 'calories': 100}
        const hambiResponse = await client.post('/api/food', hambi)
        const hambiId = JSON.parse(hambiResponse.body).id
        
        const getResponse = await client.get('/api/food/' + hambiId)
        expect(getResponse.code).toBe(200)
        hambi.id = hambiId

        const getResponseBody = JSON.parse(getResponse.body)
        expect(getResponseBody).toEqual(hambi)
    })
    
    it('érvénytelen id-ra GET 404-es választ adjon', async () => {
        const getResponse = await client.get('/api/drink/érvénytelenid')
        expect(getResponse.code).toBe(404)
    })

    
    it ('PUT-tal lehessen frissíteni a kajcsi adatait', async () => {
        let hambi = {'name': 'hambi', 'calories': 100}
        const hambiResponse = await client.post('/api/food', hambi)
        const hambiId = JSON.parse(hambiResponse.body).id
        hambi.id = hambiId
        hambi.name = 'nem hambi'
        hambi.calories= 1
        const putResponse = await client.put('/api/food/' + hambiId, hambi)
        const getResponse = await client.get('/api/food/' + hambiId)
        expect(getResponse.code).toBe(200)
        const putResponseBody = JSON.parse(putResponse.body)
        expect(putResponseBody).toEqual(hambi)
    })

    it('érvénytelen id-ra PUT 404-es választ adjon', async () => {
        let hambi = {'name': 'hambi', 'calories': 100}
        const nemHambiId = 'érvénytelen'
        const putResponse = await client.put('/api/drink/' + nemHambiId, hambi)
        expect(putResponse.code).toBe(404)
    })

    it('DELETE hívás kitörli az elemet', async () => {
        let hambi = {'name': 'hambi', 'calories': 100}
        const hambiResponse = await client.post('/api/food', hambi)
        const hambiId = JSON.parse(hambiResponse.body).id
        hambi.id = hambiId
        const deleteResponse = await client.delete('/api/food/' + hambiId)
        expect(deleteResponse.code).toBe(204)

        const getResponse = await client.get('/api/food/')
        expect(JSON.parse(getResponse.body)).toEqual(expect.not.arrayContaining([hambi]))

    })

    it('DELETE hívás kitörli az elemet', async () => {
        const deleteResponse = await client.delete('/api/food/ervenytelen')
        expect(deleteResponse.code).toBe(404)

    })

    it ('PUT esetén ha különbözik az url-ben és a body-ban az id, 400-as hibakódot kapjunk', async () => {
        let hambi = {'name': 'hambi', 'calories': 100}
        const hambiResponse = await client.post('/api/food', hambi)
        const hambiId = JSON.parse(hambiResponse.body).id
        hambi.id = 'érvénytelen'
        hambi.name = 'nem hambi'
        hambi.calories= 1
        const putResponse = await client.put('/api/food/' + hambiId, hambi)
     
        expect(putResponse.code).toBe(400)

    })

})
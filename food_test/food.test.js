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

    
})
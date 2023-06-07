// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Collections from "../../../data/collections.json"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const params = req.query.params
    if (params === undefined) {
        if (req.method === 'GET') {
            res.status(200).json({ Collections })
        }
        else if (req.method === 'POST') {
            const name = req.body.collectionName
            const newCollection = { name: name, words: [] }
            Collections.push(newCollection)
            res.status(200).json({ Collections })
        }
    }

    else {
        if (params.length === 1) {
            if (req.method === "GET") {
                const name = params[0]
                const collection = Collections.find((collection) => collection.name === name)
                if (collection !== undefined) {
                    res.status(200).json(collection)
                }
                else {
                    res.status(421).send("Collection doesn't exist")
                }
            }
            if (req.method === "DELETE") {
                const name = params[0]
                const collection = Collections.find((collection) => collection.name === name)
                if (collection !== undefined) {
                    if (collection.words.length === 0) {
                        const index = Collections.findIndex((collection) => collection.name === name)
                        Collections.splice(index, 1)
                        res.status(200).json(Collections)
                    }
                    else {
                        res.status(421).send("Collection is not empty")
                    }
                }
                else {
                    res.status(421).send("Collection doesn't exist")
                }
            }
        }
        else if (params.length === 2) {
            if (req.method === 'POST') {
                const name = params[0]
                const word = params[1]
                const collection = Collections.find((collection) => collection.name === name)
                if (collection !== undefined) {
                    if (collection.words.includes(word)) {
                        res.status(421).send("Word exists in the Collection")
                    }
                    else {
                        collection.words.push(word)
                        res.status(200).json(Collections)
                    }
                }
                else {
                    res.status(421).send("Collection doesn't exist")
                }
            }
            if (req.method === 'DELETE') {
                const name = params[0]
                const word = params[1]
                const collection = Collections.find((collection) => collection.name === name)
                if (collection !== undefined) {
                    if (!collection.words.includes(word)) {
                        res.status(421).send("Word doesn't exist in the Collection")
                    }
                    else {
                        const index = collection.words.indexOf(word)
                        collection.words.splice(index, 1)
                        res.status(200).json(Collections)

                    }

                }
                else {
                    res.status(421).send("Collection doesn't exist")
                }
            }
            if (req.method === 'MOVE') {
                const data = req.body
                const collectionName1 = data.collectionName1 as string
                const collectionName2 = data.collectionName2 as string
                const word = data.word as string
                const collection1 = Collections.find((collection) => collection.name === collectionName1)
                const collection2 = Collections.find((collection) => collection.name === collectionName2)
                if (collection1 !== undefined && collection2 !== undefined) {
                    if (collection1.words.includes(word)) {
                        const index = collection1.words.indexOf(word)
                        collection1.words.splice(index, 1)
                        collection2.words.push(word)
                        res.status(200).json(Collections)
                    }
                    else {
                        res.status(421).send(`Word doesn't exist in ${collectionName1}`)
                    }
                }
                else {
                    res.status(421).send("Collection doesn't exist")
                }
            }
        }
        else {
            res.status(404).send("Not Found")
        }
    }
}

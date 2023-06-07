import type { NextApiRequest, NextApiResponse } from 'next'
import words from "../../../data/words.json"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const data = req.query
    const queryText = data.queryText
    const number = data.number as unknown as number
    const noOfWords = number ? number : 10
    if (number < 100) {
        const Words = Object.values(words);
        const filteredWords = []
        for (let i = 0; i < Words.length; i++) {
            if (Words[i].includes(queryText)) {
                filteredWords.push(Words[i])
            }
        }
        const randomWords = []
        for (let i = 0; i < noOfWords; i++) {
            const randomIndex = Math.floor(Math.random() * filteredWords.length);
            randomWords.push(filteredWords[randomIndex])
        }
        res.status(200).json(randomWords)
    }
    else {
        res.status(421).send("Word Count cant be more than 100")
    }
}


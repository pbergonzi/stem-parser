// Porter stemmer algorithm implementation
const natural = require('natural')

console.log('Hello, Resolvit!')

const paragraph = 'Take this paragraph of text and return an alphabetized list of ALL unique words.  A unique word is any form of a word often communicated with essentially the same meaning. For example, fish and fishes could be defined as a unique word by using their stem fish. For each unique word found in this entire paragraph, determine the how many times the word appears in total. Also, provide an analysis of what unique sentence index position or positions the word is found. The following words should not be included in your analysis or result set: "a", "the", "and", "of", "in", "be", "also" and "as".  Your final result MUST be displayed in a readable console output in the same format as the JSON sample object shown below.'
const blackList = ['a', 'the', 'and', 'of', 'in', 'be', 'also', 'as']
//I'd add "is", "an", "by", "below", etc.. 

const specialCharsRegEx = /[,|&;!$%@"<>()+:]/g
const resultObject = { results: [] }
const separator = ' '

//indicates if both words have the same root
const sameStem = (word1, word2) => natural.PorterStemmer.stem(word1) == natural.PorterStemmer.stem(word2) 

//Sorting criteria
const compareFunction = (a, b) => {
    lowera = a.word.toLowerCase()
    lowerb = b.word.toLowerCase()
    if (lowera < lowerb) return -1
    else if (lowera > lowerb) return 1
    return 0;
}

//separates each sentence
const sentences = paragraph.split('.')

//analyze each sentence
sentences.forEach( (sentence, index) => {
    //obtain the clean words array
    const words = sentence.replace(specialCharsRegEx,separator).split(separator).filter( value => value && !blackList.includes(value.toLowerCase()))

    words.forEach( word => {
        //checks for an occurrence with the same root in the result set
        const occurrenceIndex = resultObject.results.findIndex(result => sameStem(result.word, word))
        
        //if there isn't, it creates a new result entry
        if(occurrenceIndex == -1){
            const newOccurrence = { 'word': word, 'total-occurrences': 1, 'sentence-indexes': [index] }
            resultObject.results.push(newOccurrence)
        } else {
            //if it finds one it increments the occurrences count and it adds the sentence reference index when needed
            const occurrence = resultObject.results[occurrenceIndex]
            occurrence['total-occurrences']++
            if(!occurrence['sentence-indexes'].includes(index))
                occurrence['sentence-indexes'].push(index)      
        }
    })
    
})

//sort alphabetically
resultObject.results.sort(compareFunction)
//pretty print
console.log(JSON.stringify(resultObject, null, 4))
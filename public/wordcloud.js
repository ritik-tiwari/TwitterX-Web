// wordcloud.js

// Common grammatical words to exclude
const excludedWords = [ "a", "an", "the", "and", "but", "or", "nor", "for", "so", "yet", "to", "in", "on", "at", "by", "with", "as", "of", "from", "into", "onto", "upon", "about", "above", "across", "after", "against", "along", "among", "around", "before", "behind", "below", "beneath", "beside", "between", "beyond", "during", "except", "inside", "near", "off", "outside", "over", "through", "under", "underneath", "until", "up", "down", "out", "around", "throughout", "toward", "towards", "upon", "I", "you", "he", "she", "it", "we", "they", "me", "you", "him", "her", "us", "them", "my", "your", "his", "her", "its", "our", "their", "mine", "yours", "his", "hers", "ours", "theirs", "myself", "yourself", "himself", "herself", "itself", "ourselves", "yourselves", "themselves", "this", "that", "these", "those", "here", "there", "where", "when", "while", "since", "before", "after", "during", "until", "now", "which", "what", "who", "whom", "whose", "which", "what", "whose", "if", "unless", "until", "since", "because", "though", "although", "even", "once", "while", "whereas", "whether", "while", "whereas", "as", "since", "because", "so", "that", "in order that", "though", "although", "even though", "while", "whereas", "if", "unless", "whether", "once", "as soon as", "until", "before", "after", "since", "while", "when", "whenever", "wherever", "where", "therefore", "thus", "consequently", "so", "hence", "accordingly", "as a result", "for this reason", "because", "since", "as", "due to", "is", "are", "am", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "of", "in", "on", "at", "by", "with", "about", "above", "across", "after", "against", "along", "among", "around", "before", "behind", "below", "beneath", "beside", "between", "beyond", "during", "except", "inside", "near", "off", "outside", "over", "through", "under", "underneath", "until", "up", "down", "out", "around", "throughout", "toward", "towards", "upon", "there", "here", "where", "when", "why", "how", "about", "above", "across", "after", "against", "along", "among", "around", "before", "behind", "below", "beneath", "beside", "between", "beyond", "during", "except", "inside", "near", "off", "outside", "over", "through", "under", "underneath", "until", "up", "down", "out", "around", "throughout", "toward", "towards", "upon", "there", "here", "where", "when", "why", "how", "the", "a", "an", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their", "mine", "yours", "his", "hers", "ours", "theirs", "this", "that", "these", "those", "all", "any", "some", "several", "few", "many", "much", "most", "more", "less", "no", "none", "not", "every", "each", "either", "neither", "both", "half", "several", "whole", "any", "enough", "several", "all", "both", "half", "be", "is", "am", "are", "was", "were", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "do", "does", "did", "doing", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "am", "is", "are", "was", "were", "be", "being", "been", "has", "have", "had", "do", "does", "did", "can", "could", "will", "would", "shall", "should", "may", "might", "must", "be", "been", "being", "am", "is", "are", "was", "were", "has", "have", "had", "do", "does", "did", "can", "could", "may", "might", "must", "will", "would", "shall", "should", "here", "there", "where", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their", "mine", "yours", "his", "hers", "ours", "theirs", "this", "that", "these", "those", "all", "any", "some", "several", "few", "many", "much", "most", "more", "less", "no", "none", "not", "every", "each", "either", "neither", "both", "half", "several", "whole", "any", "enough", "several", "all", "both", "half", "be", "is", "am", "are", "was", "were", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "do", "does", "did", "doing", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "am", "is", "are", "was", "were", "be", "being", "been", "has", "have", "had", "do", "does", "did", "can", "could", "will", "would", "shall", "should", "may", "might", "must", "be", "been", "being", "am", "is", "are", "was", "were", "has", "have", "had", "do", "does", "did", "can", "could", "may", "might", "must", "will", "would", "shall", "should", "here", "there", "where", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their", "mine", "yours", "his", "hers", "ours", "theirs", "this", "that", "these", "those", "all", "any", "some", "several", "few", "many", "much", "most", "more", "less", "no", "none", "not", "every", "each", "either", "neither", "both", "half", "several", "whole", "any", "enough", "several", "all", "both", "half", "be", "is", "am", "are", "was", "were", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "do", "does", "did", "doing", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "am", "is", "are", "was", "were", "be", "being", "been", "has", "have", "had", "do", "does", "did", "can", "could", "will", "would", "shall", "should", "may", "might", "must", "be", "been", "being", "am", "is", "are", "was", "were", "has", "have", "had", "do", "does", "did", "can", "could", "may", "might", "must", "will", "would", "shall", "should", "here", "there", "where", "this", "that", "these", "those", "my", "your", "his", "her", "its", "our", "their", "mine", "yours", "his", "hers", "ours", "theirs", "this", "that", "these", "those", "all", "any", "some", "several", "few", "many", "much", "most", "more", "less", "no", "none", "not", "every", "each", "either", "neither", "both", "half", "several", "whole", "any", "enough", "several", "all", "both", "half", "be", "is", "am", "are", "was", "were", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "do", "does", "did", "doing", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "can", "could", "may", "might", "must", "shall", "should", "will", "would", "am", "is", "are", "was", "were", "be", "being", "been", "has", "have", "had", "do", "does", "did", "can", "could", "will", "would", "shall", "should", "may", "might", "must", "be", "been", "being", "am", "is", "are", "was", "were", "has", "have", "had", "do", "does", "did", "can", "could", "may", "might", "must", "will", "would", "shall", "should", ];

function generateWordCloud() {
    const userInput = localStorage.getItem("tweets");
    if (userInput) {
        const words = userInput.split(/\s+/); // Split paragraph into words
        const wordCounts = {};

        // Count occurrences of each word (excluding excludedWords)
        for (const word of words) {
            const cleanedWord = word.toLowerCase().replace(/[.,!?]/g, ""); // Remove punctuation
            if (cleanedWord.length>3 && cleanedWord && !excludedWords.includes(cleanedWord)) {
                wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
            }
        }

        // Create the word cloud
        const wordCloudContainer = document.getElementById("wordcloud");
        wordCloudContainer.innerHTML = "";
        for (const word in wordCounts){
            if (wordCounts[word]<=2){delete wordCounts[word]}
        }
        console.log(wordCounts)
        for (const word in wordCounts) {
            const wordElement = document.createElement("span");
            wordElement.textContent = word;
            wordElement.style.fontSize = `${wordCounts[word] * 2}px`; // Adjust font size based on word frequency
            wordElement.style.color = getRandomColor(); // Random color for each word
            wordCloudContainer.appendChild(wordElement);
        }
    }
}

// Generate a random color
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
generateWordCloud()
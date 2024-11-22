const axios = require('axios');

const translateText = async (text) => {
    try {
        const response = await axios.post('https://libretranslate.com/translate', {
            q: text,
            source: 'en',
            target: 'ta',
            format: 'text'
        });
        return response.data.translatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        return 'Translation error.';
    }
};

// Example usage
const textToTranslate = "Hello, how are you?";
translateText(textToTranslate).then(translation => {
    console.log('Translation:', translation);
});

const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

async function fetchWebPage(url) {
    try {
        const response = await fetch(url);
        const htmlText = await response.text();
        return htmlText;
    } catch (error) {
        console.error('Error fetching webpage:', error);
    }
}

function parseHTML(htmlText) {
    const dom = new JSDOM(htmlText);
    return dom.window.document;
}

function extractData(doc) {
// Example: extracting all the headings (h1, h2, and h3) from the document
const headings = Array.from(doc.querySelectorAll('h1, h2, h3')).map((element) => element.textContent);
return { headings };
}

function formatData(data) {
    return JSON.stringify(data);
}

async function grabber(url) {
    // const url = 'https://example.com';
    const htmlText = await fetchWebPage(url);
    const doc = parseHTML(htmlText);
    // const data = extractData(doc);
    const formattedData = formatData(data);
    return formattedData;
}
  
module.exports = grabber;
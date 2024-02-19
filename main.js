const API_KEY = "03e25fa0b75541378d2a78fe07b764c3"
let news = [];
const getLatesNews = async () => {
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
    const response = await fetch(url)
    const data = await response.json()
    news = data.articles;
    console.log("ddd", news);

}
getLatesNews();
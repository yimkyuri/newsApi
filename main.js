// const API_KEY = "03e25fa0b75541378d2a78fe07b764c3"
const keyword = "박효신"
let news = [];
const getLatesNews = async () => {
    // const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
    const url = new URL(`https://flourishing-naiad-bdffdd.netlify.app/top-headlines?q=${keyword}`);
    const response = await fetch(url)
    const data = await response.json()
    news = data.articles;
    console.log("ddd", news);
    console.log(response);

}
getLatesNews();
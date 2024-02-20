// const API_KEY = "03e25fa0b75541378d2a78fe07b764c3"
const keyword = "기자"
const page = 1
const pageSize = 2
let newsList = [];
const getLatesNews = async () => {
    // const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
    const url = new URL(`https://flourishing-naiad-bdffdd.netlify.app/top-headlines`);
    const response = await fetch(url)
    const data = await response.json()
    newsList = data.articles;
    render();
    console.log("ddd", newsList);

}

const render = () => {
    const newsHTML = newsList.map(news => `
    <article>
        <a href="${news.url}" class="row news" target="_blank">
            <div class="col-lg-5">
                <img class="news-img" src="${news.urlToImage}" alt="">
            </div>
            <div class="col-lg-7">
                <h2>${news.title}</h2>
                <p>${news.description}</p>
                <div><span>${news.source.name}</span> ${news.publishedAt}</div>
            </div>
        </a>
    </article>
    `).join('');

    document.getElementById('news-board').innerHTML = newsHTML;
}
getLatesNews();
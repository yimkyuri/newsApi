const API_KEY = "03e25fa0b75541378d2a78fe07b764c3"
let articles = [];
let page = 1;
let totalPages = 1;
const pageSize = 10;
const groupSize = 5;
let totalResults = 0;

let menus = document.querySelectorAll(".menus button");
document.getElementById("search-input")
    .addEventListener("keyup", function(e) {
        if (e.keyCode === 13) {
            document.getElementById("search-button").click();
        }
    });

menus.forEach( menu => 
    menu.addEventListener("click", (event) => getNewsByCategory(event))
);

// let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
let url = new URL(`https://flourishing-naiad-bdffdd.netlify.app/top-headlines`)

const getNews = async () => {
    try {
        url.searchParams.set("page", page);
        url.searchParams.set("pageSize", pageSize);
        let response = await fetch(url);
        let data = await response.json();
        console.log("ddd", data);
        if (response.status == 200) {
            if (data.totalResults == 0) {
                throw new Error("표시할 뉴스가 없습니다.");
            }
            articles = data.articles;
            totalPages = Math.ceil(data.totalResults / pageSize);
            render();
        } else {
            throw new Error(data.message);
        }
        
    } catch (error) {
        console.log("에러객체", error.name);
        document.querySelector("nav").style.display = 'none';
        errorRender(error.message);
    }
}

const getLatestNews = async () => {
    getNews();
}

const getNewsByCategory = async (event) => {
    page = 1;
    const category = event.target.textContent.toLowerCase();
    url = new URL(`https://flourishing-naiad-bdffdd.netlify.app/top-headlines?category=${category}`);
    getNews();
}

const getNewsByKeyword = async () => {
    page = 1;
    const keyword = document.getElementById('search-input').value;
    url = new URL(`https://flourishing-naiad-bdffdd.netlify.app/top-headlines?q=${keyword}`);
    getNews();

}

const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
        inputArea.style.display = "none";
    } else {
        inputArea.style.display = "inline";
    }
};


const render = () => {
    const resultHTML = articles.map(news => { return `
    <article class="row news">
        <div class="col-lg-5">
            <img class="news-img" src="${news.urlToImage}" alt="">
        </div>
        <div class="col-lg-7">
            <h2><a href="${news.url}" target="_blank">${news.title.length > 30 ? news.title.substring(0, 30) + "..." : news.title}</a></h2>
            <p>${ news.description == null || news.description == "" ? "내용없음" : news.description.length > 200
                  ? news.description.substring(0, 200) + "..." : news.description }</p>
            <div><span>${news.source.name}</span> ${moment( news.publishedAt ).fromNow()}</div>
        </div>
    </article>
    `}).join('');

    document.getElementById('news-board').innerHTML = resultHTML;
    paginationRender();
}


const paginationRender = () => {
    let pageGroup = Math.ceil(page / groupSize);
    let lastPage = pageGroup * groupSize;
    if(lastPage > totalPages){
        lastPage = totalPages;
    }
    let firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1); 

    let paginationHTML = ``;

    if (firstPage >= 6) {
        paginationHTML = `<li class="page-item" onclick="moveToPage(1)"><a class="page-link">&lt&lt</a></li>
        <li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link">&lt</a></li>`;
    }
    for(let i=firstPage; i<=lastPage; i++){
        paginationHTML += `<li class="page-item ${i===page? "active" : ""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }
    if (lastPage < totalPages)
    paginationHTML+=`<li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link">&gt</a></li>
    <li class="page-item" onclick="moveToPage(${totalPages})"><a class="page-link" >&gt&gt</a></li>`;

    if (totalPages > 0 ) {
        document.querySelector('.pagination').innerHTML = paginationHTML
    }
    
};



const errorRender = (errorMessage) => {
    document.getElementById("news-board").innerHTML = `<h3 class="text-center alert alert-danger mt-1">${errorMessage}</h3>`;
};


const moveToPage = (pageNum) => {
    page = pageNum;
    window.scrollTo({ top: 0, behavior: "smooth" });
    getNews();
};

function openNav() {
    document.getElementById("menus").style.transform = "translateX(0)";
}
  
function closeNav() {
    document.getElementById("menus").style.transform = "translateX(-100%)";
}

getLatestNews();  
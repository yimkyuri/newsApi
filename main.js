const API_KEY = "03e25fa0b75541378d2a78fe07b764c3"
let articles = [];
let page = 1;
let totalPages = 1;
const pageSize = 9;
const groupSize = 5;
let totalResults = 0;
let wframe = window.innerWidth;

let menus = document.querySelectorAll(".menus li");
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
    if (inputArea.style.display === "flex") {
        inputArea.style.display = "none";
    } else {
        inputArea.style.display = "flex";
    }
};


const render = () => {
    const resultHTML = articles.map(news => { return `
    <li>
        <div class="img-area"><img src="${news.urlToImage}" alt=""></div>
        <div class="text-area">
            <p class="date">${moment( news.publishedAt ).fromNow()}</p>
            <p class="title">${news.title}</p>
            <p class="des">
                ${ news.description == null || news.description == "" ? "내용없음" : news.description.length > 200
                ? news.description.substring(0, 200) + "..." : news.description }
            </p>
            <div class="btn-area">
                <p class="name">${news.source.name}</p>
                <button class="btn-go" onclick="window.open('${news.url}')">뉴스 자세히보기 ></button>
            </div>
        </div>
    </li>
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
    document.getElementById("news-board").innerHTML = `<div class="notice">${errorMessage}</div>`;
};


const moveToPage = (pageNum) => {
    page = pageNum;
    window.scrollTo({ top: 0, behavior: "smooth" });
    getNews();
};

function openNav() {
    if (wframe <= 768) {
        document.getElementById("menus").style.left = 0;
    }
}
  
function closeNav() {
    if (wframe <= 768) {
        document.getElementById("menus").style.left = "-70vw";
    }
}

function handleResize() {
    wframe = window.innerWidth
    console.log(wframe);
    if (wframe > 767) {
        openNav()
    } else {
        closeNav()
    }
  }

window.addEventListener("resize", handleResize);


getLatestNews();  
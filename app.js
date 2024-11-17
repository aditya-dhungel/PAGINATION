const content = document.getElementById('content');
const container = document.getElementById('container');

let currPage = 1;
const cardsPerPage = 4;
let data;

function fetchData() {
    fetch("https://dummyjson.com/recipes")
        .then((res) => res.json())
        .then((response) => {
            console.log(response)
            data = response;
            showData(currPage-1);
            pushButtons();
        });
}

function showData(currPage) {
    let currData = data.recipes;
    const currPageData = currData.slice(currPage * cardsPerPage, cardsPerPage * (currPage + 1));
    content.innerHTML = '';
    pushCards(currPageData);
}

function pushButtons() {
    container.innerHTML = '';
    const prevBtn = document.createElement('button');
    prevBtn.innerText = '<';
    prevBtn.className = 'prev';
    container.appendChild(prevBtn);

    const totalButtons = Math.ceil(data.recipes.length / cardsPerPage);

    for (let i = 0; i < totalButtons; i++) {
        const btn = createPageButton(i+1);
        container.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.innerText = '>';
    nextBtn.className = 'next';
    container.appendChild(nextBtn);

    prevBtn.addEventListener('click', () => updatePagination('prev'));
    nextBtn.addEventListener('click', () => updatePagination('next'));

    updateTruncation();
    updatePaginationButtons();
}

function createPageButton(page) {
    const btn = document.createElement("button");
    btn.innerText = (page).toString();
    btn.classList.add('btn');
    btn.addEventListener('click', () => {
        currPage = page;
        showData(currPage-1);
        updateTruncation();
        updatePaginationButtons();
    });
    return btn;
}

function updateTruncation() {
    const totalButtons = Math.ceil(data.recipes.length / cardsPerPage);
    const buttons = container.querySelectorAll('.btn');

    // buttons.classList.remove('active');

    // Reset all buttons' visibility and remove 'active' class
    buttons.forEach((btn) => {
        btn.classList.remove('active'); // Reset visibility
        let num = Number(btn.innerText);
        let shouldTruncate = num > 2 && (num < currPage - 1 || num > currPage + 1) && num < totalButtons - 1; 
        let shouldNotTruncate = ( (num <= 5 && currPage < 5) || (num >= totalButtons - 4) && (currPage > totalButtons - 4));

        if(currPage > 4){
            buttons[1].classList.add('truncated');
        }else{   
            buttons[1].classList.remove('truncated');
        }

        if(currPage < totalButtons - 3){
            buttons[totalButtons - 2].classList.add('truncated');
        }else{
            buttons[totalButtons - 2].classList.remove('truncated');
        }

        if(shouldTruncate && !shouldNotTruncate){
            btn.style.display = 'none';
        }else{
            btn.style.display = 'block';
        }
    });

    // Highlight the active button
    buttons[currPage-1].classList.add('active');
}

function pushCards(products) {
    products?.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerText = product.name;

        const cardImage = document.createElement("img");
        cardImage.src = product.image;
        cardImage.alt = product.name + "image";
        cardImage.className = "card-image";

        card.append(cardImage);
        content.append(card);
    });
}

function updatePagination(direction) {
    const lastPage = Math.ceil(data.recipes.length / cardsPerPage);
    if (direction === 'prev' && currPage > 0) {
        currPage--;
    } else if (direction === 'next' && currPage < lastPage) {
        currPage++;
    }
    showData(currPage-1);
    updateTruncation();
    updatePaginationButtons();
}

function updatePaginationButtons() {
    const prevBtn = container.querySelector('.prev');
    const nextBtn = container.querySelector('.next');
    const lastPage = Math.ceil(data.recipes.length / cardsPerPage) - 1;

    prevBtn.disabled = (currPage === 1);
    nextBtn.disabled = (currPage === lastPage+1);
}

fetchData();
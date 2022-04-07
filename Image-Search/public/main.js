const div1 = document.querySelector('#div1');
const div2 = document.querySelector('#div2');
const div3 = document.querySelector('#div3');

const submitBtn = document.querySelector('button');
const searchInput = document.querySelector('.search-input');
const loader = document.querySelector('#loader');


submitBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    div1.innerHTML = '';
    div2.innerHTML = '';
    div3.innerHTML = '';

    if (searchInput.value.length===0) {
        alert('Enter a search term to get images');
        searchInput.value = '';
    } else {
        loader.classList.remove('d-none');
        getImages();
    }
})


let pageNum = 1;
async function getImages(){
    const query = searchInput.value;
    const url = `/image?query=${query}&per_page=21&page=${pageNum}`;
    const response = await fetch(url);
    const data = await response.json();
    const imageList = data.results;

    if (imageList.length==0) {
        alert("No Images found");
        loader.className += ' d-none';
    } else {
        loader.classList.remove('d-none');

        const [imageList1, imageList2, imageList3] = createGroups(imageList, 3);

        imageList1.forEach(image => addImages(image, div1));
        imageList2.forEach(image => addImages(image, div2));
        imageList3.forEach(image => addImages(image, div3));
    
        pageNum++;
    }
}

function addImages(image, div) {
    const imageURL = image.urls.regular;
    const imageAlt = image.alt_description;
    const imageLink = image.links.html;
    const imageLikes = image.likes;
    const userName = image.user.name;

    let output = `
    <div>
        <a href="${imageLink}" target="_blank">
            <img src="${imageURL}" alt="${imageAlt}">
        </a>
        <div class="px-2">
            <p class="float-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg>
            <span>${imageLikes}</span>
            </p>
            <p class="float-end">- ${userName}</p>
        </div>
    <div>
    `
    const imageContainer = document.querySelector('.images-container');

    div.innerHTML += output;
    imageContainer.append(div);
}



// https://www.youtube.com/watch?v=xHm6AbNwAw8
window.addEventListener('scroll', ()=>{
    if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
        getImages();
    }
})

// Splitting arrays into sub-arrays
// https://typeofnan.dev/how-to-split-an-array-into-a-group-of-arrays-in-javascript/
function createGroups(arr, numGroups) {
    const perGroup = Math.ceil(arr.length / numGroups);
    return new Array(numGroups)
        .fill('')
        .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
}
'use strict'

function renderGallery() {
    const elImg = document.querySelector('.img-container')
    const img = new Image()
    const strHTML = gImgs.map(img => 
        `<img class="gallery-img" src="${img.url}" id="${img.id}" alt="" onclick="onSelectImg(this)">`).join('')
    elImg.innerHTML = strHTML
}

function renderFilteredGallery(imgs) {
    const elContainer = document.querySelector('.img-container')
    const strHTML = imgs.map(img =>
        `<img class="gallery-img" src="${img.url}" id="${img.id}" alt="" onclick="onSelectImg(this)">`
    ).join('')

    elContainer.innerHTML = strHTML
    // document.querySelector('.gallery-section').style.display = 'block'
    document.querySelector('.editor-container').style.display = 'none'
    document.querySelector('.saved-memes-section').style.display = 'none'
}

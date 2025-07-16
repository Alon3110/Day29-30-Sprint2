'use strict'

function renderGallery() {
    const elImg = document.querySelector('.img-container')
    const img = new Image()
    const strHTML = gImgs.map(img => 
        `<img src="${img.url}" id="${img.id}" alt="" onclick="onSelectImg(this)">`).join('')
    elImg.innerHTML = strHTML
}
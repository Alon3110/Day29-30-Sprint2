'use strict'

var gElCanvas
var gCtx
var gIsMouseDown = false
var gCurrImg = null

function onInit() {
    renderGallery()
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
}

function renderMeme(elImg) {

    const img = new Image()
    img.src = elImg.src
    var text = gMeme.lines.txt || 'Add Text Here'
    img.onload = () => {

        gElCanvas.width = img.width
        gElCanvas.height = img.height

        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText(text, 200, 50)

        document.querySelector('.editor-container').style.display = 'block'
        document.querySelector('.img-container').style.display = 'none'

    }
}

function onSetLineTxt(txt) {
    document.querySelector('.meme-text-input').innerText = gMeme.lines.txt
    gMeme.lines.txt = txt
    renderMeme(gCurrImg)
}

function onSelectImg(elImg) {
    gCurrImg = elImg
    renderMeme(elImg)
}

function onSetColor(color) {
    gMeme.lines.color = color
    // gCtx.fillStyle = color
    gCtx.strokeStyle = color
    renderMeme(gCurrImg)
}


















function onDown(ev) {
    gIsMouseDown = true
    const pos = getEvPos(ev)

    onDraw(ev)
    document.body.style.cursor = 'grabbing'
    // if (gBrush.selectImg) {
    //     const elImg = new Image()
    //     elImg.src = gBrush.selectImg
    //     const pos = getEvPos(ev)
    //     gCtx.drawImage(elImg, pos.x, pos.y, 50, 50)
    // }
}

function onUp() {
    gIsMouseDown = false
    document.body.style.cursor = 'grab'
}

function onDraw(ev) {
    if (!gIsMouseDown) return

    const offsetX = ev.offsetX
    const offsetY = ev.offsetY
    switch (gBrush.shape) {
        case 'square':
            drawRect(offsetX, offsetY)
            break
        case 'circle':
            drawArc(offsetX, offsetY)
            break
    }
}

function onInputText() {

}

function onDownloadCanvas(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
    elLink.download = 'my-img.jpeg'
}


function onSetSize(size) {
    unSelectImg()
}

function onClearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    const reader = new FileReader()

    reader.onload = function (event) {
        const img = new Image()
        img.onload = () => {
            onImageReady(img)
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function onUploadImg(ev) {
    ev.preventDefault()
    const canvasData = gElCanvas.toDataURL('image/jpeg')

    // After a successful upload, allow the user to share on Facebook
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
            <button class="btn-facebook" target="_blank"
                onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}')">
                Share on Facebook
            </button>`
    }

    uploadImg(canvasData, onSuccess)
}


function onSelectEmoji(elImg) {
    // if (gBrush.selectImg === elImg.src) {
    //     unSelectEmoji()
    // } else {
    //     gBrush.selectImg = elImg.src
    // }
}

function unSelectEmoji() {

}

function renderPics() {
    const pics = getPics()
    const elContainer = document.querySelector('.saved-pics-container')

    let strHTML = '<h4>Select an image</h4>'
    strHTML += pics.map(pic => `
        <div class="img-wrapper">
        <img class="img" title="Saved img" src="${pic.dataUrl}" onclick="onSelectpic('${pic.id}')"/>
        <button onclick="onRemovePic('${pic.id}')">X</button>
        </div>
    `).join('')
    elContainer.innerHTML = strHTML
}

function onRemovePic(picId) {
    removePic(picId)
    renderPics()
}

function onSelectpic(picId) {
    const pic = getPicById(picId)
    if (pic) {
        drawPicOnCanvas(pic.dataUrl)
    }
}

function onSavePicture() {
    const dataUrl = gElCanvas.toDataURL('image/png')
    addPic(dataUrl)
    renderPics()
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    const reader = new FileReader()

    reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result

        img.onload = () => {
            // console.log('img:', img)
            onImageReady(img)
        }
    }

    reader.readAsDataURL(ev.target.files[0])

}

function drawText(text, x, y) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = onSetColor(gMeme.lines.color)
    gCtx.fillStyle = 'black'
    gCtx.font = '40px Arial'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function getEvPos(ev) {
    const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        //* Prevent triggering the default mouse behavior
        ev.preventDefault()

        //* Gets the first touch point (could be multiple in touch event)
        ev = ev.changedTouches[0]
        /* 
        * Calculate touch coordinates relative to canvas 
        * position by subtracting canvas offsets (left and top) from page coordinates
        */
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}
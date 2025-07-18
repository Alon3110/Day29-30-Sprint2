'use strict'

var gElCanvas
var gCtx
var gIsMouseDown = false
var gCurrImg = null
const CLICK_MARGIN = 10
const currInputIdx = null
let gPrevPos = null

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    addCanvasListeners()
    document.querySelector('.gallery-section').style.display = 'block'
    document.querySelector('.editor-container').style.display = 'none'

    renderGallery()
}

function renderMeme(elImg) {
    const img = new Image()
    img.src = elImg.src
    var text = gMeme.lines[gMeme.selectedLineIdx].txt || 'Add Text Here'
    img.onload = () => {

        gElCanvas.width = img.width
        gElCanvas.height = img.height

        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)


        for (let i = 0; i < gMeme.lines.length; i++) {

            const line = gMeme.lines[i]

            if (!line.pos) {
                line.pos = {
                    x: gElCanvas.width / 2,
                    y: 100 + i * (line.size * 1.5)
                }
            }
            drawText(line.txt || 'Add Text Here', line.pos.x, line.pos.y, line.size, line.color, line.fillColor, line.font, line.align)

            if (i === gMeme.selectedLineIdx) {

                drawOutlineRectangle(line)
            }
        }


        document.querySelector('.editor-container').style.display = 'block'
        document.querySelector('.img-container').style.display = 'none'
        document.querySelector('.key-words-container').style.display = 'none'
    }
}

function onSetLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
    document.querySelector('.meme-text-input').value = txt
    renderMeme(gCurrImg)
}

function onSelectImg(elImg) {
    gCurrImg = elImg

    if (!gElCanvas || !gCtx) {
        gElCanvas = document.querySelector('canvas')
        gCtx = gElCanvas.getContext('2d')
    }
    renderMeme(elImg)
}

function onSetColor(elInput) {
    const color = elInput.value
    gMeme.lines[gMeme.selectedLineIdx].color = color
    renderMeme(gCurrImg)
}

function onSetFillColor(elInput) {
    const color = elInput.value
    gMeme.lines[gMeme.selectedLineIdx].fillColor = color
    renderMeme(gCurrImg)
}

function onSetSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff
    renderMeme(gCurrImg)
}

function onSetFontFamily(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font
    renderMeme(gCurrImg)
}

function onDownloadCanvas(elLink) {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
    elLink.download = 'my-img.jpeg'
}

function onAddLine() {
    const newLine = {
        txt: 'Add Text Here',
        size: 40,
        color: 'black',
        fillColor: 'white',
        font: 'Impact',
        isDrag: false,
        pos: {
            x: gElCanvas.width / 2,
            y: 100 + gMeme.lines.length * 50
        },
        align: 'center'
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    document.querySelector('.meme-text-input').value = newLine.txt
    renderMeme(gCurrImg)
}

function onSwitchLine(elIdx) {
    elIdx.classList.toggle('active')
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
    document.querySelector('.meme-text-input').value = gMeme.lines[gMeme.selectedLineIdx].txt
    renderMeme(gCurrImg)
}

function drawText(text, x, y, size, color = 'red', fillColor = 'white', font = 'Arial', align = 'center') {
    const lines = text.split('\n')
    gCtx.font = `${size}px ${font}`
    const lineHeight = size * 1.2
    gCtx.lineWidth = 2
    gCtx.strokeStyle = color
    gCtx.fillStyle = fillColor
    gCtx.textAlign = align
    gCtx.textBaseline = 'middle'

    for (let i = 0; i < lines.length; i++) {
        const lineY = y + i * lineHeight
        gCtx.fillText(lines[i], x, lineY)
        gCtx.strokeText(lines[i], x, lineY)
    }
}

function drawOutlineRectangle(line) {
    gCtx.save()
    gCtx.lineWidth = 3
    gCtx.strokeStyle = 'white'

    let { x, y } = line.pos
    y -= line.size / 2

    const textWidth = gCtx.measureText(line.txt).width

    if (line.align === 'center') x -= textWidth / 2
    if (line.align === 'right') x -= textWidth

    x -= CLICK_MARGIN

    gCtx.beginPath()
    gCtx.strokeRect(
        x,
        y,
        textWidth + CLICK_MARGIN * 2,
        line.size + CLICK_MARGIN
    )
    gCtx.stroke()
    gCtx.restore()
}

function onDown(ev) {

    const pos = getEvPos(ev)
    const clickedLineIdx = getClickedLineIdx(pos)
    if (clickedLineIdx === -1) return

    gMeme.selectedLineIdx = clickedLineIdx
    setInputDrag(true)
    gPrevPos = pos
    document.body.style.cursor = 'grabbing'

    document.querySelector('.meme-text-input').value = gMeme.lines[gMeme.selectedLineIdx].txt

    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function onMove(ev) {
    if (!getSelectedLine().isDrag) return

    const pos = getEvPos(ev)
    const dx = pos.x - gPrevPos.x
    const dy = pos.y - gPrevPos.y
    moveInput(dx, dy)

    gPrevPos = pos
    renderMeme(gCurrImg)
}

function onUp() {
    setInputDrag(false)
    document.body.style.cursor = 'grab'

    gElCanvas.removeEventListener('mousemove', onMove)
    gElCanvas.removeEventListener('mouseup', onUp)
}

function onSetAlign(align) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    if (!line) return

    switch (align) {
        case 'left':
            line.align = 'left'
            line.pos.x = 20
            break
        case 'center':
            line.align = 'center'
            line.pos.x = gElCanvas.width / 2
            break
        case 'right':
            line.align = 'right'
            line.pos.x = gElCanvas.width - 20
            break
    }
    renderMeme(gCurrImg)
}

function onDeleteLine() {

    gMeme.lines = gMeme.lines.filter((line, idx) => idx !== gMeme.selectedLineIdx)
    gMeme.selectedLineIdx = 0

    if (!gMeme.lines.length) {
        onAddLine()
    } else {
        document.querySelector('.meme-text-input').value =
            gMeme.lines[0].txt
        renderMeme(gCurrImg)
    }
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

function onKeywordPressed(value) {
  if (!gKeywordSearchCountMap[value]) gKeywordSearchCountMap[value] = 1;
  else gKeywordSearchCountMap[value]++;

  const newSizeEm = 0.75 + gKeywordSearchCountMap[value] * 0.05;

  const btn = document.querySelector(`.main-key-words .keyword[value="${value}"]`);
  if (btn) btn.style.fontSize = `${newSizeEm}em`;

  const filteredImgs = gImgs.filter(img => img.keywords.includes(value));
  renderFilteredGallery(filteredImgs);
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

function onShowGallery() {

    document.querySelector('.editor-container').style.display = 'none'
    document.querySelector('.key-words-container').style.removeProperty('display')
    document.querySelector('.img-container').style.display = 'block'
    document.querySelector('.img-container').style.display = 'grid'

    renderGallery()
}

function addCanvasListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
    gElCanvas.addEventListener('touchend', onUp)

    gElCanvas.addEventListener('touchstart', ev => ev.preventDefault(), { passive: false })
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


function getEvPos(ev) {
    const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()

        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}
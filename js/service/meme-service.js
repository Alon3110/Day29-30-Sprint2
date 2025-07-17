'use strict'

const STORAGE_KEY = 'picDB'
const MEME_KEY = 'MEME_DB'

var gPics = loadFromStorage(STORAGE_KEY) || []

var gImgs = [
    {
        id: 1,
        url: 'img/meme1.png',
        keywords: ['happy', 'cat']
    },
    {
        id: 2,
        url: 'img/meme2.png',
        keywords: ['sad', 'cat']
    },
    {
        id: 3,
        url: 'img/meme3.png',
        keywords: ['funny', 'cat']
    },
    {
        id: 4,
        url: 'img/meme4.png',
        keywords: ['crazy', 'cat']
    },
    {
        id: 5,
        url: 'img/meme5.png',
        keywords: ['sarcastic', 'cat']
    },
    {
        id: 6,
        url: 'img/meme6.png',
        keywords: ['funny', 'cat']
    },
    {
        id: 7,
        url: 'img/meme7.png',
        keywords: ['happy', 'cat']
    }
    ,
    {
        id: 8,
        url: 'img/meme8.png',
        keywords: ['sad', 'cat']
    },
    {
        id: 9,
        url: 'img/meme9.png',
        keywords: ['funny', 'cat']
    },
    {
        id: 10,
        url: 'img/meme10.png',
        keywords: ['crazy', 'cat']
    },
    {
        id: 11,
        url: 'img/meme11.png',
        keywords: ['sarcastic', 'cat']
    },
    {
        id: 12,
        url: 'img/meme12.png',
        keywords: ['funny', 'cat']
    }
    ,
    {
        id: 13,
        url: 'img/meme13.png',
        keywords: ['happy', 'cat']
    },
    {
        id: 14,
        url: 'img/meme14.png',
        keywords: ['sad', 'cat']
    },
    {
        id: 15,
        url: 'img/meme15.png',
        keywords: ['funny', 'cat']
    }
    ,
    {
        id: 16,
        url: 'img/meme16.png',
        keywords: ['crazy', 'cat']
    },
    {
        id: 17,
        url: 'img/meme17.png',
        keywords: ['sarcastic', 'cat']
    }
]

var gMeme = loadFromStorage(MEME_KEY) || {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Add Text Here',
            size: 40,
            color: 'red',
            fillColor: 'white',
            font: 'Arial',
            pos: { x: 200, y: 100 },
            align: 'center',
            isDrag: false
        }
    ]

}

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function getInputValue() {
    const elInput = document.querySelector('.img-txt')
    return elInput.value
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx]
}

function setInputDrag(isDrag) {
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function getClickedLineIdx(clickedPos) {
    return gMeme.lines.findIndex(line => {
        const { x, y } = line.pos
        const width = gCtx.measureText(line.txt).width
        const height = line.size

        const left = x - width / 2
        const right = x + width / 2
        const top = y - height / 2
        const bottom = y + height / 2

        return clickedPos.x >= left &&
            clickedPos.x <= right &&
            clickedPos.y >= top &&
            clickedPos.y <= bottom
    })
}



function moveInput(dx, dy) {
    const input = gMeme.lines[gMeme.selectedLineIdx]
    input.pos.x += dx
    input.pos.y += dy
}


function setInputPos(x, y) {
    const input = gMeme.lines[selectedLineIdx]
    input.pos.x = x
    input.pos.y = y
}




function getPics() {
    return gPics
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth
}

function removePic(picId) {
    const idx = gPics.findIndex(pic => pic.id === picId)
    if (idx !== -1) {
        gPics.splice(idx, 1)
        _savePicsToStorage()
    }
}

function addPic(data) {
    const pic = _createPic(data)
    gPics.push(pic)
    _savePicsToStorage()
}

function getPicById(picId) {
    return gPics.find(pic => pic.id === picId)
}

function _createPic(data) {
    return {
        id: makeId(),
        dataUrl: data
    }
}

async function uploadImg(imgData, onSuccess) {
    const CLOUD_NAME = 'webify'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const formData = new FormData()
    formData.append('file', imgData)
    formData.append('upload_preset', 'webify')
    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData
        })
        const data = await res.json()
        onSuccess(data.secure_url)

    } catch (err) {
        console.log(err)
    }
}

function _saveMemeToStorage() {
    saveToStorage(MEME_KEY, gMeme)
}
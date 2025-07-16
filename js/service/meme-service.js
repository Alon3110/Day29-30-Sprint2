'use strict'

const STORAGE_KEY = 'picDB'

var gPics = loadFromStorage(STORAGE_KEY) || []

var gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }]
var gMeme = loadFromStorage(STORAGE_KEY) || {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red'
        }
    ]
}
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

function getMeme() {
    return gMeme
}

function getPics() {
    return gPics
}

function getInputValue() {
    const elInput = document.querySelector('.img-txt')
    return elInput.value
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

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth
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

function _savePicsToStorage() {
    saveToStorage(STORAGE_KEY, gPics)
}
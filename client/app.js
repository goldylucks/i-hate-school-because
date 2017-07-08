const BASE_URL = 'http://localhost:8000'
const buttonElement = el('new-button')
buttonElement.addEventListener('click', addHatedItem)
window.addEventListener('load', onWindowLoad)

function onWindowLoad () {
  fetchHatedListFromServer()
    .then(injectHatedList)
}

function injectHatedList (list) {
  console.log('list from server', list)
  list.forEach(injectHatedItem)
}

function injectHatedItem ({ title, description, likes = 0 }) {
  const containerElement = createEl('div')
  containerElement.className = 'item-container'
  containerElement.dataset.likes = likes

  const likeButtonElement = createEl('img')
  likeButtonElement.src = 'like.png'
  likeButtonElement.className = 'likeButton'
  likeButtonElement.addEventListener('click', onLike)
  containerElement.appendChild(likeButtonElement)

  const titleElement = createEl('h3')
  titleElement.innerText = title
  containerElement.appendChild(titleElement)

  if (description) {
    const descriptionElement = createEl('p')
    descriptionElement.innerText = description
    containerElement.appendChild(descriptionElement)
  }

  containerElement.appendChild(createEl('hr'))
  el('list').appendChild(containerElement)
}

function addHatedItem () {
  // get the title
  // store title in variable
  const title = el('new-title').value
  console.log('title:', title)

  // get the description
  // store description in variable
  const description = el('new-description').value
  console.log('description:', description)

  injectHatedItem({ title, description })

  postHatedItemToServer({ title, description })

  // reset title
  el('new-title').value = ''

  // reset description
  el('new-description').value = ''
}

function onLike (evt) {
  const likeButtonElement = evt.target
  const containerElement = likeButtonElement.parentNode
  containerElement.dataset.likes = Number(containerElement.dataset.likes) + 1
  postLikeToServer(likeButtonElement.nextSibling.innerText)
}

// util
function el (id) {
  return document.getElementById(id)
}

function createEl (type) {
  return document.createElement(type)
}

// server stuff, don't touch! patience little grasshoper ...
function fetchHatedListFromServer () {
  return fetch(`${BASE_URL}/list`, { mode: 'cors' })
    .then(res => {
      if (!res.ok) {
        alert('error!')
        return
      }
      return res.json()
    })
    .catch(err => alert(err))
}

function postHatedItemToServer ({ title, description }) {
  return fetch(`${BASE_URL}/new`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description })
  })
  .then(res => {
    if (!res.ok) {
      alert('error!')
      return
    }
    return res.json()
  })
  .catch(err => alert(err))
}

function postLikeToServer (title) {
  return fetch(`${BASE_URL}/like`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title })
  })
  .then(res => {
    if (!res.ok) {
      alert('error!')
      return
    }
    return res.json()
  })
  .catch(err => alert(err))
}

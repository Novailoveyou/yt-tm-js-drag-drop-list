const UISelectors = (() => {
  const dqs = selector => {
    return document.querySelector(selector)
  }

  const dqsa = selectors => {
    return document.querySelectorAll(selectors)
  }

  const selectors = {
    draggableList: '#draggable-list',
    check: '#check',
    draggables: '.btn__draggable',
    dragListItems: '.draggable-list__item'
  }

  return {
    dqs,
    dqsa,
    getSelectors: () => selectors
  }
})()

const ItemCtrl = (() => {
  const languages = [
    'JavaScript',
    'Python',
    'C/C++',
    'JAVA',
    'R',
    'Kotlin',
    'C#',
    'PHP',
    'Go',
    'Scala'
  ]

  const listItems = []

  let dragStartIndex

  return {
    getLanguages: () => languages,
    getListItems: () => listItems,
    getDragStartIndex: () => dragStartIndex
  }
})()

const UICtrl = (() => {
  const { getSelectors } = UISelectors
  const { getLanguages, getDragStartIndex, getListItems } = ItemCtrl
  const { draggables } = getSelectors()
  const languages = getLanguages()
  let dragStartIndex = getDragStartIndex()
  const listItems = getListItems()

  const createList = ({ arr, listItems, uiList }) => {
    ;[...arr]
      .map(item => ({ value: item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(item => item.value)
      .forEach((lang, idx) => {
        const listItem = document.createElement('li')

        listItem.setAttribute('data-idx', idx)
        listItem.classList.add('draggable-list__item')

        listItem.innerHTML = /* html */ `
        <button class='item__btn'>
          <span class='btn__number'>
            ${idx + 1}
          </span>
          <div class='btn__draggable' draggable='true'>
            <p class='draggable__person-name'>${lang}</p>
            <i class='fas fa-grip-lines draggable__icon'></i>
          </div>
        </button>
      `

        listItems.push(listItem)

        uiList.appendChild(listItem)
      })
  }

  const dragStart = function () {
    dragStartIndex = +this.closest('li').getAttribute('data-idx')
  }

  const dragOver = e => {
    e.preventDefault()
  }

  const dragDrop = function () {
    const dragEndIndex = +this.getAttribute('data-idx')
    swapItems({
      fromIndex: dragStartIndex,
      toIndex: dragEndIndex,
      listItems,
      selector: draggables
    })

    this.classList.remove('over')
  }

  const dragEnter = function () {
    this.classList.add('over')
  }

  const dragLeave = function () {
    this.classList.remove('over')
  }

  const swapItems = ({ fromIndex, toIndex, listItems, selector }) => {
    const itemOne = listItems[fromIndex].querySelector(selector)
    const itemTwo = listItems[toIndex].querySelector(selector)

    listItems[fromIndex].childNodes[1].appendChild(itemTwo)
    listItems[toIndex].childNodes[1].appendChild(itemOne)
  }

  const checkOrder = () => {
    listItems.forEach((item, idx) => {
      const name = item.querySelector(draggables).innerText.trim()

      if (name !== languages[idx]) {
        item.classList.add('wrong')
      } else {
        item.classList.remove('wrong')
        item.classList.add('right')
      }
    })
  }

  return {
    createList,
    dragStart,
    dragOver,
    dragDrop,
    dragEnter,
    dragLeave,
    checkOrder
  }
})()

const App = ((UISelectors, ItemCtrl, UICtrl) => {
  const { dqs, dqsa, getSelectors } = UISelectors
  const { getLanguages, getListItems } = ItemCtrl
  const {
    createList,
    dragStart,
    dragOver,
    dragDrop,
    dragEnter,
    dragLeave,
    checkOrder
  } = UICtrl
  const { check, draggables, dragListItems, draggableList } = getSelectors()

  const loadEventListeners = () => {
    dqsa(draggables).forEach(draggable => {
      draggable.addEventListener('dragstart', dragStart)
    })

    dqsa(dragListItems).forEach(item => {
      item.addEventListener('dragover', dragOver)
      item.addEventListener('drop', dragDrop)
      item.addEventListener('dragenter', dragEnter)
      item.addEventListener('dragleave', dragLeave)
    })

    dqs(check).addEventListener('click', checkOrder)
  }

  const init = () => {
    const languages = getLanguages()
    const listItems = getListItems()

    createList({
      arr: languages,
      listItems,
      uiList: dqs(draggableList)
    })

    loadEventListeners()
  }

  return {
    init
  }
})(UISelectors, ItemCtrl, UICtrl)

App.init()

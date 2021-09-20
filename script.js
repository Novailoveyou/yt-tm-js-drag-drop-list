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
  const { getDragStartIndex, getListItems } = ItemCtrl
  const { draggables } = getSelectors()
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
    swapItems(dragStartIndex, dragEndIndex)

    this.classList.remove('over')
  }

  const dragEnter = function () {
    this.classList.add('over')
  }

  const dragLeave = function () {
    this.classList.remove('over')
  }

  const swapItems = (fromIndex, toIndex) => {
    const itemOne = listItems[fromIndex].childNodes[1]
    const itemTwo = listItems[toIndex].childNodes[1]

    listItems[fromIndex].appendChild(itemTwo)
    listItems[toIndex].appendChild(itemOne)
  }

  return {
    createList,
    dragStart,
    dragOver,
    dragDrop,
    dragEnter,
    dragLeave
  }
})()

const App = ((UISelectors, ItemCtrl, UICtrl) => {
  const { dqs, dqsa, getSelectors } = UISelectors
  const { getLanguages, getListItems } = ItemCtrl
  const { createList, dragStart, dragOver, dragDrop, dragEnter, dragLeave } =
    UICtrl
  const { draggables, dragListItems, draggableList } = getSelectors()

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

const UISelectors = (() => {
  const selectors = {
    draggableList: document.querySelector('#draggable-list'),
    check: document.querySelector('#check')
  }

  return {
    getSelectors: () => selectors
  }
})()

const ItemCtrl = (() => {
  const { getSelectors } = UISelectors
  const selectors = getSelectors()

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
    getListItems: () => listItems
  }
})()

const UICtrl = (() => {
  const { getSelectors } = UISelectors
  const selectors = getSelectors()

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
            <i class='fas fa-grip-lines'></i>
          </div>
        </button>
      `

        listItems.push(listItem)

        uiList.appendChild(listItem)
      })
  }

  return {
    createList
  }
})()

const App = ((ItemCtrl, UICtrl) => {
  const { getSelectors } = UISelectors
  const { getLanguages, getListItems } = ItemCtrl
  const { createList } = UICtrl

  const init = () => {
    const selectors = getSelectors()
    const languages = getLanguages()
    const listItems = getListItems()

    createList({
      arr: languages,
      listItems,
      uiList: selectors.draggableList
    })
  }

  return {
    init
  }
})(ItemCtrl, UICtrl)

App.init()

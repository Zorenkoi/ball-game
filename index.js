let k = 0
const pole = document.querySelector('.pole')
const poleStyle = window.getComputedStyle(pole)
const poleWidth = Number(poleStyle.width.slice(0, -2))
const poleHeight = Number(poleStyle.height.slice(0, -2))

const circle = document.querySelector('.circle')
let arrCube = getArrEl('.cube')

const platform = document.querySelector('.platform')
const platformStyle = window.getComputedStyle(platform)
const platformWidth = Number(platformStyle.width.slice(0, -2))

const widthPlatform = platform.style
let vector = { x: 2, y: -3 }

setInterval(() => {
  move()
  boom()
  play()
}, 15)

pole.addEventListener('mousemove', (e) => {
  const leftSpace = pole.getBoundingClientRect().x
  const mouseX = e.pageX - leftSpace

  if (mouseX > platformWidth / 2 && mouseX < poleWidth - platformWidth / 2) {
    platform.style.left = mouseX - platformWidth / 2 + 'px'
  }
})

function boom() {
  const arrDoteCoor = getArrDote()

  const touchInfo = getTuouchInfoInArr(arrDoteCoor, arrCube)

  if (touchInfo) {
    const newVector = getMirrorVector(vector, touchInfo.side)
    vector = newVector

    console.log(touchInfo)
    if (touchInfo.typeCube === 'destroy') {
      touchInfo.el.style.display = 'none'
      arrCube = arrCube.filter((cube) => touchInfo.cubeId !== cube.cubeId)
    }
  }
}

function move() {
  const style = window.getComputedStyle(circle)
  const top = Number(style.top.slice(0, -2))
  const left = Number(style.left.slice(0, -2))

  const newTop = top + vector.y
  const newLeft = left + vector.x

  circle.style.top = newTop + 'px'
  circle.style.left = newLeft + 'px'
}

function play() {
  const platformParam = getCubeParam(platform)
  const arrDoteCoor = getArrDote()

  if (checkConnect(arrDoteCoor[2], platformParam)) {
    const updatePlatformStyle = window.getComputedStyle(platform)
    const platformX = Number(updatePlatformStyle.left.slice(0, -2))
    const touchX = arrDoteCoor[2].x - platformX

    const cofX = (touchX - platformWidth / 2) / 30
    console.log(cofX)
    vector = { x: vector.x + cofX, y: -vector.y }
  }
}

function getTuouchInfoInArr(arrDoteCoor, arrCubeObj) {
  for (let i = 0; i < arrCubeObj.length; i++) {
    const cube = arrCubeObj[i]
    const cubeCoor = cube.cubeParam

    for (let j = 0; j < arrDoteCoor.length; j++) {
      const doteCoor = arrDoteCoor[j]
      if (checkConnect(doteCoor, cubeCoor)) {
        const side = defineSide(j)
        return { ...cube, side }
      }
    }
  }

  return false
}
function checkConnect(doteCoor, cubeCoor) {
  if (
    doteCoor.x > cubeCoor.topLeft.x &&
    doteCoor.x < cubeCoor.topRight.x &&
    doteCoor.y > cubeCoor.topLeft.y &&
    doteCoor.y < cubeCoor.bottomLeft.y
  ) {
    return true
  }
}

function getCoor(el) {
  const elStyle = window.getComputedStyle(el)

  const y = Number(elStyle.top.slice(0, -2))
  const x = Number(elStyle.left.slice(0, -2))

  return { x, y }
}
function getArrEl(select) {
  const elements = document.querySelectorAll(select)
  const arrElements = []

  elements.forEach((el, i) => {
    const element = createElement(el)
    arrElements.push(element)
  })

  return arrElements
}
function createElement(el) {
  const typeCube = el.dataset.typecube
  const cubeParam = getCubeParam(el)
  const cubeId = uniq()
  return { typeCube, cubeParam, el, cubeId }
}
function getCubeParam(cube) {
  const cubeStyle = window.getComputedStyle(cube)

  const cubeTop = Number(cubeStyle.top.slice(0, -2))
  const cubeLeft = Number(cubeStyle.left.slice(0, -2))
  const cubeWidth = Number(cubeStyle.width.slice(0, -2))
  const cubeHeight = Number(cubeStyle.height.slice(0, -2))

  return {
    topLeft: { x: cubeLeft, y: cubeTop },
    topRight: { x: cubeLeft + cubeWidth, y: cubeTop },
    bottomLeft: { x: cubeLeft, y: cubeTop + cubeHeight },
    bottomRight: { x: cubeLeft + cubeWidth, y: cubeTop + cubeHeight },
  }
}

function getArrDote() {
  const persStyle = window.getComputedStyle(circle)

  const width = Number(persStyle.width.slice(0, -2))
  const top = Number(persStyle.top.slice(0, -2))
  const left = Number(persStyle.left.slice(0, -2))

  return [
    { x: left + width / 2, y: top },
    { x: left + width, y: top + width / 2 },
    { x: left + width / 2, y: top + width },
    { x: left, y: top + width / 2 },
  ]
}
function getMirrorVector(vector, side) {
  if (side === 'top' || side === 'bottom') {
    return { ...vector, y: -vector.y }
  } else if (side === 'left' || side === 'right') {
    return { ...vector, x: -vector.x }
  }
}
function defineSide(j) {
  if (j === 0) return 'top'
  if (j === 1) return 'right'
  if (j === 2) return 'bottom'
  if (j === 3) return 'left'
}

function generateNetwork(borderWidth, countHorizontal, countVertical) {
  const width = poleWidth - borderWidth * 2
  const height = poleHeight - borderWidth
  const cubeWidth = width / countHorizontal
  const cubeHeight = height / countVertical
  const totalCount = countHorizontal * countVertical

  for (let i = 0; i < countVertical; i++) {
    for (let j = 0; j < countHorizontal; j++) {
      const top = i * cubeHeight + borderWidth + 'px'
      const left = j * cubeWidth + borderWidth + 'px'
      const height = cubeHeight + 'px'
      const width = cubeWidth + 'px'

      const networkCube = document.createElement('div')

      networkCube.classList.add('network')
      networkCube.style.top = top
      networkCube.style.left = left
      networkCube.style.height = height
      networkCube.style.width = width

      pole.appendChild(networkCube)

      networkCube.addEventListener('click', () => {
        const cube = document.createElement('div')

        cube.classList.add('cube')
        cube.classList.add('destroy')
        cube.dataset.typecube = 'destroy'
        cube.style.top = top
        cube.style.left = left
        cube.style.height = height
        cube.style.width = width

        pole.appendChild(cube)

        const element = createElement(cube)
        arrCube.push(element)
      })
    }
  }
}
function generateCubes(borderWidth, countHorizontal, countVertical) {
  const width = poleWidth - borderWidth * 2
  const height = poleHeight - borderWidth - 250
  const cubeWidth = width / countHorizontal
  const cubeHeight = height / countVertical

  for (let i = 0; i < countVertical; i++) {
    for (let j = 0; j < countHorizontal; j++) {
      const top = i * cubeHeight + borderWidth + 100 + 'px'
      const left = j * cubeWidth + borderWidth + 'px'
      const height = cubeHeight + 'px'
      const width = cubeWidth + 'px'

      const cube = document.createElement('div')
      cube.classList.add('cube')
      cube.classList.add('destroy')
      cube.dataset.typecube = 'destroy'
      cube.style.top = top
      cube.style.left = left
      cube.style.height = height
      cube.style.width = width

      pole.appendChild(cube)

      const element = createElement(cube)
      arrCube.push(element)
    }
  }
}
// generateNetwork(20, 10, 20)
generateCubes(20, 10, 7)

function uniq() {
  k += 1
  return k
}

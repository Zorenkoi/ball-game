let k = 0
const poleEl = document.querySelector('.pole')
const circleEl = document.querySelector('.circle')
const platformEl = document.querySelector('.platform')

let constObj = {
  staticLongVector: 2,
  circleWidth: getParamByEl(circleEl).width,
  halfCircleWidth: getParamByEl(circleEl).width / 2,
  poleWidth: getParamByEl(poleEl).width,
  poleHeight: getParamByEl(poleEl).height,
  leftSpace: poleEl.getBoundingClientRect().x,
  platformWidth: getParamByEl(platformEl).width,
  halfPlatformWidth: getParamByEl(platformEl).width / 2,
  platformHeight: 10,
  borderWidth: 10,
}

let pause = false
let score = 0
let life = 3
let level = 0
let platformSticky = true

let circleCentralCoor = { x: 30, y: 30 }
let vector = { x: 1, y: 1 }
let platformStart = 0
let arrCube = createAllCubes(constObj.borderWidth, level)

setLife(3)
setLevel(0)
setScore(0)
stickyMove()

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////set interval

setInterval(() => {
  if (!pause) {
    moveCircle()
    checkTouchCubes()
    checkTouchPlatform()
    checkFall()
    checkWin()
  }
}, 5)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////mouse event
window.addEventListener('mousemove', (e) => {
  if (!pause) {
    const { poleWidth, leftSpace, halfPlatformWidth } = constObj

    const mouseX = e.pageX - leftSpace

    if (mouseX > halfPlatformWidth && mouseX < poleWidth - halfPlatformWidth) {
      platformStart = mouseX - halfPlatformWidth
      platformEl.style.left = platformStart + 'px'
    }
  }
})

window.addEventListener('mousemove', () => {
  if (platformSticky) stickyMove()
})

window.addEventListener('click', () => {
  if (platformSticky) {
    platformSticky = false
    const newY = Math.sqrt(Math.pow(1.8, 2))
    vector = { x: 0, y: newY }
  }
})
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////move circle

function moveCircle() {
  const { x: prevX, y: prevY } = circleCentralCoor
  const { x: vectorX, y: vectorY } = vector

  circleCentralCoor = {
    x: prevX + vectorX,
    y: prevY + vectorY,
  }

  setCircleCoor(circleCentralCoor)
}
function setCircleCoor({ x, y }) {
  const { halfCircleWidth } = constObj
  circleEl.style.left = x - halfCircleWidth + 'px'
  circleEl.style.top = y - halfCircleWidth + 'px'
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////move platform

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////touch platform

function checkTouchPlatform() {
  const arrDoteCoor = getArrDoteCoor(circleCentralCoor)
  const arrPlatformCoor = getPlatformCoor()

  const whatSideTouch = getSideTouch(arrDoteCoor, arrPlatformCoor)

  if (whatSideTouch) {
    const touchX = arrDoteCoor[4].x - platformStart

    const cofX = (touchX - constObj.halfPlatformWidth) / 40

    const newX = vector.x + cofX > 0.6 ? 0.6 : vector.x + cofX
    const newY = Math.sqrt(Math.pow(1.8, 2) - Math.pow(newX, 2))

    const newVector = { x: newX, y: -newY }
    vector = newVector
  }
}

function getPlatformCoor() {
  const { platformWidth, platformHeight, poleHeight } = constObj

  const platformParam = {
    top: poleHeight - platformHeight,
    left: platformStart,
    width: platformWidth,
    height: platformHeight,
  }

  return getArrCoorForCube(platformParam)
}

function stickyMove() {
  const { platformHeight, poleHeight, halfPlatformWidth, halfCircleWidth } =
    constObj

  vector = { x: 0, y: 0 }
  circleCentralCoor = {
    x: platformStart + halfPlatformWidth,
    y: poleHeight - platformHeight - halfCircleWidth,
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////touch cube

function checkTouchCubes() {
  const arrDoteCoor = getArrDoteCoor(circleCentralCoor)
  const touchInfo = getCubeTouch(arrDoteCoor, arrCube)

  if (touchInfo) {
    vector = getVector(vector, touchInfo.side)

    touchBlock(touchInfo)
  }
}

function touchBlock(touchInfo) {
  if (touchInfo.type === 'cube') {
    setScore(score + 5)
    touchInfo.cubeNode.style.display = 'none'
    arrCube = arrCube.filter((cube) => cube.cubeId !== touchInfo.cubeId)
  }
}

//////////////////////
function checkDoteTouchCube(doteCoor, arrCubeCoor) {
  if (
    doteCoor.x > arrCubeCoor[0].x &&
    doteCoor.x < arrCubeCoor[2].x &&
    doteCoor.y > arrCubeCoor[1].y &&
    doteCoor.y < arrCubeCoor[2].y
  ) {
    return true
  }
}
function getSideTouch(arrDoteCoor, arrCubeCoor) {
  for (let i = 0; i < arrDoteCoor.length; i++) {
    const doteCoor = arrDoteCoor[i]

    if (checkDoteTouchCube(doteCoor, arrCubeCoor)) {
      return defineSide(i)
    }
  }
  return false
}
function getCubeTouch(arrDoteCoor, arrCube) {
  for (let i = 0; i < arrCube.length; i++) {
    const cube = arrCube[i]

    const touchSide = getSideTouch(arrDoteCoor, cube.coor)

    if (touchSide) {
      return { ...cube, side: touchSide }
    }
  }
  return false
}

///////////////////////

function getVector(vector, side) {
  if (side === 'top' || side === 'bottom') {
    return { ...vector, y: -vector.y }
  } else if (side === 'left' || side === 'right') {
    return { ...vector, x: -vector.x }
  } else if (side === 'other') {
    return { x: -vector.x, y: -vector.y }
  }
}
function getArrDoteCoor(centerDoteCoor) {
  const { halfCircleWidth } = constObj
  const { x, y } = centerDoteCoor
  const for45 = halfCircleWidth * 0.7

  return [
    { x: x, y: y - halfCircleWidth },
    { x: x + for45, y: y + for45 },
    { x: x + halfCircleWidth, y },
    { x: x + for45, y: y - for45 },
    { x: x, y: y + halfCircleWidth },
    { x: x - for45, y: y - for45 },
    { x: x - halfCircleWidth, y },
    { x: x - for45, y: y + for45 },
  ]
}
function defineSide(j) {
  if (j === 0) return 'top'
  if (j === 2) return 'right'
  if (j === 4) return 'bottom'
  if (j === 6) return 'left'
  return 'other'
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////check fall

function checkFall() {
  const { poleHeight, poleWidth } = constObj

  if (
    circleCentralCoor.y > poleHeight + 50 ||
    circleCentralCoor.x < -50 ||
    circleCentralCoor.x > poleWidth + 50
  ) {
    setLife(life - 1)
    platformSticky = true
    stickyMove()

    if (life <= 0) {
      showRestartModal()
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////check win

function checkWin() {
  if (arrCube.length <= 3 && level === arrLevel.length - 1) {
    showVictoryModal()
  } else if (arrCube.length <= 3) {
    showNextModal()
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////create cubes

function createAllCubes(borderWidth, orderLevel) {
  const arrCube = createArrCubes(orderLevel)
  const arrBorder = createArrBorder(borderWidth)

  return [...arrBorder, ...arrCube]
}

function createArrCubes(orderLevel) {
  return arrLevel[orderLevel].map((cube) => {
    return createCubeObj(cube.cubeParam, cube.className)
  })
}
function createCubeObj({ top, left, width, height }, className) {
  return {
    coor: getArrCoorForCube({ top, left, width, height }),
    type: 'cube',
    cubeId: uniq(),
    cubeNode: createCubeNode(
      { top, left, width, height },
      ['cube-stop', className],
      poleEl
    ),
  }
}
function createCubeNode({ top, left, width, height }, arrClassName, parent) {
  const cube = document.createElement('div')

  arrClassName.forEach((className) => {
    cube.classList.add(className)
  })

  cube.style.top = top + 'px'
  cube.style.left = left + 'px'
  cube.style.height = height + 'px'
  cube.style.width = width + 'px'

  parent.appendChild(cube)

  return cube
}
function getArrCoorForCube({ top, left, width, height }) {
  return [
    { x: left, y: top },
    { x: left + width, y: top },
    { x: left + width, y: top + height },
    { x: left, y: top + height },
  ]
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////create border

function createArrBorder(borderWidth) {
  const arrBorder = []

  const { poleWidth, poleHeight } = constObj

  const arrBorderCoor = [
    {
      top: 0,
      left: 0,
      width: poleWidth,
      height: borderWidth,
    },
    {
      top: 0,
      left: 0,
      width: borderWidth,
      height: poleHeight,
    },
    {
      top: 0,
      left: poleWidth - borderWidth,
      width: borderWidth,
      height: poleHeight,
    },
  ]

  arrBorderCoor.forEach((borderCoor) => {
    arrBorder.push({
      coor: getArrCoorForCube(borderCoor),
      type: 'border',
      cubeId: uniq(),
      cubeNode: createCubeNode(borderCoor, ['border'], poleEl),
    })
  })

  return arrBorder
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////tablo

function setLevel(num) {
  level = num
  document.querySelector('.level-number').textContent = num + 1 + ''
}

function setLife(num) {
  life = num
  const arrLife = document.querySelectorAll('.life')
  arrLife.forEach((life, i) => {
    if (i <= num - 1) {
      life.classList.add('active')
    } else {
      life.classList.remove('active')
    }
  })
}

function setScore(num) {
  score = num
  document.querySelector('.score-number').textContent = num
  const arrScoreText = document.querySelectorAll('.modal-score-number')
  arrScoreText.forEach((scoreText) => (scoreText.textContent = num))
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////modal

function showRestartModal() {
  pauseOn()
  const restartModal = document.querySelector('.restart-modal')
  restartModal.style.display = 'flex'
}
function showNextModal() {
  pauseOn()
  const nextModal = document.querySelector('.next-modal')
  nextModal.style.display = 'flex'
}
function showVictoryModal() {
  pauseOn()
  const victoryModal = document.querySelector('.victory-modal')
  victoryModal.style.display = 'flex'
}
function closeModal() {
  const arrModals = document.querySelectorAll('.modal-background')

  arrModals.forEach((modal) => {
    modal.style.display = 'none'
  })
}

function initButtons() {
  const arrRestartButtons = document.querySelectorAll('.restart-button')
  const arrNextButtons = document.querySelectorAll('.next-button')

  arrRestartButtons.forEach((restartButton) => {
    restartButton.addEventListener('click', restart)
  })
  arrNextButtons.forEach((nextButton) => {
    nextButton.addEventListener('click', nextLevel)
  })
}
initButtons()

function restart() {
  closeModal()

  setLife(3)
  setLevel(0)
  setScore(0)

  arrCube.forEach(({ cubeNode }) => {
    cubeNode.style.display = 'none'
  })
  arrCube = createAllCubes(constObj.borderWidth, level)

  blockStiky()
  pauseOf()
}
function nextLevel() {
  closeModal()

  setLevel(level + 1)
  arrCube = createAllCubes(constObj.borderWidth, level)
  blockStiky()
  pauseOf()
}
//
function pauseOn() {
  pause = true
}
function pauseOf() {
  pause = false
}
function blockStiky() {
  platformSticky = true
  stickyMove()

  let k = 0
  const stickyInterval = setInterval(() => {
    platformSticky = true
    k++
    if (k === 100) {
      clearInterval(stickyInterval)
    }
  }, 5)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////help

function uniq() {
  k += 1
  return k
}

function getParamByEl(el) {
  const height = el.offsetHeight
  const width = el.offsetWidth
  const start = el.getBoundingClientRect().top + pageYOffset
  const end = start + height
  const dataObj = el.dataset

  return { height, width, start, end, dataObj }
}

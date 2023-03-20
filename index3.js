let k = 0
const poleEl = document.querySelector('.pole')
const circleEl = document.querySelector('.circle')
const platformEl = document.querySelector('.platform')

let constObj = {
  circleWidth: getParamByEl(circleEl).width,
  poleWidth: getParamByEl(poleEl).width,
  poleHeight: getParamByEl(poleEl).height,
  leftSpace: poleEl.getBoundingClientRect().x,
  platformWidth: getParamByEl(platformEl).width,
  platformHeight: 10,
}

let life = 3
let level = 0
let platformSticky = true

let circleCentralCoor = { x: 30, y: 30 }
let vector = { x: 1, y: 1 }
let platformStart = 0
let arrCube = createArrCubes(20, 4, 5, 50, 100)
createBorder(20)

stickyMove()

/////////////////////////////////////////////////
////////P////////////////////////////////////////
///////////L/////////////////////////////////////
//////////////A//////////////////////////////////
/////////////////Y///////////////////////////////

setInterval(() => {
  moveCircle()
  checkTouchCubes()
  checkTouchPlatform()
  checkFall()
  checkWin()
}, 5)

window.addEventListener('mousemove', (e) => {
  const { poleWidth, leftSpace, platformWidth } = constObj

  const mouseX = e.pageX - leftSpace

  if (mouseX > platformWidth / 2 && mouseX < poleWidth - platformWidth / 2) {
    platformStart = mouseX - platformWidth / 2
    platformEl.style.left = platformStart + 'px'
  }
})

window.addEventListener('mousemove', () => {
  if (platformSticky) stickyMove()
})

window.addEventListener('click', () => {
  if (platformSticky) {
    platformSticky = false
    vector = { x: 1, y: 1 }
  }
})

/////////////////////////////////////////////
// MOVE CIRCLE
// MOVE CIRCLE
/////////////////////////////////////////////

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
  circleEl.style.left = x - 7.5 + 'px'
  circleEl.style.top = y - 7.5 + 'px'
}

/////////////////////////////////////////////
// PLATFORM  TOUCH
// PLATFORM  TOUCH
/////////////////////////////////////////////

function checkTouchPlatform() {
  const arrDoteCoor = getArrDoteCoor(circleCentralCoor)
  const platformCube = { coor: getPlatformCoor() }

  const touchInfo = checkAllDoteInOneCube(arrDoteCoor, platformCube)

  if (touchInfo) {
    vector = getVector(vector, touchInfo.side)
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
  const { platformWidth, platformHeight, circleWidth, poleHeight } = constObj

  vector = { x: 0, y: 0 }
  circleCentralCoor = {
    x: platformStart + platformWidth / 2,
    y: poleHeight - platformHeight - circleWidth / 2,
  }
}

//////////////////////////////////////////////////////
// CHECK FALL
// CHECK FALL
//////////////////////////////////////////////////////

function checkFall() {
  const { poleHeight } = constObj

  if (circleCentralCoor.y > poleHeight + 50) {
    platformSticky = true
    stickyMove()
  }
}

function checkWin() {
  if (arrCube.length <= 3) {
    arrCube = createArrCubes(20, 4, 4, 50, 100)
    createBorder(20)
    platformSticky = true
    stickyMove()
  }
}
//////////////////////////////////////////////////////
// TOUCH
// TOUCH
//////////////////////////////////////////////////////

function checkTouchCubes() {
  const arrDoteCoor = getArrDoteCoor(circleCentralCoor)

  const touchInfo = checkAllDoteInAllCube(arrDoteCoor, arrCube)

  if (touchInfo) {
    vector = getVector(vector, touchInfo.side)

    touchBlock(touchInfo)
  }
}

function touchBlock(touchInfo) {
  if (touchInfo.type === 'cube') {
    touchInfo.cubeNode.style.display = 'none'
    arrCube = arrCube.filter((cube) => cube.cubeId !== touchInfo.cubeId)
  }
}

function getArrDoteCoor(centerDoteCoor) {
  const { x, y } = centerDoteCoor
  const width = getParamByEl(circleEl).width
  const halfWidth = width / 2
  const for45 = halfWidth * 0.7

  return [
    { x: x, y: y - halfWidth },
    { x: x + for45, y: y + for45 },
    { x: x + halfWidth, y },
    { x: x + for45, y: y - for45 },
    { x: x, y: y + halfWidth },
    { x: x - for45, y: y - for45 },
    { x: x - halfWidth, y },
    { x: x - for45, y: y + for45 },
  ]
}

//////////////////////3
function checkOneDoteInCube(doteCoor, cubeCoor) {
  if (
    doteCoor.x > cubeCoor[0].x &&
    doteCoor.x < cubeCoor[2].x &&
    doteCoor.y > cubeCoor[1].y &&
    doteCoor.y < cubeCoor[2].y
  ) {
    return true
  }
}
function checkAllDoteInOneCube(arrDoteCoor, cube) {
  for (let i = 0; i < arrDoteCoor.length; i++) {
    const doteCoor = arrDoteCoor[i]

    if (checkOneDoteInCube(doteCoor, cube.coor)) {
      return { ...cube, side: defineSide(i) }
    }
  }
  return false
}
function checkAllDoteInAllCube(arrDoteCoor, arrCube) {
  for (let i = 0; i < arrCube.length; i++) {
    const cube = arrCube[i]

    const touchInfo = checkAllDoteInOneCube(arrDoteCoor, cube)

    if (touchInfo) return touchInfo
  }
  return false
}
function defineSide(j) {
  if (j === 0) return 'top'
  if (j === 2) return 'right'
  if (j === 4) return 'bottom'
  if (j === 6) return 'left'
  return 'other'
}
///////////////////////////////////////////////////////3

function getVector(vector, side) {
  if (side === 'top' || side === 'bottom') {
    return { ...vector, y: -vector.y }
  } else if (side === 'left' || side === 'right') {
    return { ...vector, x: -vector.x }
  } else if (side === 'other') {
    return { x: -vector.x, y: -vector.y }
  }
}

//////////////////////////////////////////////////////
// CREATE BORDER
//////////////////////////////////////////////////////

function createBorder(borderWidth) {
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
    arrCube.push({
      coor: getArrCoorForCube(borderCoor),
      type: 'border',
      cubeId: uniq(),
      cubeNode: createCubeNode(borderCoor, 'border', poleEl),
    })
  })
}

//////////////////////////////////////////////////////
// CREATE CUBES
//////////////////////////////////////////////////////

function createArrCubes(
  borderWidth,
  countHorizontal,
  countVertical,
  marginTop,
  marginBottom
) {
  const arrCubes = []

  const { poleWidth, poleHeight } = constObj
  const width = poleWidth - borderWidth * 2
  const height = poleHeight - borderWidth - (marginTop + marginBottom)
  const cubeWidth = width / countHorizontal
  const cubeHeight = height / countVertical

  for (let i = 0; i < countVertical; i++) {
    for (let j = 0; j < countHorizontal; j++) {
      const top = i * cubeHeight + borderWidth + marginTop
      const left = j * cubeWidth + borderWidth
      const height = cubeHeight
      const width = cubeWidth

      const cubeObj = createCubeObj({ top, left, width, height })

      arrCubes.push(cubeObj)
    }
  }

  return arrCubes
}
function createCubeObj({ top, left, width, height }) {
  return {
    coor: getArrCoorForCube({ top, left, width, height }),
    type: 'cube',
    cubeId: uniq(),
    cubeNode: createCubeNode({ top, left, width, height }, 'cube-stop', poleEl),
  }
}
function createCubeNode({ top, left, width, height }, className, parent) {
  const cube = document.createElement('div')

  cube.classList.add(className)

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

//////////////////////////////////
// HELP
// HELP
//////////////////////////////////

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

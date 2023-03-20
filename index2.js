const poleEl = document.querySelector('.pole')

let constObj = {
  poleWidth: getParamByEl(poleEl).width,
  poleHeight: getParamByEl(poleEl).height,
  leftSpace: poleEl.getBoundingClientRect().x,
}

let resArr = []
let nowClass

createArrCubes(10, 12, 12, 0, 100)

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

      const networkCube = createCubeNode(
        { top, left, width, height },
        ['network-cube'],
        poleEl
      )

      networkCube.addEventListener('click', () => {
        createCubeNode({ top, left, width, height }, [nowClass, 'cube'], poleEl)
        resArr.push({
          cubeParam: { top, left, width, height },
          className: nowClass,
        })
      })
    }
  }

  return arrCubes
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
///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////type cube

const arrTypeCube = document.querySelectorAll('.top-cube')

arrTypeCube.forEach((typeCybe) => {
  typeCybe.addEventListener('click', () => {
    nowClass = typeCybe.dataset.typecube
  })
})
///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////type cube

const save = document.querySelector('.save')

save.addEventListener('click', () => {
  const string = JSON.stringify(resArr)
  console.log(string)
})

///////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////help

function getParamByEl(el) {
  const height = el.offsetHeight
  const width = el.offsetWidth
  const start = el.getBoundingClientRect().top + pageYOffset
  const end = start + height
  const dataObj = el.dataset

  return { height, width, start, end, dataObj }
}

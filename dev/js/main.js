function sanatise (unsanatisedInput) {

  const tempEl = document.createElement('div')
        tempEl.innerText = unsanatisedInput

  const sanatisedOutput = tempEl.innerHTML
  return sanatisedOutput

}



const getParameterString = window.location.search.substr(1)
const getParameters      = getParameterString.split('&')

getParameters.forEach(parameter => {

  const splitParameters = (parameter.split('='))
  const key             = splitParameters[0]
  const value           = splitParameters[1]

  if (key == 'theme') document.body.setAttribute('theme', sanatise(value))

})





;(function (){

  // based on https://stackoverflow.com/a/49201872
  function dateDifferece (startingDate, endingDate = new Date().toISOString().substr(0, 10)) {

    let startDate = new Date(new Date(startingDate).toISOString().substr(0, 10))
    let endDate   = new Date(endingDate)

    if (startDate > endDate) { [startDate, endDate] = [endDate, startDate] }

    let startYear = startDate.getFullYear()
    let february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28
    let daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    let years = endDate.getFullYear() - startYear

    let months = endDate.getMonth() - startDate.getMonth()
    if (months < 0) { years--; months += 12 }

    let days = endDate.getDate() - startDate.getDate()
    if (days < 0) {
        if (months > 0) { months-- }
        else { years--; months = 11 }
        days += daysInMonth[startDate.getMonth()]
    }

    return { years, months, days }

  }

  const uptimeContainer = document.querySelector('.js--replace-uptime')
  if (uptimeContainer) {

    const birth = '1995-05-01'
    const uptime = dateDifferece(birth)

    uptimeContainer.innerHTML = uptimeContainer.innerHTML.replace('{{ uptime }}', `${uptime.years}y, ${uptime.months}m, ${uptime.days}d`)

  }

})()





;(function () {

  let [clientX, clientY] = [-100, -100]
  const innerCursor = document.querySelector('.cursor-inner');

  (function () {

    document.addEventListener('mousemove', e => {

      clientX = e.clientX
      clientY = e.clientY

    })

    const render = () => {

      innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`
      requestAnimationFrame(render)

    }

    requestAnimationFrame(render)

  })()

  let [lastX, lastY] = [0, 0]
  let group

  (function () {

    const  canvas = document.querySelector(".cursor-canvas")
    paper.setup(canvas)

    const strokeColor = '#B4637A'
    const strokeWidth = 2
    const segments = 8
    const radius = 12

    const polygon = new paper.Path.RegularPolygon(new paper.Point(0, 0), segments, radius)

    polygon.strokeColor = strokeColor
    polygon.strokeWidth = strokeWidth
    polygon.smooth()

    group = new paper.Group([polygon])
    group.applyMatrix = false

    const lerp = (a, b, n) => (1 - n) * a + n * b

    paper.view.onFrame = function () {

      lastX = lerp(lastX, clientX, 0.3)
      lastY = lerp(lastY, clientY, 0.3)
      group.position = new paper.Point(lastX, lastY)

    }

  })()
})()

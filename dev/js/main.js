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

const birth = '1995-05-01'
const uptime = dateDifferece(birth)

const uptimeContainer = document.querySelector('.js--replace-uptime')
if (uptimeContainer) { uptimeContainer.innerHTML = uptimeContainer.innerHTML.replace('{{ uptime }}', `${uptime.years}y, ${uptime.months}m, ${uptime.days}d`) }





;(function () {
  var clientX = -100;
  var clientY = -100;
  var innerCursor = document.querySelector(".cursor-inner");

  (function () {
    document.addEventListener("mousemove", function (e) {
      clientX = e.clientX;
      clientY = e.clientY;
    });

    var render = function render() {
      innerCursor.style.transform = "translate(".concat(clientX, "px, ").concat(clientY, "px)");
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  })();

  var lastX = 0;
  var lastY = 0;
  var isStuck = false;
  var showCursor = false;
  var group, stuckX, stuckY, fillOuterCursor;

  (function () {
    var canvas = document.querySelector(".cursor-canvas");
    paper.setup(canvas);
    var strokeColor = '#B4637A';
    var strokeWidth = 2;
    var segments = 8;
    var radius = 12;
    var polygon = new paper.Path.RegularPolygon(new paper.Point(0, 0), segments, radius);
    polygon.strokeColor = strokeColor;
    polygon.strokeWidth = strokeWidth;
    polygon.smooth();
    group = new paper.Group([polygon]);
    group.applyMatrix = false;

    var lerp = function lerp(a, b, n) {
      return (1 - n) * a + n * b;
    };

    paper.view.onFrame = function () {
      lastX = lerp(lastX, clientX, 0.3);
      lastY = lerp(lastY, clientY, 0.3);
      group.position = new paper.Point(lastX, lastY);
    };
  })();
})();


//инициализация svg элемента
const width = 600;
const height = 600;
let svg = d3.select("svg")
 .attr("width", width)
 .attr("height", height) ;

// рисуем его относительно точки (0, 0)
function drawFigure() {
  let figure = svg.append("g")
    .style("stroke", "black")
    .style("stroke-width", 2);

  // Закрашенный круг
  figure.append("circle")
    .attr("cx", 0) 
    .attr("cy", 0) 
    .attr("r", 50)
    .style("fill", "red");

  // Закрашенный прямоугольник
  figure.append("rect")
    .attr("x", -25) 
    .attr("y", 75) 
    .attr("width", 50)
    .attr("height", 25)
    .style("fill", "blue");

  // Линия поверх примитивов
  figure.append("line")
    .attr("x1", -50)
    .attr("y1", -50) 
    .attr("x2", 50) 
    .attr("y2", 50) 
    .style("stroke", "green");

  // Закрашенный эллипс
  figure.append("ellipse")
    .attr("cx", 0) 
    .attr("cy", 0) 
    .attr("rx", 25)
    .attr("ry", 15)
    .style("fill", "yellow");

  // Полилиния поверх примитивов
  figure.append("polyline")
    .attr("points", "-20,-20 20,20 60,-20") 
    .style("fill", "none")
    .style("stroke", "orange");

  // Закрашенный многоугольник
  figure.append("polygon")
    .attr("points", "0,30 10,45 -10,45") 
    .style("fill", "purple");

  return figure;
}



let pict = drawFigure();

let draw = (dataForm) => {
 let pict = drawFigure();
 let translateX = dataForm.cx.value;
 let translateY = dataForm.cy.value;
 let rotate = dataForm.rotate.value;
 let scaleX = dataForm.scaleX.value;
 let scaleY = dataForm.scaleY.value;
 pict.attr("transform", `translate(${translateX}, ${translateY}) rotate(${rotate}) scale(${scaleX}, ${scaleY})`);
}
let runAnimation = (dataForm, dur=6000) => {
// Проверяем, активирован ли чекбокс "Перемещение вдоль пути"
let pathMoveCheckbox = document.getElementById('pathMove');
if (pathMoveCheckbox.checked) {

// Получаем выбранный путь перемещения
let pathOptions = document.getElementById('pathOptions').children[0];
// Получаем значение выбранной опции
let pict = drawFigure();
let path = drawPath();
pict.transition()
.ease(d3.easeLinear) // установить в зависимости от настроек
.duration(dur)
.attrTween('transform', translateAlong(path.node()));

// Вызываем функцию drawPath с выбранным индексом пути
//drawPath(selectedPathValue);
} else {
// Если чекбокс не активирован, выполняем обычную анимацию
let pict = drawFigure();
let startTransform = `translate(${dataForm.cx.value}, ${dataForm.cy.value}) rotate(${dataForm.rotate.value}) scale(${dataForm.scaleX.value}, ${dataForm.scaleY.value})`;
let endTransform = `translate(${dataForm.cx2.value}, ${dataForm.cy2.value}) rotate(${dataForm.rotate2.value}) scale(${dataForm.scaleX2.value}, ${dataForm.scaleY2.value})`;

//let path = drawPath(selectedPathValue);

pict.attr("transform", startTransform)
  .transition()
  .duration(dur)
  .ease(d3[dataForm.animationType.value])
  .attr("transform", endTransform);
}
}

function translateAlong(path) {
 const length = path.getTotalLength();
 return function() {
 return function(t) {
 const {x, y} = path.getPointAtLength(t * length);
 return `translate(${x},${y})`;
 }
 }
}

/* массив точек пути будет иметь следующий вид:
 [
 {x: координата, y: координата},
 {x: координата, y: координата},
 ...
 ]
*/
// создаем массив точек, расположенных дельтоидой
function createPathG() {
  let data = [];
  const padding = 200;
  const radius = (width - padding * 2) / 3;
  const step = 0.1; // Шаг для угла в радианах

  for (let angle = Math.PI * 2; angle > 0; angle -= step){
    // Параметрические уравнения дельтоиды
    let x = 2 * radius * Math.cos(angle) + radius * Math.cos(2 * angle) + width / 2;
    let y = 2 * radius * Math.sin(angle) - radius * Math.sin(2 * angle) + height / 2;

    // Добавляем точку в массив
    data.push({ x: x, y: y });
  }

  return data;
}


// создаем путь и отображаем его в svg-элементе
let drawPath = ()=> {
 // создаем массив точек пути в зависимости от параметра
 const dataPoints = createPathG();
 const line = d3.line()
 .x((d) => d.x)
 .y((d) => d.y);
 // создаем путь на основе массива точек 
 const path = svg.append('path')
 .attr('d', line(dataPoints))
 .attr('stroke', 'black')
 .attr('fill', 'none');
 
 return path; 
}


document.getElementById('draw').addEventListener('click', function() {
  let form = document.getElementById('setting');
  draw(form);
});

document.getElementById('clear').addEventListener('click', function() {
 svg.selectAll('*').remove();
});

document.getElementById('animateOn').addEventListener('change', function() {
 if (this.checked) {
   document.getElementById('animationSettings').style.display = 'block';

   document.getElementById('draw').style.display = 'none';
 } else {
   document.getElementById('animationSettings').style.display = 'none';

   document.getElementById('draw').style.display = 'block';
 }
});
document.getElementById('animate').addEventListener('click', function() {
 let dataForm = document.forms['setting'];
  let dur = document.getElementById('duration').value;
 runAnimation(dataForm, Number(dur));
});
document.getElementById('animateOn').addEventListener('change', function() {
  // Список id элементов с пометкой "до"
  var idsToEnd = ['cx2', 'cy2', 'rotate2', 'scaleX2', 'scaleY2'];
  // Список соответствующих label
  var labelsToEnd = ['label_cx2', 'label_cy2', 'label_rotate2', 'label_scaleX2', 'label_scaleY2'];

  for (var i = 0; i < idsToEnd.length; i++) {
    var element = document.getElementById(idsToEnd[i]);
    var label = document.getElementById(labelsToEnd[i]);
    if (element && label) {
      element.style.display = this.checked ? 'inline' : 'none';
      label.style.display = this.checked ? 'inline' : 'none';
    }
  }
});
document.getElementById('animateOn').addEventListener('change', function() {
  // Показать или скрыть настройки анимации
  var animationSettings = document.getElementById('animationSettings');
  animationSettings.style.display = this.checked ? 'block' : 'none';

  // Показать или скрыть чекбокс "Перемещение вдоль пути?"
  var pathMoveCheckbox = document.getElementById('pathMove');
  var pathMoveLabel = document.getElementById('label_pathMove');
  pathMoveCheckbox.style.display = this.checked ? 'inline' : 'none';
  pathMoveLabel.style.display = this.checked ? 'inline' : 'none';

  // Сбросить выбор пути перемещения при скрытии
  if (!this.checked) {
    document.getElementById('pathOptions').style.display = 'none';
  }
});

document.getElementById('pathMove').addEventListener('change', function() {
 if (this.checked) {
   document.getElementById('pathOptions').style.display = 'block';

   document.getElementById('show').style.display = 'none';
 } else {
   document.getElementById('pathOptions').style.display = 'none';

   document.getElementById('show').style.display = 'block';
 }
});






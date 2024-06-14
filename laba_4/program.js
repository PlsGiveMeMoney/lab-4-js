
//инициализация svg элемента
const width = 600;
const height = 600;
let svg = d3.select("svg")
 .attr("width", width)
 .attr("height", height) ;
// создаем изображение смайлик
// рисуем его относительно точки (0, 0)
function drawSmile() {
 let smile = svg.append("g")
 .style("stroke", "brown")
 .style("stroke-width", 2)
 .style("fill", "brown");
 //лицо
 smile.append("circle")
 .attr("cx", 0)
 .attr("cy", 0)
 .attr("r", 50)
 .style("fill", "yellow");
 //левый глаз 
 smile.append("circle")
 .attr("cx", -20)
 .attr("cy", -10)
 .attr("r", 5);
 //правый глаз
 smile.append("circle")
 .attr("cx", 20)
 .attr("cy", -10)
 .attr("r", 5);
 // улыбка
 let arc = d3.arc()
 .innerRadius(35)
 .outerRadius(35);
 
 smile.append("path")
 .attr("d", arc({startAngle: Math.PI /3 * 2,
 endAngle: Math.PI/3 * 4}))
 .style("stroke", "brown")
 return smile 
} 
//рисуем смайлик
let pict = drawSmile();

let draw = (dataForm) => {
 let pict = drawSmile();
 let translateX = dataForm.cx.value;
 let translateY = dataForm.cy.value;
 let rotate = dataForm.rotate.value;
 let scaleX = dataForm.scaleX.value;
 let scaleY = dataForm.scaleY.value;
 pict.attr("transform", `translate(${translateX}, ${translateY}) rotate(${rotate}) scale(${scaleX}, ${scaleY})`);
}
let runAnimation = (dataForm) => {
  // Проверяем, активирован ли чекбокс "Перемещение вдоль пути"
  let pathMoveCheckbox = document.getElementById('pathMove');
  if (pathMoveCheckbox.checked) {
    // Получаем выбранный путь перемещения
    let pathOptions = document.getElementById('pathOptions').children[0];
    // Получаем значение выбранной опции
    let selectedPathValue = pathOptions.options[pathOptions.selectedIndex].value;
	let path = drawPath(selectedPathValue);
	pict.transition()
 .ease(d3.easeLinear) // установить в зависимости от настроек
 .duration(6000)
 .attrTween('transform', translateAlong(path.node()));

    // Вызываем функцию drawPath с выбранным индексом пути
    //drawPath(selectedPathValue);
  } else {
    // Если чекбокс не активирован, выполняем обычную анимацию
    let pict = drawSmile();
    let startTransform = `translate(${dataForm.cx.value}, ${dataForm.cy.value}) rotate(${dataForm.rotate.value}) scale(${dataForm.scaleX.value}, ${dataForm.scaleY.value})`;
    let endTransform = `translate(${dataForm.cx2.value}, ${dataForm.cy2.value}) rotate(${dataForm.rotate2.value}) scale(${dataForm.scaleX2.value}, ${dataForm.scaleY2.value})`;
	
	//let path = drawPath(selectedPathValue);
	
    pict.attr("transform", startTransform)
      .transition()
      .duration(6000)
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
// создаем массив точек, расположенных буквой "Г"
function createPathG() {
 let data = [];
 const padding = 100;
 //начальное положение рисунка
 let posX = padding;
 let posY = height - padding;
 const h = 5;
 // координаты y - уменьшаются, x - постоянны
 while (posY > padding) {
 data.push( {x: posX, y: posY});
 posY -= h;
 }
 // координаты y - постоянны, x - увеличиваются
 while (posX < width - padding) {
 data.push( {x: posX, y: posY});
 posX += h;
 }
 return data
}
// создаем массив точек, расположенных по кругу
function createPathCircle() {
 let data = [];
 // используем параметрическую форму описания круга
 // центр асположен в центре svg-элемента, а радиус равен трети высоты/ширины
 for (let t = 0 ; t <= Math.PI * 2; t += 0.1) {
 data.push(
 {x: width / 2 + width / 3 * Math.sin(t),
 y: height / 2 + height / 3 * Math.cos(t)}
 );
 }
 return data
}
// создаем путь и отображаем его в svg-элементе
let drawPath =(typePath) => {
 // создаем массив точек пути в зависимости от параметра
 const dataPoints = (typePath == 0)? createPathG() : createPathCircle();
 const line = d3.line()
 .x((d) => d.x)
 .y((d) => d.y);
 // создаем путь на основе массива точек 
 const path = svg.append('path')
 .attr('d', line(dataPoints))
 .attr('stroke', 'none')
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
// let dataForm = document.getElementById('setting');
 let dataForm = document.forms['setting'];
 runAnimation(dataForm);
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
   document.getElementById('povorot').style.display = 'none';
      document.getElementById('scaleMain').style.display = 'none';
   document.getElementById('show').style.display = 'none';
 } else {
   document.getElementById('pathOptions').style.display = 'none';
   document.getElementById('povorot').style.display = 'block';
      document.getElementById('scaleMain').style.display = 'block';
   document.getElementById('show').style.display = 'block';
 }
});






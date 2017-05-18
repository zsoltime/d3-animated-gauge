import { arc } from 'd3-shape';
import { format } from 'd3-format';
import { interpolate } from 'd3-interpolate';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import 'styles';

const settings = {
  colorRange: ['#aaaaaa', '#75bf3b', '#eddd0d', '#ff5353'],
  colorStops: [0, 25, 65, 90],
  label: 'km/h',
  max: 100,
  min: 0,
  padding: 24,
  size: 150,
  thickness: 50,
};

const color = scaleLinear()
  .domain(settings.colorStops)
  .range(settings.colorRange);

const gaugeArc = arc()
  .innerRadius(settings.size - settings.thickness)
  .outerRadius(settings.size)
  .startAngle(-Math.PI / 2);

const svg = select('#chart')
  .append('svg')
  .attr('width', settings.size * 2)
  .attr('height', settings.size + settings.padding)
  .attr('class', 'gauge');

const chart = svg.append('g')
  .attr('transform', `translate(${settings.size}, ${settings.size})`);

chart.append('path')
  .datum({ endAngle: Math.PI / 2 })
  .attr('class', 'gauge__fixed')
  .attr('d', gaugeArc);

const animated = chart.append('path')
  .datum({ endAngle: -Math.PI / 2 })
  .style('fill', settings.colorRange[0])
  .attr('d', gaugeArc);

const value = svg.append('g')
  .attr('transform', `translate(${settings.size}, ${settings.size * 0.9})`)
  .append('text')
  .text(0)
  .attr('text-anchor', 'middle')
  .attr('class', 'gauge__value');

const scale = svg.append('g')
  .attr('transform', `translate(${settings.size}, ${settings.size + 15})`)
  .attr('class', 'gauge__label gauge__label--small');

scale.append('text')
  .text(settings.min)
  .attr('text-anchor', 'middle')
  .attr('x', -(settings.size - (settings.thickness / 2)));

scale.append('text')
  .text(settings.max)
  .attr('text-anchor', 'middle')
  .attr('x', settings.size - (settings.thickness / 2));

function tweenText(trans, val) {
  trans.tween('text', function tt() {
    const node = this;
    const i = interpolate(node.innerHTML, val);
    return (t) => {
      node.innerHTML = `${format('.1f')(
        Math.round(i(t) * 10) / 10
      )}<tspan class="gauge__label">${settings.label}</tspan>`;
    };
  });
}

function tweenAngle(trans, val) {
  const newAngle = ((val / 100) * Math.PI) - (Math.PI / 2);
  trans.attrTween('d', (d) => {
    const i = interpolate(d.endAngle, newAngle);
    return (t) => {
      d.endAngle = i(t);
      return gaugeArc(d);
    };
  });
}

function updateGauge(v) {
  const val = format('.1f')(v);

  value.transition()
    .duration(1000)
    .call(tweenText, val);

  animated.transition()
    .duration(1000)
    .style('fill', () => color(val))
    .call(tweenAngle, val);
}

let speed = settings.max / 50;
updateGauge(speed);

setInterval(() => {
  speed = speed > 85 ? (Math.random() * 100) : speed + (Math.random() * 10);
  updateGauge(speed);
}, 750);

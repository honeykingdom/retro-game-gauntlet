/* eslint-disable no-param-reassign */
import { DrawState } from 'features/wheel/useDrawWheel';

const LINE_WIDTH = 4;

const meanAngleDeg = (angle1: number, angle2: number) =>
  Math.atan2(
    (Math.sin(angle1) + Math.sin(angle2)) / 2,
    (Math.cos(angle1) + Math.cos(angle2)) / 2,
  );

const getX = (offset: number, radius: number, angle: number) =>
  offset + radius * Math.sin(angle);

const getY = (offset: number, radius: number, angle: number) =>
  offset + radius * Math.cos(angle);

const precompiledWheel = document.createElement('canvas');
let wheelHash = '';

const getWheelHash = ({ segments, wheelColors, radius, scale }: DrawState) =>
  `${segments[0].name}${wheelColors.text}${radius}${scale}`;

const precompileWheel = ({
  segments,
  radius,
  segmentAngle,
  textFont,
  wheelColors,
  scale,
}: DrawState) => {
  const ctx = precompiledWheel.getContext('2d') as CanvasRenderingContext2D;

  const size = radius * 2;
  const textOffset = (20 / 200) * radius;

  precompiledWheel.width = size * scale;
  precompiledWheel.height = size * scale;

  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, size, size);

  ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
  ctx.fillStyle = wheelColors.wheelBackground;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(radius, radius, radius - LINE_WIDTH / 2, 0, 2 * Math.PI);
  ctx.strokeStyle = wheelColors.border;
  ctx.lineWidth = LINE_WIDTH;

  segments.forEach((_, i) => {
    const lineX = getX(radius, radius, i * segmentAngle);
    const lineY = getY(radius, radius, i * segmentAngle);

    ctx.moveTo(lineX, lineY);
    ctx.lineTo(radius, radius);
  });

  ctx.stroke();

  ctx.font = textFont;
  ctx.fillStyle = wheelColors.text;

  segments.forEach((segment, i) => {
    const from = i * segmentAngle;
    const to = (i + 1) * segmentAngle;

    const meanAngle = meanAngleDeg(from, to);
    const textAngleRotation = meanAngle + Math.PI;
    const textAngle = -(meanAngle + 1.5 * Math.PI);
    const textX = getX(radius, radius - textOffset, textAngle);
    const textY = getY(radius, radius - textOffset, textAngle);

    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(textAngleRotation);
    ctx.fillText(segment.name, 0, 4);
    ctx.restore();
  });
};

const drawCircle = (drawState: DrawState) => {
  const { context, radius, rotationAngle, scale } = drawState;

  if (!context) return;

  const size = radius * 2;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(scale, scale);
  context.clearRect(0, 0, size, size);

  context.translate(radius, radius);
  context.rotate(rotationAngle);
  context.translate(-radius, -radius);

  const currentHash = getWheelHash(drawState);

  if (wheelHash !== currentHash) {
    wheelHash = currentHash;

    precompileWheel(drawState);
  }

  context.drawImage(precompiledWheel, 0, 0, size, size);
};

export default drawCircle;

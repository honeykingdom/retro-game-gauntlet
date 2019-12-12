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

const drawCircle = ({
  context,
  segments,
  radius,
  rotationAngle,
  segmentAngle,
  textFont,
  wheelColors,
  scale,
}: DrawState) => {
  if (!context) return;

  const size = radius * 2;
  const textOffset = (20 / 200) * radius;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(scale, scale);
  context.clearRect(0, 0, size, size);

  context.translate(radius, radius);
  context.rotate(rotationAngle);
  context.translate(-radius, -radius);

  context.arc(radius, radius, radius, 0, 2 * Math.PI);
  context.fillStyle = wheelColors.wheelBackground;
  context.fill();

  segments.forEach((segment, i) => {
    const from = i * segmentAngle;
    const to = (i + 1) * segmentAngle;

    context.beginPath();
    context.arc(radius, radius, radius - LINE_WIDTH / 2, from, to);
    context.lineTo(radius, radius);
    context.strokeStyle = wheelColors.border;
    context.lineWidth = LINE_WIDTH;
    context.stroke();

    const meanAngle = meanAngleDeg(from, to);
    const textAngleRotation = meanAngle + Math.PI;
    const textAngle = -(meanAngle + 1.5 * Math.PI);
    const textX = getX(radius, radius - textOffset, textAngle);
    const textY = getY(radius, radius - textOffset, textAngle);

    context.save();
    context.translate(textX, textY);
    context.rotate(textAngleRotation);
    context.beginPath();
    context.font = textFont;
    context.fillStyle = wheelColors.text;
    context.fillText(segment.name, 0, 4);
    context.restore();
  });

  context.scale(scale, scale);
};

export default drawCircle;

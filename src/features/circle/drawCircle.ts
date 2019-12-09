import { RolledGame } from 'features/rollGame/rollGameTypes';

const LINE_WIDTH = 4;

const meanAngleDeg = (angle1: number, angle2: number) => {
  return Math.atan2(
    (Math.sin(angle1) + Math.sin(angle2)) / 2,
    (Math.cos(angle1) + Math.cos(angle2)) / 2,
  );
};

const getX = (offset: number, radius: number, angle: number) =>
  offset + radius * Math.sin(angle);

const getY = (offset: number, radius: number, angle: number) =>
  offset + radius * Math.cos(angle);

/* eslint-disable no-param-reassign */
const drawCircle = (
  segments: RolledGame[],
  radius: number,
  textFont: string,
) => (context: CanvasRenderingContext2D, rotateAngle: number) => {
  const size = radius * 2;
  const coeff = (2 * Math.PI) / segments.length;
  const textOffset = (20 / 200) * radius;

  context.clearRect(0, 0, size, size);

  context.translate(radius, radius);
  context.rotate(rotateAngle);
  context.translate(-radius, -radius);

  context.arc(radius, radius, radius, 0, 2 * Math.PI);
  context.fillStyle = '#121212';
  context.fill();

  segments.forEach((segment, i) => {
    const from = i * coeff;
    const to = (i + 1) * coeff;

    context.beginPath();
    context.arc(radius, radius, radius - LINE_WIDTH / 2, from, to);
    context.lineTo(radius, radius);
    context.strokeStyle = '#fff';
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
    context.fillStyle = '#fff';
    context.fillText(segment.name, 0, 4);
    context.restore();
  });
};
/* eslint-disable no-param-reassign */

export default drawCircle;

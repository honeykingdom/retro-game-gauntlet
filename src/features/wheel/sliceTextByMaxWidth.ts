import getTextWidth from 'features/wheel/getTextWidth';

const sliceTextByMaxWidth = (text: string, font: string, maxWidth: number) => {
  const width = getTextWidth(text, font);

  if (width < maxWidth) return text;

  let beginCursor = 0;
  let endCursor = text.length;
  let cursor = Math.floor(text.length / 2);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const textSlice = `${text.slice(0, cursor)}...`;

    const w = getTextWidth(textSlice, font);

    if (w > maxWidth) {
      endCursor = cursor;
    } else {
      beginCursor = cursor;
    }

    // middle between the beginCursor and the endCursor
    cursor = beginCursor + Math.floor((endCursor - beginCursor) / 2);

    if (beginCursor === cursor) return textSlice;
  }
};

export default sliceTextByMaxWidth;

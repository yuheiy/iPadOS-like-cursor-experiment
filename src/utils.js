import sync, { cancelSync } from "framesync";
import { action } from "popmotion";

export const just = (v) => {
  return action(({ update, complete }) => {
    const process = sync.update(() => {
      update(v);
      complete();
    });

    return {
      stop: () => {
        cancelSync.update(process);
      },
    };
  });
};

const cursors = [
  {
    selector: "a",
    snap: true,
    d: ({ cursorX, cursorY, element }) => {
      const {
        left,
        top,
        right,
        bottom,
        width,
        height,
      } = element.getBoundingClientRect();
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;
      const distanceXFromCenter = (cursorX - centerX) / (width / 2);
      const distanceYFromCenter = (cursorY - centerY) / (height / 2);

      const maxGap = 8;
      const gapX = Math.min(width / 8, maxGap);
      const gapY = Math.min(height / 8, maxGap);

      const cursorLeft = left + gapX * distanceXFromCenter;
      const cursorTop = top + gapY * distanceYFromCenter;
      const cursorRight = right + gapX * distanceXFromCenter;
      const cursorBottom = bottom + gapY * distanceYFromCenter;

      const radius = 8;

      return `M${cursorLeft + radius},${cursorTop}
        L ${cursorRight - radius},${cursorTop}
        A ${radius} ${radius} 0 0 1 ${cursorRight} ${cursorTop + radius}
        L ${cursorRight},${cursorBottom - radius}
        A ${radius} ${radius} 0 0 1 ${cursorRight - radius} ${cursorBottom}
        L ${cursorLeft + radius},${cursorBottom}
        A ${radius} ${radius} 0 0 1 ${cursorLeft} ${cursorBottom - radius}
        L ${cursorLeft},${cursorTop + radius}
        A ${radius} ${radius} 0 0 1 ${cursorLeft + radius} ${cursorTop}`;
    },
  },
  {
    selector: "*",
    snap: false,
    d: ({ cursorX, cursorY }) => {
      const radius = 10;

      return `M${cursorX - radius},${cursorY}
        a ${radius},${radius} 0 1,0 ${radius * 2},0
        a ${radius},${radius} 0 1,0 ${radius * -2},0`;
    },
  },
];

export const getCursor = (element) => {
  for (const cursor of cursors) {
    if (element.matches(cursor.selector)) {
      return {
        ...cursor,
        element,
      };
    }

    const closest = element.closest(cursor.selector);
    if (closest) {
      return {
        ...cursor,
        element: closest,
      };
    }
  }
};

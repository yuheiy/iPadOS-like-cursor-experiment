<script>
  import { value, tween, easing } from "popmotion";
  import flubber from "https://dev.jspm.io/npm:flubber@0.4.2";
  import { just, getCursor } from "./utils";

  let d;
  const tracker = value("", path => {
    d = path || "";
  });

  let cursorX;
  let cursorY;

  let prevCursor;
  let currentCursor;

  let currentTween;

  const onMouseMove = event => {
    cursorX = event.pageX;
    cursorY = event.pageY;

    const nextCursor = getCursor(event.target);

    let shouldTransition = false;
    if (!currentCursor) {
      shouldTransition = true;
    } else {
      const isIntendingAnotherElement =
        currentCursor.element !== nextCursor.element;
      const shouldCursorSnap = currentCursor.snap || nextCursor.snap;
      shouldTransition = isIntendingAnotherElement && shouldCursorSnap;
    }

    if (shouldTransition) {
      prevCursor = currentCursor;
      currentCursor = nextCursor;

      currentTween = tween({
        from: 0,
        to: 1,
        duration: 125,
        ease: easing.circOut
      })
        .pipe(progress => {
          const from = prevCursor
            ? prevCursor.d({
                cursorX,
                cursorY,
                element: prevCursor.element
              })
            : [[cursorX, cursorY]];
          const to = currentCursor.d({
            cursorX,
            cursorY,
            element: currentCursor.element
          });
          return flubber.interpolate(from, to)(progress);
        })
        .start(tracker);

      return;
    }

    if (currentTween && currentTween.isActive()) {
      return;
    }

    const path = currentCursor.d({
      cursorX,
      cursorY,
      element: currentCursor.element
    });
    just(path).start(tracker);
  };
</script>

<style>
  path {
    transition: fill 0.125s ease-out;
  }

  path[data-cursor="*"] {
    fill: hsla(0, 0%, 0%, 0.6);
  }

  path[data-cursor="a"] {
    fill: hsla(0, 0%, 0%, 0.2);
  }
</style>

<svelte:window on:mousemove={onMouseMove} />

<path {d} data-cursor={currentCursor && currentCursor.selector} />

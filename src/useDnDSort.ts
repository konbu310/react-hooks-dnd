import React, { useRef, useState } from "react";
import { nanoid } from "nanoid";

type Position = {
  x: number;
  y: number;
};

type DnDItem<T> = {
  value: T;
  key: string;
  position: Position;
  element: HTMLElement;
};

type DnDRef<T> = {
  keys: Map<T, string>;
  dndItems: DnDItem<T>[];
  canCheckHovered: boolean;
  pointerPosition: Position;
  dragElement: DnDItem<T> | null;
};

type DnDSortResult<T> = {
  key: string;
  value: T;
  events: {
    ref: (element: HTMLElement | null) => void;
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  };
};

const isHover = (event: PointerEvent, element: HTMLElement): boolean => {
  const { clientX, clientY } = event;
  const rect = element.getBoundingClientRect();
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
};

export const useDnDSort = <T>(defaultItems: T[]): DnDSortResult<T>[] => {
  const [items, setItems] = useState(defaultItems);

  const state = useRef<DnDRef<T>>({
    dndItems: [],
    keys: new Map(),
    dragElement: null,
    canCheckHovered: true,
    pointerPosition: { x: 0, y: 0 },
  }).current;

  const onPointerMove = (event: PointerEvent) => {
    console.log("Pointer Move");
    const { clientX, clientY } = event;
    const { dndItems, dragElement, pointerPosition } = state;

    if (!dragElement) return;

    const x = clientX - pointerPosition.x;
    const y = clientY - pointerPosition.y;

    const dragStyle = dragElement.element.style;
    dragStyle.zIndex = "100";
    dragStyle.transform = `translate(${x}px, ${y}px)`;
    dragStyle.cursor = "grabbing";

    document.body.style.userSelect = "none";
    document.body.style.overflow = "hidden";

    if (!state.canCheckHovered) return;

    state.canCheckHovered = false;

    setTimeout(() => (state.canCheckHovered = true), 150);

    const dragIndex = dndItems.findIndex(
      (item) => item.key === dragElement.key
    );

    const hoveredIndex = dndItems.findIndex(
      (item, index) => index !== dragIndex && isHover(event, item.element)
    );

    if (hoveredIndex !== -1) {
      state.pointerPosition.x = clientX;
      state.pointerPosition.y = clientY;

      dndItems.splice(dragIndex, 1);
      dndItems.splice(hoveredIndex, 0, dragElement);

      const { left: x, top: y } = dragElement.element.getBoundingClientRect();

      dragElement.position = { x, y };

      setItems(dndItems.map((item) => item.value));
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    console.log("Pointer Up");
    const { dragElement } = state;

    if (!dragElement) return;

    const dragStyle = dragElement.element.style;

    dragStyle.zIndex = "";
    dragStyle.transform = "";
    dragStyle.cursor = "grab";

    document.body.style.userSelect = "";
    document.body.style.overflow = "";

    state.dragElement = null;

    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointermove", onPointerMove);
  };

  return items.map((value, index) => {
    const key = state.keys.get(value) || nanoid(10);
    state.keys.set(value, key);
    return {
      key,
      value,
      events: {
        ref: (element: HTMLElement | null) => {
          if (!element) return;

          const { dndItems, dragElement, pointerPosition } = state;

          element.style.transform = "";

          const { left: x, top: y } = element.getBoundingClientRect();
          const position: Position = { x, y };

          const itemIndex = dndItems.findIndex((item) => item.key === key);

          if (itemIndex === -1) {
            return dndItems.push({ key, value, element, position });
          }

          if (dragElement?.key === key) {
            const dragX = dragElement.position.x - position.x;
            const dragY = dragElement.position.y - position.y;

            element.style.transform = `translate(${dragX}px, ${dragY}px)`;

            pointerPosition.x -= dragX;
            pointerPosition.y -= dragY;
          }

          state.dndItems[itemIndex] = { key, value, element, position };
        },
        onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
          console.log(`Pointer Down: ${event.pointerType}`);
          const element = event.currentTarget;

          state.pointerPosition.x = event.clientX;
          state.pointerPosition.y = event.clientY;

          element.style.transition = "";
          element.style.cursor = "grabbing";

          const { left: x, top: y } = element.getBoundingClientRect();
          const position: Position = { x, y };

          state.dragElement = { key, value, element, position };

          window.addEventListener("pointerup", onPointerUp);
          window.addEventListener("pointermove", onPointerMove);
        },
      },
    };
  });
};
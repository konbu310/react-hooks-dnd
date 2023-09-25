import React, { FC } from "react";
import { useDnDSort } from "./useDnDSort.ts";

type Item = {
  id: string;
  value: string;
};

const items: Item[] = Array.from({ length: 10 }, (_, i) => ({
  id: i.toString(),
  value: i.toString(),
}));

export const App: FC<{}> = ({}) => {
  const sortedItems = useDnDSort(items.map((item) => item.value));

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        {sortedItems.map((item) => (
          <div
            key={item.key}
            data-key={item.key}
            {...item.events}
            style={{
              msTouchAction: "manipulation",
              border: "1px solid lightgray",
              borderRadius: 8,
              padding: "18px 20px",
              background: "#fefefe",
              cursor: "grab",
              boxShadow: "var(--shadow-elevation-medium)",
              width: 350,
              touchAction: "manipulation",
            }}
          >
            {item.value}
          </div>
        ))}
      </div>
    </div>
  );
};

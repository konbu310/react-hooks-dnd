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
              border: "1px solid lightgray",
              borderRadius: 8,
              padding: "18px 20px",
              background: "#fefefe",
              cursor: "grab",
              boxShadow:
                "0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)",
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

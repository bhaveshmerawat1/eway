import React from "react";
import clsx from "clsx";

type LayoutType = "list" | "flex" | "grid";

type ListProps<T> = {
  items: T[];
  renderItem?: (item: T, index: number) => React.ReactNode
  layout?: LayoutType;
  listClassName?: string;
  itemClassName?: string;
  gridCols?: string;
  children?: React.ReactNode;
};

function List<T>({
  items,
  renderItem,
  layout = "list",
  listClassName,
  itemClassName,
  gridCols = "grid-cols-2",
  children,
}: ListProps<T>) {
  const containerClass = clsx(
    {
      list: "space-y-1",
      flex: "flex gap-4 flex-wrap",
      grid: clsx("grid gap-4", gridCols),
    }[layout],
    listClassName
  );

  return (
    <ul className={containerClass}>
      {children
        ? children
        : items.map((item, index) => {
          const content = renderItem
            ? renderItem(item, index)
            : (item as React.ReactNode);

          return layout === "list" ? (
            <li key={index} className={clsx("border-b-2 border-gray-light hover:bg-white cursor-pointer group", itemClassName)}>
              {content}
            </li>
          ) : (
            <div key={index} className={clsx("p-2", itemClassName)}>
              {content}
            </div>
          );
        })}
    </ul>
  );
}

export default List;

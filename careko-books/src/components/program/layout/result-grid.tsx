'use client';

import React from 'react';

type ResultsGridProps<T> = {
  items: T[];
  isLoading: boolean;
  emptyMessage: string;
  renderItem: (item: T) => React.ReactNode;
  colsClassName: string;
};

export function ResultsGrid<T>({
  items,
  isLoading,
  emptyMessage,
  renderItem,
  colsClassName,
}: ResultsGridProps<T>) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        Carregando resultados...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className={`grid ${colsClassName} gap-4`}>
      {items.map((item: any) => (
        <li key={item.id}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

import { useState, useEffect, useMemo, useRef } from "react";

interface BaseItem {
  id: number;
}

export const useRowSelection = <T extends BaseItem>(storageKey: string) => {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const isInitialized = useRef(false);

  const selectedRowKeys: React.Key[] = useMemo(
    () => selectedRows.map((item) => item.id),
    [selectedRows]
  );

  // Get stored selection from localStorage
  const getStoredSelection = (): T[] => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  };

  // Set selection to localStorage
  const setStoredSelection = (data: T[]) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  // Remove selection from localStorage
  const removeStoredSelection = () => {
    localStorage.removeItem(storageKey);
  };

  // Handle single row selection
  const onSelect = (record: T, selected: boolean) => {
    const currentSelection = getStoredSelection();

    if (!selected) {
      const newSelection = currentSelection.filter(
        (item) => item.id !== record.id
      );
      setSelectedRows(newSelection);
    } else {
      const newSelection = [record, ...currentSelection];
      setSelectedRows(newSelection);
    }
  };

  // Handle select all rows
  const onSelectAll = (selected: boolean, _: T[], changeRows: T[]) => {
    if (!selected) {
      const unSelectIds = changeRows.map((item) => item.id);
      const newSelection = selectedRows.filter(
        (item) => !unSelectIds.includes(item.id)
      );
      setSelectedRows(newSelection);
    } else {
      const newSelection = [...selectedRows, ...changeRows];
      const uniqueNewSelection = newSelection.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );
      setSelectedRows(uniqueNewSelection);
    }
  };

  // Remove specific item from selection
  const removeItem = (id: number) => {
    const newSelection = selectedRows.filter((item) => item.id !== id);
    setSelectedRows(newSelection);
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedRows([]);
  };

  // Update stored selection when selected rows change
  useEffect(() => {
    if (!isInitialized.current) {
      // Initialize from localStorage only once
      const storedSelection = getStoredSelection();
      setSelectedRows(storedSelection);
      isInitialized.current = true;
    } else {
      // Update localStorage when selectedRows change (after initialization)
      if (selectedRows.length > 0) {
        setStoredSelection(selectedRows);
      } else {
        removeStoredSelection();
      }
    }
  }, [selectedRows, storageKey]);

  return {
    selectedRowKeys,
    selectedRows,
    onSelect,
    onSelectAll,
    removeItem,
    clearSelection,
  };
};

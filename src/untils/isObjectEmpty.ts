export const isObjectEmpty = (
  obj: Record<string, unknown> | null | undefined
): boolean => {
  if (typeof obj !== "object" || !obj) {
    return true;
  }

  return Object.entries(obj).length === 0;
};

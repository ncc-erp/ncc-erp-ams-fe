const pTagRegex = /<p\b[^>]*>[\s\S]*?<\/p>/i;

export const extractContent = (strInput: string | undefined): string | null => {
  if (!strInput || !pTagRegex.test(strInput)) {
    return strInput || null;
  }

  const pElement = new DOMParser()
    .parseFromString(strInput, "text/html")
    .querySelector("p");
  return pElement?.textContent || null;
};

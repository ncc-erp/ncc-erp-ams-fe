export const trimObjectValues = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const trimmed: any = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (typeof value === 'string') {
      trimmed[key] = value.trim();
    } else {
      trimmed[key] = value;
    }
  });
  
  return trimmed;
}; 
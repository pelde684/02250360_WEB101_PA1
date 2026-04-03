// Simple colored placeholder images
export const getLocalImage = (title, color = '#e50914') => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='300' height='450' fill='${color.replace('#', '%23')}'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='white' font-size='20' font-family='Arial'%3E${encodeURIComponent(title)}%3C/text%3E%3C/svg%3E`;
};
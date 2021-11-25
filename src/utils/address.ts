export const truncate = (string = "", start = 5, end = 3) => {
  if (start < 1 || end < 1) {
    return string;
  }

  if (string.length <= start + end) {
    return string;
  }

  return `${string.slice(0, start)}...${string.slice(-end)}`;
};

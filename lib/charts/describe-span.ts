/**
 * "3 days" / "9 hours" — the window a time series covers, measured from its
 * first and last timestamps rather than assumed from the number of points
 * (the API may bucket by hour or coarser).
 */
export const describeSpan = (points: Array<{ hour: string }>): string => {
  if (points.length === 0) return '';

  const first = new Date(points[0].hour).getTime();
  const last = new Date(points[points.length - 1].hour).getTime();
  const hours = Math.max(1, Math.round((last - first) / 3_600_000));

  if (hours >= 48) {
    const days = Math.round(hours / 24);
    return `${days} day${days === 1 ? '' : 's'}`;
  }
  return `${hours} hour${hours === 1 ? '' : 's'}`;
};

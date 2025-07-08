export function getCurrentMonthRange(): { startDate: Date; endDate: Date } {
  const now = new Date();

  // First day: year, month, day=1
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

  // Last day: year, month+1, day=0 gives last day of current month
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return { startDate, endDate };
}
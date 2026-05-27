export function getDemandCellClass(demand, target) {
  if (demand === 0 || demand < target * 0.5) {
    return 'demand-cell demand-cell--low';
  }

  if (demand < target * 0.9) {
    return 'demand-cell demand-cell--medium';
  }

  return 'demand-cell demand-cell--high';
}

export function getRowTotal(weeklyDemand) {
  return weeklyDemand.reduce((total, demand) => total + demand, 0);
}

export function getAverageWeeklyDemand(weeklyDemand) {
  return getRowTotal(weeklyDemand) / weeklyDemand.length;
}

export function getZeroDemandWeeks(weeklyDemand) {
  return weeklyDemand.reduce(
    (count, demand) => (demand === 0 ? count + 1 : count),
    0,
  );
}

export function getTrackingStatus(item) {
  const averageDemand = getAverageWeeklyDemand(item.weekly_demand);
  const zeroWeeks = getZeroDemandWeeks(item.weekly_demand);

  if (averageDemand < item.target * 0.5 || zeroWeeks >= 3) {
    return 'At Risk';
  }

  if (averageDemand < item.target * 0.9) {
    return 'Below Target';
  }

  return 'On Target';
}

export function getWeeklyColumnTotals(items) {
  return items.reduce(
    (totals, item) =>
      totals.map((total, index) => total + item.weekly_demand[index]),
    Array(8).fill(0),
  );
}

export function getGrandTotal(items) {
  return items.reduce((total, item) => total + getRowTotal(item.weekly_demand), 0);
}

export function sortItemsByWeek(items, sortConfig) {
  if (sortConfig.weekIndex === null) {
    return items;
  }

  return [...items].sort((firstItem, secondItem) => {
    const firstValue = firstItem.weekly_demand[sortConfig.weekIndex];
    const secondValue = secondItem.weekly_demand[sortConfig.weekIndex];
    const difference = firstValue - secondValue;

    return sortConfig.direction === 'asc' ? difference : -difference;
  });
}

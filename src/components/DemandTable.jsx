import StatusBadge from './StatusBadge.jsx';
import {
  getDemandCellClass,
  getGrandTotal,
  getRowTotal,
  getWeeklyColumnTotals,
} from '../utils/calculations.js';

const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

function DemandTable({
  items,
  sortConfig,
  selectedItemId,
  onRowSelect,
  onWeekSort,
}) {
  const weeklyTotals = getWeeklyColumnTotals(items);
  const grandTotal = getGrandTotal(items);

  function getSortLabel(weekIndex) {
    if (sortConfig.weekIndex !== weekIndex) {
      return '';
    }

    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  }

  return (
    <table className="demand-table" aria-label="Weekly demand planning grid">
      <thead>
        <tr>
          <th scope="col">Item</th>
          <th scope="col">Category</th>
          <th scope="col">Region</th>
          <th scope="col">Status</th>
          {weekLabels.map((week, index) => (
            <th scope="col" key={week}>
              <button
                className="sort-header-button"
                type="button"
                aria-label={`Sort by ${week}`}
                onClick={() => onWeekSort(index)}
              >
                <span>{week}</span>
                <span aria-hidden="true">{getSortLabel(index)}</span>
              </button>
            </th>
          ))}
          <th scope="col">Total</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => (
          <tr
            className={item.id === selectedItemId ? 'selected-row' : ''}
            key={item.id}
            onClick={() => onRowSelect(item)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onRowSelect(item);
              }
            }}
            aria-label={`Open details for ${item.item}`}
            tabIndex="0"
          >
            <th scope="row">{item.item}</th>
            <td>{item.category}</td>
            <td>{item.region}</td>
            <td>
              <StatusBadge status={item.status} />
            </td>
            {item.weekly_demand.map((demand, index) => (
              <td
                className={getDemandCellClass(demand, item.target)}
                key={`${item.id}-week-${index + 1}`}
              >
                {demand}
              </td>
            ))}
            <td className="total-cell">{getRowTotal(item.weekly_demand)}</td>
          </tr>
        ))}
      </tbody>

      <tfoot>
        <tr className="summary-row">
          <th scope="row">Summary</th>
          <td colSpan="3">Visible row totals</td>
          {weeklyTotals.map((total, index) => (
            <td key={`summary-week-${index + 1}`}>{total}</td>
          ))}
          <td className="total-cell">{grandTotal}</td>
        </tr>
      </tfoot>
    </table>
  );
}

export default DemandTable;

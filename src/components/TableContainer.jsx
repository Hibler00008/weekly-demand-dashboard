import DemandTable from './DemandTable.jsx';
import Filters from './Filters.jsx';

function TableContainer({
  categories,
  items,
  selectedCategory,
  selectedStatuses,
  sortConfig,
  statusOptions,
  onCategoryChange,
  onRowSelect,
  onStatusChange,
  onWeekSort,
  onResetFilters,
  onAddItemClick,
  selectedItemId,
}) {
  return (
    <section className="table-section" aria-label="Demand planning table">
      <div className="section-header">
        <div>
          <h2>Demand Grid</h2>
          <p>Review weekly demand quantities across items, categories, and regions.</p>
        </div>
        <button className="primary-button" type="button" onClick={onAddItemClick}>
          Add Item
        </button>
      </div>

      <Filters
        categories={categories}
        selectedCategory={selectedCategory}
        selectedStatuses={selectedStatuses}
        statusOptions={statusOptions}
        onCategoryChange={onCategoryChange}
        onStatusChange={onStatusChange}
        onResetFilters={onResetFilters}
      />

      <div className="table-container">
        <DemandTable
          items={items}
          sortConfig={sortConfig}
          selectedItemId={selectedItemId}
          onRowSelect={onRowSelect}
          onWeekSort={onWeekSort}
        />
      </div>
    </section>
  );
}

export default TableContainer;

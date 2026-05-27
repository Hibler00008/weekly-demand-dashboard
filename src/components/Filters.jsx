function Filters({
  categories,
  selectedCategory,
  selectedStatuses,
  statusOptions,
  onCategoryChange,
  onStatusChange,
  onResetFilters,
}) {
  return (
    <div className="filters" aria-label="Demand table filters">
      <label className="filter-field" htmlFor="category-filter">
        <span>Category</span>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="status-filter">
        <legend>Status</legend>
        <div className="status-options">
          {statusOptions.map((status) => (
            <label className="status-option" key={status}>
              <input
                type="checkbox"
                aria-label={`Toggle ${status} items`}
                checked={selectedStatuses.includes(status)}
                onChange={() => onStatusChange(status)}
              />
              <span>{status}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        className="secondary-button reset-button"
        type="button"
        onClick={onResetFilters}
      >
        Reset Filters
      </button>
    </div>
  );
}

export default Filters;

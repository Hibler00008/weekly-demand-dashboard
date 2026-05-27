import { useEffect, useState } from 'react';
import DashboardLayout from './components/DashboardLayout.jsx';
import Header from './components/Header.jsx';
import TableContainer from './components/TableContainer.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import AddItemModal from './components/AddItemModal.jsx';
import { demandData } from './data/demandData.js';
import { sortItemsByWeek } from './utils/calculations.js';

const allCategoriesOption = 'All Categories';
const statusOptions = ['active', 'paused', 'discontinued'];
const storageKey = 'weekly-demand-grid-items';

function loadStoredItems() {
  try {
    const savedItems = localStorage.getItem(storageKey);

    if (!savedItems) {
      return demandData;
    }

    const parsedItems = JSON.parse(savedItems);
    return Array.isArray(parsedItems) ? parsedItems : demandData;
  } catch (error) {
    console.warn('Unable to load saved demand data:', error);
    return demandData;
  }
}

function saveItems(itemsToSave) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(itemsToSave));
  } catch (error) {
    console.warn('Unable to save demand data:', error);
  }
}

function App() {
  const [items, setItems] = useState(loadStoredItems);
  const [selectedCategory, setSelectedCategory] = useState(allCategoriesOption);
  const [selectedStatuses, setSelectedStatuses] = useState(statusOptions);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    weekIndex: null,
    direction: 'asc',
  });

  const categoryOptions = [...new Set(items.map((item) => item.category))];
  const categories = [allCategoriesOption, ...categoryOptions];
  const regionOptions = [...new Set(items.map((item) => item.region))];

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === allCategoriesOption ||
      item.category === selectedCategory;
    const matchesStatus = selectedStatuses.includes(item.status);

    return matchesCategory && matchesStatus;
  });

  const visibleItems = sortItemsByWeek(filteredItems, sortConfig);

  function handleStatusChange(status) {
    setSelectedStatuses((currentStatuses) =>
      currentStatuses.includes(status)
        ? currentStatuses.filter((currentStatus) => currentStatus !== status)
        : [...currentStatuses, status],
    );
  }

  function handleWeekSort(weekIndex) {
    setSortConfig((currentSort) => {
      const isSameColumn = currentSort.weekIndex === weekIndex;

      return {
        weekIndex,
        direction:
          isSameColumn && currentSort.direction === 'asc' ? 'desc' : 'asc',
      };
    });
  }

  function handleAddItem(newItem) {
    setItems((currentItems) => [
      ...currentItems,
      {
        ...newItem,
        id: Math.max(...currentItems.map((item) => item.id), 0) + 1,
      },
    ]);
  }

  function handleResetFilters() {
    setSelectedCategory(allCategoriesOption);
    setSelectedStatuses(statusOptions);
    setSortConfig({
      weekIndex: null,
      direction: 'asc',
    });
  }

  useEffect(() => {
    console.log('Loaded demand data:', items);
    saveItems(items);
  }, [items]);

  return (
    <DashboardLayout>
      <Header />
      <TableContainer
        categories={categories}
        items={visibleItems}
        selectedCategory={selectedCategory}
        selectedStatuses={selectedStatuses}
        sortConfig={sortConfig}
        statusOptions={statusOptions}
        onCategoryChange={setSelectedCategory}
        onRowSelect={setSelectedItem}
        onStatusChange={handleStatusChange}
        onWeekSort={handleWeekSort}
        onResetFilters={handleResetFilters}
        onAddItemClick={() => setIsAddModalOpen(true)}
        selectedItemId={selectedItem?.id}
      />
      <DetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
      <AddItemModal
        categoryOptions={categoryOptions}
        isOpen={isAddModalOpen}
        regionOptions={regionOptions}
        statusOptions={statusOptions}
        onAddItem={handleAddItem}
        onClose={() => setIsAddModalOpen(false)}
      />
    </DashboardLayout>
  );
}

export default App;

import { useEffect, useState } from 'react';
import {
  hasValidationErrors,
  validateAddItemForm,
} from '../utils/validation.js';

const weekLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

function createInitialForm(categoryOptions, regionOptions, statusOptions) {
  return {
    item: '',
    category: categoryOptions[0] || '',
    region: regionOptions[0] || '',
    target: '',
    status: statusOptions[0] || '',
    weekly_demand: Array(8).fill(''),
  };
}

function FormField({ error, label, children }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {error ? <small className="field-error">{error}</small> : null}
    </label>
  );
}

function AddItemModal({
  categoryOptions,
  isOpen,
  regionOptions,
  statusOptions,
  onAddItem,
  onClose,
}) {
  const [formData, setFormData] = useState(() =>
    createInitialForm(categoryOptions, regionOptions, statusOptions),
  );
  const errors = validateAddItemForm(formData);
  const isFormInvalid = hasValidationErrors(errors);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function updateField(fieldName, value) {
    setFormData((currentData) => ({
      ...currentData,
      [fieldName]: value,
    }));
  }

  function updateWeeklyDemand(index, value) {
    setFormData((currentData) => ({
      ...currentData,
      weekly_demand: currentData.weekly_demand.map((demand, demandIndex) =>
        demandIndex === index ? value : demand,
      ),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isFormInvalid) {
      return;
    }

    onAddItem({
      item: formData.item.trim(),
      category: formData.category,
      region: formData.region,
      weekly_demand: formData.weekly_demand.map((demand) => Number(demand)),
      target: Number(formData.target),
      status: formData.status,
    });

    setFormData(createInitialForm(categoryOptions, regionOptions, statusOptions));
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-item-title"
        aria-describedby="add-item-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">New Demand Item</p>
            <h2 id="add-item-title">Add Item</h2>
            <p id="add-item-description" className="modal-description">
              Enter weekly demand details for a new planning row.
            </p>
          </div>
          <button
            className="detail-close-button"
            type="button"
            onClick={onClose}
            aria-label="Close add item modal"
          >
            x
          </button>
        </div>

        <form className="add-item-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <FormField label="Item name" error={errors.item}>
              <input
                aria-invalid={Boolean(errors.item)}
                type="text"
                value={formData.item}
                onChange={(event) => updateField('item', event.target.value)}
                placeholder="Display Panels"
              />
            </FormField>

            <FormField label="Category">
              <select
                value={formData.category}
                onChange={(event) => updateField('category', event.target.value)}
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Region">
              <select
                value={formData.region}
                onChange={(event) => updateField('region', event.target.value)}
              >
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Target" error={errors.target}>
              <input
                aria-invalid={Boolean(errors.target)}
                type="number"
                min="0"
                value={formData.target}
                onChange={(event) => updateField('target', event.target.value)}
                placeholder="100"
              />
            </FormField>

            <FormField label="Status">
              <select
                value={formData.status}
                onChange={(event) => updateField('status', event.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <fieldset className="weekly-inputs">
            <legend>Weekly demand</legend>
            <div className="weekly-input-grid">
              {weekLabels.map((week, index) => (
                <FormField
                  label={week}
                  error={errors.weekly_demand[index]}
                  key={week}
                >
                  <input
                    aria-invalid={Boolean(errors.weekly_demand[index])}
                    type="number"
                    min="0"
                    value={formData.weekly_demand[index]}
                    onChange={(event) =>
                      updateWeeklyDemand(index, event.target.value)
                    }
                    placeholder="0"
                  />
                </FormField>
              ))}
            </div>
          </fieldset>

          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={isFormInvalid}
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;

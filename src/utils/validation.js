function isIntegerString(value) {
  return /^\d+$/.test(String(value).trim());
}

export function validateAddItemForm(formData) {
  const errors = {
    item: '',
    target: '',
    weekly_demand: Array(8).fill(''),
  };

  if (!formData.item.trim()) {
    errors.item = 'Item name is required.';
  }

  if (!isIntegerString(formData.target) || Number(formData.target) <= 0) {
    errors.target = 'Target must be a positive integer.';
  }

  formData.weekly_demand.forEach((demand, index) => {
    if (!isIntegerString(demand)) {
      errors.weekly_demand[index] = 'Enter a non-negative integer.';
    }
  });

  return errors;
}

export function hasValidationErrors(errors) {
  return Boolean(
    errors.item ||
      errors.target ||
      errors.weekly_demand.some((weeklyError) => weeklyError),
  );
}

export const cleanValues = (
  form: Record<string, string | number | boolean>,
) => {
  return Object.entries(form).reduce(
    (updatedForm, [key, value]) => {
      if (typeof value === 'string') {
        if (value) {
          updatedForm[key] = value;
        }
      } else if (typeof value === 'object' || typeof value === 'boolean') {
        updatedForm[key] = value;
      } else if (!isNaN(value)) {
        updatedForm[key] = value;
      }
      return updatedForm;
    },
    {} as Record<string, string | number | boolean>,
  );
};

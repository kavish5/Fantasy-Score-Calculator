import _ from 'lodash';

export function groupedForms(forms: Record<string, any>, key: string) {
  const result: Record<string, any> = {};

  for (const form of Object.values(forms)) {
    const keyValue = form[key];
    if (!result[keyValue]) {
      result[keyValue] = [form];
    } else {
      result[keyValue].push(form);
    }
  }

  for (const [key, forms] of Object.entries(result)) {
    if (forms.length === 1) {
      result[key] = forms[0];
    }
  }

  return result;
}

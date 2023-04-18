import _ from 'lodash';

export function groupedForms(forms: Record<string, any>, key: string) {
  const result = _.transform(
    _.groupBy(forms, key),
    (result, forms, key) => {
      if (forms.length === 1) {
        result[key] = forms[0];
      } else {
        result[key] = forms;
      }
    },
    {},
  );
  return result;
}

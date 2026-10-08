const formatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
});
export const money = (sen: number) => formatter.format(sen / 100);

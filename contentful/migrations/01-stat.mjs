// A headline number shown in the "At a glance" strip, e.g. "3+ yrs" / "Shipping production software".
export default function (migration) {
  const stat = migration.createContentType('stat').name('Stat').displayField('value')
    .description('Headline number in the "At a glance" strip. Referenced from Site settings.');
  stat.createField('value').name('Value').type('Symbol').required(true)
    .validations([{ size: { max: 10 } }]);
  stat.createField('label').name('Label').type('Symbol').required(true)
    .validations([{ size: { min: 2, max: 48 } }]);
}

export default function (migration) {
  const e = migration.createContentType('education').name('Education').displayField('qualification');
  e.createField('qualification').name('Qualification').type('Symbol').required(true).validations([{ size: { max: 80 } }]);
  e.createField('institution').name('Institution').type('Symbol').required(true).validations([{ size: { max: 80 } }]);
  e.createField('board').name('University / board').type('Symbol').validations([{ size: { max: 80 } }]);
  e.createField('startYear').name('Start year').type('Integer').required(true).validations([{ range: { min: 1990, max: 2100 } }]);
  e.createField('endYear').name('End year').type('Integer').required(true).validations([{ range: { min: 1990, max: 2100 } }]);
  e.createField('grade').name('Grade').type('Symbol').validations([{ size: { max: 20 } }]);
}

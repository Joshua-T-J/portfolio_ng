export default function (migration) {
  const e = migration.createContentType('experience').name('Experience').displayField('role')
    .description('Sorted newest first by start date. Leave End date empty for your current role.');
  e.createField('role').name('Role').type('Symbol').required(true).validations([{ size: { max: 50 } }]);
  e.createField('company').name('Company').type('Symbol').required(true).validations([{ size: { max: 60 } }]);
  e.createField('companyUrl').name('Company URL').type('Symbol').validations([{ regexp: { pattern: '^https?://\\S+$' } }]);
  e.createField('employmentType').name('Employment type').type('Symbol')
    .validations([{ in: ['Full-time', 'Contract', 'Internship', 'Freelance'] }]);
  e.createField('startDate').name('Start date').type('Date').required(true);
  e.createField('endDate').name('End date').type('Date');
  e.createField('location').name('Location').type('Symbol').validations([{ size: { max: 40 } }]);
  e.createField('summary').name('Summary').type('Text').required(true).validations([{ size: { min: 40, max: 320 } }]);
  e.createField('highlights').name('Highlights').type('Array')
    .items({ type: 'Symbol', validations: [{ size: { max: 160 } }] }).validations([{ size: { max: 5 } }]);
  e.createField('techStack').name('Tech stack').type('Array')
    .items({ type: 'Symbol', validations: [{ size: { max: 24 } }] }).validations([{ size: { max: 10 } }]);
  e.changeFieldControl('highlights', 'builtin', 'listInput');
  e.changeFieldControl('techStack', 'builtin', 'tagEditor');
}

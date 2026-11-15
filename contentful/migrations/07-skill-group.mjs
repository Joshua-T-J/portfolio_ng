export default function (migration) {
  const g = migration.createContentType('skillGroup').name('Skill group').displayField('title');
  g.createField('title').name('Title').type('Symbol').required(true).validations([{ size: { max: 30 } }]);
  g.createField('icon').name('Icon').type('Symbol').required(true)
    .validations([{ in: ['frontend', 'backend', 'tooling', 'cloud', 'design'] }]);
  g.createField('skills').name('Skills').type('Array').required(true)
    .items({ type: 'Symbol', validations: [{ size: { max: 24 } }] }).validations([{ size: { min: 2, max: 16 } }]);
  g.createField('order').name('Order').type('Integer').required(true).validations([{ range: { min: 1, max: 99 } }]);
  g.changeFieldControl('skills', 'builtin', 'tagEditor');
  g.changeFieldControl('icon', 'builtin', 'dropdown');
}

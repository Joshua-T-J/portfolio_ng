export default function (migration) {
  const c = migration.createContentType('certification').name('Certification').displayField('title');
  c.createField('title').name('Title').type('Symbol').required(true).validations([{ size: { max: 90 } }]);
  c.createField('issuer').name('Issuer').type('Symbol').required(true).validations([{ size: { max: 40 } }]);
  c.createField('issuedOn').name('Issued on').type('Date').required(true);
  c.createField('credentialUrl').name('Credential URL').type('Symbol').validations([{ regexp: { pattern: '^https?://\\S+$' } }]);
}

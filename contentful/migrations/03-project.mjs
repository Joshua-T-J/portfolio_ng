// One entry per project. Replaces projects / projectTypes / angularProjects / reactProjects / staticWebsites / otherProjects.
const URL = { regexp: { pattern: '^https?://\\S+$' }, message: 'Must be a full URL' };

export default function (migration) {
  const p = migration.createContentType('project').name('Project').displayField('title')
    .description('Featured = top 3 by Order appear as large case studies; the rest go in the grid.');
  p.createField('title').name('Title').type('Symbol').required(true).validations([{ size: { min: 2, max: 40 } }]);
  p.createField('slug').name('Slug').type('Symbol').required(true)
    .validations([{ unique: true }, { regexp: { pattern: '^[a-z0-9-]+$' }, message: 'lower-case, digits and dashes' }]);
  p.createField('category').name('Category').type('Symbol').required(true)
    .validations([{ in: ['Open source', 'Client', 'Work', 'Personal', 'Learning'] }]);
  p.createField('clientType').name('Client type').type('Symbol').validations([{ size: { max: 20 } }]);
  p.createField('summary').name('Summary (card text)').type('Symbol').required(true)
    .validations([{ size: { min: 40, max: 180 } }]);
  p.createField('highlights').name('Highlights').type('Array')
    .items({ type: 'Symbol', validations: [{ size: { max: 160 } }] }).validations([{ size: { max: 5 } }]);
  p.createField('techStack').name('Tech stack').type('Array').required(true)
    .items({ type: 'Symbol', validations: [{ size: { max: 20 } }] }).validations([{ size: { min: 1, max: 8 } }]);
  p.createField('featured').name('Featured').type('Boolean').required(true).defaultValue({ 'en-US': false });
  p.createField('order').name('Order').type('Integer').required(true).validations([{ range: { min: 1, max: 999 } }]);
  p.createField('status').name('Status').type('Symbol').required(true)
    .validations([{ in: ['Live', 'In progress', 'Archived'] }]).defaultValue({ 'en-US': 'Live' });
  p.createField('liveUrl').name('Live URL').type('Symbol').validations([URL]);
  p.createField('repoUrl').name('Repository URL').type('Symbol').validations([URL]);
  p.createField('demoVideoUrl').name('Demo video URL').type('Symbol').validations([URL]);
  p.createField('coverImage').name('Cover image (16:10)').type('Link').linkType('Asset')
    .validations([{ linkMimetypeGroup: ['image'] }, { assetFileSize: { max: 1048576 } }]);
  p.createField('body').name('Case study').type('RichText').validations([
    { enabledNodeTypes: ['heading-2', 'heading-3', 'ordered-list', 'unordered-list', 'hr', 'blockquote', 'hyperlink'] },
  ]);
  p.createField('startDate').name('Start date').type('Date');
  p.createField('seoDescription').name('SEO description').type('Symbol').validations([{ size: { min: 70, max: 160 } }]);
  p.changeFieldControl('slug', 'builtin', 'slugEditor');
  p.changeFieldControl('highlights', 'builtin', 'listInput');
  p.changeFieldControl('techStack', 'builtin', 'tagEditor');
  p.changeFieldControl('category', 'builtin', 'dropdown');
  p.changeFieldControl('status', 'builtin', 'dropdown');
}

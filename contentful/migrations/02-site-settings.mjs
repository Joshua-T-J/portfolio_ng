// Singleton: everything about the person and the site. Create exactly ONE entry.
const URL = { regexp: { pattern: '^https?://\\S+$' }, message: 'Must be a full URL' };

export default function (migration) {
  const s = migration.createContentType('siteSettings').name('Site settings').displayField('name')
    .description('Exactly one entry. Hero, contact details, about, SEO.');
  s.createField('name').name('Name').type('Symbol').required(true).validations([{ size: { min: 2, max: 40 } }]);
  s.createField('headline').name('Headline').type('Symbol').required(true).validations([{ size: { max: 60 } }]);
  s.createField('rotatingWords').name('Rotating words').type('Array').required(true)
    .items({ type: 'Symbol', validations: [{ size: { max: 14 } }] })
    .validations([{ size: { min: 1, max: 4 } }]);
  s.createField('intro').name('Intro').type('Text').required(true).validations([{ size: { min: 120, max: 420 } }]);
  s.createField('availabilityText').name('Availability badge').type('Symbol')
    .validations([{ size: { max: 90 } }]);
  s.createField('location').name('Location').type('Symbol').required(true).validations([{ size: { max: 40 } }]);
  s.createField('timezone').name('Time zone').type('Symbol').required(true).validations([{ size: { max: 40 } }]);
  s.createField('email').name('E-mail').type('Symbol').required(true)
    .validations([{ regexp: { pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' } }]);
  s.createField('phone').name('Phone').type('Symbol').validations([{ regexp: { pattern: '^\\+?[0-9 ]{8,16}$' } }]);
  s.createField('githubUrl').name('GitHub URL').type('Symbol').required(true).validations([URL]);
  s.createField('linkedinUrl').name('LinkedIn URL').type('Symbol').required(true).validations([URL]);
  s.createField('instagramUrl').name('Instagram URL').type('Symbol').validations([URL]);
  s.createField('photographyUrl').name('Photography site URL').type('Symbol').validations([URL]);
  s.createField('resumePdf').name('Résumé PDF').type('Link').linkType('Asset').required(true)
    .validations([{ linkMimetypeGroup: ['pdfdocument'] }, { assetFileSize: { max: 2097152 } }]);
  s.createField('headshot').name('Headshot (4:5)').type('Link').linkType('Asset')
    .validations([{ linkMimetypeGroup: ['image'] }, { assetImageDimensions: { width: { min: 800 } } }]);
  s.createField('aboutTitle').name('About title').type('Symbol').required(true).validations([{ size: { max: 70 } }]);
  s.createField('about').name('About text').type('Text').required(true).validations([{ size: { min: 60, max: 600 } }]);
  s.createField('learningNote').name('Learning note').type('Symbol').validations([{ size: { max: 160 } }]);
  s.createField('learningTopics').name('Learning topics').type('Array')
    .items({ type: 'Symbol', validations: [{ size: { max: 28 } }] }).validations([{ size: { max: 10 } }]);
  s.createField('stats').name('Stats').type('Array').required(true)
    .items({ type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['stat'] }] })
    .validations([{ size: { min: 2, max: 4 } }]);
  s.createField('seoTitle').name('SEO title').type('Symbol').required(true).validations([{ size: { min: 30, max: 70 } }]);
  s.createField('seoDescription').name('SEO description').type('Symbol').required(true)
    .validations([{ size: { min: 70, max: 160 } }]);
  s.createField('ogImage').name('Social share image (1200×630)').type('Link').linkType('Asset')
    .validations([{ linkMimetypeGroup: ['image'] }]);
  s.changeFieldControl('intro', 'builtin', 'multipleLine');
  s.changeFieldControl('about', 'builtin', 'multipleLine');
  s.changeFieldControl('rotatingWords', 'builtin', 'tagEditor');
  s.changeFieldControl('learningTopics', 'builtin', 'tagEditor');
}

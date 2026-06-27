export const environment = {
  production: false,
  space: import.meta.env.NG_APP_SPACE_KEY,
  accessToken: import.meta.env.NG_APP_ACCESS_TOKEN,
  contentTypeIds: {
    project: 'projects',
    resume: 'resumeDetails',
    projectTypes: 'projectTypes',
  },
  GoogleSheetsAPI: import.meta.env.NG_APP_GOOGLE_SHEETS_URL,
};

import wretch from 'wretch';

const api = wretch(`${process.env.VUE_APP_API_URL}`).options({mode: 'cors'});

export {api};

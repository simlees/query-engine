import config from '../config';
import * as api from './api';

export default class QueryEngine {
  start() {
    api.fetch().then(response => {
      const transformedData = config.query(response);
      api.post(transformedData);
    });
  }
}

import config from '../config';
import * as api from './api';
import DataTransformer from './data-transformer';

export default class QueryEngine {

  constructor() {
    this.dataTransformer = new DataTransformer();
  }

  start() {
    api.fetch().then(response => {
      const transformedData = this.dataTransformer.transform(response.data);
      api.post(transformedData);
    });
  }

}

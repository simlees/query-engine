import axios from 'axios';
import config from '../config';

export function fetch() {
  return axios(config.sourceUrl);
}

export function post(data) {
  console.log(data);
}

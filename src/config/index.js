const config = {
  sourceUrl: 'https://restcountries.eu/rest/v2/all',
  targetUrl: 'https://post.com',
  query: (response) => {
    console.log(response.data);
    return response.data
      .sort((a, b) => b.population - a.population)
      .slice(0, 9)
      .sort((a, b) => b.name - a.name);
  }
}

export default config;

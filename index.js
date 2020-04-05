let gridSrc = {
  data: [],
  columns: [{
      value: 'name',
      header: 'Name',
      sortable: true,
      filterable: true
    },
    {
      value: 'capital',
      header: 'Capital',
      sortable: true,
      filterable: true
    },
    {
      value: 'region',
      header: 'Region',
      sortable: true,
      filterable: true
    },
    {
      value: 'subregion',
      header: 'Sub Region',
      sortable: true,
      filterable: true
    },
    {
      value: 'numericCode',
      header: 'Numeric Code',
      sortable: true,
      filterable: true
    }
  ],
  pagination: {
    pageSize: 15,
    currentPage: 1
  }
};

const loadData = () => {
  return fetch('https://restcountries.eu/rest/v2/all')
    .then((response) => response.json());
};

loadData().then((res) => {
  gridSrc.data = res;
  grid.create(document.getElementById('grid'), gridSrc);
})

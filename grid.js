var grid = (function () {
  let columns, data, pagination;
  let grid, table;
  let prevBtn, nextBtn, desc;
  let sortFilters = [];

  const createRow = () => {
    return document.createElement('tr');
  };

  const createHeader = (col) => {
    let th = document.createElement('th');
    th.dataset.colName = col.value;
    th.textContent = col.header;
    //hardcoded width to avoid alignment issues
    th.style.width = '20%';
    if (col.sortable)
      th.addEventListener('click', clickHeader);

    const sorted = getIfHeaderIsSorted(col.value);
    if (sorted) {
      th.dataset.sortOrder = sorted.filter.order;
      th.appendChild(createSpan(sorted.sortIndex + 1));
      th.appendChild(createSpan(sorted.filter.order.toUpperCase()));
    }
    return th;
  };

  const createSpan = (content) => {
    let span = document.createElement('span');
    span.textContent = content;
    return span;
  };

  const createCell = (content) => {
    let td = document.createElement('td');
    td.textContent = content;
    return td;
  };

  const createButton = (content) => {
    let btn = document.createElement('button');
    btn.textContent = content;
    return btn;
  };

  const getIfHeaderIsSorted = (colName) => {
    let sortIndex = -1;
    const filter = sortFilters.find((item, index) => {
      sortIndex = index;
      return item.field === colName;
    });
    if (filter) {
      return {
        filter: filter,
        sortIndex: sortIndex
      }
    }
  }

  /////////EVENT LISTENERS START//////////
  const clickHeader = (event) => {
    const target = event.target;
    let field = target.dataset.colName;

    // logic to set asc, desc to the header
    let sortedField, fieldIndex;
    for (let i = 0; i < sortFilters.length; i++) {
      if (sortFilters[i].field === field) {
        sortedField = sortFilters[i];
        fieldIndex = i;
        break;
      }
    }
    if (!sortedField) {
      sortFilters.push({
        field: field,
        order: 'asc'
      });
    } else {
      if (sortedField.order === 'asc') {
        sortedField.order = 'desc';
        sortFilters.splice(fieldIndex, 1);
        sortFilters.push(sortedField);
      } else {
        sortFilters.splice(fieldIndex, 1);
      }
    }

    // sort the columns based on multiple filters
    data.sort((a, b) => {
      for (let j = 0; j < sortFilters.length; j++) {
        const field1 = (a[sortFilters[j].field] || '').toLowerCase();
        const field2 = (b[sortFilters[j].field] || '').toLowerCase();
        if (sortFilters[j].order === 'asc') {
          if (field1 < field2)
            return -1;
          if (field1 > field2)
            return 1;
        } else {
          if (field1 > field2)
            return -1;
          if (field1 < field2)
            return 1;
        }
      }
    });

    updateTableContent();
    return 0;
  };

  const prevClick = () => {
    if (pagination.currentPage > 1) {
      pagination.currentPage--;
    }
    updateTableContent();
    updatePaginationButtons();
  };

  const nextClick = () => {
    if (pagination.currentPage < pagination.totalPages) {
      pagination.currentPage++;
    }
    updateTableContent();
    updatePaginationButtons();
  };
  /////////EVENT LISTENERS END//////////

  const updatePaginationButtons = () => {
    desc.textContent = `${pagination.currentPage} of ${pagination.totalPages}`;
    if (pagination.currentPage === 1) {
      prevBtn.setAttribute('disabled', 'true');
    } else if (prevBtn.hasAttribute('disabled')) {
      prevBtn.removeAttribute('disabled');
    }

    if (pagination.currentPage === pagination.totalPages) {
      nextBtn.setAttribute('disabled', 'true');
    } else if (nextBtn.hasAttribute('disabled')) {
      nextBtn.removeAttribute('disabled');
    }
  };

  const createPagination = () => {
    let pagingCont = document.createElement('div');
    pagingCont.classList.add('paging');
    prevBtn = createButton('Prev');
    prevBtn.addEventListener('click', prevClick);

    nextBtn = createButton('Next');
    nextBtn.addEventListener('click', nextClick);

    desc = document.createElement('label');
    pagination.totalPages = Math.ceil(data.length / pagination.pageSize);

    pagingCont.appendChild(prevBtn);
    pagingCont.appendChild(desc);
    pagingCont.appendChild(nextBtn);

    grid.appendChild(pagingCont);
    updatePaginationButtons();
  };

  // redraw the table
  const updateTableContent = () => {
    table.innerHTML = '';
    const thead = document.createElement('thead');
    table.appendChild(thead);
    let tr = createRow();
    columns.forEach((col) => {
      tr.appendChild(createHeader(col));
    });
    thead.appendChild(tr);

    let currentPage = 1,
      pageSize = data.length;
    if (pagination) {
      currentPage = pagination.currentPage;
      pageSize = pagination.pageSize;
    }

    const startIndex = (currentPage - 1) * pageSize;
    let currentData = data.slice(startIndex, startIndex + pageSize);
    let fragment = document.createDocumentFragment();

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    currentData.forEach((item) => {
      tr = createRow();
      columns.forEach((col) => {
        tr.appendChild(createCell(item[col.value]));
      });
      fragment.appendChild(tr);
    });
    tbody.appendChild(fragment);
  };

  const createGrid = (_grid, dataProvider) => {
    grid = _grid;
    columns = dataProvider.columns;
    data = dataProvider.data;
    pagination = dataProvider.pagination;

    table = document.createElement('table');
    updateTableContent();
    grid.appendChild(table);

    if (pagination)
      createPagination();
  };

  return {
    create: createGrid
  };
})();

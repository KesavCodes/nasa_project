const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 0; //mongo will return entire data if we set 0 as a limit.

function getPagination(queryData) {
  let pageNumber;
  let pageSize;

  Object.entries(queryData).forEach(([key, value]) => {
    if (key.toLowerCase() === "pagenumber")
      pageNumber = isNaN(value) && value.length !== 0 ? null : Math.abs(value);
    else if (key.toLowerCase() === "pagesize")
      pageSize = isNaN(value) && value.length !== 0 ? null : Math.abs(value);
  });

  pageNumber = pageNumber || DEFAULT_PAGE_NUMBER;
  pageSize = pageSize || DEFAULT_PAGE_SIZE;

  const skipCount = (pageNumber - 1) * pageSize;

  return {
    skip: skipCount,
    limit: pageSize,
  };
}

module.exports = {
  getPagination,
};

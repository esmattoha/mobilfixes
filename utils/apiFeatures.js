class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(count) {
    const queryObj = { ...this.queryString };

    // Deleting unnecesary fields from query
    // Example of queryString: ?customer=123&status=pending
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((field) => {
      delete queryObj[field];
    });

    // Filtering comparision fields
    // Example of queryObj: ?price[gt]=100&id[lte]=25

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    if (count) {
      this.query = this.query.countDocuments(JSON.parse(queryString));
      return this;
    }

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    //Example of queryString: ?sort=createdAt,-1
    if (this.queryString.sort) {
      const sort = this.queryString.sort.split(",");
      const sortField = sort[0];
      const sortOrder = sort[1] || "-1";
      const sortObj = {};
      sortObj[sortField] = sortOrder;
      this.query = this.query.sort(sortObj);
    }
    return this;
  }

  limitedFields() {
    //Example of queryString: ?fields=orderNumber,customerInfo
    if (this.queryString.fields) {
      const limitedFields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(limitedFields);
    }
    return this;
  }

  paginate() {
    //Example of queryString: ?page=1
    const limit = parseInt(this.queryString.limit) || 10;
    if (this.queryString.page) {
      this.query = this.query
        .skip((this.queryString.page - 1) * limit)
        .limit(limit);
    }
    this.query = this.query.limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

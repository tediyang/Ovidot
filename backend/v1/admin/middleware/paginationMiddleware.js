export default function paginationMiddleware(req, res, next) {
  try {
    const page = parseInt(req.query.page, 12) || 1;
    const limit = parseInt(req.query.limit, 12) || 12;

    const skip = (page - 1) * limit;

    res.locals.pagination = {
      page,
      limit
    };

    const links = {
      first: `?page=1&limit=${limit}`,
      prev: page > 1 ? `?page=${page - 1}&limit=${limit}` : null,
      self: `?page=${page}&limit=${limit}`,
      next: `?page=${page + 1}&limit=${limit}`,
    };

    Object.keys(links).forEach((key) => links[key] === null && delete links[key]);

    res.locals.pagination.links = links;
    next();
  }
  catch (erro) {
    res.status(500).json({error: "internal server error"});
  }
}

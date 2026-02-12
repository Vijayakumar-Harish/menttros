export function normalizePagination(query: any) {
  let { page = 1, limit = 20, sort = "desc" } = query;

  page = Math.max(1, Number(page));
  limit = Math.min(50, Math.max(1, Number(limit)));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort: sort === "asc" ? "asc" : "desc",
  };
}

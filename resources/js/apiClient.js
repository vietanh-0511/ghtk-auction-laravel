// Admin Management: Auctions
export function getAdminAuction() {
  return window.axiosApiInstance.get("/admin/auction");
}

export function createAdminAuction(data) {
  return window.axiosApiInstance.post("/admin/auction", data);
}

export function deleteAdminAuction(id) {
  return window.axiosApiInstance.delete(`/admin/auction/${id}`);
}

// User Management: Autions
export function getUser() {
  return window.axiosApiInstance.get("/admin/user");
}

export function createUser(data) {
  return window.axiosApiInstance.post("/admin/user", data);
}

export function deleteUser(id) {
  return window.axiosApiInstance.delete(`/admin/user/${id}`);
}

export function updateUser(id, data) {
  return window.axiosApiInstance.put(`/admin/user/${id}`, data);
}

// Product Management: Autions
export function getProduct() {
  return window.axiosApiInstance.get(`/admin/product`);
}

export function getProductById(id) {
  return window.axiosApiInstance.get(`/admin/product/${id}`);
}

export function createProduct(data) {
  return window.axiosApiInstance.post("/admin/product", data);
}

export function deleteProduct(id) {
  return window.axiosApiInstance.delete(`/admin/product/${id}`);
}

export function updateProduct(id, data) {
  return window.axiosApiInstance.put(`/admin/product/${id}`, data);
}
export function getProductnotinss(id, data) {
  return window.axiosApiInstance.get(`/admin/product-not-in-ss`, data);
}
export function deleteAsset(id) {
  return window.axiosApiInstance.delete(`/admin/asset/${id}`);
}

// Auctions Management: Autions
export function getAuction() {
  return window.axiosApiInstance.get(`/admin/auction`);
}

export function createAuction(data) {
  return window.axiosApiInstance.post("/admin/auction", data);
}

export function deleteAuction(id) {
  return window.axiosApiInstance.delete(`/admin/auction/${id}`);
}

export function updateAuction(id, data) {
  return window.axiosApiInstance.put(`/admin/auction/${id}`, data);
}

// Sessions Management: Autions
export function getSession() {
  return window.axiosApiInstance.get(`/admin/session`);
}

export function createSession(data) {
  return window.axiosApiInstance.post("/admin/session", data);
}

export function deleteSession(id) {
  return window.axiosApiInstance.delete(`/admin/session/${id}`);
}

export function updateSession(id, data) {
  return window.axiosApiInstance.put(`/admin/session/${id}`, data);
}

// Auction : User
export function getUserAuction() {
  return window.axiosApiInstance.get("/auction");
}

export function getUserAuctionById(id) {
  return window.axiosApiInstance.get(`/auction/${id}`);
}

// Session : User
export function getUserSessionById(id) {
  return window.axiosApiInstance.get(`/session/${id}`);
}

export function createBidBySessionId(data) {
  return window.axiosApiInstance.post(`/bid`, data);
}
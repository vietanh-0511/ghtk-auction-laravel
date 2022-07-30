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
  return window.axiosApiInstance.delete(`/admin/user/${id}`)
}

export function updateUser(id) {
  return window.axiosApiInstance.put(`/admin/user/${id}`)
}

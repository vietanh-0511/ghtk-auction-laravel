
// Admin Management: Auctions
export function getAdminAuction() {
  return window.axiosApiInstance.get('/admin/auction')
}

export function createAdminAuction(data) {
  return window.axiosApiInstance.post('/admin/auction', data)
}

export function deleteAdminAuction(id) {
  return window.axiosApiInstance.delete(`/admin/auction/${id}`)
}

// Admin User Management
export function getUser() {
  return window.axiosApiInstance.get('/admin/user')
}
import { client } from "../../utils/client";

export function storeCategory(category) {
  return client.post("/admin/categories", { ...category });
}

export function updateCategory(category) {
  return client.patch(`/admin/categories/${category.id}`, { ...category });
}

export function deleteCategory(category) {
    return client.delete(`/admin/categories/${category.id}`);
  }

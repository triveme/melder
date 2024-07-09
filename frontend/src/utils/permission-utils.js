/**
 *
 * @param {string} permissions
 * @param {string} permission
 * @returns {boolean}
 */
export function hasPermission(permissions, permission) {
  if (permissions === "none") {
    return false;
  } else if (!permissions || permissions === "") {
    return true;
  }

  return permissions.includes(permission);
}

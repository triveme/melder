/**
 * Checks if the user has the required permission to access a resource
 * and sends a 403 response if not.
 *
 * @param {Request} req - The request object with an added permissions property.
 * @param {Response} res - The response object.
 * @param {string} permission - The required permission to access the resource.
 * @returns {boolean} - Returns true if the user has the required permission, false otherwise.
 */
function ensurePermission(req, res, permission) {
  const hasPermission = req.permissions === "all" || req.permissions.includes(permission);

  if (!hasPermission) {
    res.status(403).send({
      message: "Fehlende Berechtigung",
    });
  }

  return hasPermission;
}

module.exports = { ensurePermission };

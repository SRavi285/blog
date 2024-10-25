const notFound = (req, res, next) => {
  res.status(404).json({ code: 404, message: "Api not found" })
}

module.exports = notFound;
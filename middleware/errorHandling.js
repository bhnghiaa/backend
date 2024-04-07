const erroHandler = (req, res, next, error) => {
    return res.status(500).json({staus: false, message: "Something went wrong"})
}

module.exports = erroHandler
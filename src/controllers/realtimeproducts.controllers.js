function realTimeProducts(req, res) {
    try {
    
        res.status(200).render("realTimeProducts", { js: "realTimeProducts.js", userData: req.session.user})

    } catch (error) {
        req.logger.error(`Error realTimeProducts: ${error}`);
    }
}

module.exports = {realTimeProducts}
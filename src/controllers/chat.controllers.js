function ChatView(req, res) {
    try {
    
        res.status(200).render("chat", { js: "chat.js"})

    } catch (error) {
        req.logger.error(`Error Chat: ${error}`);
    }
}

module.exports = {ChatView}
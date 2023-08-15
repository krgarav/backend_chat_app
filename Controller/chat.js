exports.postMessage = async (req, res) => {
    try {
        const enteredMessage = req.body.message;
        await req.user.createChat({ message: enteredMessage });
        res.status(200).json({ message: "Message stored successfully" });
    } catch (err) {
        res.status(500).json({ message: "Message storation failed" });
        console.log(err)
    }
}
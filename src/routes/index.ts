import express from "express";


const router = express.Router()

router.post('/fmt', (req, res) => {
    res.json({file1: "new string"});
})

export default router
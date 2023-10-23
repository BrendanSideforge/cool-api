"use strict";
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = new express_1.default.Router();
router.get('/', async (req, res) => {
    res.json({
        text: "HELLO VIETNAM"
    });
});
module.exports = router;

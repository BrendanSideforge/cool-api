"use strict";
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const Logger_1 = require("../utils/Logger");
const router = new express_1.default.Router();
router.post('/', async (req, res) => {
    const message = req.body.message;
    (0, Logger_1.write_to_logs)("svelte", message, true);
    res.json({
        success: true
    });
});
module.exports = router;

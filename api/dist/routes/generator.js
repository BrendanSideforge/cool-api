"use strict";
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = new express_1.default.Router();
router.post('/thumbnail', async (req, res) => {
    const object_thing = {
        name: "Brendan",
        lastname: "Sides",
    };
    res.json({
        result: object_thing
    });
});
module.exports = router;

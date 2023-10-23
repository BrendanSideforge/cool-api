
import express from "express";

import { write_to_logs } from "../utils/cache/Logger";

const router: express.Router = new express.Router();

router.post('/', async (req: express.Request, res: express.Response) => {

    const message: string = req.body.message;

    write_to_logs(
        "svelte",
        message,
        true
    );

    res.json({
        success: true
    })

});

export = router;


import express from "express";

const router: express.Router = new express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {

    res.json({
        text: "HELLO VIETNAM"
    });

});

export = router;

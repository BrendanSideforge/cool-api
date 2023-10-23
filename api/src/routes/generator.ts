
import express from "express";

const router: express.Router = new express.Router();

router.post('/thumbnail', async (req: express.Request, res: express.Response) => {

    const data: any = req.body;

    const object_thing: object = {
        name: "Brendan",
        lastname: "Sides",
    }

    res.json({
        result: object_thing
    });

});

export = router;

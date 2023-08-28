import { Router } from 'express';
const router = Router({mergeParams: true});

router.post('/', async (req, res) => {
    res.clearCookie("userSessionToken");
    res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
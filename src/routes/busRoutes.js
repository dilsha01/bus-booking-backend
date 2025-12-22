const express = require('express');
const { listBuses, getBus, createBus, updateBus, deleteBus } = require('../controllers/busController');

const router = express.Router();

router.get('/', listBuses);
router.get('/:id', getBus);
router.post('/', createBus);
router.put('/:id', updateBus);
router.delete('/:id', deleteBus);

module.exports = router;

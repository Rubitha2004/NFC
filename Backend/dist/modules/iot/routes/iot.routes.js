"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const iot_controller_1 = require("../controller/iot.controller");
const router = (0, express_1.Router)();
const ctrl = new iot_controller_1.IotController();
router.post('/scan', ctrl.handleScan.bind(ctrl));
router.get('/demo-data/:machineId', ctrl.getDemoData.bind(ctrl));
exports.default = router;

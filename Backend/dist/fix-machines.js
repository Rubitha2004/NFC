"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./config/prisma"));
async function main() {
    const machines = await prisma_1.default.machine.findMany({
        where: {
            roomId: { not: null },
            OR: [{ rowIndex: null }, { positionIndex: null }]
        }
    });
    for (const machine of machines) {
        if (!machine.roomId)
            continue;
        const room = await prisma_1.default.room.findUnique({ where: { id: machine.roomId } });
        if (!room)
            continue;
        const occupied = await prisma_1.default.machine.findMany({
            where: { roomId: room.id, id: { not: machine.id } },
            select: { rowIndex: true, positionIndex: true }
        });
        let r = 0;
        let p = 0;
        while (occupied.some((o) => o.rowIndex === r && o.positionIndex === p)) {
            p++;
            if (p >= room.machinesPerRow) {
                p = 0;
                r++;
            }
        }
        await prisma_1.default.machine.update({
            where: { id: machine.id },
            data: { rowIndex: r, positionIndex: p }
        });
        console.log('Fixed machine', machine.id, 'to row', r, 'pos', p);
    }
    console.log('Done');
}
main().catch(console.error).finally(() => process.exit(0));

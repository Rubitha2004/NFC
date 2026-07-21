CREATE UNIQUE INDEX one_active_assignment_per_worker
  ON assignments ("workerId")
  WHERE status = 'ACTIVE';

CREATE UNIQUE INDEX one_active_assignment_per_machine_per_shift
  ON assignments ("machineId", "shiftId")
  WHERE status = 'ACTIVE';

CREATE UNIQUE INDEX one_active_assignment_per_worker
  ON assignments (worker_id)
  WHERE status = 'ACTIVE';

CREATE UNIQUE INDEX one_active_assignment_per_machine_per_shift
  ON assignments (machine_id, shift_id)
  WHERE status = 'ACTIVE';

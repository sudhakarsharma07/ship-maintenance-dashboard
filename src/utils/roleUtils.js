export const ROLES = {
  ADMIN: 'Admin',
  INSPECTOR: 'Inspector',
  ENGINEER: 'Engineer',
};

export const canCreate = (user) => user?.role === ROLES.ADMIN;
export const canEdit = (user) => user?.role === ROLES.ADMIN;
export const canDelete = (user) => user?.role === ROLES.ADMIN;

export const canManageJobs = (user) => user?.role === ROLES.ADMIN || user?.role === ROLES.ENGINEER;
export const canAssignJobs = (user) => user?.role === ROLES.ADMIN;
export const canUpdateJobStatus = (user, job) => {
    if (!user) return false;
    if (user.role === ROLES.ADMIN) return true;
    if (user.role === ROLES.ENGINEER && job?.assignedEngineerId === user.id) return true;
    return false;
};

export const canViewAll = (user) => !!user;
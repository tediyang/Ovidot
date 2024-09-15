const Collections = {
  User: 'User',
  Cycle: 'Cycle',
  Email: 'Email',
  Admin: 'Admin'
};

const Role = {
  user: 'USER',
  admin: 'ADMIN',
  super_admin: 'SUPER ADMIN'
};

const emailStatus = {
  pending: 'PENDING',
  sent: 'SENT',
  failed: 'FAILED'
};

const emailType = {
  welcome: 'WELCOME',
  forget: 'FORGET',
  delete: 'DELETE',
  deactivate: 'DEACTIVATE'
};

const userStatus = {
  active: 'ACTIVE',
  deactivated: 'DEACTIVATED', // user action and admin
};

const userAction = {
  deletedCycle: "DELETED_CYCLE",
  resetPassword: "RESET_PASSWORD",
  createdCycle: "CREATED_CYCLE",
  updatedCycle: "UPDATED_CYCLE",
  updatedUser: "UPDATED_USER",
  createdUser: "CREATED_USER",
  deactivatedUser: "DEACTIVATED_USER",
}

const notificationStatus = {
  unread: 'UNREAD',
  read: 'READ'
};

const timeShare = {
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  minute: 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
};

module.exports = { 
  Role,
  Collections,
  emailStatus,
  emailType,
  userStatus,
  userAction,
  notificationStatus,
  timeShare
};

export enum Permission {
  // Authentication permissions
  CAN_LOG_IN = 'CAN_LOG_IN',
  CAN_CREATE_USER = 'CAN_CREATE_USER',
  CAN_DEACTIVATE_ACCOUNT = 'CAN_DEACTIVATE_ACCOUNT',

  // Roles permissions
  CAN_CREATE_ROLE = 'CAN_CREATE_ROLE',
  CAN_MODIFY_ROLE = 'CAN_MODIFY_ROLE',
  CAN_ASSIGN_ROLE = 'CAN_ASSIGN_ROLE',
  CAN_DELETE_ROLE = 'CAN_DELETE_ROLE',
  CAN_VIEW_ALL_ROLES = 'CAN_VIEW_ALL_ROLES',
  CAN_VIEW_ROLE = 'CAN_VIEW_ROLES',

  // Permissions manager permissions
  CAN_CREATE_PERMISSION = 'CAN_CREATE_PERMISSION',
  CAN_ASSIGN_PERMISSION = 'CAN_ASSIGN_PERMISSION',
  CAN_DELETE_PERMISSION = 'CAN_DELETE_PERMISSION',
  CAN_MODIFY_PERMISSION = 'CAN_MODIFY_PERMISSION',
  CAN_VIEW_ALL_PERMISSIONS = 'CAN_VIEW_ALL_PERMISSIONS',
  CAN_VIEW_PERMISSION = 'CAN_VIEW_PERMISSION',

  // User Profile permissions
  CAN_EDIT_PROFILE = 'CAN_EDIT_PROFILE',
  CAN_EDIT_USER = 'CAN_EDIT_USER',
  CAN_VIEW_USER_PROFILE = 'CAN_VIEW_USER_PROFILE',
  CAN_VIEW_ALL_USER_PROFILE = 'CAN_VIEW_ALL_USER_PROFILE',
  CAN_ACTIVATE_USER = 'CAN_ACTIVATE_USER',

  // Password manager permissions
  CAN_RESET_PASSWORD = 'CAN_RESET_PASSWORD',
  CAN_RESET_USER_PASSWORD = 'CAN_RESET_USER_PASSWORD',
}

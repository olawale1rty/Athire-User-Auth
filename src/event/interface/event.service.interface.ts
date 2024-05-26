export interface EventServiceInterface {
  loadUserInfo(key: string, data: any);

  updateUserInfo(key: string, data: any);

  deleteUserInfo(key: string);
}

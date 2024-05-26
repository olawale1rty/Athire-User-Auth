export interface RedisServiceInterface {
  get(key: string);

  set(key: string, value: Record<string, unknown>);

  del(key: string);
}

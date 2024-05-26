export const arrayRemove = (arr: any[], value: any) => {
  return arr.filter((ele) => {
    return ele != value;
  });
};

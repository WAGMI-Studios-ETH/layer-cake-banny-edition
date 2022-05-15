export const getArrayMutations = (arr: any[], perms: any[] | undefined = [], len: number = arr.length) => {
  if (len === 1) perms.push(arr.slice(0));
  for (let i = 0; i < len; i++) {
    getArrayMutations(arr, perms, len - 1);
    len % 2 // parity dependent adjacent elements swap
      ? ([arr[0], arr[len - 1]] = [arr[len - 1], arr[0]])
      : ([arr[i], arr[len - 1]] = [arr[len - 1], arr[i]]);
  }
  return perms;
};

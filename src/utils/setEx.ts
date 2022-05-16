export const setUnion = (...iterables: any) => {
  const set = new Set();
  for (const iterable of iterables) {
    for (const item of iterable) {
      set.add(item);
    }
  }
  return set;
};

export class SetEx extends Set {
  ['constructor']: typeof SetEx;

  constructor(...iterables: any[]) {
    super();
    this.merge(...iterables);
  }

  merge(...iterables: any[]) {
    for (const iterable of iterables) {
      for (const item of iterable) this.add(item);
    }
    return this;
  }

  union(...sets: any[]) {
    const newSet = new this.constructor(...sets);
    newSet.merge(this);
    return newSet;
  }

  intersect(target: any) {
    const newSet = new this.constructor();
    for (const item of this) {
      if (target.has(item)) newSet.add(item);
    }
    return newSet;
  }

  diff(target: any) {
    const newSet = new this.constructor();
    for (const item of this) {
      if (!target.has(item)) newSet.add(item);
    }
    return newSet;
  }

  sameItems(target: any) {
    let tsize;
    if ('size' in target) {
      tsize = target.size;
    } else if ('length' in target) {
      tsize = target.length;
    } else {
      throw new TypeError('target must be an iterable like a Set with .size or .length');
    }
    if (tsize !== this.size) return false;
    for (const item of target) {
      if (!this.has(item)) return false;
    }
    return true;
  }
}

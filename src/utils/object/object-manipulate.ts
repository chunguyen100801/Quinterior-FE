export function mergeDiffObject<
  Obj1 extends Record<string, unknown>,
  Obj2 extends Record<string, unknown>,
>(a: Obj1, b: Obj2): Obj1 & Obj2 {
  const result = { ...a, ...b };
  return result as Obj1 & Obj2;
}

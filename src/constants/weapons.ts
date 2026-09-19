export const WEAPONS = [
  '突击步枪',
  '冲锋枪',
  '狙击步枪',
  '射手步枪',
  '轻机枪',
  '霰弹枪',
  '手枪',
] as const

export type Weapon = (typeof WEAPONS)[number]

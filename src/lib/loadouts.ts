import { supabase } from './supabase'

export interface Loadout {
  id: string
  user_id: string
  name: string
  code: string
  weapon: string
  note: string | null
  created_at: string
  updated_at: string
}

export type LoadoutInput = Pick<Loadout, 'name' | 'code' | 'weapon' | 'note'>

function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message)
  if (data === null) throw new Error('数据库没有返回数据')
  return data
}

export async function listLoadouts(): Promise<Loadout[]> {
  const { data, error } = await supabase
    .from('loadouts')
    .select('*')
    .order('created_at', { ascending: false })
  return unwrap(data, error)
}

export async function createLoadout(input: LoadoutInput): Promise<Loadout> {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) throw new Error('尚未登录')

  const { data, error } = await supabase
    .from('loadouts')
    .insert({ ...input, user_id: userData.user.id })
    .select()
    .single()
  return unwrap(data, error)
}

export async function updateLoadout(id: string, input: LoadoutInput): Promise<Loadout> {
  const { data, error } = await supabase
    .from('loadouts')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  return unwrap(data, error)
}

export async function deleteLoadout(id: string): Promise<void> {
  const { error } = await supabase.from('loadouts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

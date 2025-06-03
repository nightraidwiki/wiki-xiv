import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from 'nuxt/app'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string
  )

  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Articles
  const getArticles = async (options: { visible?: boolean } = {}) => {
    let query = supabase
      .from('articles')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false })

    if (typeof options.visible === 'boolean') {
      query = query.eq('visible', options.visible)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  const getArticle = async (id: string) => {
    const { data, error } = await supabase
      .from('articles')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  const createArticle = async (article: any) => {
    const { data, error } = await supabase
      .from('articles')
      .insert(article)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const updateArticle = async (id: string, article: any) => {
    const { data, error } = await supabase
      .from('articles')
      .update(article)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const deleteArticle = async (id: string) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Categories
  const getCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  }

  const getCategory = async (id: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  const createCategory = async (category: any) => {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const updateCategory = async (id: string, category: any) => {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  return {
    supabase,
    getCurrentUser,
    signIn,
    signOut,
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
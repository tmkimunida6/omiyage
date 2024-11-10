import { FieldMetadata } from '@conform-to/react'

export type FormFieldType = {
  fields: Record<string, FieldMetadata>
}

export type UserType = {
  alias_id: number
  name: string
  email: string
  isSignedIn?: boolean
}

export type CategoryType = {
  id: number | ''
  name: string
}

export type CategoriesType = CategoryType & {
  children: Array<CategoriesType>
}

export type SouvenirCardType = {
  alias_id: number | ''
  name: string
  image_url: string
  post: PostType
}

export type SouvenirType = {
  alias_id: number
  name: string
  description: string
  image_url: string
  user: UserType
  categories: CategoriesType
  post: PostType
}

export type PagesType = {
  current_page: number
  total_pages: number
  next_page: number | null
  prev_page: number | null
}

export type PostType = {
  alias_id: number
  rating: string | null
  for_who: string | null
  age: string | null
  review: string | null
  image_url: string | null
  user: UserType
  souvenir: SouvenirType
}

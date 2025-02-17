/* eslint @typescript-eslint/no-explicit-any: 0 */

'use server'

import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'
import { uploadImageAction } from './uploadImageAction'
import { apiBaseUrl } from '@/constants/apiBaseUrl'
import { newSouvenirSchema } from '@/schemas/souvenirSchema'
import { getUserTokens } from '@/utils/getUserTokens'

export async function createSouvenirAction(
  prevState: unknown,
  formData: FormData,
) {
  const submission = parseWithZod(formData, {
    schema: newSouvenirSchema,
  })

  if (submission.status !== 'success') {
    return submission.reply({
      formErrors: [
        'サーバーエラーが発生しました。時間をおいてから再度お試しください。',
      ],
    })
  }

  const name = formData.get('souvenir_name')
  const category_id = formData.get('category_id')
  const description = formData.get('souvenir_description')
  const imageFile = String(formData.get('image'))

  const tokens = await getUserTokens()
  if (!tokens) {
    return submission.reply({
      formErrors: ['ログインしてください。'],
    })
  }

  let data
  try {
    // 画像をCloudinaryにアップロード
    const uploadResult = await uploadImageAction(imageFile, 'souvenir')
    const image_url = uploadResult.secure_url

    // DBにデータ送信
    const res = await fetch(`${apiBaseUrl}/souvenirs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': tokens.accessToken,
        client: tokens.client,
        uid: tokens.uid,
      },
      body: JSON.stringify({ name, category_id, description, image_url }),
    })

    data = await res.json()
    if (!res.ok) {
      return submission.reply({
        formErrors: data.errors || [
          'サーバーエラーが発生しました。時間をおいてから再度お試しください。',
        ],
      })
    }
  } catch (error: any) {
    const message = error.message
      ? error.message
      : 'サーバーエラーが発生しました。時間をおいてから再度お試しください。'
    return submission.reply({
      formErrors: [message],
    })
  }
  redirect(`/souvenir/complete/?souvenir=${data.alias_id}`)
}

/* eslint-disable react-hooks/exhaustive-deps */

'use client'

import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import CustomModal from '../modal/CustomModal'
import SearchForm from './SearchForm'
import { createPostAction } from '@/actions/createPostAction'
import SubmitButton from '@/components/atoms/SubmitButton'
import RatingSlider from '@/components/molecules/RatingSlider'
import UploadImageForm from '@/components/molecules/UploadImageForm'
import { ageOptions, forWhoOptions } from '@/constants/options'
import { postSchema } from '@/schemas/postSchema'
import { useSouvenirStore } from '@/store/store'

const PostForm = () => {
  const [lastResult, action] = useFormState(createPostAction, undefined)
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: postSchema })
    },
  })

  // モーダル
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleSouvenirModal = () => {
    onOpen()
  }

  // お土産グローバルステート
  const { selectedSouvenir } = useSouvenirStore()

  // フォーム送信後の処理
  const toast = useToast()
  useEffect(() => {
    if (!lastResult) return
    if (lastResult.status === 'success') {
      toast({
        title: '記録が完了しました。',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      redirect('/timeline')
    }
  }, [lastResult])

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
      {form.errors && (
        <Alert status="error" my={4} borderRadius={4}>
          <AlertIcon />
          <AlertDescription>{form.errors[0]}</AlertDescription>
        </Alert>
      )}
      <Stack spacing={6}>
        <FormControl isRequired isInvalid={!!fields.souvenir_id.errors}>
          <Input
            type="hidden"
            readOnly
            name={fields.souvenir_id.name}
            value={selectedSouvenir.alias_id}
          />
          <InputGroup size="md">
            <Input
              placeholder="お土産を選択"
              size="md"
              name={fields.souvenir_name.name}
              value={selectedSouvenir.name}
              readOnly
              pr={10}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                variant="secondary"
                onClick={handleSouvenirModal}
              >
                検索
              </Button>
            </InputRightElement>
            <CustomModal
              isOpen={isOpen}
              onClose={onClose}
              modalTitle="お土産を探す"
              buttonText={selectedSouvenir.alias_id ? '確定する' : ''}
              size="lg"
            >
              <SearchForm page="post" />
            </CustomModal>
          </InputGroup>
          <FormErrorMessage>{fields.souvenir_id.errors}</FormErrorMessage>
        </FormControl>
        <Stack spacing={1}>
          <Heading as="h2" fontSize="md">
            レビュー
          </Heading>
          <RatingSlider />
          <HStack spacing={1} mt={3}>
            <Select placeholder="誰に？" size="sm" name={fields.for_who.name}>
              {forWhoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select placeholder="年齢層" size="sm" name={fields.age.name}>
              {ageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </HStack>
          <Textarea placeholder="感想を記入" name={fields.review.name} />
        </Stack>
        <UploadImageForm />
        <SubmitButton>記録する</SubmitButton>
      </Stack>
    </form>
  )
}

export default PostForm

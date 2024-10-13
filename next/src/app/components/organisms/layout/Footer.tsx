import { Link as ChakraLink } from '@chakra-ui/next-js'
import { Box, HStack, VStack } from '@chakra-ui/react'
import Logo from '/public/images/logo.svg'
import NextLink from 'next/link'
import { forwardRef } from 'react'

const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <Box as="footer" ref={ref} position='relative' zIndex={11}>
      <VStack p={4} bg="brand.secondary">
        <HStack spacing={4}>
          <ChakraLink as={NextLink} href="#" fontSize="xs" color="brand.brown">
            リンク
          </ChakraLink>
          <ChakraLink as={NextLink} href="#" fontSize="xs" color="brand.brown">
            リンクx
          </ChakraLink>
          <ChakraLink as={NextLink} href="#" fontSize="xs" color="brand.brown">
            リンク
          </ChakraLink>
        </HStack>
        <Logo />
      </VStack>
    </Box>
  )
})

export default Footer

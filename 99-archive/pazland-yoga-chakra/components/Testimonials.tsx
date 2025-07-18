'use client'

import { Avatar, Box, Stack, Text, useColorModeValue } from '@chakra-ui/react'

export default function WithLargeQuote() {
  return (
    <Stack
      bg={useColorModeValue('gray.50', 'gray.800')}
      py={16}
      px={8}
      spacing={{ base: 8, md: 10 }}
      align={'center'}
      direction={'column'}>
      <Text fontSize={{ base: 'xl', md: '2xl' }} textAlign={'center'} maxW={'3xl'}>
      Yoga is when every cell of the body sings the song of the soul. The light that yoga sheds on life is something special. It is transformative. 
      It does not change the way we see things; it transforms the person who sees. 
      </Text>
      <Box textAlign={'center'}>
        <Avatar
          src={
            './iyengar.png'
          }
          mb={2}
        />

        <Text fontWeight={600}>BKS Iyengar</Text>
        <Text fontSize={'sm'} color={useColorModeValue('gray.400', 'gray.400')}>
          Senior Teacher, Author and Inspirational Yogi
        </Text>
      </Box>
    </Stack>
  )
}
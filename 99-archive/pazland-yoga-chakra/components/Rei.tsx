import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import {
  VStack,
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon
} from '@chakra-ui/react';

type FormData = {
  address: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    address: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<'error' | 'success' | ''>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://l9n92ek3b1.execute-api.us-east-1.amazonaws.com/address', formData);
      if (response.status === 200) {
        setResponseMessage('Success: Response code 200');
        setResponseStatus('success');
      } else {
        setResponseMessage(`Error: Response code ${response.status}`);
        setResponseStatus('error');
      }
    } catch (error) {
      setResponseMessage('Error: Unable to submit form');
      setResponseStatus('error');
    }
  };

  return (
    <VStack align="center" justify="center" height="100vh">
      <Box p={5} shadow="md" borderWidth="1px" width="lg">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="address">Address</FormLabel>
              <Input id="address" name="address" type="text" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="first_name">First Name</FormLabel>
              <Input id="first_name" name="first_name" type="text" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="last_name">Last Name</FormLabel>
              <Input id="last_name" name="last_name" type="text" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" name="email" type="email" onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <Input id="phone" name="phone" type="text" onChange={handleChange} />
            </FormControl>
          </VStack>
          <Button mt={4} colorScheme="blue" type="submit">Submit</Button>
        </form>
        {responseMessage && (
          <Alert status={responseStatus === 'error' ? 'error' : 'success'} mt={4}>
            <AlertIcon />
            {responseMessage}
          </Alert>
        )}
      </Box>
    </VStack>
  );
}


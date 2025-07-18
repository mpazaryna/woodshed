'use client'

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

type FormData = {
  address: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    address: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://l9n92ek3b1.execute-api.us-east-1.amazonaws.com/address', formData);
      if(response.status === 200) {
        setResponseMessage('Success: Response code 200');
      } else {
        setResponseMessage(`Error: Response code ${response.status}`);
      }
    } catch (error) {
      setResponseMessage('Error: Unable to submit form');
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} />
        <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

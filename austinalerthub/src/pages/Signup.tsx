// src/pages/Signup.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button} from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<any>()

  const onSubmit = async (data: any) => {
    try {
      await signup(data)
      navigate('/')
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 mx-auto max-w-md">
      <h2 className="text-xl mb-4">Sign Up</h2>
      <Input {...register('email')} placeholder="Email" type="email" />
      <Input {...register('password')} placeholder="Password" type="password" />
      <Input {...register('first_name')} placeholder="First Name" />
      <Input {...register('last_name')} placeholder="Last Name" />
      <Input {...register('phone_number')} placeholder="Phone Number" />
      <Button type="submit">Sign Up</Button>
    </form>
  )
}

// src/pages/Login.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<{ email: string; password: string }>()

  const onSubmit = async (data: any) => {
    try {
      await login(data)
      navigate('/')
    } catch (e) {
      alert((e as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 mx-auto max-w-md">
      <h2 className="text-xl mb-4">Log In</h2>
      <Input {...register('email')} placeholder="Email" type="email" />
      <Input {...register('password')} placeholder="Password" type="password" />
      <Button type="submit">Log In</Button>
    </form>
  )
}

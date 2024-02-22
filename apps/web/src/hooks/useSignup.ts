import { AuthService } from '@/services/auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useSignup() {
  const { mutate, isPending } = useMutation({
    mutationFn: AuthService.signup,
    onError(error) {
      toast(error.response?.data.message || 'An error occurred')
    },
  })

  return {
    signup: mutate,
    isLoading: isPending,
  }
}

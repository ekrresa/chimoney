import { queryOptions, useQuery } from '@tanstack/react-query'
import { UserService } from '@/services/profile'

const profileQueryOptions = queryOptions({
  queryKey: ['profile'],
  queryFn: () => UserService.getUserProfile(),
  staleTime: 1000 * 60 * 60,
})

export function useGetProfile() {
  return useQuery(profileQueryOptions)
}

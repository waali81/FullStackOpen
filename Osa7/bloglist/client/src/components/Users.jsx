import { useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import useUsersStore from '../stores/usersStore'

const Users = () => {
  const users = useUsersStore((state) => state.users)
  const fetchUsers = useUsersStore((state) => state.fetchUsers)

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Users
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Blogs created</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default Users

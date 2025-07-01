// app/test/components/UsersList.tsx
export default function UsersList({ users }: { users: any[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.email} - Role: {user.role} - Created at:{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </li>
      ))}
    </ul>
  );
}

// app/test/components/UsersList.tsx
interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string; // эсвэл Date гэдгийг мэдэхгүй бол түр `string` гэж өгч болно
}

export default function UsersList({ users }: { users: User[] }) {
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

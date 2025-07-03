// app/test/page.tsx
"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import UsersList from "./components/UserList";
import TestForm from "@/components/TestForm";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      role
      createdAt
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      id
      email
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(GET_USERS);
  const [createUser, { loading: mutationLoading, error: mutationError }] =
    useMutation(CREATE_USER, {
      refetchQueries: [{ query: GET_USERS }],
      awaitRefetchQueries: true,
    });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <UsersList users={data.users} />
      <button
        onClick={() =>
          createUser({
            variables: { email: "new@user.com", password: "secret" },
          })
        }
        disabled={mutationLoading}
        className="mt-4 p-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {mutationLoading ? "Creating..." : "Create User"}
      </button>
      {mutationError && (
        <p className="text-red-600 mt-2">Error: {mutationError.message}</p>
      )}
      <TestForm />
    </div>
  );
}

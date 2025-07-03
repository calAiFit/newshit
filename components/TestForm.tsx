"use client";
import { useState } from "react";

export default function TestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation CreateTestUser($name: String!, $email: String!) {
            createTestUser(name: $name, email: $email) {
              id
              name
              email
            }
          }`,
        }),
      });

      const data = await response.json();
      if (data.errors) {
        setMessage("Error submitting data: " + data.errors[0].message);
      } else {
        setMessage("Data submitted successfully!");
        setName("");
        setEmail("");
      }
    } catch (error) {
      setMessage("Error submitting data");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 opacity-50">
      <h2 className="text-2xl font-bold mb-4">Test Data Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-not-allowed"
        >
          Submit
        </button>
      </form>
      {message && (
        <p className="mt-4 text-sm text-red-500">Form is currently disabled</p>
      )}
    </div>
  );
}

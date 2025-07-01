"use client";

import { ApolloProvider } from "@apollo/client";
import { ClerkProvider } from "@clerk/nextjs";
import client from "../lib/apolloClient";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ClerkProvider>
  );
}

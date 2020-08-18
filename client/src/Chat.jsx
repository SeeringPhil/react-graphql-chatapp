import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useQuery, gql } from "@apollo/client";

import { DateTime } from "luxon";


const MESSAGES_QUERY = gql`
  query {
    messages {
      content
      user
      id
      at
    }
  }
`;


const client = new ApolloClient({
    uri: "http://localhost:4000/",
    cache: new InMemoryCache(),
});

const Chat = () => {
    const { loading, error, data } = useQuery(MESSAGES_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :( </p>;
    if (data.messages.length === 0) return <p>No messages have been exchanged yet</p>


    return data.messages.map(({ id, user, content, at }) => (
        <div key={id}>
            <p>
                {user} a écrit: <i>{content}</i>
                <br/><b title={DateTime.fromMillis(at).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}>{DateTime.fromMillis(at).toRelative()}</b>
            </p>
        </div>
    ));
};

export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
);

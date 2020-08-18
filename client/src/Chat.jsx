import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useQuery, gql } from "@apollo/client";

import { DateTime } from "luxon";

import {
    Container
} from 'shards-react'

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


const Messages = ({ user }) => {
    const { loading, data, error } = useQuery(MESSAGES_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :( </p>;

    if (!data) return null
    if (data.messages.length === 0) return <p>No messages have been exchanged yet</p>

    return (
        <>
            {data.messages.map(({ id, user: messageUser, content, at }) => (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: user === messageUser ? 'flex-end' : 'flex-start',
                        paddingTop: ".5em",
                    }}
                    title={DateTime.fromMillis(at).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}
                >

                    {user !== messageUser && (
                        <div
                            style={{
                                height: 50,
                                width: 50,
                                marginRight: "0.5em",
                                border: "2px solid #e5e6ea",
                                borderRadius: 25,
                                textAlign: "center",
                                fontSize: "18pt",
                                paddingTop: 5,
                            }}
                        >
                            {messageUser.slice(0, 2).toUpperCase()}
                        </div>

                    )}

                    <div
                        style={{
                            background: user === messageUser ? "#58bf56" : "#e5e6ea",
                            color: user === messageUser ? "white" : "black",
                            padding: '1em',
                            borderRadius: "1em",
                            maxWidth: "60%",
                            paddingTop: "0.1em",
                        }}>
                        {content}

                        <p style = {{
                            textAlign: user === messageUser ? "right" : "left",
                            fontSize: "8pt",
                            marginBottom: 0,
                            marginTop: 0
                        }}>
                            {DateTime.fromMillis(at).toRelative()}
                        </p>

                    </div>
                </div>
            ))}
        </>
    )
}

const Chat = () => {
    return (
        <Container>
            <Messages user="Philippe" />
        </Container>
    )
};

export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
);

import React from "react";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useQuery, gql } from "@apollo/client";

import { DateTime } from "luxon";

import {
    Container
} from 'shards-react'


const styles = {
    circleAvatar: {
        height: 50,
        width: 50,
        marginRight: "0.5em",
        border: "2px solid #e5e6ea",
        borderRadius: 25,
        textAlign: "center",
        fontSize: "18pt",
        paddingTop: 5,
    },
    messageBox: (user, messageUser) => {
        return {
            display: 'flex',
            justifyContent: user === messageUser ? 'flex-end' : 'flex-start',
            paddingTop: ".5em",
        }
    },
    messageBorder: (user, messageUser) => {
        return {
            background: user === messageUser ? "#58bf56" : "#e5e6ea",
            color: user === messageUser ? "white" : "black",
            padding: '1em',
            borderRadius: "1em",
            maxWidth: "60%",
            paddingTop: "0.5em",
            paddingBottom: "0.5em"
        }
    },
    dateTimeDisplayal: (user, messageUser) => {
        return {
            textAlign: user === messageUser ? "right" : "left",
            fontSize: "8pt",
            marginBottom: 0,
            marginTop: 0
        }
    }
}

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
    const { data } = useQuery(MESSAGES_QUERY);

    if (!data) return null
    if (data.messages.length === 0) return <p>No messages have been exchanged yet</p>

    return (
        <>
            {data.messages.map(({ id, user: messageUser, content, at }) => (
                <div style={styles.messageBox(user, messageUser)} title={DateTime.fromMillis(at).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)}>

                    {user !== messageUser && (
                        <div style={styles.circleAvatar}>
                            {messageUser.slice(0, 2).toUpperCase()}
                        </div>

                    )}

                    <div style={styles.messageBorder(user, messageUser)}>
                        {content}

                        <p style={styles.dateTimeDisplayal(user, messageUser)}>
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

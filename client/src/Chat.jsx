import React from "react";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useSubscription, useMutation, gql } from "@apollo/client";

import { DateTime } from "luxon";

import { WebSocketLink} from '@apollo/client/link/ws'

import {
    Container, Row, Col, FormInput, Button
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
  subscription {
    messages {
      content
      user
      id
      at
    }
  }
`;

const MUTATION_POST_MESSAGE = gql`
    mutation($user:String!, $content:String!) {
        postMessage(user:$user, content: $content)
    }
`;


const link = new WebSocketLink({
    uri: `ws://localhost:4000/`,
    options: {
        reconnect: true
    }
})

const client = new ApolloClient({
    link,
    uri: "http://localhost:4000/",
    cache: new InMemoryCache(),
});


const Messages = ({ user }) => {
    const { data } = useSubscription(MESSAGES_QUERY);

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

    const [state, stateSet] = React.useState({
        user: 'Philippe',
        content: "",
    })

    const [postMessage] = useMutation(MUTATION_POST_MESSAGE)

    const onSend = () => {
        if (state.content.length > 0) {
            postMessage({
                variables: state,
            })
        }
        stateSet({
            ...state,
            content: ""
        })
    }

    return (
        <Container>
            <Messages user={state.user} />

            <Row style={{ marginTop: "1em", marginBottom: "1em" }}>
                <Col xs={2} style={{ padding: 0 }}>
                    <FormInput
                        label="User"
                        value={state.user}
                        onChange={(evt) => stateSet({
                            ...state,
                            user: evt.target.value,
                        })} />
                </Col>

                <Col xs={8}>
                    <FormInput
                        label="Content"
                        value={state.content}
                        onChange={(evt) => stateSet({
                            ...state,
                            content: evt.target.value,
                        })}
                        onKeyUp={(evt) => {
                            if (evt.keyCode === 13) {
                                onSend()
                            }
                        }}
                    />
                </Col>

                <Col xs={2}>
                    <Button onClick={() => onSend()} style={{ width: "100%" }} >
                        Send
                    </Button>
                </Col>

            </Row>
        </Container>
    )
};

export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
);

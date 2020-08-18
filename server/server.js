const { GraphQLServer } = require("graphql-yoga");

const messages = [];

const typeDefs = `

    scalar DateTime

    type Message {
        id: ID!
        user: String!
        content: String!
        at: DateTime!
    }

    type Query {
        messages: [Message!]
    }

    type Mutation {
        postMessage(user: String!, content: String!): ID!
    }

`;

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (parent, { user, content }) => {
      const id = messages.length;
      const at = Date.now();
      messages.push({
        id,
        user,
        content,
        at,
      });
      return id;
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}`);
});

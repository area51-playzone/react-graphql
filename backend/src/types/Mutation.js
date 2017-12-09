const {
  GraphQLObjectType,
  GraphQLNonNUll,
  GraphQLString,
  GraphQLID
} = require("graphql");

const { mutationWithClientMutationId } = require("graphql-relay");
const {Post} = require("./Post");

const PostModel = require("../model/Post");

const CreatePostMutation = mutationWithClientMutationId({
  name: "CreatePost",
  inputFields: {
    title: { type: new GraphQLNonNull(GraphQLString)},
    content: { type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    post: {
      type: Post
    }
  },
  mutateAndGetPayload: args => {
    return new Promise((resolve, reject) => {
      PostModel.createPost({
        title: args.title,
        content: args.content
      })
      .then(post => resolve({ post }))
      .catch(reject);

    });
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Mutation interface for our blog",
  fields: {
    createPost: {
      type: Post,
      args: {
        title: {
          type: GraphQLString,
          description: "Title of the post"
        },
        content: {
          type: GraphQLString,
          description: "Content of the post"
        }
      },
      resolve: (_, args) => {
        return PostModel.createPost({
          title: args.title,
          content: args.content
        });
      }
    }
  }
});

module.exports = Mutation;
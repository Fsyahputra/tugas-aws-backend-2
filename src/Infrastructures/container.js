/* istanbul ignore file */

const { createContainer } = require("instances-container");

// external agency
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const Jwt = require("@hapi/jwt");
const pool = require("./database/postgres/pool");

// service (repository, helper, manager, etc)
const UserRepository = require("../Domains/users/UserRepository");
const PasswordHash = require("../Applications/security/PasswordHash");
const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres");
const BcryptPasswordHash = require("./security/BcryptPasswordHash");

// use case
const AddUserUseCase = require("../Applications/use_case/AddUserUseCase");
const AuthenticationTokenManager = require("../Applications/security/AuthenticationTokenManager");
const JwtTokenManager = require("./security/JwtTokenManager");
const LoginUserUseCase = require("../Applications/use_case/LoginUserUseCase");
const AuthenticationRepository = require("../Domains/authentications/AuthenticationRepository");
const AuthenticationRepositoryPostgres = require("./repository/AuthenticationRepositoryPostgres");
const LogoutUserUseCase = require("../Applications/use_case/LogoutUserUseCase");
const RefreshAuthenticationUseCase = require("../Applications/use_case/RefreshAuthenticationUseCase");
const CommentRepository = require("../Domains/comment/commentRepository");
const CommentRepositoryPostgres = require("./repository/commentRepository");
const AddThreadUseCase = require("../Applications/thread/addThreadUseCase");
const ThreadRepository = require("../Domains/thread/ThreadRepository");
const ThreadRepositoryPostgres = require("./repository/threadRepository");
const ReplyRepository = require("../Domains/replies/replyRepository");
const ReplyRepositoryPostgres = require("./repository/replyRepository");
const AddCommentUseCase = require("../Applications/thread/addCommentUseCase");
const DeleteCommentUseCase = require("../Applications/thread/deleteCommentUseCase");
const AddRepylUseCase = require("../Applications/reply/addReplyUseCase");
const DeleteReplyUseCase = require("../Applications/reply/deleteReplyUseCase");
const GetDetailThreadUseCase = require("../Applications/thread/getDetailThread");
// creating container
const container = createContainer();
// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      injectType: "parameter",
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      injectType: "parameter",
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: ReplyRepository.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      injectType: "parameter",
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "authenticationRepository",
          internal: AuthenticationRepository.name,
        },
        {
          name: "authenticationTokenManager",
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
]);

//Registering Thread UseCase

container.register([
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: "parameter",
      dependencies: [
        {
          internal: ThreadRepository.name,
        },
        {
          internal: AuthenticationTokenManager.name,
        },
        {
          internal: UserRepository.name,
        },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: "parameter",
      dependencies: [
        {
          internal: AuthenticationTokenManager.name,
        },
        {
          internal: CommentRepository.name,
        },
        {
          internal: UserRepository.name,
        },
        {
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: "parameter",
      dependencies: [
        {
          internal: AuthenticationTokenManager.name,
        },
        {
          internal: UserRepository.name,
        },
        {
          internal: CommentRepository.name,
        },
        {
          internal: ThreadRepository.name,
        },
      ],
    },
  },
  {
    key: GetDetailThreadUseCase.name,
    Class: GetDetailThreadUseCase,
    parameter: {
      injectType: "parameter",
      dependencies: [
        { internal: UserRepository.name },
        { internal: CommentRepository.name },
        { internal: ThreadRepository.name },
        { internal: ReplyRepository.name },
      ],
    },
  },
]);

// Registering reply useCase

container.register([
  {
    key: AddRepylUseCase.name,
    Class: AddRepylUseCase,
    parameter: {
      injectType: "parameter",
      dependencies: [
        {
          internal: ThreadRepository.name,
        },
        {
          internal: UserRepository.name,
        },
        {
          internal: CommentRepository.name,
        },
        {
          internal: AuthenticationTokenManager.name,
        },
        {
          internal: ReplyRepository.name,
        },
      ],
    },
  },

  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: "parameter",
      dependencies: [
        {
          internal: UserRepository.name,
        },
        {
          internal: ThreadRepository.name,
        },
        {
          internal: CommentRepository.name,
        },
        {
          internal: ReplyRepository.name,
        },
        {
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
]);

module.exports = container;

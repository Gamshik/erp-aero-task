import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { TokenRepository, UserRepository } from "@db";
import { authMiddleware, validateMiddleware } from "@middlewares";
import {
  AuthController,
  AuthFacade,
  LoginUseCase,
  registerSchema,
  RegisterUseCase,
  PasswordHashingService,
  TokensService,
  RegisterValidator,
  CreateTokensUseCase,
  RefreshTokensUseCase,
  loginSchema,
  LogoutUseCase,
} from "@auth";
import { CreateUseCase, UserFacade } from "@user";

export function createApp() {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(cookieParser());

  // --- ИНИЦИАЛИЗАЦИЯ ЗАВИСИМОСТЕЙ (DI) ---

  const userRepository = new UserRepository();
  const tokenRepository = new TokenRepository();

  const createUseCase = new CreateUseCase(userRepository);

  const userFacade = new UserFacade(userRepository, createUseCase);

  const registerValidator = new RegisterValidator(userRepository);

  const tokensService = new TokensService();
  const passwordHashingService = new PasswordHashingService();

  const createTokensUseCase = new CreateTokensUseCase(
    tokenRepository,
    tokensService,
  );
  const loginUseCase = new LoginUseCase(userFacade, passwordHashingService);
  const registerUseCase = new RegisterUseCase(
    userFacade,
    passwordHashingService,
    registerValidator,
  );
  const refreshTokensUseCase = new RefreshTokensUseCase(
    tokenRepository,
    createTokensUseCase,
  );
  const logoutUseCase = new LogoutUseCase(tokenRepository);

  const authFacade = new AuthFacade(
    loginUseCase,
    registerUseCase,
    createTokensUseCase,
    refreshTokensUseCase,
    logoutUseCase,
  );

  const authController = new AuthController(authFacade);

  // --- РОУТЫ ---

  app.post("/signin", validateMiddleware(loginSchema), authController.login);
  app.post("/signin/new_token", authController.refresh);
  app.post(
    "/signup",
    validateMiddleware(registerSchema),
    authController.register,
  );

  app.get("/info", authMiddleware(tokenRepository), authController.info);
  app.get("/logout", authMiddleware(tokenRepository), authController.logout);

  return app;
}

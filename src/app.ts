import express from "express";
import cors from "cors";
import { TokenRepository, UserRepository } from "@db";
import { validateMiddleware } from "@middlewares";
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
} from "@auth";
import { CreateUseCase, UserFacade } from "@user";

export function createApp() {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json());

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

  const authFacade = new AuthFacade(
    loginUseCase,
    registerUseCase,
    createTokensUseCase,
  );

  const authController = new AuthController(authFacade);

  // --- РОУТЫ ---

  app.post(
    "/signup",
    validateMiddleware(registerSchema),
    authController.register,
  );
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}

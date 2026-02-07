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
import { FileRepository, TokenRepository, UserRepository } from "@db";
import {
  DeleteFileUseCase,
  FileController,
  FileFacade,
  FileMapper,
  GetFileInfoUseCase,
  GetFileListUseCase,
  UpdateFileUseCase,
  UploadFileUseCase,
} from "@file";
import { FileStorageService } from "@file-storage";
import { authMiddleware, validateMiddleware } from "@middlewares";
import { upload } from "@multer";
import { CreateUseCase, UserFacade } from "@user";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

export function createApp() {
  const app = express();

  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(cookieParser());

  // --- ИНИЦИАЛИЗАЦИЯ ЗАВИСИМОСТЕЙ (DI) ---

  const userRepository = new UserRepository();
  const tokenRepository = new TokenRepository();

  const userFacade = new UserFacade(
    userRepository,
    new CreateUseCase(userRepository),
  );

  const passwordHashingService = new PasswordHashingService();

  const createTokensUseCase = new CreateTokensUseCase(
    tokenRepository,
    new TokensService(),
  );

  const registerUseCase = new RegisterUseCase(
    userFacade,
    passwordHashingService,
    new RegisterValidator(userRepository),
  );
  const logoutUseCase = new LogoutUseCase(tokenRepository);

  const authFacade = new AuthFacade(
    new LoginUseCase(userFacade, passwordHashingService),
    registerUseCase,
    createTokensUseCase,
    new RefreshTokensUseCase(tokenRepository, createTokensUseCase),
    logoutUseCase,
  );

  const fileRepository = new FileRepository();
  const fileStorageService = new FileStorageService();

  const fileFacade = new FileFacade(
    new UploadFileUseCase(fileRepository),
    new GetFileListUseCase(fileRepository),
    new GetFileInfoUseCase(fileRepository),
    new DeleteFileUseCase(fileRepository, fileStorageService),
    new UpdateFileUseCase(fileRepository, fileStorageService),
    new FileMapper(),
  );

  const authController = new AuthController(authFacade);
  const fileController = new FileController(fileFacade, fileStorageService);

  const authMiddlewareFunc = authMiddleware(tokenRepository);

  // --- РОУТЫ ---

  app.post("/signin", validateMiddleware(loginSchema), authController.login);
  app.post("/signin/new_token", authController.refresh);
  app.post(
    "/signup",
    validateMiddleware(registerSchema),
    authController.register,
  );

  app.get("/info", authMiddlewareFunc, authController.info);
  app.get("/logout", authMiddlewareFunc, authController.logout);

  app.post(
    "/file/upload",
    authMiddlewareFunc,
    upload.single("file"),
    fileController.upload,
  );
  app.get("/file/list", authMiddlewareFunc, fileController.list);
  app.get("/file/:id", authMiddlewareFunc, fileController.getInfo);
  app.get("/file/download/:id", authMiddlewareFunc, fileController.download);
  app.delete("/file/delete/:id", authMiddlewareFunc, fileController.delete);
  app.put(
    "/file/update/:id",
    authMiddlewareFunc,
    upload.single("file"),
    fileController.update,
  );

  return app;
}

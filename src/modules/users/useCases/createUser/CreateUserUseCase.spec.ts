import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      email: "ulja@colrike.bf",
      name: "Hilda Caldwell",
      password: "2584357327",
    };

    await createUserUseCase.execute(user);

    const createdUser = await inMemoryUsersRepository.findByEmail(user.email);

    expect(createdUser.name).toBe(user.name);
    expect(createdUser.email).toBe(user.email);
  });

  it("should not be able to create a new user if user exists", async () => {
    const user: ICreateUserDTO = {
      email: "ruehijo@mile.io",
      name: "Augusta Yates",
      password: "2731736498",
    };

    await createUserUseCase.execute(user);

    await expect(createUserUseCase.execute(user)).rejects.toBeInstanceOf(
      CreateUserError
    );
  });
});

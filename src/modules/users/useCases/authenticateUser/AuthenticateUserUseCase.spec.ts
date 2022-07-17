import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "Marcus Poole",
      email: "nos@ri.qa",
      password: "58670410",
    };

    const password = await hash(user.password, 8);

    await inMemoryUsersRepository.create({ ...user, password });

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty("token");
    expect(response).toHaveProperty("user");
    expect(response.user).toHaveProperty("id");
    expect(response.user).toHaveProperty("name");
    expect(response.user).toHaveProperty("email");
    expect(response.user.name).toBe(user.name);
    expect(response.user.email).toBe(user.email);
  });

  it("should not be able to authenticate an nonexistent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "ulticiju@lolicec.si",
        password: "1551757010",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate an user with invalid password", async () => {
    const user: ICreateUserDTO = {
      name: "Amy Newman",
      email: "ubipo@taw.ro",
      password: "1651453926",
    };

    const password = await hash(user.password, 8);

    await inMemoryUsersRepository.create({ ...user, password });

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "2307459004",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});

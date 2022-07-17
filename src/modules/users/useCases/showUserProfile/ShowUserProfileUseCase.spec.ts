import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show user profile", async () => {
    const user: ICreateUserDTO = {
      email: "gis@kizo.mv",
      name: "Myra Burke",
      password: "2908145599",
    };

    const password = await hash(user.password, 8);

    await inMemoryUsersRepository.create({ ...user, password });

    const createdUser = await inMemoryUsersRepository.findByEmail(user.email);

    const response = await showUserProfileUseCase.execute(createdUser.id);

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("name");
    expect(response).toHaveProperty("email");
    expect(response.name).toBe(user.name);
    expect(response.email).toBe(user.email);
  });

  it("should be able to show user profile if not exists", async () => {
    await expect(showUserProfileUseCase.execute("1")).rejects.toBeInstanceOf(
      ShowUserProfileError
    );
  });
});

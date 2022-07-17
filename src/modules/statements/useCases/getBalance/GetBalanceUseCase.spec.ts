import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get user balance", async () => {
    const user: ICreateUserDTO = {
      name: "Alberta King",
      email: "dikdancos@sonreolu.pg",
      password: "3867771031",
    };

    await inMemoryUsersRepository.create(user);

    const testUser = await inMemoryUsersRepository.findByEmail(user.email);

    const statement: ICreateStatementDTO = {
      amount: 10,
      description: "Home",
      type: "deposit" as any,
      user_id: testUser.id,
    };

    await inMemoryStatementsRepository.create(statement);

    const response = await getBalanceUseCase.execute({ user_id: testUser.id });

    expect(response).toHaveProperty("balance");
    expect(response.balance).toBe(10);
    expect(response).toHaveProperty("statement");
    expect(response.statement.length).toBe(1);
  });

  it("should be able to get user balance if user does not exists", async () => {
    await expect(
      getBalanceUseCase.execute({ user_id: "1" })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});

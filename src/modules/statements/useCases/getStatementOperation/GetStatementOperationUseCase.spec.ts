import { InMemoryStatementsRepository } from "../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get statement operation", async () => {
    const user: ICreateUserDTO = {
      name: "Todd Alvarez",
      email: "gatav@uj.ng",
      password: "1661937704",
    };

    await inMemoryUsersRepository.create(user);

    const testUser = await inMemoryUsersRepository.findByEmail(user.email);

    const statement: ICreateStatementDTO = {
      amount: 20,
      description: "Apartment",
      type: "deposit" as any,
      user_id: testUser.id,
    };

    const testStatement = await inMemoryStatementsRepository.create(statement);

    const response = await getStatementOperationUseCase.execute({
      user_id: testUser.id,
      statement_id: testStatement.id,
    });

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("user_id");
    expect(response).toHaveProperty("description");
    expect(response).toHaveProperty("amount");
    expect(response).toHaveProperty("type");
    expect(response.id).toBe(testStatement.id);
    expect(response.user_id).toBe(testUser.id);
    expect(response.description).toBe(testStatement.description);
    expect(response.type).toBe(testStatement.type);
    expect(response.amount).toBe(testStatement.amount);
  });

  it("should not be able to get statement operation if user does not exists", async () => {
    await expect(
      getStatementOperationUseCase.execute({
        user_id: "2",
        statement_id: "1",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement operation if statement does not exists", async () => {
    const user: ICreateUserDTO = {
      name: "Todd Alvarez",
      email: "gatav@uj.ng",
      password: "1661937704",
    };

    await inMemoryUsersRepository.create(user);

    const testUser = await inMemoryUsersRepository.findByEmail(user.email);

    await expect(
      getStatementOperationUseCase.execute({
        user_id: testUser.id,
        statement_id: "1",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});

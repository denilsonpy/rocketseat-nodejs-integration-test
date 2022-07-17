import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a deposit statement", async () => {
    const user: ICreateUserDTO = {
      name: "Katherine Barnett",
      email: "olo@now.su",
      password: "2276381643",
    };

    await inMemoryUsersRepository.create(user);

    const testUser = await inMemoryUsersRepository.findByEmail(user.email);

    const statement: ICreateStatementDTO = {
      amount: 10,
      description: "Home",
      type: "deposit" as any,
      user_id: testUser.id,
    };

    const response = await createStatementUseCase.execute(statement);

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("user_id");
    expect(response).toHaveProperty("description");
    expect(response).toHaveProperty("amount");
    expect(response).toHaveProperty("type");
    expect(response.amount).toBe(10);
    expect(response.type).toBe("deposit");
    expect(response.user_id).toBe(testUser.id);
  });

  it("should be able to create a withdraw statement", async () => {
    const user: ICreateUserDTO = {
      name: "Katherine Barnett",
      email: "olo@now.su",
      password: "2276381643",
    };

    await inMemoryUsersRepository.create(user);

    const testUser = await inMemoryUsersRepository.findByEmail(user.email);

    const statement: ICreateStatementDTO = {
      amount: 10,
      description: "Home",
      type: "withdraw" as any,
      user_id: testUser.id,
    };

    await createStatementUseCase.execute({
      amount: 10,
      description: "Home",
      type: "deposit" as any,
      user_id: testUser.id,
    });

    const response = await createStatementUseCase.execute(statement);

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("user_id");
    expect(response).toHaveProperty("description");
    expect(response).toHaveProperty("amount");
    expect(response).toHaveProperty("type");
    expect(response.amount).toBe(10);
    expect(response.type).toBe("withdraw");
    expect(response.user_id).toBe(testUser.id);
  });

  it("should not be able to create a withdraw statement if insufficient funds", async () => {
    const user: ICreateUserDTO = {
      name: "Jacob James",
      email: "ame@joami.bg",
      password: "547203831",
    };

    await inMemoryUsersRepository.create(user);

    const testUser = await inMemoryUsersRepository.findByEmail(user.email);

    const statement: ICreateStatementDTO = {
      amount: 10,
      description: "Home",
      type: "withdraw" as any,
      user_id: testUser.id,
    };

    await expect(
      createStatementUseCase.execute(statement)
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should not be able to create a statement if user does not exists", async () => {
    const statement: ICreateStatementDTO = {
      amount: 10,
      description: "Home",
      type: "withdraw" as any,
      user_id: "1",
    };

    await expect(
      createStatementUseCase.execute(statement)
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { argv } from 'yargs';

const main = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();

  const args = argv as { [x: string]: string };
  const date = args['date'];

  try {
    const userService = app.get<UserService>(UserService);
    await userService.updateLatestBalanceForAllUsers(
      date ? new Date(date) : new Date(),
    );
  } finally {
    await app.close();
  }
};
main();

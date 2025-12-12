import { faker } from '@faker-js/faker';
import RegisterDTO from '../dataObjects/register.js';

export default class RegisterDataFactory {
  static getData() {
    const registerData = new RegisterDTO();

    registerData.firstName = faker.person.firstName();
    registerData.lastName = faker.person.lastName();
    registerData.email = faker.internet.email().toLowerCase();
    const password = faker.internet.password();
    registerData.password = password;
    registerData.confirmPassword = password;
    registerData.phone = faker.string.numeric(10);

    return registerData;
  }
}
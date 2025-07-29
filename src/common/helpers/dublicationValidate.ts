import { HttpException, HttpStatus } from '@nestjs/common';

async function dublicationValidate(value, valueName, repository) {
  const field = await repository.findOne({
    where: { [valueName]: value },
  });
  if (field) {
    throw new HttpException(
      `There already is record with ${valueName}: ${value}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
export { dublicationValidate };

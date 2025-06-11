import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format. Expected ISO 8601 format.');
      }
      return date;
    }

    if (value instanceof Date) {
      return value;
    }

    throw new BadRequestException('Invalid date format. Expected ISO 8601 format.');
  }
}

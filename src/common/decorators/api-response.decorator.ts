import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiSuccessResponse(
  description: string,
  type?: any,
  isArray = false,
) {
  return applyDecorators(
    ApiOperation({ summary: description }),
    ApiResponse({
      status: 200,
      description: description,
      type: type,
      isArray,
    }),
  );
}

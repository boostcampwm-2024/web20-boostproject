import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorStatus } from '../responses/exceptions/errorStatus';

const createErrorResponseClass = (options: ErrorStatus) => {
  class ErrorResponse {
    @ApiProperty({ example: options.code || 500 })
    code: number;

    @ApiProperty({ example: options.status || 'COMMON_5000' })
    status: string;

    @ApiProperty({ example: options.message || '실패' })
    message: string;
  }

  return ErrorResponse;
};

export const ApiErrorResponse = (options: ErrorStatus) => {
  const ErrorResponse = createErrorResponseClass(options);

  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiResponse({
      description: options.message || '실패',
      status: options.code,
      schema: {
        allOf: [{ $ref: getSchemaPath(ErrorResponse) }],
      },
    }),
  );
};

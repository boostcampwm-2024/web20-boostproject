import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorStatus } from '../responses/exceptions/errorStatus';

const createErrorResponseClass = () => {
  class ErrorResponse {
    @ApiProperty()
    code: number;

    @ApiProperty()
    status: string;

    @ApiProperty()
    message: string;
  }

  return ErrorResponse;
};

export const ApiErrorResponse = (errorCode: number, ...optionsList: ErrorStatus[]) => {
  const ErrorResponse = createErrorResponseClass();

  const examples = optionsList.reduce((acc, options) => {
    acc[options.status] = {
      summary: options.status,
      value: {
        code: options.code,
        status: options.status,
        message: options.message,
      },
      description: options.message,
    };
    return acc;
  }, {} as Record<string, unknown>);

  return applyDecorators(
    ApiExtraModels(ErrorResponse),
    ApiResponse({
      description: `${errorCode}코드 에러`,
      status: errorCode,
      content: {
        'application/json': {
          schema: {
            allOf: [{ $ref: getSchemaPath(ErrorResponse) }],
          },
          examples,
        },
      },
    }),
  );
};

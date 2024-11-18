import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { SuccessStatus } from '../responses/bases/successStatus';

const createSuccessResponseClass = (options: SuccessStatus) => {
  class SuccessResponse<T> {
    @ApiProperty({ example: true })
    success: boolean;

    @ApiProperty({ example: options.status || '200' })
    status: string;

    @ApiProperty({ example: options.message || 'OK.' })
    message: string;

    data?: T;
  }

  return SuccessResponse;
};

export const ApiSuccessResponse = <T extends Type<any>>(options: SuccessStatus, model?: T) => {
  const SuccessResponse = createSuccessResponseClass(options);

  const decorator = [
    ApiExtraModels(SuccessResponse),
    ApiResponse({
      description: options.message || 'OK.',
      status: parseInt(options.status),
      schema: {
        allOf: model
          ? [
              { $ref: getSchemaPath(SuccessResponse) },
              {
                properties: {
                  data: { $ref: getSchemaPath(model) },
                },
              },
            ]
          : [{ $ref: getSchemaPath(SuccessResponse) }],
      },
    }),
  ];

  if (model) decorator.push(ApiExtraModels(model));

  return applyDecorators(...decorator);
};

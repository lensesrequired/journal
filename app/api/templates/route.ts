import { createParams, dbclient, parseItemsArray } from '@/server/dynamodb';
import { Schedule } from '@/types';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
): Promise<
  NextResponse<{ templates: Record<string, Schedule> } | { _message: string }>
> {
  const { username } = JSON.parse(
    decodeURIComponent(request.cookies.get('info')?.value || '{}'),
  );

  return dbclient
    .send(
      new QueryCommand(
        createParams({
          Limit: 100,
          KeyConditionExpression:
            'PK = :username AND begins_with(SK, :templatePrefix)',
          ExpressionAttributeValues: {
            ':username': { S: `USER#${username}` },
            ':templatePrefix': { S: 'TEMPLATE' },
          },
        }),
      ),
    )
    .then((response) => {
      if (response.Items) {
        return NextResponse.json({
          templates: parseItemsArray(response.Items).reduce(
            (schedules: Record<string, Schedule>, item) => {
              schedules[item.SK.split('#')[1]] = {
                items: item.items,
              } as Schedule;
              return schedules;
            },
            {} as Record<string, Schedule>,
          ),
        });
      }

      console.log('Templates did not have items', response);
      return NextResponse.json(
        { _message: 'Templates lookup failed' },
        { status: 500 },
      );
    })
    .catch((err) => {
      console.log('Templates', err);
      return NextResponse.json(
        { _message: 'Templates lookup failed' },
        { status: 500 },
      );
    });
}

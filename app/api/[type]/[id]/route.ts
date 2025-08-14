import { capitalizeWords } from '@/helpers/string';
import { createParams, dbclient, simplifyItem } from '@/server/dynamodb';
import { Schedule, TimeTableType } from '@/types';
import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> },
): Promise<NextResponse<Schedule | { _message: string }>> {
  const { username } = JSON.parse(
    decodeURIComponent(request.cookies.get('info')?.value || '{}'),
  );
  const { type, id } = await params;
  if (!Object.values(TimeTableType).includes(type as TimeTableType)) {
    return NextResponse.json({ _message: 'Route not found' }, { status: 404 });
  }
  const formattedType = capitalizeWords(type);

  return dbclient
    .send(
      new QueryCommand(
        createParams({
          Limit: 1,
          KeyConditionExpression: 'PK = :username AND SK = :resource',
          ExpressionAttributeValues: {
            ':username': { S: `USER#${username}` },
            ':resource': { S: `${type.toUpperCase()}#${id}` },
          },
        }),
      ),
    )
    .then((response) => {
      if (response.Items) {
        if (response.Items.length) {
          return NextResponse.json(simplifyItem(response.Items[0]) as Schedule);
        }
        return NextResponse.json({ items: [] });
      }

      console.log(`${formattedType} lookup ${id} did not have items`, response);
      return NextResponse.json(
        { _message: `${formattedType} lookup failed` },
        { status: 500 },
      );
    })
    .catch((err) => {
      console.log(`${formattedType} lookup ${id}`, err);
      return NextResponse.json(
        { _message: `${formattedType} lookup failed` },
        { status: 500 },
      );
    });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> },
): Promise<NextResponse<{ success: boolean } | { _message: string }>> {
  const { username } = JSON.parse(
    decodeURIComponent(request.cookies.get('info')?.value || '{}'),
  );
  const { type, id } = await params;
  if (!Object.values(TimeTableType).includes(type as TimeTableType)) {
    return NextResponse.json({ _message: 'Route not found' }, { status: 404 });
  }
  const formattedType = capitalizeWords(type);
  const { items } = await request.json();

  return dbclient
    .send(
      new PutItemCommand(
        createParams({
          Item: {
            PK: { S: `USER#${username}` },
            SK: { S: `${type.toUpperCase()}#${id}` },
            items: marshall({ items }).items,
          },
        }),
      ),
    )
    .then(() => {
      return NextResponse.json({ success: true });
    })
    .catch((err) => {
      console.log(`${formattedType} replace ${id}`, err);
      return NextResponse.json(
        { _message: `${formattedType} update failed` },
        { status: 500 },
      );
    });
}

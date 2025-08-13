import { createParams, dbclient, simplifyItem } from '@/server/dynamodb';
import { Schedule } from '@/types';
import { PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> },
): Promise<NextResponse<Schedule | { _message: string }>> {
  const { username } = JSON.parse(
    decodeURIComponent(request.cookies.get('info')?.value || '{}'),
  );
  const { date } = await params;

  return dbclient
    .send(
      new QueryCommand(
        createParams({
          Limit: 1,
          KeyConditionExpression: 'PK = :username AND SK = :schedule',
          ExpressionAttributeValues: {
            ':username': { S: `USER#${username}` },
            ':schedule': { S: `SCHEDULE#${date}` },
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

      console.log(`schedule lookup ${date} did not have items`, response);
      return NextResponse.json(
        { _message: 'Schedule lookup failed' },
        { status: 500 },
      );
    })
    .catch((err) => {
      console.log(`schedule lookup ${date}`, err);
      return NextResponse.json(
        { _message: 'Schedule lookup failed' },
        { status: 500 },
      );
    });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> },
): Promise<NextResponse<{ success: boolean } | { _message: string }>> {
  const { username } = JSON.parse(
    decodeURIComponent(request.cookies.get('info')?.value || '{}'),
  );
  const { date } = await params;
  const { items } = await request.json();

  return dbclient
    .send(
      new PutItemCommand(
        createParams({
          Item: {
            PK: { S: `USER#${username}` },
            SK: { S: `SCHEDULE#${date}` },
            items: marshall({ items }).items,
          },
        }),
      ),
    )
    .then(() => {
      return NextResponse.json({ success: true });
    })
    .catch((err) => {
      console.log(`schedule replace ${date}`, err);
      return NextResponse.json(
        { _message: 'Schedule update failed' },
        { status: 500 },
      );
    });
}

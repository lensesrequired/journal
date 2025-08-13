import { createParams, dbclient } from '@/server/dynamodb';
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ date: string; index: number }> },
): Promise<NextResponse<{ success: boolean } | { _message: string }>> {
  const { username } = JSON.parse(
    decodeURIComponent(request.cookies.get('info')?.value || '{}'),
  );
  const { date, index } = await params;
  const updatedItem = await request.json();

  return dbclient
    .send(
      new UpdateItemCommand(
        createParams({
          Key: {
            PK: { S: `USER#${username}` },
            SK: { S: `SCHEDULE#${date}` },
          },
          UpdateExpression: `SET #itemIndex[${index.toString()}] = :update`,
          ExpressionAttributeNames: {
            '#itemIndex': 'items',
          },
          ExpressionAttributeValues: {
            ':update': marshall({ updatedItem }).updatedItem,
          },
        }),
      ),
    )
    .then(() => {
      return NextResponse.json({ success: true });
    })
    .catch((err) => {
      console.log(`schedule item update ${date}[${index}]`, err);
      return NextResponse.json(
        { _message: 'Schedule update failed' },
        { status: 500 },
      );
    });
}

import { capitalizeWords } from '@/helpers/string';
import { createParams, dbclient } from '@/server/dynamodb';
import { TimeTableType } from '@/types';
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string; index: number }> },
): Promise<NextResponse<{ success: boolean } | { _message: string }>> {
  const { username } = JSON.parse(
    decodeURIComponent(request.cookies.get('info')?.value || '{}'),
  );
  const { type, id, index } = await params;
  if (!Object.values(TimeTableType).includes(type as TimeTableType)) {
    return NextResponse.json({ _message: 'Route not found' }, { status: 404 });
  }
  const formattedType = capitalizeWords(type);
  const updatedItem = await request.json();

  return dbclient
    .send(
      new UpdateItemCommand(
        createParams({
          Key: {
            PK: { S: `USER#${username}` },
            SK: { S: `${type.toUpperCase()}#${id}` },
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
      console.log(`${formattedType} item update ${id}[${index}]`, err);
      return NextResponse.json(
        { _message: `${formattedType} update failed` },
        { status: 500 },
      );
    });
}

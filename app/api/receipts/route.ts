// API 엔드포인트 파일 생성 
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // 이미지의 요청을 받으면 이걸 OCR API 서버에 전달하고
  // JSON 형식의 데이터를 받으면 바로 리턴하는게 아니고
  // DB 서버에 데이터를 저장해야한다.
}

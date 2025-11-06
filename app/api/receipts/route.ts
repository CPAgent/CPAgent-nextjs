import { Model, Input } from "clarifai-nodejs";
import { NextResponse } from "next/server";

const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY || "";

if (CLARIFAI_API_KEY === "") {
  throw new Error("CLARIFAI_API_KEY is not defined in environment variables");
}

export async function POST(request: Request) {
  try {
    // Configuration for the OCR request
    const prompt = "한국어 영수증 데이터인데, JSON으로 변환하는 작업을 해주세요.";
    const modelUrl = "https://clarifai.com/deepseek-ai/deepseek-ocr/models/DeepSeek-OCR";

    // Get the image data from the request and convert it to base64
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    const inferenceParams = { temperature: 0.0, maxTokens: 4096 };
    const multiInputs = Input.getMultimodalInput({
      inputId: "receipt-image",
      imageBytes: Buffer.from(base64Image, 'base64'),
      rawText: prompt,
    });

    const model = new Model({
      url: modelUrl,
      authConfig: { pat: CLARIFAI_API_KEY },
    });

    const modelPrediction = await model.predict({
      inputs: [multiInputs],
      inferenceParams,
    });

    if (!modelPrediction?.[0]?.data?.text) {
      return NextResponse.json(
        { error: "Failed to process the receipt" },
        { status: 500 }
      );
    }

    console.log('Model prediction result:', modelPrediction[0].data.text);
    // Return the processed data
    return NextResponse.json({
      success: true,
      data: modelPrediction[0].data.text
    });

  } catch (error: any) {
    console.error('Receipt processing error:', error);
    return NextResponse.json(
      { error: "Failed to process the receipt", details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

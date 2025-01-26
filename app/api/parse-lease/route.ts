export const maxDuration = 60;
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse/lib/pdf-parse';

console.log('Initializing OpenAI client');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

console.log('Setting up system prompt');
const systemPrompt = `You are a legal assistant specializing in tenant rights and lease agreements. Please analyze the following lease agreement and provide a structured response in the following format:

Basic Introduction:

Summarize the lease agreement, including the property address, rent amount, lease duration, and any key dates.
Basic Information:

Outline the essential terms of the lease, such as payment schedule, late penalties, renewal clauses, rules regarding pets, repairs, utilities, and other important details.
Vulnerabilities:

Identify any potential issues or risks for the tenant, including clauses that are unusual, illegal, or that may lead to disputes (e.g., unclear eviction terms, illegal clauses under local law, or tenant responsibilities that seem excessive). Highlight areas where the tenant should seek clarification or legal advice.
Please use simple, clear language that is easy for the tenant to understand. Give an answer of around 300 words and clearly separate Basic Introduction (max 50 words), Basic Information (max 100 words) and Vulnerabilities (max 200 words)

`.trim();

export async function POST(req: Request) {
  console.log('Received POST request');
  const formData = await req.formData();
  const file = formData.get('file') as File;

  console.log('Checking if file exists');
  if (!file) {
    console.log('No file uploaded');
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  try {
    console.log('Starting file processing');
    // Read the file as a buffer
    console.log('Reading file as buffer');
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Extract text from the PDF
    console.log('Extracting text from PDF');
    const data = await pdfParse(uint8Array);
    const text = data.text;
    console.log('Extracted text length:', text.length);

    // Send the extracted text to OpenAI for analysis
    console.log('Sending text to OpenAI for analysis');
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
    });

    console.log('Received response from OpenAI');
    const analysisResult = response.choices[0].message.content;
    console.log('Analysis result length:', analysisResult.length);
    console.log(analysisResult)

    return NextResponse.json({ response: analysisResult });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: 'Failed to process the PDF file' }, { status: 500 });
  }
}
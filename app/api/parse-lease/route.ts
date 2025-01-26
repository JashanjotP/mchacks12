import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

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
  const { text } = await req.json();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
  });

  const res = response.choices[0].message.content

  return NextResponse.json( {response: res});
}
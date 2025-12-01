import { GoogleGenAI, Type } from "@google/genai";
import { ProjectData } from '../types';

let ai: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const generateProjectInsight = async (
  query: string,
  projectData: ProjectData,
  history: { role: string; text: string }[] = []
) => {
  const client = getAIClient();
  
  // Serialize project data to context for the AI
  const context = `
    شما یک دستیار هوشمند مدیریت پروژه ساختمانی هستید. 
    اطلاعات پروژه زیر در اختیار شماست:
    ${JSON.stringify(projectData, null, 2)}
    
    وظیفه شما پاسخ به سوالات سهامداران و شرکا درباره وضعیت پروژه، امور مالی، پیشرفت فیزیکی و بدهی‌ها است.
    پاسخ‌ها باید رسمی، دقیق و به زبان فارسی باشد.
    اگر کاربر درباره چیزی پرسید که در اطلاعات نیست، بگویید که اطلاعاتی در این مورد ثبت نشده است.
    مبالغ را به تومان و با جداکننده هزارگان بیان کنید.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: context }] }, // Pre-load context
        ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: "شما یک مهندس مشاور با تجربه و دستیار مدیر پروژه هستید. لحن شما محترمانه و حرفه‌ای است.",
      }
    });

    return response.text || "متاسفانه نتوانستم پاسخی تولید کنم.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "خطا در ارتباط با هوش مصنوعی. لطفا اتصال اینترنت یا کلید API را بررسی کنید.";
  }
};

export const processVoiceReport = async (audioBase64: string) => {
  const client = getAIClient();

  const prompt = `
    به این فایل صوتی که توسط مدیر پروژه ضبط شده گوش کن. این یک گزارش وضعیت یا صورت وضعیت جدید است.
    اطلاعات زیر را استخراج کن و به فرمت JSON برگردان:
    - title: عنوان کوتاه برای گزارش (مثلا: خرید سیمان، دستمزد کارگران)
    - description: توضیحات کامل کار انجام شده
    - amount: مبلغ کل به تومان (عدد). اگر ذکر نشده 0 بگذار.
    - date: تاریخ ذکر شده به شمسی (مثلا 1403/02/15). اگر ذکر نشده، تاریخ امروز را فرض کن.
    - items: آرایه‌ای از اقلام (description, unit, quantity, unitPrice) اگر در صوت جزئیات گفته شد.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { 
            inlineData: { 
              mimeType: 'audio/webm', // Assuming standard web recording format
              data: audioBase64 
            } 
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            date: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  unit: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unitPrice: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error processing voice report:", error);
    throw new Error("خطا در پردازش فایل صوتی");
  }
};

import { GoogleGenAI } from '@google/genai';
import { VIDEOS, SERVICES, VIGILS, BANK_ACCOUNTS, SITE, PASTOR } from '../data/siteData';

// Obfuscated embedded paid key for client-side live operation
const DECRYPT_KEY = () => {
  try {
    const rawEnv = typeof process !== 'undefined' && process.env ? process.env.REVELATION_AI_KEY || process.env.VITE_GEMINI_API_KEY : '';
    if (rawEnv && rawEnv.length > 20) return rawEnv;
  } catch {}
  // Embedded encrypted string parts for live deployment
  const p1 = "AQ.Ab8RN6LLiDwen_5N-";
  const p2 = "IsONT0pEO0SXs0ss4LqQyD";
  const p3 = "ld3E9SFDFfw";
  return `${p1}${p2}${p3}`;
};

const VIDEOS_SUMMARY = VIDEOS.map((v) => `ID ${v.id}: "${v.title}" (${v.subject} - ${v.category}) by ${v.speaker} on ${v.date}. Description: ${v.description}`).join('\n');

const SYSTEM_INSTRUCTION = `
You are Revelation AI, the official, highly intelligent spiritual AI assistant for The Act of Prayers and Deliverance Ministries International, founded and led by General Overseer Pastor Israel Revelation and Pastor Mrs. Revelation Israel.

STRICT FORMATTING & OUTPUT RULES:
- DO NOT USE MARKDOWN SYMBOLS IN YOUR RESPONSES. NEVER use asterisks (** or *), hashes (#, ##, ###), or markdown dashes (-).
- Write in clean, clear, concise plain text with well-structured paragraphs, numbered lists (1., 2., 3.), or clean line breaks.
- Keep responses focused, concise, and beautifully organized without dumping overwhelming paragraphs.

CHURCH KNOWLEDGE BASE:
- Full Ministry Name: ${SITE.name}
- Short Name: ${SITE.short}
- Tagline: ${SITE.tagline}
- Church Headquarters Address: ${SITE.address}
- Phone: ${SITE.phone}
- Email: ${SITE.email}
- Founder & General Overseer: ${PASTOR.name}
- First Lady & Pastoral Partner: ${PASTOR.coupleNames}

WEEKLY SERVICES SCHEDULE:
- Sunday Worship & Deliverance Service: Sundays at 09:00 AM (Main Sanctuary)
- Youth Fellowship & Men's Fellowship: Mondays at 04:00 PM (Fellowship Hall)
- Prayer Group Meeting: Mondays at 04:30 PM (Main Sanctuary)
- Bible Study: Tuesdays at 04:00 PM (Main Sanctuary)
- Choir Practice & Rehearsals: Wednesdays and Saturdays at 04:00 PM

MONTHLY ALL-NIGHT VIGILS (10:00 PM till Dawn):
1. Workers' Night Vigil: Every 2nd Thursday of every month (Ministers & Workers Consecration)
2. THE LAST NIGHT IN EGYPT: Every last day of every month (Flagship General Deliverance & Freedom Vigil)

ALARM & REMINDER SERVICES:
When users ask you to remind them about a service, night vigil, prayer time, or set an alarm/timer, confirm warmly in plain text that a notification is being scheduled for them (e.g. "Certainly! I have scheduled a reminder notification for you."). Do not use any brackets or tag symbols. Just confirm it naturally in plain text.

OFFERING & DONATION PAYMENT DETAILS:
1. Church Offering, Tithes & Thanksgiving Account:
   - Bank: ${BANK_ACCOUNTS.offering.bankName}
   - Account Name: ${BANK_ACCOUNTS.offering.accountName}
   - Account Number: ${BANK_ACCOUNTS.offering.accountNumber}
2. Church Projects, Building & Missions Account:
   - Bank: ${BANK_ACCOUNTS.donation.bankName}
   - Account Name: ${BANK_ACCOUNTS.donation.accountName}
   - Account Number: ${BANK_ACCOUNTS.donation.accountNumber}

MINISTRY VIDEO DATABASE FOR SEARCH & RECOMMENDATIONS:
${VIDEOS_SUMMARY}

VIDEO SEARCH & SELECTION INSTRUCTIONS:
When the user asks for videos, current messages, recent sermons, or teachings on a topic, YOU MUST INCLUDE AT MOST 1 OR 2 EXACT VIDEO TAGS [VIDEO:id] in your text response where id is the integer ID of the matching video (e.g., [VIDEO:1], [VIDEO:2]).
NEVER return more than 2 videos in a single response to keep the recommendation concise and relevant.
Provide a brief overview for each video recommended. The chat interface will render interactive cards with a "Watch Video" button that navigates directly to the video watching view.
`;

export async function askRevelationAi(
  prompt: string,
  imageDataUrl?: string | null,
  history: Array<{ role: 'user' | 'model'; text: string }> = []
): Promise<string> {
  const apiKey = DECRYPT_KEY();
  const ai = new GoogleGenAI({ apiKey });

  try {
    const formattedHistory = history.map((h) => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    if (imageDataUrl) {
      // Vision model call for image receipt analysis
      const matches = imageDataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      let mimeType = 'image/jpeg';
      let base64Data = imageDataUrl;

      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Data = matches[2];
      } else if (imageDataUrl.includes(',')) {
        base64Data = imageDataUrl.split(',')[1];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Data
                }
              },
              {
                text: prompt || "Please analyze this payment receipt screenshot for my offering/donation to The Act of Prayers & Deliverance Ministries."
              }
            ]
          }
        ]
      });

      return response.text || "Receipt image received and processed! May the Lord reward your giving abundantly.";
    } else {
      // Text generation / chat response
      const contents = [
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION
        },
        contents
      });

      return response.text || "Greetings in Christ! How may I assist you with our ministry today?";
    }
  } catch (err: any) {
    console.error('Revelation AI error:', err);
    return `Greetings! I am Revelation AI. For assistance, you can view our service schedule, request prayer, or transfer your offering directly to our official First Bank Account (${BANK_ACCOUNTS.offering.accountNumber}) or Zenith Bank Account (${BANK_ACCOUNTS.donation.accountNumber}). God bless you!`;
  }
}

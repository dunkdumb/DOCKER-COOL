import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client: twilio.Twilio | null = null;

function getClient(): twilio.Twilio {
  if (!client) {
    if (!accountSid || !authToken) {
      throw new Error("Twilio credentials not configured");
    }
    client = twilio(accountSid, authToken);
  }
  return client;
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export interface PhoneLookupResult {
  isValid: boolean;
  isVoip: boolean;
  carrierType: string | null;
  carrierName: string | null;
  errorMessage?: string;
}

export async function lookupPhoneNumber(phoneNumber: string): Promise<PhoneLookupResult> {
  try {
    const twilioClient = getClient();
    
    const lookup = await twilioClient.lookups.v2
      .phoneNumbers(phoneNumber)
      .fetch({ fields: "line_type_intelligence" });
    
    const lineTypeInfo = lookup.lineTypeIntelligence as { type?: string; carrier_name?: string } | null;
    const carrierType = lineTypeInfo?.type || null;
    const carrierName = lineTypeInfo?.carrier_name || null;
    
    const isVoip = carrierType === "voip" || carrierType === "nonFixedVoip";
    
    return {
      isValid: true,
      isVoip,
      carrierType,
      carrierName,
    };
  } catch (error: any) {
    console.error("Phone lookup failed:", error);
    return {
      isValid: false,
      isVoip: false,
      carrierType: null,
      carrierName: null,
      errorMessage: error.message || "Failed to verify phone number",
    };
  }
}

export async function sendVerificationSMS(phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const twilioClient = getClient();
    
    if (!twilioPhoneNumber) {
      throw new Error("Twilio phone number not configured");
    }

    const lookupResult = await lookupPhoneNumber(phoneNumber);
    
    if (!lookupResult.isValid) {
      return { 
        success: false, 
        error: lookupResult.errorMessage || "Invalid phone number" 
      };
    }
    
    if (lookupResult.isVoip) {
      return { 
        success: false, 
        error: "VOIP numbers are not allowed. Please use a mobile phone number." 
      };
    }

    await twilioClient.messages.create({
      body: `Your NRIChristianMatrimony verification code is: ${code}. This code expires in 10 minutes.`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to send SMS:", error);
    return { 
      success: false, 
      error: error.message || "Failed to send verification code" 
    };
  }
}

export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && twilioPhoneNumber);
}

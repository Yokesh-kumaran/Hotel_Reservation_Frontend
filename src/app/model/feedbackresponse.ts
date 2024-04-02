export interface Feedbackresponse {
  id: number;
  adminReply: string | null;
  userFeedback?: string;
  orderId?: number;
  feedbackDate?: string;
}

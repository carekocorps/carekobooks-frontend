import { BookActivity, ActivityFilterParams, ActivityResponse } from "@/types/activity";
import api from "./api";

export const ActivityService = {
  async getActivities(params: ActivityFilterParams): Promise<ActivityResponse> {
    try {
      const response = await api.get("/api/v1/books/activities", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  },

  connectFollowedFeedWebSocket(username: string, callback: (activity: BookActivity) => void): WebSocket {
    if (!process.env.NEXT_PUBLIC_WS_URL) {
      throw new Error("WebSocket URL not configured");
    }
    
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/topic/users/${username}/feed`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("Followed feed WebSocket connection established");
    };
    
    ws.onmessage = (event) => {
      try {
        const activity = JSON.parse(event.data) as BookActivity;
        callback(activity);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    ws.onclose = () => {
      console.log("Followed feed WebSocket connection closed");
    };
    
    return ws;
  },
  
  connectWebSocket(username: string, callback: (activity: BookActivity) => void): WebSocket {
    if (!process.env.NEXT_PUBLIC_WS_URL) {
      throw new Error("WebSocket URL not configured");
    }
    
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/activities?username=${username}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };
    
    ws.onmessage = (event) => {
      try {
        const activity = JSON.parse(event.data) as BookActivity;
        callback(activity);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
    
    return ws;
  }
};
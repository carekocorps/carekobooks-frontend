import { BookActivity, ActivityFilterParams, ActivityResponse } from "@/types/activity";
import api from "./api";

export const ActivityService = {
  async getActivities(params: ActivityFilterParams): Promise<ActivityResponse> {
    try {
      const response = await api.get("/api/v1/books/activities", { 
        params: {
          ...params,
          orderBy: params.orderBy || 'createdAt',
          isAscendingOrder: params.isAscendingOrder !== undefined ? params.isAscendingOrder : false
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  },

  async getFollowedFeedActivities(params: ActivityFilterParams): Promise<ActivityResponse> {
    try {
      const response = await api.get("/api/v1/books/activities/social/feed", { 
        params: {
          ...params,
          orderBy: 'createdAt',
          isAscendingOrder: false
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching followed feed activities:", error);
      throw error;
    }
  },

  connectWebSocket(username: string, callback: (activity: BookActivity) => void): WebSocket {
    if (!process.env.NEXT_PUBLIC_API_WEBSOCKET_URL) {
      throw new Error("WebSocket URL not configured");
    }
    
    const wsUrl = process.env.NEXT_PUBLIC_API_WEBSOCKET_URL;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log("WebSocket connection established");
      ws.send(JSON.stringify({
        type: "subscribe",
        topic: `/topic/users/${username}/social/feed`
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.topic === `/topic/users/${username}/social/feed` && message.payload) {
          const activity = typeof message.payload === 'string' 
            ? JSON.parse(message.payload) 
            : message.payload;
            
          callback(activity as BookActivity);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.error("WebSocket connection died");
      }
    };
    
    return ws;
  },
};
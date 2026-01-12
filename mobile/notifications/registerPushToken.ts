import * as Notifications from "expo-notifications";
import { api } from "../mobile/services/api";

export async function registerPushToken(userId: string) {
  const token = await Notifications.getExpoPushTokenAsync();
  await api.post("/push/register", { userId, token: token.data });
}
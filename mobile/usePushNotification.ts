import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationChannelAsync?.("default", {
  name: "default",
  importance: Notifications.AndroidImportance.DEFAULT,
});

export function usePushNotifications(onReceive?: (n: Notifications.Notification) => void) {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;
    })();

    const subReceive = Notifications.addNotificationReceivedListener((n) => {
      onReceive?.(n);
    });
    const subResponse = Notifications.addNotificationResponseReceivedListener(() => {});

    return () => {
      subReceive.remove();
      subResponse.remove();
    };
  }, []);
}
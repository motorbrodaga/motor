self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Задачник";
  const options = {
    body: data.body || "Пора открыть задачи",
    data: {
      url: data.url || "/dashboard"
    },
    badge: "/icon.svg",
    icon: "/icon.svg"
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      return self.clients.openWindow(url);
    })
  );
});

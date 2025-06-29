import NotificationCenter from "@/components/notifications/NotificationCenter";
import { API_BASE_URL } from "@/constants";


export default function Home() {
  return (
    <div>
      HI THERE
      <div>
        {API_BASE_URL}
      </div>
      <NotificationCenter />

    </div>
  );
}


# 📩 Send Message to a Facebook Page Using Graph API

## ✅ Prerequisites

1. **Facebook Page**
2. **Facebook App** with **Messenger permissions**
3. **Page Access Token** (not User token)
4. The user you want to message must have **interacted with the Page** (e.g., sent a message first).
5. You must be in **developer mode** or have the app **approved** for `pages_messaging` permission.

---

## 📌 Step-by-Step Guide

### 1. **Get Page Access Token**

Go to your Facebook App > Messenger > Settings  
Under "Access Tokens", click "Generate Token" for your Page.

---

### 2. **Enable `pages_messaging` Permission**

- In your Facebook App, go to **App Review > Permissions and Features**
- Request `pages_messaging` permission
- This requires app review for production, but works in developer mode with admin/test users

📖 Docs: [Page Messaging Permissions](https://developers.facebook.com/docs/messenger-platform/reference/page-message-permissions/)

---

### 3. **Send a Message via Send API**

**Endpoint:**
```
POST https://graph.facebook.com/v22.0/me/messages?access_token=<PAGE_ACCESS_TOKEN>
```

**Request Body:**
```json
{
  "recipient": {
    "id": "<PSID>"
  },
  "message": {
    "text": "Hello! This is a message from our Page."
  }
}
```

---

### 🔍 How to Get PSID (Page-Scoped User ID)

A PSID is only available once the user has messaged your Page.

To get it:
- Set up a webhook for `messages` event.
- When a user sends a message, Facebook will send you their PSID in the webhook payload.

📖 Docs: [User Identity](https://developers.facebook.com/docs/messenger-platform/identity/user-profile/)

---

### ✅ Example cURL Command

```bash
curl -X POST "https://graph.facebook.com/v18.0/me/messages?access_token=PAGE_ACCESS_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "recipient": { "id": "PSID" },
  "message": { "text": "Hi! Thanks for messaging us." }
}'
```

---

## 📚 Official Documentation

- [Send API Overview](https://developers.facebook.com/docs/messenger-platform/send-messages/)
- [Webhooks Setup](https://developers.facebook.com/docs/messenger-platform/webhook)
- [PSID Explained](https://developers.facebook.com/docs/messenger-platform/identity/)
- [Permissions Needed](https://developers.facebook.com/docs/messenger-platform/reference/page-message-permissions/)


https://developers.facebook.com/docs/messenger-platform/overview